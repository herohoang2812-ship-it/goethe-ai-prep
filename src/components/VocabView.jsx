import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Compass, 
  TrendingUp, 
  User, 
  ChevronLeft,
  ChevronRight, 
  Search,
  BookOpen,
  Volume2,
  Activity,
  Home,
  Leaf,
  CheckCircle,
  Circle,
  Check,
  X
} from 'lucide-react';
import { VOCAB_CATEGORIES, VOCAB_LIST } from '../data/vocabList';
import { getSrsRecords, isDue, recordAttempt, reviewSrs } from '../utils/learningStore';
import { speak } from '../services/ttsService';

// Helper to render icon dynamically
const CategoryIcon = ({ iconName, size = 18 }) => {
  switch (iconName) {
    case 'GraduationCap':
      return <GraduationCap size={size} />;
    case 'Compass':
      return <Compass size={size} />;
    case 'TrendingUp':
      return <TrendingUp size={size} />;
    case 'User':
      return <User size={size} />;
    case 'Activity':
      return <Activity size={size} />;
    case 'Home':
      return <Home size={size} />;
    case 'Leaf':
      return <Leaf size={size} />;
    default:
      return <Compass size={size} />;
  }
};

export default function VocabView({ showToast, onActivityComplete }) {
  const [selectedCategory, setSelectedCategory] = useState('pflege');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'flashcard' | 'quiz'
  const [vocabIndex, setVocabIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // SRS state
  const [knownWords, setKnownWords] = useState([]);
  const [srsRecords, setSrsRecords] = useState(() => getSrsRecords());
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'unknown' | 'known'

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);

  // Load known words from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('goethe_known_vocab');
    if (saved) {
      setKnownWords(JSON.parse(saved));
    }
  }, []);

  // Filter vocabulary by selected category
  const filteredVocab = VOCAB_LIST.filter(v => v.category === selectedCategory);

  // Apply SRS filter mode
  const srsFilteredVocab = filteredVocab.filter(v => {
    const record = srsRecords[v.de];
    const isKnown = knownWords.includes(v.de) || (record?.repetitions || 0) >= 2;
    if (filterMode === 'known') return isKnown;
    if (filterMode === 'unknown') return !isKnown;
    if (filterMode === 'due') return isDue(record);
    return true;
  });

  // Search filter
  const searchedVocab = srsFilteredVocab.filter(v => 
    v.de.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.vi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset states when category or filters change
  useEffect(() => {
    setVocabIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, filterMode]);

  // Voice synthesis function for vocabulary pronunciation
  const speakWord = (text, e) => {
    if (e) {
      e.stopPropagation(); // Prevent card flipping when clicking pronunciation button
    }
    speak(text);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setIsFlipped(false);
    if (searchedVocab.length > 0) {
      setVocabIndex((vocabIndex + 1) % searchedVocab.length);
    }
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setIsFlipped(false);
    if (searchedVocab.length > 0) {
      setVocabIndex((vocabIndex - 1 + searchedVocab.length) % searchedVocab.length);
    }
  };

  const handleFlipKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  // Toggle SRS known/unknown word status
  const toggleKnownStatus = (wordDe, e) => {
    if (e) e.stopPropagation();
    let updated;
    const isAlreadyKnown = knownWords.includes(wordDe);
    if (isAlreadyKnown) {
      updated = knownWords.filter(w => w !== wordDe);
      if (showToast) showToast('Đã chuyển từ vào danh sách cần ôn tập!', 'warning');
    } else {
      updated = [...knownWords, wordDe];
      if (showToast) showToast('Đã đánh dấu thuộc từ này!', 'success');
    }
    setKnownWords(updated);
    localStorage.setItem('goethe_known_vocab', JSON.stringify(updated));
  };


  const handleSrsRating = (rating, event) => {
    event?.stopPropagation();
    const updated = reviewSrs(currentWord.de, rating);
    setSrsRecords(getSrsRecords());
    const dueDate = new Date(updated.due).toLocaleDateString('vi-VN');
    if (showToast) showToast(`Đã lên lịch ôn lại vào ${dueDate}.`, rating === 'again' ? 'warning' : 'success');
    setTimeout(() => handleNext(), 180);
  };
  // Generate Vocab Quiz questions (5 random questions from current category)
  const generateQuiz = () => {
    if (filteredVocab.length < 4) {
      if (showToast) showToast('Không đủ từ vựng trong chuyên ngành này để tạo trắc nghiệm!', 'error');
      return;
    }
    
    // Shuffle words
    const shuffled = [...filteredVocab].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 5);

    const questions = selectedWords.map(word => {
      // Pick 3 random wrong options
      const otherWords = filteredVocab.filter(w => w.de !== word.de);
      const shuffledOthers = otherWords.sort(() => 0.5 - Math.random());
      const wrongOptions = shuffledOthers.slice(0, 3).map(w => w.vi);
      
      // Combine correct and wrong options, then shuffle
      const options = [word.vi, ...wrongOptions].sort(() => 0.5 - Math.random());
      const correctIndex = options.indexOf(word.vi);

      return {
        word: word.de,
        type: word.type,
        options,
        correct: correctIndex,
        example: word.ex,
        exampleVi: word.exVi
      };
    });

    setQuizQuestions(questions);
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setShowQuizFeedback(false);
    setQuizScore(0);
  };

  // Start quiz on tab change to quiz
  useEffect(() => {
    if (viewMode === 'quiz') {
      generateQuiz();
    }
  }, [viewMode, selectedCategory]);

  const handleSelectQuizOption = (optionIdx) => {
    if (showQuizFeedback) return;
    setSelectedQuizOption(optionIdx);
    setShowQuizFeedback(true);
    
    const currentQ = quizQuestions[quizIndex];
    speakWord(currentQ.word);

    if (optionIdx === currentQ.correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedQuizOption(null);
      setShowQuizFeedback(false);
    } else {
      // Finished quiz
      if (showToast) {
        const finalQuizScore = quizScore + (selectedQuizOption === quizQuestions[quizIndex].correct ? 1 : 0);
        showToast('Bạn hoàn thành bài trắc nghiệm từ vựng! Điểm: ' + finalQuizScore + '/5', 'success');
        recordAttempt({ module: 'Wortschatz', part: selectedCategory, correct: finalQuizScore, total: 5 });
      }
      if (onActivityComplete) {
        onActivityComplete();
      }
    }
  };

  const currentWord = searchedVocab[vocabIndex] || { de: '', type: 'Nomen', vi: '', ex: '', exVi: '' };
  
  // Calculate category stats
  const totalInCategory = filteredVocab.length;
  const knownInCategory = filteredVocab.filter(w => knownWords.includes(w.de) || (srsRecords[w.de]?.repetitions || 0) >= 2).length;
  const dueInCategory = filteredVocab.filter(w => isDue(srsRecords[w.de])).length;
  const percentMastered = totalInCategory > 0 ? Math.round((knownInCategory / totalInCategory) * 100) : 0;

  return (
    <div className="page-section">
      <div className="content-header">
        <div>
          <h1 className="content-title">Từ vựng Chuyên ngành</h1>
          <p className="content-subtitle">Tra cứu và ôn luyện từ vựng theo chuyên ngành với hệ thống lặp lại ngắt quãng SRS.</p>
        </div>
      </div>

      {/* Mastery Progress Card */}
      <div className="glass-panel panel anim-fade-in-up" style={{ marginBottom: '24px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
            Tiến trình ghi nhớ chuyên ngành
          </h3>
          <p className="text-muted" style={{ fontSize: '13px' }}>
            Bạn đã thuộc <strong>{knownInCategory}</strong>/{totalInCategory} từ · <strong>{dueInCategory}</strong> thẻ đến hạn hôm nay.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '120px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${percentMastered}%`, height: '100%', background: 'var(--success)' }}></div>
          </div>
          <span className="font-semibold text-success" style={{ fontSize: '14px' }}>{percentMastered}% thuộc</span>
        </div>
      </div>

      {/* Control panel: Category selector & View mode selector */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        {/* Category Tabs Selector */}
        <div className="vocab-category-selector" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {VOCAB_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'} flex-row gap-sm`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ padding: '8px 16px', borderRadius: '12px' }}
                aria-label={`Chọn chuyên ngành ${cat.name}`}
              >
                <CategoryIcon iconName={cat.icon} size={16} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div 
          className="btn-group" 
          style={{ 
            display: 'flex', 
            background: 'rgba(255, 255, 255, 0.03)', 
            padding: '4px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.08)' 
          }}
        >
          <button 
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : ''}`} 
            onClick={() => setViewMode('list')}
            style={{ borderRadius: '8px', padding: '6px 16px', fontSize: '13px' }}
          >
            Danh sách
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'flashcard' ? 'btn-primary' : ''}`} 
            onClick={() => setViewMode('flashcard')}
            style={{ borderRadius: '8px', padding: '6px 16px', fontSize: '13px' }}
          >
            Flashcard
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'quiz' ? 'btn-primary' : ''}`} 
            onClick={() => setViewMode('quiz')}
            style={{ borderRadius: '8px', padding: '6px 16px', fontSize: '13px' }}
          >
            Trắc nghiệm
          </button>
        </div>
      </div>

      {viewMode !== 'quiz' && (
        <div className="dashboard-grid" style={{ marginBottom: '20px', gap: '12px' }}>
          {/* Search Input */}
          <div className="col-8 form-group" style={{ position: 'relative', margin: 0 }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Tìm kiếm nhanh từ vựng (Ví dụ: Übergabe, đo huyết áp...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVocabIndex(0);
              }}
              style={{ width: '100%', paddingLeft: '40px' }}
            />
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} 
            />
          </div>

          {/* SRS Filter Select */}
          <div className="col-4 form-group" style={{ margin: 0 }}>
            <select
              className="form-control"
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              aria-label="Lọc theo trạng thái SRS"
            >
              <option value="all">Tất cả từ vựng</option>
              <option value="unknown">Từ chưa thuộc (Cần học)</option>
              <option value="known">Từ đã thuộc (Đã nhớ)</option>
              <option value="due">Đến hạn ôn theo SRS</option>
            </select>
          </div>
        </div>
      )}

      {/* VIEW MODE: QUIZ */}
      {viewMode === 'quiz' && quizQuestions.length > 0 && (
        <div className="flashcard-container anim-fade-in-up">
          <div className="flashcard-progress" style={{ maxWidth: '480px' }}>
            <span>Câu {quizIndex + 1} / 5</span>
            <div className="flashcard-progress-bar">
              <div 
                className="flashcard-progress-fill" 
                style={{ width: `${((quizIndex + 1) / 5) * 100}%`, background: 'var(--secondary)' }}
              ></div>
            </div>
          </div>

          <div className="glass-panel panel flex-col" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '14px', alignItems: 'center' }}>
              <span className="badge badge-secondary">{quizQuestions[quizIndex].type}</span>
              <button 
                className="btn-text-primary" 
                onClick={() => speakWord(quizQuestions[quizIndex].word)}
                title="Đọc từ"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <h2 className="text-center" style={{ fontSize: '26px', fontWeight: 'bold', margin: '20px 0', color: 'var(--text-main)' }}>
              {quizQuestions[quizIndex].word}
            </h2>
            <p className="text-muted text-center" style={{ fontSize: '13px', marginBottom: '24px' }}>
              Chọn nghĩa tiếng Việt đúng của từ trên:
            </p>

            <div className="flex-col gap-sm">
              {quizQuestions[quizIndex].options.map((opt, optIdx) => {
                const isSelected = selectedQuizOption === optIdx;
                const isCorrect = optIdx === quizQuestions[quizIndex].correct;
                
                let optionStyle = {};
                if (showQuizFeedback) {
                  if (isCorrect) {
                    optionStyle = { background: 'rgba(16, 185, 129, 0.15)', borderColor: 'var(--success)', color: 'var(--success)' };
                  } else if (isSelected) {
                    optionStyle = { background: 'rgba(244, 63, 94, 0.15)', borderColor: 'var(--accent)', color: 'var(--accent)' };
                  } else {
                    optionStyle = { opacity: 0.6 };
                  }
                } else if (isSelected) {
                  optionStyle = { borderColor: 'var(--primary)', background: 'rgba(139, 92, 246, 0.1)' };
                }

                return (
                  <div
                    key={optIdx}
                    className="quiz-option"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px',
                      cursor: showQuizFeedback ? 'default' : 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease',
                      ...optionStyle
                    }}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={showQuizFeedback ? -1 : 0}
                    onKeyDown={(event) => { if (!showQuizFeedback && (event.key === 'Enter' || event.key === ' ')) handleSelectQuizOption(optIdx); }}
                    onClick={() => handleSelectQuizOption(optIdx)}
                  >
                    <span>{opt}</span>
                    {showQuizFeedback && isCorrect && <Check size={16} className="text-success" />}
                    {showQuizFeedback && isSelected && !isCorrect && <X size={16} className="text-accent" />}
                  </div>
                );
              })}
            </div>

            {showQuizFeedback && (
              <div className="anim-fade-in" style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <p className="font-semibold" style={{ fontSize: '13px', color: 'var(--secondary)', marginBottom: '4px' }}>
                  Câu ví dụ:
                </p>
                <p style={{ fontSize: '13px', fontStyle: 'italic', margin: 0 }}>
                  "{quizQuestions[quizIndex].example}"
                </p>
                {quizQuestions[quizIndex].exampleVi && (
                  <p className="text-muted" style={{ fontSize: '12px', marginTop: '2px', margin: 0 }}>
                    ({quizQuestions[quizIndex].exampleVi})
                  </p>
                )}

                <div className="flex-end" style={{ marginTop: '16px' }}>
                  <button className="btn btn-primary btn-sm flex-row gap-xs" onClick={handleNextQuizQuestion}>
                    {quizIndex < 4 ? 'Câu tiếp theo' : 'Hoàn thành'}
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode !== 'quiz' && searchedVocab.length > 0 ? (
        <>
          {/* VIEW MODE: FLASHCARD */}
          {viewMode === 'flashcard' && (
            <div className="flashcard-container">
              <div className="flashcard-progress" style={{ width: '100%', maxWidth: '780px' }}>
                <span>{vocabIndex + 1} / {searchedVocab.length}</span>
                <div className="flashcard-progress-bar">
                  <div 
                    className="flashcard-progress-fill" 
                    style={{ width: `${((vocabIndex + 1) / searchedVocab.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 3-Card Deck Carousel */}
              <div className="flashcard-deck">
                {/* 1. PREVIOUS SIBLING CARD */}
                {searchedVocab.length > 1 && (
                  <div 
                    className="flashcard-sibling prev-card" 
                    onClick={handlePrev}
                    title="Từ trước đó"
                  >
                    <span className="badge badge-secondary" style={{ fontSize: '9px', marginBottom: '8px' }}>
                      {searchedVocab[(vocabIndex - 1 + searchedVocab.length) % searchedVocab.length].type}
                    </span>
                    <div className="flashcard-sibling-word">
                      {searchedVocab[(vocabIndex - 1 + searchedVocab.length) % searchedVocab.length].de}
                    </div>
                    <span className="text-muted" style={{ fontSize: '11px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <ChevronLeft size={12} />
                      Click để lùi
                    </span>
                  </div>
                )}

                {/* 2. ACTIVE CENTER CARD */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
                  <div 
                    className={`glass-panel glass-card-accent flashcard ${isFlipped ? 'flipped' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Thẻ từ vựng: ${currentWord.de}. Nhấn để lật thẻ.`}
                    onKeyDown={handleFlipKeyDown}
                    style={{ minHeight: '260px' }}
                  >
                    <div className="flex-between" style={{ width: '100%', position: 'absolute', top: '16px', left: '0', padding: '0 20px', pointerEvents: 'none' }}>
                      <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
                        <span className="badge badge-primary flashcard-type">{currentWord.type}</span>
                        <button
                          className="btn-text-primary"
                          onClick={(e) => toggleKnownStatus(currentWord.de, e)}
                          title={knownWords.includes(currentWord.de) ? "Đánh dấu chưa thuộc" : "Đánh dấu đã thuộc"}
                          style={{ display: 'inline-flex', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          {knownWords.includes(currentWord.de) ? (
                            <CheckCircle size={18} className="text-success" />
                          ) : (
                            <Circle size={18} className="text-muted" />
                          )}
                        </button>
                      </div>

                      <button 
                        className="btn-text-primary" 
                        onClick={(e) => speakWord(currentWord.de, e)} 
                        title="Phát âm từ vựng"
                        style={{ 
                          pointerEvents: 'auto',
                          display: 'inline-flex', 
                          padding: '6px', 
                          borderRadius: '50%',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-color)', 
                          cursor: 'pointer', 
                          color: 'var(--text-main)' 
                        }}
                      >
                        <Volume2 size={16} className="hover-pulse" />
                      </button>
                    </div>
                    
                    <h2 className="flashcard-word" style={{ marginTop: '24px', fontSize: '24px' }}>
                      {currentWord.de}
                    </h2>

                    {isFlipped ? (
                      <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 10px' }}>
                        <p className="flashcard-translation" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {currentWord.vi}
                        </p>
                        <div className="flashcard-example-container" style={{ marginTop: '14px' }}>
                          <p className="flashcard-example" style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-main)' }}>
                            Ví dụ: "{currentWord.ex}"
                          </p>
                          {currentWord.exVi && (
                            <p className="flashcard-example-translation" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                              ({currentWord.exVi})
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="flashcard-hint">Nhấn vào thẻ để xem nghĩa và ví dụ</p>
                    )}
                  </div>
                  {isFlipped && (
                    <div className="srs-rating-row" onClick={(event) => event.stopPropagation()}>
                      <button onClick={(event) => handleSrsRating('again', event)} className="srs-again">Lại · 1 ngày</button>
                      <button onClick={(event) => handleSrsRating('hard', event)}>Khó</button>
                      <button onClick={(event) => handleSrsRating('good', event)} className="srs-good">Tốt</button>
                      <button onClick={(event) => handleSrsRating('easy', event)} className="srs-easy">Dễ</button>
                    </div>
                  )}
                </div>

                {/* 3. NEXT SIBLING CARD */}
                {searchedVocab.length > 2 && (
                  <div 
                    className="flashcard-sibling next-card" 
                    onClick={handleNext}
                    title="Từ tiếp theo"
                  >
                    <span className="badge badge-secondary" style={{ fontSize: '9px', marginBottom: '8px' }}>
                      {searchedVocab[(vocabIndex + 1) % searchedVocab.length].type}
                    </span>
                    <div className="flashcard-sibling-word">
                      {searchedVocab[(vocabIndex + 1) % searchedVocab.length].de}
                    </div>
                    <span className="text-muted" style={{ fontSize: '11px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Click để tiến
                      <ChevronRight size={12} />
                    </span>
                  </div>
                )}
              </div>

              <div className="flashcard-actions" style={{ marginTop: '10px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={handlePrev}
                  aria-label="Từ trước đó"
                >
                  <ChevronLeft size={16} />
                  Từ trước đó
                </button>

                <button 
                  className="btn btn-primary"
                  onClick={handleNext}
                  aria-label="Từ tiếp theo"
                >
                  Tiếp theo
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* VIEW MODE: LIST VIEW */}
          {viewMode === 'list' && (
            <div 
              className="vocab-list-view" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '14px', 
                maxHeight: '620px', 
                overflowY: 'auto', 
                paddingRight: '8px'
              }}
            >
              {searchedVocab.map((word, idx) => {
                const isKnown = knownWords.includes(word.de);
                return (
                  <div 
                    key={idx} 
                    className="glass-panel inner-card anim-fade-in-up" 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      padding: '18px', 
                      gap: '10px',
                      animationDelay: `${Math.min(idx * 0.03, 0.5)}s`,
                      borderLeft: isKnown ? '3px solid var(--success)' : '3px solid var(--border-color)'
                    }}
                  >
                    <div className="flex-between" style={{ flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                      <div className="flex-row gap-sm" style={{ alignItems: 'center' }}>
                        <button
                          className="btn-text-primary"
                          onClick={(e) => toggleKnownStatus(word.de, e)}
                          title={isKnown ? "Đánh dấu chưa thuộc" : "Đánh dấu đã thuộc"}
                          style={{ display: 'inline-flex', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          {isKnown ? (
                            <CheckCircle size={18} className="text-success" />
                          ) : (
                            <Circle size={18} className="text-muted" />
                          )}
                        </button>

                        <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)' }}>{word.de}</span>
                        <span className="badge badge-secondary" style={{ fontSize: '11px', padding: '2px 8px' }}>{word.type}</span>
                        <button 
                          className="btn-text-primary" 
                          onClick={() => speakWord(word.de)} 
                          title="Đọc phát âm"
                          style={{ 
                            display: 'inline-flex', 
                            padding: '4px', 
                            borderRadius: '50%',
                            background: 'var(--bg-elevated)',
                            border: 'none', 
                            cursor: 'pointer', 
                            color: 'var(--text-muted)',
                            marginLeft: '4px'
                          }}
                        >
                          <Volume2 size={14} className="hover-pulse" />
                        </button>
                      </div>
                      <span style={{ fontSize: '15px', fontWeight: '500', color: '#a78bfa' }}>{word.vi}</span>
                    </div>
                    
                    <div 
                      style={{ 
                        fontSize: '13px', 
                        borderTop: '1px solid var(--border-color)', 
                        paddingTop: '10px',
                        lineHeight: '1.5'
                      }}
                    >
                      <p className="text-muted" style={{ fontStyle: 'italic', marginBottom: '4px' }}>
                        <strong>Bối cảnh:</strong> "{word.ex}"
                      </p>
                      {word.exVi && (
                        <p className="text-muted">
                          ({word.exVi})
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        viewMode !== 'quiz' && (
          <div className="glass-panel panel text-center anim-fade-in-up" style={{ padding: '40px' }}>
            <BookOpen size={36} className="text-muted" style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p className="text-muted">Không tìm thấy từ vựng nào khớp với bộ lọc của bạn.</p>
          </div>
        )
      )}
    </div>
  );
}
