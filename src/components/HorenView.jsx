import { useEffect, useMemo, useRef, useState } from 'react';
import { Award, BookOpen, Check, ChevronLeft, ChevronRight, Clock, Gauge, Headphones, Play, Square, X } from 'lucide-react';
import { B2_HOREN_PARTS } from '../data/b2ExamData';
import { recordAttempt } from '../utils/learningStore';
import { speak, stop } from '../services/ttsService';

const TOTAL_SECONDS = 40 * 60;
const formatTime = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;

export default function HorenView({ showToast, onActivityComplete }) {
  const [partIndex, setPartIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [plays, setPlays] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState('exam');
  const [speechRate, setSpeechRate] = useState(0.9);
  const [activeSegment, setActiveSegment] = useState(-1);
  const [showTranscript, setShowTranscript] = useState(true);
  const answersRef = useRef({});
  const part = B2_HOREN_PARTS[partIndex];
  const allQuestions = useMemo(() => B2_HOREN_PARTS.flatMap(item => item.questions), []);
  const learningMode = mode === 'learn';

  const stopAudio = () => { stop(); setIsPlaying(false); setActiveSegment(-1); };
  useEffect(() => () => stop(), []);

  const finish = (automatic = false) => {
    if (submitted) return;
    stopAudio(); let totalCorrect = 0;
    B2_HOREN_PARTS.forEach(section => {
      let correct = 0; const errors = [];
      section.questions.forEach(question => {
        const selected = answersRef.current[question.id];
        if (selected === question.correct) correct += 1;
        else errors.push({ question: question.question, answer: selected === undefined ? 'Chưa trả lời' : question.options[selected], correction: question.options[question.correct], explanation: question.explanation, skillTag: 'hoeren-paraphrase', category: 'VOCABULARY' });
      });
      totalCorrect += correct; recordAttempt({ module: 'Hören', part: section.title, correct, total: section.questions.length, errors });
    });
    const finalScore = Math.round(totalCorrect / allQuestions.length * 100);
    setScore(finalScore); setSubmitted(true); onActivityComplete?.();
    showToast?.(automatic ? `Hết 40 phút. Bài Hören đã tự nộp: ${finalScore}/100.` : `Đã nộp module Hören B2: ${finalScore}/100.`, finalScore >= 60 ? 'success' : 'warning');
  };

  useEffect(() => {
    if (submitted || learningMode) return undefined;
    const timer = setInterval(() => setTimeLeft(value => {
      if (value <= 1) { clearInterval(timer); setTimeout(() => finish(true), 0); return 0; }
      return value - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [submitted, learningMode]);

  const playPart = () => {
    const used = plays[part.id] || 0;
    if (!learningMode && used >= part.maxPlays) return showToast?.('Bạn đã dùng hết số lượt nghe của Teil này.', 'warning');
    
    stop();
    if (!learningMode) setPlays(current => ({ ...current, [part.id]: used + 1 }));
    setIsPlaying(true);
    
    let segmentIndex = 0;
    
    const playNextSegment = () => {
      if (segmentIndex >= part.segments.length) {
        setIsPlaying(false);
        setActiveSegment(-1);
        return;
      }
      
      setActiveSegment(segmentIndex);
      const segment = part.segments[segmentIndex];
      segmentIndex++;
      
      const speakerMap = new Map();
      let speakerCursor = 0;
      part.segments.forEach(seg => {
        if (!speakerMap.has(seg.speaker)) {
          speakerMap.set(seg.speaker, speakerCursor);
          speakerCursor += 1;
        }
      });
      const voiceIndex = speakerMap.get(segment.speaker) || 0;
      
      speak(segment.text, {
        rate: learningMode ? speechRate : 0.96,
        pitch: 0.92 + (voiceIndex % 3) * 0.09,
        onEnd: () => {
          setTimeout(() => {
            playNextSegment();
          }, 450);
        }
      });
    };
    
    playNextSegment();
  };

  const selectAnswer = (questionId, optionIndex) => {
    if (submitted && !learningMode) return;
    const next = { ...answersRef.current, [questionId]: optionIndex }; answersRef.current = next; setAnswers(next);
  };
  const switchPart = index => { stopAudio(); setPartIndex(index); };
  const switchMode = nextMode => { stopAudio(); setMode(nextMode); if (nextMode === 'learn') setShowTranscript(true); };
  const reset = () => { stopAudio(); answersRef.current = {}; setAnswers({}); setPlays({}); setSubmitted(false); setTimeLeft(TOTAL_SECONDS); setScore(0); setPartIndex(0); };

  return <div className="page-section">
    <div className="content-header"><div><h1 className="content-title">Goethe B2 Hören</h1><p className="content-subtitle">Prüfungsmodus giữ đúng luật nghe; Lernmodus cho phép tua chậm, transcript và phân tích bẫy.</p></div><div className="badge badge-primary"><Clock size={14}/> {learningMode ? 'Không tính giờ' : formatTime(timeLeft)}</div></div>

    <div className="glass-panel panel listening-mode-bar" style={{ marginBottom: 20 }}>
      <div className="mode-switch" role="tablist" aria-label="Chế độ luyện nghe"><button className={`mode-button ${!learningMode ? 'active' : ''}`} onClick={() => switchMode('exam')}><Clock size={15}/> Prüfungsmodus</button><button className={`mode-button ${learningMode ? 'active' : ''}`} onClick={() => switchMode('learn')}><BookOpen size={15}/> Lernmodus</button></div>
      <p className="text-muted">{learningMode ? 'Nghe không giới hạn · transcript theo người nói · tốc độ tùy chỉnh.' : `Mỗi Teil chỉ được nghe ${part.maxPlays} lần theo định dạng đề.`}</p>
    </div>

    <div className="glass-panel panel" style={{ marginBottom: 20 }}><div className="exam-part-tabs" role="tablist">{B2_HOREN_PARTS.map((item,index)=><button key={item.id} className={`exam-part-tab ${index===partIndex?'active':''}`} onClick={()=>switchPart(index)}><span>Teil {index+1}</span><small>{item.maxPlays===1?'1 lần':'2 lần'}</small></button>)}</div></div>
    <div className="dashboard-grid">
      <section className="col-5 flex-col gap-md">
        <div className="glass-panel panel"><span className="badge badge-secondary"><Headphones size={13}/> {learningMode ? 'Nghe không giới hạn' : `Nghe tối đa ${part.maxPlays} lần`}</span><h2 style={{fontSize:19,marginTop:12}}>{part.title}</h2><p className="text-muted" style={{fontSize:13,lineHeight:1.6}}>{part.format}</p>
          {learningMode && <div className="learning-audio-controls"><span><Gauge size={14}/> Tốc độ</span>{[0.75,0.9,1].map(rate=><button key={rate} className={`speed-button ${speechRate===rate?'active':''}`} onClick={()=>setSpeechRate(rate)}>{rate}×</button>)}</div>}
          <div className="audio-player-card" style={{marginTop:18}}><div className={`audio-visualizer-disc ${isPlaying?'disc-spinning':''}`}><div className="audio-visualizer-center"/></div><p className="font-semibold">{isPlaying?'Đang phát hội thoại nhiều giọng…':'Sẵn sàng nghe'}</p><p className="text-muted" style={{fontSize:12}}>{learningMode ? `Lernmodus · ${speechRate}×` : `Đã nghe ${plays[part.id]||0}/${part.maxPlays} lần`}</p><div className="flex-row gap-md">{isPlaying?<button className="btn btn-danger" onClick={stopAudio}><Square size={14}/> Dừng</button>:<button className="btn btn-primary" onClick={playPart} disabled={!learningMode&&(plays[part.id]||0)>=part.maxPlays}><Play size={15}/> Phát Teil {partIndex+1}</button>}</div></div>
        </div>
        {(learningMode || submitted) && <div className="glass-panel panel"><div className="flex-between"><h3 style={{fontSize:15}}>Transcript theo người nói</h3>{learningMode&&<button className="btn-text-primary" onClick={()=>setShowTranscript(value=>!value)}>{showTranscript?'Ẩn':'Hiện'}</button>}</div>{showTranscript&&<div className="speaker-transcript">{part.segments.map((segment,index)=><p key={index} className={activeSegment===index?'active-segment':''}><strong>{segment.speaker}</strong><span>{segment.text}</span></p>)}</div>}</div>}
      </section>
      <section className="col-7 glass-panel panel flex-col gap-md"><div className="flex-between"><h3 style={{fontSize:17}}>Câu hỏi Teil {partIndex+1}</h3>{submitted&&<span className="badge badge-success"><Award size={13}/> {score}/100</span>}</div>{part.questions.map((question,index)=>{const selected=answers[question.id];const reveal=submitted||learningMode;return <div key={question.id} className="inner-card exam-question-card"><p className="font-semibold">{index+1}. {question.question}</p><div className="flex-col gap-sm" role="radiogroup">{question.options.map((option,optionIndex)=>{const correct=reveal&&selected!==undefined&&optionIndex===question.correct;const wrong=reveal&&selected===optionIndex&&optionIndex!==question.correct;return <button key={option} className={`quiz-option exam-option ${selected===optionIndex?'selected':''} ${correct?'correct':''} ${wrong?'wrong':''}`} onClick={()=>selectAnswer(question.id,optionIndex)} disabled={submitted&&!learningMode} role="radio" aria-checked={selected===optionIndex}><span>{option}</span>{correct&&<Check size={15}/>} {wrong&&<X size={15}/>}</button>})}</div>{reveal&&selected!==undefined&&<div className="listening-analysis"><span className="badge badge-primary">Từ khóa: {question.keyword}</span><p><strong>Paraphrase:</strong> {question.paraphrase}</p>{selected!==question.correct&&<p><strong>Bẫy:</strong> {question.trap}</p>}</div>}</div>})}<div className="flex-between exam-footer"><button className="btn btn-secondary" disabled={partIndex===0} onClick={()=>switchPart(partIndex-1)}><ChevronLeft size={15}/> Teil trước</button>{partIndex<3?<button className="btn btn-primary" onClick={()=>switchPart(partIndex+1)}>Teil tiếp <ChevronRight size={15}/></button>:submitted?<button className="btn btn-secondary" onClick={reset}>Làm lại</button>:!learningMode&&<button className="btn btn-primary" onClick={()=>finish(false)}>Nộp Hören</button>}</div></section>
    </div>
  </div>;
}