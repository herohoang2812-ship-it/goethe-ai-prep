import { useEffect, useMemo, useRef, useState } from 'react';
import { Award, Check, ChevronLeft, ChevronRight, Clock, Highlighter, RefreshCw, X } from 'lucide-react';
import { B2_LESEN_PARTS } from '../data/b2ExamData';
import { recordAttempt } from '../utils/learningStore';

const TOTAL_SECONDS = 65 * 60;
const formatTime = (value) => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;

const READING_SKILLS = {
  L1: 'Ghép quan điểm & chi tiết', L2: 'Liên kết văn bản & Kohärenz', L3: 'Đọc chi tiết qua paraphrase', L4: 'Nhận diện luận điểm chính', L5: 'Đọc chức năng văn bản',
};
const getReadingAnalysis = (part, question) => ({
  skill: READING_SKILLS[part.id],
  evidence: question.evidence || (part.id === 'L2' ? `Kiểm tra liên kết logic ngay trước và sau ${question.question}.` : `Tìm đoạn diễn đạt cùng ý với “${question.options[question.correct]}”, không chỉ tìm từ trùng.`),
  paraphrase: question.paraphrase || `${question.question} ↔ ${question.options[question.correct]}`,
  trap: question.trap || 'Đáp án nhiễu thường đúng một chi tiết nhỏ nhưng không trả lời đúng trọng tâm câu hỏi.',
});
export default function LesenView({ showToast, onActivityComplete }) {
  const [partIndex, setPartIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const answersRef = useRef({});
  const part = B2_LESEN_PARTS[partIndex];
  const allQuestions = useMemo(() => B2_LESEN_PARTS.flatMap(item => item.questions), []);

  const finish = (automatic = false) => {
    if (submitted) return;
    let totalCorrect = 0;
    B2_LESEN_PARTS.forEach(section => {
      const errors = [];
      let correct = 0;
      section.questions.forEach(question => {
        const selected = answersRef.current[question.id];
        if (selected === question.correct) correct += 1;
        else errors.push({ question: question.question, answer: selected === undefined ? 'Chưa trả lời' : question.options[selected], correction: question.options[question.correct], explanation: question.explanation, skillTag: READING_SKILLS[section.id], category: 'VOCABULARY' });
      });
      totalCorrect += correct;
      recordAttempt({ module: 'Lesen', part: section.title, correct, total: section.questions.length, errors });
    });
    const finalScore = Math.round(totalCorrect / allQuestions.length * 100);
    setScore(finalScore); setSubmitted(true); onActivityComplete?.();
    showToast?.(automatic ? `Hết 65 phút. Bài Lesen đã tự nộp: ${finalScore}/100.` : `Đã nộp module Lesen B2: ${finalScore}/100.`, finalScore >= 60 ? 'success' : 'warning');
  };

  useEffect(() => {
    if (submitted) return undefined;
    const timer = setInterval(() => setTimeLeft(value => {
      if (value <= 1) { clearInterval(timer); setTimeout(() => finish(true), 0); return 0; }
      return value - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const selectAnswer = (questionId, optionIndex) => {
    if (submitted) return;
    const next = { ...answersRef.current, [questionId]: optionIndex };
    answersRef.current = next; setAnswers(next);
  };

  const reset = () => { answersRef.current = {}; setAnswers({}); setSubmitted(false); setScore(0); setTimeLeft(TOTAL_SECONDS); setPartIndex(0); };
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="page-section">
      <div className="content-header">
        <div><h1 className="content-title">Goethe B2 Lesen</h1><p className="content-subtitle">Mô phỏng đủ 5 Teil · 30 câu · 65 phút · ngưỡng đạt 60/100.</p></div>
        <div className="badge badge-primary"><Clock size={14} /> {formatTime(timeLeft)}</div>
      </div>

      <div className="glass-panel panel" style={{ marginBottom: 20 }}>
        <div className="exam-part-tabs" role="tablist" aria-label="Các phần Lesen B2">
          {B2_LESEN_PARTS.map((item, index) => {
            const done = item.questions.filter(q => answers[q.id] !== undefined).length;
            return <button key={item.id} className={`exam-part-tab ${index === partIndex ? 'active' : ''}`} onClick={() => setPartIndex(index)} role="tab" aria-selected={index === partIndex}><span>Teil {index + 1}</span><small>{done}/{item.questions.length}</small></button>;
          })}
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="col-6 glass-panel panel flex-col gap-md">
          <div className="flex-between"><div><span className="badge badge-secondary">{part.minutes} phút đề xuất</span><h2 style={{ fontSize: 19, marginTop: 10 }}>{part.title}</h2></div></div>
          <p className="text-muted" style={{ fontSize: 13 }}>{part.format}</p>
          <div className="rewrite-block exam-passage">{part.passage}</div>
          {part.sentenceOptions && <div className="reference-options">{part.sentenceOptions.map(text => <div key={text}>{text}</div>)}</div>}
          {part.headingOptions && <div className="reference-options">{part.headingOptions.map(text => <div key={text}>{text}</div>)}</div>}
        </section>

        <section className="col-6 glass-panel panel flex-col gap-md">
          <div className="flex-between"><h3 style={{ fontSize: 17 }}>Câu hỏi Teil {partIndex + 1}</h3>{submitted && <span className="badge badge-success"><Award size={13} /> {score}/100</span>}</div>
          {part.questions.map((question, index) => {
            const selected = answers[question.id];
            const analysis = getReadingAnalysis(part, question);
            return <div key={question.id} className="inner-card exam-question-card"><div className="flex-between gap-sm"><p className="font-semibold">{index + 1}. {question.question}</p><span className="badge badge-secondary reading-skill-badge">{analysis.skill}</span></div><div className="flex-col gap-sm" role="radiogroup">{question.options.map((option, optionIndex) => {
              const correct = submitted && optionIndex === question.correct;
              const wrong = submitted && selected === optionIndex && optionIndex !== question.correct;
              return <button key={option} className={`quiz-option exam-option ${selected === optionIndex ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`} onClick={() => selectAnswer(question.id, optionIndex)} disabled={submitted} role="radio" aria-checked={selected === optionIndex}><span>{option}</span>{correct && <Check size={15} />}{wrong && <X size={15} />}</button>;
            })}</div>{submitted && <div className="reading-analysis"><div className="reading-analysis-title"><Highlighter size={15}/> Bằng chứng & paraphrase</div><p><strong>Bằng chứng cần tìm:</strong> {analysis.evidence}</p><p><strong>Cặp paraphrase:</strong> {analysis.paraphrase}</p>{selected !== question.correct && <p><strong>Bẫy thường gặp:</strong> {analysis.trap}</p>}</div>}</div>;
          })}
          <div className="flex-between exam-footer"><button className="btn btn-secondary" disabled={partIndex === 0} onClick={() => setPartIndex(value => value - 1)}><ChevronLeft size={15} /> Teil trước</button><span className="text-muted" style={{ fontSize: 12 }}>{answeredCount}/{allQuestions.length} câu</span>{partIndex < 4 ? <button className="btn btn-primary" onClick={() => setPartIndex(value => value + 1)}>Teil tiếp <ChevronRight size={15} /></button> : submitted ? <button className="btn btn-secondary" onClick={reset}><RefreshCw size={15} /> Làm lại</button> : <button className="btn btn-primary" onClick={() => finish(false)}>Nộp Lesen</button>}</div>
        </section>
      </div>
    </div>
  );
}