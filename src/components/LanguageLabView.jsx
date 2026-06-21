import { useState } from 'react';
import { BookOpenCheck, Check, Eye, MessageSquareText, PenLine, Repeat2, X } from 'lucide-react';
import { COLLOCATION_EXERCISES, PARAPHRASE_EXERCISES, PRODUCTION_EXERCISES, REDEMITTEL_GROUPS } from '../data/b2LanguageData';
import { recordAttempt } from '../utils/learningStore';

export default function LanguageLabView({ showToast, onActivityComplete }) {
  const [mode, setMode] = useState('redemittel');
  const [answers, setAnswers] = useState({});
  const [productionIndex, setProductionIndex] = useState(0);
  const [productionText, setProductionText] = useState('');
  const [showModel, setShowModel] = useState(false);
  const exercises = mode === 'paraphrase' ? PARAPHRASE_EXERCISES : COLLOCATION_EXERCISES;
  const submitQuiz = () => {
    let correct = 0; const errors = [];
    exercises.forEach(item => { if (answers[item.id] === item.correct) correct += 1; else errors.push({ question:item.prompt, answer:item.options[answers[item.id]] || 'Chưa trả lời', correction:item.options[item.correct], explanation:item.tip || item.answer }); });
    recordAttempt({ module:'B2 Language Lab', part:mode === 'paraphrase' ? 'Paraphrase' : 'Collocation', correct, total:exercises.length, errors });
    onActivityComplete?.(); showToast?.(`Kết quả ${correct}/${exercises.length}. Các lỗi đã vào sổ lỗi.`, correct/exercises.length >= .6 ? 'success' : 'warning');
  };
  const rateProduction = success => {
    const item = PRODUCTION_EXERCISES[productionIndex];
    recordAttempt({ module:'B2 Language Lab', part:`Sản sinh · ${item.skill}`, correct:success?1:0, total:1, errors:success?[]:[{question:item.prompt,answer:productionText||'Chưa viết',correction:item.model,explanation:'So sánh cấu trúc, liên kết và độ chính xác với đáp án mẫu.'}] });
    onActivityComplete?.(); setProductionText(''); setShowModel(false); setProductionIndex(value => (value + 1) % PRODUCTION_EXERCISES.length);
  };
  return <div className="page-section"><div className="content-header"><div><h1 className="content-title">B2 Language Lab</h1><p className="content-subtitle">Redemittel, diễn đạt lại, collocation và bài tập sản sinh chủ động.</p></div></div>
    <div className="glass-panel panel"><div className="exam-part-tabs language-tabs">{[['redemittel','Redemittel',MessageSquareText],['paraphrase','Paraphrase',Repeat2],['collocation','Collocation',BookOpenCheck],['production','Sản sinh',PenLine]].map(([id,label,Icon])=><button key={id} className={`exam-part-tab ${mode===id?'active':''}`} onClick={()=>{setMode(id);setAnswers({})}}><Icon size={15}/><span>{label}</span></button>)}</div></div>
    <div style={{marginTop:20}}>{mode==='redemittel'&&<div className="dashboard-grid">{REDEMITTEL_GROUPS.map(group=><section key={group.title} className="col-6 glass-panel panel"><h3 className="section-title">{group.title}</h3>{group.items.map(([de,vi])=><div key={de} className="redemittel-card"><div className="redemittel-de">{de}</div><div className="redemittel-vi">{vi}</div></div>)}</section>)}</div>}
    {(mode==='paraphrase'||mode==='collocation')&&<section className="glass-panel panel flex-col gap-md">{exercises.map((item,index)=><div key={item.id} className="inner-card exam-question-card"><p className="font-semibold">{index+1}. {item.prompt}</p><div className="flex-col gap-sm">{item.options.map((option,optionIndex)=><button key={option} className={`exam-option ${answers[item.id]===optionIndex?'selected':''}`} onClick={()=>setAnswers(value=>({...value,[item.id]:optionIndex}))}>{option}</button>)}</div></div>)}<div className="flex-end"><button className="btn btn-primary" onClick={submitQuiz}>Kiểm tra & ghi lỗi</button></div></section>}
    {mode==='production'&&<section className="glass-panel panel-lg"><span className="badge badge-secondary">{PRODUCTION_EXERCISES[productionIndex].skill}</span><h3 style={{fontSize:18,margin:'14px 0'}}>{PRODUCTION_EXERCISES[productionIndex].prompt}</h3><textarea className="form-control production-editor" value={productionText} onChange={event=>setProductionText(event.target.value)} placeholder="Tự viết câu trả lời bằng tiếng Đức…"/><div className="flex-between" style={{marginTop:14}}><button className="btn btn-secondary" onClick={()=>setShowModel(value=>!value)}><Eye size={15}/> {showModel?'Ẩn mẫu':'So sánh đáp án mẫu'}</button></div>{showModel&&<div className="rewrite-block" style={{marginTop:16}}>{PRODUCTION_EXERCISES[productionIndex].model}</div>}{showModel&&<div className="flex-row gap-md" style={{marginTop:16}}><button className="btn btn-danger" onClick={()=>rateProduction(false)}><X size={15}/> Cần ôn lại</button><button className="btn btn-primary" onClick={()=>rateProduction(true)}><Check size={15}/> Tôi làm đạt</button></div>}</section>}</div>
  </div>;
}