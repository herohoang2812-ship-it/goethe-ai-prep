import { useState } from 'react';
import { 
  Check, 
  X,
  Sparkles, 
  BookOpen, 
  RefreshCw
} from 'lucide-react';
import { GRAMMAR_DATA } from '../data/grammarData';
import { recordAttempt } from '../utils/learningStore';

export default function GrammarView({ showToast, onActivityComplete }) {
  const [selectedTopic, setSelectedTopic] = useState(GRAMMAR_DATA[0]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
    setUserAnswers({});
    setShowQuizResult(false);
    setScore(0);
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (!showQuizResult) {
      setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    selectedTopic.quiz.forEach(q => {
      if (userAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });
    const errors = selectedTopic.quiz.filter(q => userAnswers[q.id] !== q.correct).map(q => ({
      question: q.question,
      answer: q.options[userAnswers[q.id]] || 'Chưa trả lời',
      correction: q.options[q.correct],
      explanation: q.explanation,
    }));
    recordAttempt({ module: 'Grammatik', part: selectedTopic.title, correct: correctCount, total: selectedTopic.quiz.length, errors });
    setScore(correctCount);
    setShowQuizResult(true);

    showToast(`Chúc mừng! Bạn đã trả lời đúng ${correctCount}/${selectedTopic.quiz.length} câu hỏi.`, 'success');
    
    if (onActivityComplete) {
      onActivityComplete();
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowQuizResult(false);
    setScore(0);
  };

  return (
    <div className="page-section">
      <div className="content-header">
        <div>
          <h1 className="content-title">Luyện Ngữ pháp B1/B2</h1>
          <p className="content-subtitle">Học các cấu trúc ngữ pháp Goethe trọng tâm và luyện bài tập trắc nghiệm điền từ củng cố kiến thức.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Topics List */}
        <div className="col-4 flex-col gap-sm">
          <div className="glass-panel panel anim-slide-left">
            <h3 style={{ fontSize: '16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} />
              Chủ đề Ngữ pháp
            </h3>

            <div className="flex-col gap-sm">
              {GRAMMAR_DATA.map((topic) => {
                const isActive = topic.id === selectedTopic.id;
                return (
                  <div 
                    key={topic.id}
                    className={`redemittel-card ${isActive ? 'active-history-card' : ''}`}
                    onClick={() => handleTopicChange(topic)}
                    style={{ 
                      cursor: 'pointer', 
                      padding: '14px',
                      borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                      background: isActive ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <div className="flex-between" style={{ marginBottom: '4px' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '10px' }}>{topic.level}</span>
                    </div>
                    <div className="font-semibold" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                      {topic.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Theory & Mini Quiz */}
        <div className="col-8 flex-col gap-xl">
          {/* Theory Panel */}
          <div className="glass-panel panel-lg anim-fade-in-up">
            <span className="badge badge-primary" style={{ marginBottom: '12px', display: 'inline-flex' }}>Cấp độ: {selectedTopic.level}</span>
            <h2 className="section-title" style={{ color: 'var(--text-main)', fontSize: '20px', marginTop: '4px', marginBottom: '12px' }}>
              {selectedTopic.title}
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', lineHeight: '1.6', whiteSpace: 'pre-line', marginBottom: '20px' }}>
              {selectedTopic.theory}
            </p>

            <div className="section-divider">
              <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--primary)' }}>Ví dụ minh họa song ngữ:</h4>
              <div className="flex-col gap-sm">
                {selectedTopic.examples.map((ex, idx) => (
                  <div key={idx} className="redemittel-card" style={{ background: 'var(--bg-elevated)' }}>
                    <div className="redemittel-de" style={{ fontSize: '14px', fontWeight: '500' }}>{ex.de}</div>
                    <div className="redemittel-vi" style={{ fontSize: '12.5px' }}>{ex.vi}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mini Quiz Panel */}
          <div className="glass-panel panel-lg anim-fade-in-up">
            <div className="flex-between" style={{ marginBottom: '18px' }}>
              <h3 className="section-title" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} />
                Luyện tập nhanh (Mini Quiz):
              </h3>
              {showQuizResult && (
                <span className="badge badge-success" style={{ fontSize: '12px' }}>
                  Điểm số: {score} / {selectedTopic.quiz.length}
                </span>
              )}
            </div>

            <div className="flex-col gap-lg">
              {selectedTopic.quiz.map((q, qIdx) => (
                <div key={q.id} className="quiz-question" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '18px' }}>
                  <p className="quiz-question-text" style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                    Câu {qIdx + 1}: {q.question}
                  </p>

                  <div className="flex-col gap-sm">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      const isCorrect = q.correct === optIdx;
                      let className = 'quiz-option';

                      if (showQuizResult) {
                        if (isCorrect) className += ' quiz-option-correct';
                        else if (isSelected) className += ' quiz-option-wrong';
                      } else if (isSelected) {
                        className += ' quiz-option-selected';
                      }

                      return (
                        <div 
                          key={optIdx} 
                          className={className}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          onKeyDown={(event) => { if (!showQuizResult && (event.key === 'Enter' || event.key === ' ')) handleSelectOption(q.id, optIdx); }}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectOption(q.id, optIdx);
                            }
                          }}
                          style={{ padding: '10px 14px', fontSize: '13px' }}
                        >
                          <span>{opt}</span>
                          {showQuizResult && isCorrect && <Check size={14} className="text-success" />}
                          {showQuizResult && isSelected && !isCorrect && <X size={14} className="text-accent" />}
                        </div>
                      );
                    })}
                  </div>

                  {showQuizResult && (
                    <div className="ai-explanation" style={{ marginTop: '12px', padding: '12px 16px' }}>
                      <div className="ai-explanation-header" style={{ fontSize: '12px' }}>
                        <Sparkles size={12} />
                        AI giải thích đáp án:
                      </div>
                      <p className="text-muted" style={{ fontSize: '12.5px', marginTop: '4px' }}>{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex-end" style={{ marginTop: '20px' }}>
              {!showQuizResult ? (
                <button 
                  className="btn btn-primary" 
                  disabled={Object.keys(userAnswers).length < selectedTopic.quiz.length}
                  onClick={handleSubmitQuiz}
                  aria-label="Nộp bài và kiểm tra đáp án"
                >
                  <Check size={16} />
                  Nộp bài & Kiểm tra
                </button>
              ) : (
                <button 
                  className="btn btn-secondary flex-row gap-sm" 
                  onClick={handleResetQuiz}
                  aria-label="Làm lại quiz này"
                >
                  <RefreshCw size={16} />
                  Làm lại bài tập
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
