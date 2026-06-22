import { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Sparkles, 
  Award, 
  AlertCircle,
  History,
  FileText,
  Clock
} from 'lucide-react';
import { SCHREIBEN_TOPICS } from '../data/schreibenTopics';
import AnimatedScore from './AnimatedScore';
import { gradeWriting } from '../services/aiService';
import { recordAttempt } from '../utils/learningStore';
import CorrectionPracticeCard from './CorrectionPracticeCard';

export default function SchreibenView({ showToast, onActivityComplete, currentUser, onAuthClick }) {
  const [selectedWriteTopic, setSelectedWriteTopic] = useState(SCHREIBEN_TOPICS[0]);
  const [writeText, setWriteText] = useState('');
  const [isWritingGrading, setIsWritingGrading] = useState(false);
  const [writeResult, setWriteResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeHistoryId, setActiveHistoryId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(75 * 60);
  const isB2 = selectedWriteTopic.level === 'B2';
  const isTeil1 = selectedWriteTopic.type.startsWith('Teil 1');
  const wordTarget = isB2 ? (isTeil1 ? 150 : 100) : 80;
  const taskMinutes = isB2 ? (isTeil1 ? 50 : 25) : 30;

  // Load history from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('goethe_schreiben_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);


  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleSchreibenGrade = async () => {
    if (!currentUser) {
      showToast('Tính năng chấm điểm Viết bằng AI yêu cầu đăng nhập tài khoản. Vui lòng đăng nhập hoặc đăng ký tài khoản miễn phí để tiếp tục!', 'warning');
      onAuthClick();
      return;
    }
    if (countWords(writeText) < Math.ceil(wordTarget / 2)) {
      showToast('Bài dưới 50% độ dài yêu cầu. Hãy viết ít nhất ' + Math.ceil(wordTarget / 2) + ' từ.', 'warning');
      return;
    }
    setIsWritingGrading(true);
    
    try {
      const resultData = await gradeWriting(
        writeText,
        selectedWriteTopic.title,
        `${selectedWriteTopic.level} · ${selectedWriteTopic.type} · Ziel ${wordTarget} Wörter`,
        selectedWriteTopic.points
      );

      setWriteResult(resultData);

      recordAttempt({
        module: 'Schreiben',
        part: selectedWriteTopic.type,
        correct: resultData.score,
        total: 100,
        errors: resultData.errors.map(error => ({ ...error, question: selectedWriteTopic.title, answer: error.original, correction: error.correct, explanation: error.reason })),
      });
      // Save to History
      const newSubmission = {
        id: Date.now(),
        topicId: selectedWriteTopic.id,
        topicTitle: selectedWriteTopic.title,
        level: selectedWriteTopic.level,
        date: new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        text: writeText,
        result: resultData
      };

      const updatedHistory = [newSubmission, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('goethe_schreiben_history', JSON.stringify(updatedHistory));
      setActiveHistoryId(newSubmission.id);

      // Trigger streak update
      if (onActivityComplete) {
        onActivityComplete();
      }
      showToast('Chấm bài hoàn tất!', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Lỗi kết nối AI. Vui lòng thử lại sau!', 'error');
    } finally {
      setIsWritingGrading(false);
    }
  };

  const handleSelectHistory = (item) => {
    setActiveHistoryId(item.id);
    setWriteText(item.text);
    setWriteResult(item.result);
    const originalTopic = SCHREIBEN_TOPICS.find(t => t.id === item.topicId);
    if (originalTopic) {
      setSelectedWriteTopic(originalTopic);
    }
  };

  const handleNewDraft = () => {
    setActiveHistoryId(null);
    setWriteText('');
    setWriteResult(null);
  };

  return (
    <div className="page-section">
      <div className="content-header">
        <div>
          <h1 className="content-title">AI Schreiben Grader</h1>
          <p className="content-subtitle">B2: Teil 1 Forumsbeitrag ~150 từ/50 phút · Teil 2 Nachricht ~100 từ/25 phút.</p>
        </div>
        <div className="badge badge-primary"><Clock size={14} /> Module 75 phút: {formatTime(timeLeft)}</div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Topic details & History */}
        <div className="col-4 flex-col gap-md">
          {/* Topic Select Panel */}
          <div className="glass-panel panel anim-slide-left">
            <div className="form-group">
              <label className="form-label" htmlFor="write-topic-select">Chọn Đề thi</label>
              <select 
                id="write-topic-select"
                className="form-control" 
                value={selectedWriteTopic.id}
                onChange={(e) => {
                  const topic = SCHREIBEN_TOPICS.find(t => t.id === parseInt(e.target.value));
                  setSelectedWriteTopic(topic);
                  setWriteText('');
                  setWriteResult(null);
                  setActiveHistoryId(null);
                }}
              >
                {SCHREIBEN_TOPICS.map(t => (
                  <option key={t.id} value={t.id}>[{t.level}] {t.title}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span className="badge badge-primary" style={{ marginBottom: '10px', display: 'inline-flex' }}>{selectedWriteTopic.type}</span>
              <p className="font-semibold" style={{ fontSize: '15px', marginBottom: '8px' }}>Yêu cầu đề bài:</p>
              <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.55, marginBottom: '14px' }}>
                {selectedWriteTopic.description}
              </p>
              
              <ul style={{ paddingLeft: '20px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedWriteTopic.points.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="section-divider">
              <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Cụm từ hữu ích (Redemittel)</h4>
              <div className="flex-col gap-sm">
                {selectedWriteTopic.redemittel.map((r, idx) => (
                  <div key={idx} className="redemittel-card">
                    <div className="redemittel-de">{r.de}</div>
                    <div className="redemittel-vi">{r.vi}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="glass-panel panel anim-slide-left">
            <h3 style={{ fontSize: '16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={16} />
              Lịch sử bài viết
            </h3>

            {history.length > 0 ? (
              <div className="flex-col gap-sm" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                {history.map((item) => {
                  const isActive = item.id === activeHistoryId;
                  return (
                    <div 
                      key={item.id}
                      className={`redemittel-card ${isActive ? 'active-history-card' : ''}`}
                      onClick={() => handleSelectHistory(item)}
                      style={{ 
                        cursor: 'pointer', 
                        padding: '12px',
                        borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                        background: isActive ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)'
                      }}
                    >
                      <div className="flex-between" style={{ marginBottom: '4px' }}>
                        <span className="badge badge-secondary" style={{ fontSize: '10px' }}>{item.level}</span>
                        <span className="text-muted" style={{ fontSize: '10px' }}>{item.date}</span>
                      </div>
                      <div className="font-semibold" style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.topicTitle}
                      </div>
                      <div className="text-primary font-semibold" style={{ fontSize: '12px', marginTop: '4px' }}>
                        Điểm số: {item.result.score}/100
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted text-center" style={{ fontSize: '13px', padding: '20px 0' }}>Bạn chưa nộp bài viết nào.</p>
            )}
          </div>
        </div>

        {/* Right Column: Editor and Grading Result */}
        <div className="col-8 flex-col gap-xl">
          {/* Editor Container */}
          <div className="glass-panel panel anim-fade-in-up">
            <div className="flex-between" style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} />
                {activeHistoryId ? 'Chi tiết bài làm cũ' : 'Bài viết của bạn'}
              </h3>
              <div className="flex-row gap-sm">
                <span className="badge badge-secondary">{countWords(writeText)} từ</span>
                <span className="badge badge-primary">Mục tiêu: ~{wordTarget} từ · {taskMinutes} phút</span>
              </div>
            </div>
            
            <textarea 
              className="form-control" 
              value={writeText}
              onChange={(e) => {
                if (!activeHistoryId) {
                  setWriteText(e.target.value);
                }
              }}
              disabled={!!activeHistoryId}
              placeholder="Viết bài tiếng Đức của bạn vào đây..."
              aria-label="Bài viết tiếng Đức"
            ></textarea>

            <div className="flex-end gap-md" style={{ marginTop: '14px' }}>
              {activeHistoryId ? (
                <button className="btn btn-secondary flex-row gap-sm" onClick={handleNewDraft}>
                  <Sparkles size={16} />
                  Viết bài mới
                </button>
              ) : (
                <>
                  <button className="btn btn-secondary" onClick={() => setWriteText('')} aria-label="Xóa tất cả">
                    Xóa tất cả
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSchreibenGrade}
                    disabled={isWritingGrading}
                    aria-label="Nộp bài và chấm AI"
                  >
                    {isWritingGrading ? (
                      <>
                        <RefreshCw className="spin-slow" size={16} />
                        AI đang chấm điểm...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Nộp bài & Chấm AI
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* AI Results Section */}
          {writeResult && (
            <div className="glass-panel panel-lg anim-fade-in-up" style={{ borderLeft: '3px solid var(--primary)' }}>
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <div>
                  <h3 className="section-title" style={{ marginBottom: '4px' }}>
                    <Award className="text-primary" size={22} />
                    Kết quả chấm điểm AI
                  </h3>
                  <p className="text-muted" style={{ fontSize: '13px' }}>Kết quả AI chỉ mang tính tham khảo, không thay thế giám khảo chính thức.</p>
                </div>
                <div className="score-display">
                  <div className="score-big">
                    <AnimatedScore target={writeResult.score} />/100
                  </div>
                  <span className="badge badge-success" style={{ marginTop: '6px' }}>{writeResult.grade}</span>
                </div>
              </div>

              {/* Score criteria breakdown */}
              <div className="rubric-grid" style={{ marginBottom: '24px' }}>
                {[
                  { label: 'Hoàn thành nhiệm vụ', value: writeResult.critCompletion },
                  { label: 'Mạch lạc', value: writeResult.critCoherence },
                  { label: 'Từ vựng', value: writeResult.critVocabulary },
                  { label: 'Ngữ pháp', value: writeResult.critGrammar },
                  { label: 'Register', value: writeResult.critRegister || '—/20' },
                ].map((c, idx) => (
                  <div key={c.label} className={`inner-card score-criteria anim-fade-in-up anim-delay-${Math.min(idx + 1, 4)}`}>
                    <div className="score-criteria-label">{c.label}</div>
                    <div className="score-criteria-value">{c.value}</div>
                  </div>
                ))}
              </div>

              {/* Detected Errors */}
              <div style={{ marginBottom: '24px' }}>
                <h4 className="section-title" style={{ fontSize: '15px', color: 'var(--accent)' }}>
                  <AlertCircle size={16} />
                  Sửa từng câu & luyện lại
                </h4>
                <p className="text-muted" style={{ marginBottom: '14px', fontSize: '13px' }}>Mỗi lỗi được gắn nhóm kỹ năng và biến thành một câu sản sinh. Làm đúng để đánh dấu đã sửa.</p>
                <div className="flex-col gap-md">
                  {writeResult.errors.length ? writeResult.errors.map((error, idx) => <CorrectionPracticeCard key={`${error.original}-${idx}`} error={error} />) : <p className="text-success">Không phát hiện lỗi trọng yếu trong bài này.</p>}
                </div>
              </div>

              {/* AI Rewrite */}
              <div className="section-divider">
                <h4 className="section-title" style={{ fontSize: '15px', color: 'var(--secondary)' }}>
                  <Sparkles size={16} />
                  Phiên bản viết lại tối ưu từ AI (Band B2/C1):
                </h4>
                <div className="rewrite-block">
                  {writeResult.rewrite}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
