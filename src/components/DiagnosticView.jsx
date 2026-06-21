import { useEffect, useMemo, useRef, useState } from 'react';
import { Award, BookOpen, Check, ChevronLeft, ChevronRight, Clock3, Headphones, Mic, PenTool, Play, RotateCcw, Square, Target, Volume2 } from 'lucide-react';
import { DIAGNOSTIC_HOEREN, DIAGNOSTIC_LESEN, DIAGNOSTIC_SECTIONS, DIAGNOSTIC_SPEAKING, DIAGNOSTIC_WRITING } from '../data/b2DiagnosticData';
import { buildDiagnosticResult, buildRoadmap, getDiagnosticFeedback, getDiagnosticResult, saveDiagnosticResult, scoreObjective, scoreSpeaking, scoreWriting } from '../utils/diagnosticEngine';
import { recordAttempt } from '../utils/learningStore';

const icons = { lesen: BookOpen, hoeren: Headphones, schreiben: PenTool, sprechen: Mic };

export default function DiagnosticView({ showToast, onActivityComplete, setActiveTab }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [plays, setPlays] = useState({});
  const [writing, setWriting] = useState('');
  const [speaking, setSpeaking] = useState('');
  const [result, setResult] = useState(() => getDiagnosticResult());
  const [isPlaying, setIsPlaying] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const section = DIAGNOSTIC_SECTIONS[sectionIndex];
  const roadmap = useMemo(() => buildRoadmap(result), [result]);
  const feedback = useMemo(() => getDiagnosticFeedback(result), [result]);
  const writingWords = writing.trim().split(/\s+/).filter(Boolean).length;
  const speakingWords = speaking.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => () => { window.speechSynthesis?.cancel(); recognitionRef.current?.stop?.(); }, []);

  const playClip = clip => {
    if ((plays[clip.id] || 0) >= 1) return showToast?.('Diagnostic chỉ cho nghe mỗi đoạn một lần.', 'warning');
    if (!('speechSynthesis' in window)) return showToast?.('Trình duyệt không hỗ trợ phát giọng nói.', 'error');
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clip.text);
    utterance.lang = 'de-DE'; utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices().filter(voice => voice.lang?.startsWith('de'));
    if (voices.length) utterance.voice = voices[Number(clip.id.replace('DH', '')) % voices.length];
    utterance.onstart = () => setIsPlaying(clip.id);
    utterance.onend = () => setIsPlaying(null);
    utterance.onerror = () => setIsPlaying(null);
    setPlays(current => ({ ...current, [clip.id]: 1 }));
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return showToast?.('Trình duyệt chưa hỗ trợ nhận giọng nói. Bạn có thể nhập transcript bên dưới.', 'warning');
    const recognition = new Recognition();
    recognition.lang = 'de-DE'; recognition.continuous = true; recognition.interimResults = true;
    recognition.onresult = event => {
      let transcript = '';
      for (let index = 0; index < event.results.length; index += 1) transcript += `${event.results[index][0].transcript} `;
      setSpeaking(transcript.trim());
    };
    recognition.onerror = () => { setIsRecording(false); showToast?.('Không thể nhận giọng nói. Hãy nhập transcript để tiếp tục.', 'warning'); };
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition; recognition.start(); setIsRecording(true);
  };

  const submitDiagnostic = () => {
    const missingLesen = DIAGNOSTIC_LESEN.questions.some(question => answers[question.id] === undefined);
    const missingHoeren = DIAGNOSTIC_HOEREN.some(question => answers[question.id] === undefined);
    if (missingLesen || missingHoeren) return showToast?.('Hãy trả lời đủ câu Lesen và Hören.', 'warning');
    if (writingWords < 30) return showToast?.('Phần Schreiben cần tối thiểu 30 từ để chẩn đoán.', 'warning');
    if (speakingWords < 18) return showToast?.('Phần Sprechen cần transcript tối thiểu 18 từ.', 'warning');

    const lesenResult = scoreObjective(DIAGNOSTIC_LESEN.questions, answers);
    const hoerenResult = scoreObjective(DIAGNOSTIC_HOEREN, answers);
    const schreibenResult = scoreWriting(writing);
    const sprechenResult = scoreSpeaking(speaking);
    const next = buildDiagnosticResult({ lesen: lesenResult, hoeren: hoerenResult, schreiben: schreibenResult, sprechen: sprechenResult });
    saveDiagnosticResult(next); setResult(next); onActivityComplete?.();
    const lowError = (skill, score, sample, correction) => score < 60 ? [{ question: `Diagnostic ${skill}`, answer: sample, correction, explanation: `Điểm ${skill} dưới 60%; ưu tiên luyện dạng này trong 30 ngày đầu.`, category: skill === 'Schreiben' || skill === 'Sprechen' ? 'SENTENCE_STRUCTURE' : 'VOCABULARY', skillTag: `diagnostic-${skill.toLowerCase()}` }] : [];
    recordAttempt({ module: 'Diagnostic', part: 'Lesen', correct: lesenResult.correct, total: lesenResult.total, errors: lowError('Lesen', lesenResult.score, `${lesenResult.correct}/${lesenResult.total}`, 'Đạt tối thiểu 60%') });
    recordAttempt({ module: 'Diagnostic', part: 'Hören', correct: hoerenResult.correct, total: hoerenResult.total, errors: lowError('Hören', hoerenResult.score, `${hoerenResult.correct}/${hoerenResult.total}`, 'Đạt tối thiểu 60%') });
    recordAttempt({ module: 'Diagnostic', part: 'Schreiben', correct: schreibenResult.score, total: 100, errors: lowError('Schreiben', schreibenResult.score, writing.slice(0, 180), 'Viết đủ bố cục, quan điểm, hai phía và giải pháp') });
    recordAttempt({ module: 'Diagnostic', part: 'Sprechen', correct: sprechenResult.score, total: 100, errors: lowError('Sprechen', sprechenResult.score, speaking.slice(0, 180), 'Trình bày có mở bài, quan điểm, ví dụ và kết luận') });
    showToast?.(`Hoàn tất chẩn đoán: ${next.overall}/100.`, next.overall >= 60 ? 'success' : 'warning');
  };

  const reset = () => { setResult(null); setSectionIndex(0); setAnswers({}); setPlays({}); setWriting(''); setSpeaking(''); };

  if (result) return <DiagnosticResultPage result={result} feedback={feedback} roadmap={roadmap} onReset={reset} setActiveTab={setActiveTab}/>;
  return (
  <div className="page-section">
    <div className="content-header"><div><h1 className="content-title">Diagnostic B2</h1><p className="content-subtitle">35 phút · bốn kỹ năng · xác định điểm xuất phát trước khi lập lộ trình.</p></div><div className="badge badge-primary"><Clock3 size={14}/> {section.minutes} phút đề xuất</div></div>
    <div className="glass-panel panel diagnostic-stepper">{DIAGNOSTIC_SECTIONS.map((item, index) => { const Icon = icons[item.id]; return <button key={item.id} className={`diagnostic-step ${index === sectionIndex ? 'active' : ''} ${index < sectionIndex ? 'done' : ''}`} onClick={() => setSectionIndex(index)}><Icon size={16}/><span>{item.label}</span><small>{item.minutes}'</small></button>; })}</div>

    <section className="glass-panel panel-lg diagnostic-workspace">
      <div className="diagnostic-section-heading"><div><span className="badge badge-secondary">Phần {sectionIndex + 1}/4</span><h2>{section.label}</h2><p className="text-muted">{section.description}</p></div></div>

      {section.id === 'lesen' && <div className="dashboard-grid"><div className="col-6 rewrite-block exam-passage">{DIAGNOSTIC_LESEN.passage}</div><div className="col-6 flex-col gap-md">{DIAGNOSTIC_LESEN.questions.map((question, index) => <Question key={question.id} question={question} index={index} value={answers[question.id]} onSelect={value => setAnswers(current => ({ ...current, [question.id]: value }))}/>)}</div></div>}

      {section.id === 'hoeren' && <div className="diagnostic-listening-list">{DIAGNOSTIC_HOEREN.map((clip, index) => <article key={clip.id} className="inner-card diagnostic-listening-card"><div className="flex-between gap-sm"><div><span className="badge badge-secondary"><Volume2 size={13}/> Đoạn {index + 1}</span><p className="text-muted diagnostic-speaker">{clip.speaker} · chỉ nghe 1 lần</p></div><button className="btn btn-primary" onClick={() => playClip(clip)} disabled={(plays[clip.id] || 0) >= 1}>{isPlaying === clip.id ? <Square size={14}/> : <Play size={14}/>} {isPlaying === clip.id ? 'Đang phát' : plays[clip.id] ? 'Đã nghe' : 'Nghe'}</button></div><Question question={clip} index={index} value={answers[clip.id]} onSelect={value => setAnswers(current => ({ ...current, [clip.id]: value }))}/></article>)}</div>}

      {section.id === 'schreiben' && <div className="production-diagnostic"><div className="production-prompt"><span className="badge badge-primary">Forumsbeitrag</span><h3>{DIAGNOSTIC_WRITING.title}</h3><p>{DIAGNOSTIC_WRITING.prompt}</p><ul>{DIAGNOSTIC_WRITING.requirements.map(item => <li key={item}>{item}</li>)}</ul></div><div><div className="flex-between"><label className="form-label" htmlFor="diagnostic-writing">Bài viết</label><span className={`badge ${writingWords >= 80 ? 'badge-success' : 'badge-secondary'}`}>{writingWords} từ</span></div><textarea id="diagnostic-writing" className="form-control diagnostic-production-input" value={writing} onChange={event => setWriting(event.target.value)} placeholder="Meiner Meinung nach ..."/></div></div>}

      {section.id === 'sprechen' && <div className="production-diagnostic"><div className="production-prompt"><span className="badge badge-primary">Kurzvortrag</span><h3>{DIAGNOSTIC_SPEAKING.title}</h3><p>{DIAGNOSTIC_SPEAKING.prompt}</p><button className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`} onClick={toggleRecording}>{isRecording ? <Square size={15}/> : <Mic size={15}/>} {isRecording ? 'Dừng ghi âm' : 'Bắt đầu nói'}</button></div><div><div className="flex-between"><label className="form-label" htmlFor="diagnostic-speaking">Transcript</label><span className={`badge ${speakingWords >= 55 ? 'badge-success' : 'badge-secondary'}`}>{speakingWords} từ</span></div><textarea id="diagnostic-speaking" className="form-control diagnostic-production-input" value={speaking} onChange={event => setSpeaking(event.target.value)} placeholder="Heute möchte ich über ... sprechen."/></div></div>}

      <div className="flex-between diagnostic-navigation"><button className="btn btn-secondary" disabled={sectionIndex === 0} onClick={() => setSectionIndex(value => value - 1)}><ChevronLeft size={15}/> Phần trước</button>{sectionIndex < 3 ? <button className="btn btn-primary" onClick={() => setSectionIndex(value => value + 1)}>Phần tiếp <ChevronRight size={15}/></button> : <button className="btn btn-primary" onClick={submitDiagnostic}><Award size={15}/> Chấm diagnostic</button>}</div>
</section>
  </div>
  );
}

function DiagnosticResultPage({ result, feedback, roadmap, onReset, setActiveTab }) {
  const weakestTab = result.weakest[0].skill === 'Hören' ? 'horen' : result.weakest[0].skill === 'Lesen' ? 'lesen' : result.weakest[0].skill === 'Schreiben' ? 'schreiben' : 'sprechen';
  return <div className="page-section diagnostic-result-page">
    <div className="content-header">
      <div><h1 className="content-title">Phiếu chẩn đoán năng lực B2</h1><p className="content-subtitle">Không chỉ là điểm số: đây là điều bạn đang làm tốt, điểm đang mất và cách học tiếp.</p></div>
      <button className="btn btn-secondary" onClick={onReset}><RotateCcw size={15}/> Làm lại diagnostic</button>
    </div>

    <section className="glass-panel panel-lg diagnostic-hero">
      <div><span className="badge badge-primary"><Award size={14}/> Điểm xuất phát</span><div className="diagnostic-overall">{result.overall}<small>/100</small></div><p className="text-muted">Chẩn đoán định hướng, không phải kết quả thi chính thức.</p></div>
      <div>
        <h2 className="diagnostic-verdict-title">Nhận định chung</h2><p className="diagnostic-verdict">{feedback.overall}</p>
        <div className="diagnostic-skill-grid">{Object.entries(result.skills).map(([skill, value]) => <SkillScore key={skill} skill={skill} value={value}/>)}</div>
      </div>
    </section>

    <section className="diagnostic-feedback-section">
      <div className="section-heading-copy"><h2>Nhận xét theo từng kỹ năng</h2><p className="text-muted">Mỗi nhận xét gồm bằng chứng từ bài làm và một hành động cụ thể.</p></div>
      <div className="diagnostic-feedback-grid">{Object.entries(feedback.skills).map(([skill, item]) => <SkillFeedbackCard key={skill} skill={skill} item={item}/>)}</div>
    </section>

    <section className="glass-panel panel-lg diagnostic-actions">
      <div className="section-heading-copy"><h2>Ba việc nên làm ngay</h2><p className="text-muted">Thứ tự này được tạo từ hai kỹ năng có điểm thấp nhất.</p></div>
      <div className="diagnostic-action-list">{feedback.nextActions.map(action => <NextAction key={action.number} action={action}/>)}</div>
    </section>

    <div className="section-heading-copy roadmap-heading"><h2>Lộ trình 30/60/90 ngày</h2><p className="text-muted">Mục tiêu tăng dần; không yêu cầu học lại phần bạn đã vững.</p></div>
    <div className="dashboard-grid roadmap-phase-grid">{roadmap.map((phase, index) => <RoadmapPhase key={phase.phase} phase={phase} index={index}/>)}</div>
    <section className="glass-panel panel diagnostic-next">
      <div><Target size={22}/><div><h3>Bắt đầu từ kỹ năng yếu nhất: {result.weakest[0].skill}</h3><p className="text-muted">Điểm hiện tại {result.weakest[0].score}%. Hãy làm bài ngắn theo nhận xét phía trên trước khi vào full test.</p></div></div>
      <button className="btn btn-primary" onClick={() => setActiveTab?.(weakestTab)}>Luyện ngay <ChevronRight size={15}/></button>
    </section>
  </div>;
}

function SkillScore({ skill, value }) {
  return <div className="diagnostic-skill"><div className="flex-between"><span>{skill}</span><strong className={value < 60 ? 'text-accent' : 'text-success'}>{value}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${value}%` }}/></div></div>;
}

function NextAction({ action }) {
  return <article><span>{action.number}</span><div><h3>{action.title}</h3><p>{action.text}</p></div></article>;
}

function RoadmapPhase({ phase, index }) {
  return <article className="col-4 glass-panel panel roadmap-phase"><div className="phase-number">{index + 1}</div><span className="badge badge-secondary">{phase.phase}</span><h3>{phase.title}</h3><p className="phase-focus">Trọng tâm: <strong>{phase.focus}</strong> · Mục tiêu {phase.target}%</p><ul>{phase.tasks.map(task => <li key={task}><Check size={14}/><span>{task}</span></li>)}</ul></article>;
}
function SkillFeedbackCard({ skill, item }) {
  return <article className={`glass-panel panel diagnostic-feedback-card feedback-tone-${item.tone}`}>
    <div className="flex-between gap-sm">
      <div><span className="feedback-skill-name">{skill}</span><span className={`feedback-status ${item.tone}`}>{item.label}</span></div>
      <strong className="feedback-score">{item.score}%</strong>
    </div>
    <h3>{item.summary}</h3>
    <p className="feedback-evidence">{item.evidence}</p>
    {item.criteria && <div className="diagnostic-criteria">{item.criteria.map(criterion => <DiagnosticCriterion key={criterion[0]} criterion={criterion}/>)}</div>}
    {item.mistakes?.length > 0 && <div className="diagnostic-mistakes"><strong>Câu cần xem lại</strong>{item.mistakes.slice(0, 3).map(mistake => <div key={mistake.id}><span>{mistake.skill}: {mistake.question}</span><small>Bạn chọn: {mistake.selectedAnswer} · Đúng: {mistake.correctAnswer}</small></div>)}</div>}
    <div className="feedback-action"><Target size={15}/><span><strong>Nên làm tiếp:</strong> {item.action}</span></div>
  </article>;
}

function DiagnosticCriterion({ criterion }) {
  const [label, value, max, explanation] = criterion;
  return <div className="diagnostic-criterion">
    <div className="flex-between"><span>{label}<small>{explanation}</small></span><strong>{value}/{max}</strong></div>
    <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.round(value / max * 100)}%` }}/></div>
  </div>;
}
function Question({ question, index, value, onSelect }) {
  return <div className="diagnostic-question"><div className="flex-between gap-sm"><p className="font-semibold">{index + 1}. {question.question}</p><span className="badge badge-secondary">{question.skill}</span></div><div className="flex-col gap-sm" role="radiogroup">{question.options.map((option, optionIndex) => <button key={option} className={`quiz-option exam-option ${value === optionIndex ? 'selected' : ''}`} onClick={() => onSelect(optionIndex)} role="radio" aria-checked={value === optionIndex}><span>{option}</span></button>)}</div></div>;
}