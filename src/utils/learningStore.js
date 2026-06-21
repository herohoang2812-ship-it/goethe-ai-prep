import { normalizeLearningError } from './errorTaxonomy';

const KEYS = {
  attempts: 'goethe_learning_attempts_v2',
  errors: 'goethe_error_notebook_v2',
  srs: 'goethe_srs_records_v2',
};

export function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function recordAttempt({ module, part, correct, total, errors = [] }) {
  const now = Date.now();
  const attempts = readStore(KEYS.attempts, []);
  attempts.unshift({ id: now, date: new Date().toISOString(), module, part, correct, total, score: total ? Math.round(correct / total * 100) : 0 });
  writeStore(KEYS.attempts, attempts.slice(0, 200));
  if (errors.length) {
    const notebook = readStore(KEYS.errors, []);
    const normalized = errors.map((error, index) => ({
      id: `${now}-${index}`,
      date: new Date().toISOString(),
      module,
      part,
      reviewed: false,
      repairAttempts: 0,
      repairSuccesses: 0,
      ...normalizeLearningError(error),
    }));
    writeStore(KEYS.errors, [...normalized, ...notebook].slice(0, 300));
  }
  window.dispatchEvent(new Event('goethe-progress-updated'));
}

export function getLearningAnalytics() {
  const attempts = readStore(KEYS.attempts, []);
  const byPart = {};
  for (const attempt of attempts) {
    const key = `${attempt.module} · ${attempt.part}`;
    const item = byPart[key] || { attempts: 0, correct: 0, total: 0 };
    item.attempts += 1; item.correct += attempt.correct; item.total += attempt.total; byPart[key] = item;
  }
  return Object.entries(byPart).map(([name, value]) => ({ name, ...value, score: value.total ? Math.round(value.correct / value.total * 100) : 0 })).sort((a, b) => a.score - b.score);
}

export function getErrorNotebook() {
  return readStore(KEYS.errors, []).map(normalizeLearningError);
}

export function getErrorPatterns() {
  const groups = {};
  for (const error of getErrorNotebook()) {
    const group = groups[error.category] || { category: error.category, label: error.categoryLabel, count: 0, unreviewed: 0, modules: new Set(), samples: [] };
    group.count += 1;
    if (!error.reviewed) group.unreviewed += 1;
    group.modules.add(error.module);
    if (group.samples.length < 3) group.samples.push(error);
    groups[error.category] = group;
  }
  return Object.values(groups)
    .map(group => ({ ...group, modules: [...group.modules] }))
    .sort((a, b) => b.count - a.count);
}

export function markErrorReviewed(id) {
  const items = readStore(KEYS.errors, []).map(item => item.id === id ? { ...item, reviewed: true } : item);
  writeStore(KEYS.errors, items); window.dispatchEvent(new Event('goethe-progress-updated'));
}

export function recordRepairResult(id, success) {
  const items = readStore(KEYS.errors, []).map(item => item.id === id ? {
    ...item,
    reviewed: success ? true : item.reviewed,
    repairAttempts: (item.repairAttempts || 0) + 1,
    repairSuccesses: (item.repairSuccesses || 0) + (success ? 1 : 0),
    lastRepairAt: new Date().toISOString(),
  } : item);
  writeStore(KEYS.errors, items);
  window.dispatchEvent(new Event('goethe-progress-updated'));
}

export function getSrsRecords() { return readStore(KEYS.srs, {}); }
export function reviewSrs(cardId, rating) {
  const records = getSrsRecords();
  const previous = records[cardId] || { interval: 0, ease: 2.5, repetitions: 0 };
  let { interval, ease, repetitions } = previous;
  if (rating === 'again') { interval = 1; repetitions = 0; ease = Math.max(1.3, ease - 0.2); }
  if (rating === 'hard') { interval = Math.max(1, Math.round((interval || 1) * 1.2)); ease = Math.max(1.3, ease - 0.15); }
  if (rating === 'good') { interval = repetitions === 0 ? 1 : repetitions === 1 ? 3 : Math.max(4, Math.round(interval * ease)); repetitions += 1; }
  if (rating === 'easy') { interval = repetitions === 0 ? 4 : Math.max(7, Math.round((interval || 1) * ease * 1.3)); repetitions += 1; ease += 0.15; }
  const due = new Date(); due.setDate(due.getDate() + interval);
  records[cardId] = { interval, ease, repetitions, due: due.toISOString(), lastRating: rating };
  writeStore(KEYS.srs, records); window.dispatchEvent(new Event('goethe-progress-updated'));
  return records[cardId];
}

export function isDue(record) { return !record?.due || new Date(record.due) <= new Date(); }