export const ERROR_CATEGORIES = {
  VERB_POSITION: { label: 'Vị trí động từ', color: 'accent' },
  CASE: { label: 'Dativ/Akkusativ', color: 'warning' },
  PREPOSITION: { label: 'Giới từ cố định', color: 'warning' },
  ARTICLE_DECLENSION: { label: 'Mạo từ & biến cách', color: 'secondary' },
  VERB_FORM: { label: 'Chia/dạng động từ', color: 'accent' },
  SENTENCE_STRUCTURE: { label: 'Cấu trúc câu', color: 'primary' },
  REGISTER: { label: 'Văn phong/Register', color: 'secondary' },
  COHERENCE: { label: 'Mạch lạc & liên kết', color: 'primary' },
  VOCABULARY: { label: 'Từ vựng/Collocation', color: 'success' },
  TASK_COMPLETION: { label: 'Thiếu yêu cầu đề', color: 'warning' },
  SPELLING: { label: 'Chính tả', color: 'secondary' },
  OTHER: { label: 'Lỗi khác', color: 'muted' },
};

export function inferErrorCategory(error = {}) {
  const supplied = String(error.category || '').toUpperCase();
  if (ERROR_CATEGORIES[supplied]) return supplied;
  const text = `${error.reason || ''} ${error.original || error.answer || ''}`.toLowerCase();
  if (/verb.*(position|cuối|vị trí)|wortstellung|nebensatz/.test(text)) return 'VERB_POSITION';
  if (/dativ|akkusativ|kasus|cách 3|cách 4/.test(text)) return 'CASE';
  if (/präposition|giới từ/.test(text)) return 'PREPOSITION';
  if (/artikel|deklination|mạo từ|biến cách/.test(text)) return 'ARTICLE_DECLENSION';
  if (/konjug|chia động từ|partizip|verbform/.test(text)) return 'VERB_FORM';
  if (/register|văn phong|höflich|formell|informell/.test(text)) return 'REGISTER';
  if (/kohären|liên kết|mạch lạc|logic/.test(text)) return 'COHERENCE';
  if (/wortschatz|vokab|từ vựng|collocation|ausdruck/.test(text)) return 'VOCABULARY';
  if (/aufgabe|inhaltspunkt|yêu cầu|thiếu ý/.test(text)) return 'TASK_COMPLETION';
  if (/rechtschreibung|chính tả|spelling/.test(text)) return 'SPELLING';
  if (/satz|cấu trúc/.test(text)) return 'SENTENCE_STRUCTURE';
  return 'OTHER';
}

export function normalizeLearningError(error = {}) {
  const category = inferErrorCategory(error);
  const original = error.original || error.answer || '';
  const correct = error.correct || error.correction || '';
  return {
    ...error,
    category,
    categoryLabel: ERROR_CATEGORIES[category].label,
    original,
    correct,
    reason: error.reason || error.explanation || '',
    skillTag: error.skillTag || category.toLowerCase(),
    drillPrompt: error.drillPrompt || `Hãy viết lại câu đúng, giữ nguyên ý: “${original}”`,
    expectedAnswer: error.expectedAnswer || correct,
  };
}