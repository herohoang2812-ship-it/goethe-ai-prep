import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { LESEN_EXAMS } from '../src/data/lesenExams.js';
import { HOREN_EXAMS } from '../src/data/horenExams.js';
import { DIAGNOSTIC_HOEREN, DIAGNOSTIC_LESEN } from '../src/data/b2DiagnosticData.js';
import { getPlanPrice, PRICING_PLANS } from '../src/data/pricingPlans.js';
import { buildDiagnosticResult, buildRoadmap, getDiagnosticFeedback, scoreSpeaking, scoreWriting } from '../src/utils/diagnosticEngine.js';

function distribution(groups) {
  return groups.flatMap((group) => group.questions).reduce((counts, question) => {
    counts[question.correct] = (counts[question.correct] || 0) + 1;
    return counts;
  }, {});
}

test('đáp án Lesen và Hören được phân bố trên nhiều vị trí', () => {
  assert.ok(Object.keys(distribution(LESEN_EXAMS)).length >= 3);
  assert.ok(Object.keys(distribution(HOREN_EXAMS)).length >= 3);
});

test('frontend không chứa API key hoặc Authorization header', async () => {
  const source = await readFile(new URL('../src/services/aiService.js', import.meta.url), 'utf8');
  assert.equal(source.includes('sk-'), false);
  assert.equal(source.includes('Authorization'), false);
});
test('diagnostic bao phủ đủ dữ liệu Lesen và Hören', () => {
  assert.equal(DIAGNOSTIC_LESEN.questions.length, 4);
  assert.equal(DIAGNOSTIC_HOEREN.length, 4);
  assert.ok(DIAGNOSTIC_HOEREN.every(item => item.text && item.options.length === 3));
});

test('chấm sản sinh và sinh lộ trình từ kỹ năng yếu nhất', () => {
  const writing = scoreWriting('Meiner Meinung nach sollten Städte ruhiger werden. Einerseits verbessert das die Luft. Andererseits brauchen ältere Menschen gute Busse. Zum Beispiel könnte die Stadt mehr Parkplätze am Stadtrand bauen. Deshalb wäre es sinnvoll, zuerst den Nahverkehr auszubauen. Abschließend halte ich eine schrittweise Lösung für fair. Dieser Vorschlag verbindet Umweltschutz und Mobilität für alle Menschen in der Innenstadt.');
  const speaking = scoreSpeaking('Heute möchte ich über Online-Unterricht sprechen. Meiner Meinung nach ist Präsenzunterricht besser. Zum Beispiel kann man direkt Fragen stellen. Andererseits sind Online-Kurse flexibel. Abschließend denke ich, dass eine Mischung sinnvoll ist und beide Formen klare Vorteile haben.');
  assert.ok(writing.score >= 60);
  assert.ok(speaking.score >= 50);
  const result = buildDiagnosticResult({ lesen: { score: 75 }, hoeren: { score: 50 }, schreiben: writing, sprechen: speaking });
  const roadmap = buildRoadmap(result);
  assert.equal(result.weakest[0].skill, 'Hören');
  assert.equal(roadmap.length, 3);
assert.equal(roadmap[0].focus, 'Hören');
  const feedback = getDiagnosticFeedback(result);
  assert.match(feedback.skills.Hören.action, /Lernmodus/);
  assert.equal(feedback.skills.Schreiben.criteria.length, 5);
  assert.equal(feedback.nextActions.length, 3);
});
test('gói trả phí có hạn mức rõ ràng và giảm giá năm chính xác', () => {
  assert.equal(PRICING_PLANS.length, 4);
  assert.equal(PRICING_PLANS[0].monthlyPrice, 0);
  assert.ok(PRICING_PLANS.slice(1).every(plan => plan.quota.includes('lượt nâng cao') && plan.quota.includes('phút phát âm')));
  const plus = PRICING_PLANS.find(plan => plan.id === 'plus');
  assert.equal(getPlanPrice(plus, 'monthly'), 49000);
  assert.equal(getPlanPrice(plus, 'annual'), 39000);
});