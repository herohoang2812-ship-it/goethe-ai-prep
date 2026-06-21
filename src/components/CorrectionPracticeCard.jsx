import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, Wand2, XCircle } from 'lucide-react';
import { normalizeLearningError } from '../utils/errorTaxonomy';
import { recordRepairResult } from '../utils/learningStore';

const simplify = value => String(value || '').toLocaleLowerCase('de-DE').replace(/[“”„"'.,!?;:()]/g, '').replace(/\s+/g, ' ').trim();

export default function CorrectionPracticeCard({ error, compact = false }) {
  const item = useMemo(() => normalizeLearningError(error), [error]);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState(false);

  const checkAnswer = () => {
    const expected = simplify(item.expectedAnswer);
    const actual = simplify(answer);
    const passed = Boolean(actual) && (actual === expected || (expected.length > 18 && actual.includes(expected)));
    setSuccess(passed);
    setChecked(true);
    if (item.id) recordRepairResult(item.id, passed);
  };

  return <article className={`correction-practice ${compact ? 'correction-practice-compact' : ''}`}>
    <div className="flex-between gap-sm">
      <span className="badge badge-secondary">{item.categoryLabel}</span>
      {item.skillTag && <small className="text-muted">#{item.skillTag}</small>}
    </div>
    <div className="correction-pair">
      <span className="error-original">{item.original || item.answer}</span>
      <span aria-hidden="true">→</span>
      <span className="error-correct">{item.correct || item.correction}</span>
    </div>
    {item.reason && <p className="error-reason"><strong>Vì sao:</strong> {item.reason}</p>}
    <div className="repair-drill">
      <label className="form-label" htmlFor={`repair-${item.id || item.original}`}><Wand2 size={14}/> Tự sửa lại</label>
      <p className="text-muted repair-prompt">{item.drillPrompt}</p>
      <textarea id={`repair-${item.id || item.original}`} className="form-control repair-input" rows={compact ? 2 : 3} value={answer} onChange={event => { setAnswer(event.target.value); setChecked(false); }} placeholder="Nhập câu tiếng Đức đã sửa..." />
      <div className="flex-between gap-sm repair-actions">
        <button className="btn btn-secondary" onClick={() => { setAnswer(''); setChecked(false); }}><RotateCcw size={14}/> Làm lại</button>
        <button className="btn btn-primary" onClick={checkAnswer} disabled={!answer.trim()}>Kiểm tra</button>
      </div>
      {checked && <div className={`repair-feedback ${success ? 'repair-success' : 'repair-error'}`}>
        {success ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
        <div><strong>{success ? 'Đúng rồi.' : 'Chưa khớp đáp án mẫu.'}</strong>{!success && <p>Gợi ý: {item.expectedAnswer}</p>}</div>
      </div>}
    </div>
  </article>;
}