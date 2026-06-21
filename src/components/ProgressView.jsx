import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, Clock3, Repeat2, Target } from 'lucide-react';
import { getErrorNotebook, getErrorPatterns, getLearningAnalytics, getSrsRecords, isDue, markErrorReviewed } from '../utils/learningStore';
import CorrectionPracticeCard from './CorrectionPracticeCard';

export default function ProgressView() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const update = () => setVersion(value => value + 1);
    window.addEventListener('goethe-progress-updated', update);
    return () => window.removeEventListener('goethe-progress-updated', update);
  }, []);

  const analytics = useMemo(() => getLearningAnalytics(), [version]);
  const errors = useMemo(() => getErrorNotebook(), [version]);
  const patterns = useMemo(() => getErrorPatterns(), [version]);
  const srs = useMemo(() => Object.values(getSrsRecords()), [version]);
  const due = srs.filter(isDue).length;
  const average = analytics.length ? Math.round(analytics.reduce((sum, item) => sum + item.score, 0) / analytics.length) : 0;
  const repairItem = errors.find(item => !item.reviewed) || errors[0];
  const topPattern = patterns[0];

  return <div className="page-section">
    <div className="content-header"><div><h1 className="content-title">Tiến độ & Sổ lỗi B2</h1><p className="content-subtitle">Tìm phần yếu nhất, nhận diện lỗi lặp lại và sửa bằng bài tập sản sinh.</p></div></div>

    <div className="dashboard-grid" style={{ marginBottom: 22 }}>
      {[[Target, `${average}%`, 'Trung bình các dạng'], [BarChart3, analytics.length, 'Dạng bài đã luyện'], [AlertTriangle, errors.filter(item => !item.reviewed).length, 'Lỗi cần sửa'], [Clock3, due, 'Thẻ SRS đến hạn']].map(([Icon, value, label]) => <div key={label} className="col-3 glass-panel stat-card"><div className="stat-icon stat-icon-purple"><Icon size={20}/></div><div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div></div>)}
    </div>

    {topPattern && <section className="glass-panel panel pattern-summary" style={{ marginBottom: 22 }}>
      <div><span className="badge badge-primary"><Repeat2 size={13}/> Lỗi lặp lại nhiều nhất</span><h3>{topPattern.label}</h3><p className="text-muted">Xuất hiện {topPattern.count} lần trong {topPattern.modules.join(', ')}. Ưu tiên Repair Session cho nhóm này trước khi làm đề mới.</p></div>
      <div className="pattern-count">{topPattern.count}<small>lần</small></div>
    </section>}

    <div className="dashboard-grid" style={{ marginBottom: 22 }}>
      <section className="col-5 glass-panel panel">
        <h3 className="section-title"><BarChart3 size={18}/> Phân tích theo dạng bài</h3>
        {analytics.length === 0 ? <p className="text-muted">Hoàn thành một bài luyện để bắt đầu phân tích.</p> : analytics.map(item => <div key={item.name} className="weakness-row"><div className="flex-between"><span>{item.name}</span><strong className={item.score < 60 ? 'text-accent' : 'text-success'}>{item.score}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${item.score}%` }}/></div><small className="text-muted">{item.attempts} lượt · {item.correct}/{item.total} câu/điểm</small></div>)}
      </section>
      <section className="col-7 glass-panel panel">
        <h3 className="section-title"><Repeat2 size={18}/> Mẫu lỗi lặp lại</h3>
        {patterns.length === 0 ? <p className="text-muted">Chưa đủ dữ liệu để nhận diện mẫu lỗi.</p> : <div className="pattern-list">{patterns.slice(0, 6).map(pattern => <article key={pattern.category} className="pattern-row"><div><strong>{pattern.label}</strong><small className="text-muted">{pattern.modules.join(' · ')} · {pattern.unreviewed} chưa sửa</small></div><span className="badge badge-secondary">{pattern.count} lần</span></article>)}</div>}
      </section>
    </div>

    {repairItem && <section className="glass-panel panel-lg repair-session" style={{ marginBottom: 22 }}>
      <div className="repair-session-heading"><div><span className="badge badge-primary">Repair Session</span><h3>Sửa một lỗi trước khi học tiếp</h3></div><p className="text-muted">Câu này được lấy trực tiếp từ Sổ lỗi cá nhân.</p></div>
      <CorrectionPracticeCard error={repairItem} compact/>
    </section>}

    <section className="glass-panel panel">
      <h3 className="section-title"><AlertTriangle size={18}/> Sổ lỗi cá nhân</h3>
      <div className="error-notebook-list">{errors.length === 0 ? <p className="text-muted">Chưa có lỗi nào được ghi.</p> : errors.slice(0, 40).map(item => <article key={item.id} className={`error-card ${item.reviewed ? 'reviewed-error' : ''}`}><div className="flex-between gap-sm"><div className="flex-row gap-sm"><span className="badge badge-secondary">{item.module} · {item.part}</span><span className="badge badge-primary">{item.categoryLabel}</span></div>{!item.reviewed && <button className="btn-text-primary" onClick={() => markErrorReviewed(item.id)}><CheckCircle2 size={14}/> Đã ôn</button>}</div><p className="font-semibold" style={{ marginTop: 8 }}>{item.question}</p><div className="error-original">Câu trả lời: {item.original || item.answer}</div><div className="error-correct">Đúng/Mẫu: {item.correct || item.correction}</div>{item.reason && <p className="error-reason">{item.reason}</p>}</article>)}</div>
    </section>
  </div>;
}