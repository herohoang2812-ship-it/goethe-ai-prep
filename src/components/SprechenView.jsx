import { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Mic, 
  Square,
  Volume2,
  Clock
} from 'lucide-react';
import { SPRECHEN_TOPICS } from '../data/sprechenTopics';
import TypingIndicator from './TypingIndicator';
import AnimatedScore from './AnimatedScore';
import { chatWithExaminer, gradeSpeaking } from '../services/aiService';
import { recordAttempt } from '../utils/learningStore';
import { speak, stop } from '../services/ttsService';
import { deductSpeechMinutesOnDb } from '../services/dbService';

export default function SprechenView({ showToast, onActivityComplete, currentUser, onAuthClick }) {
  const [selectedSpeakTopic, setSelectedSpeakTopic] = useState(SPRECHEN_TOPICS[0]);
  const [speakChat, setSpeakChat] = useState(SPRECHEN_TOPICS[0].aiMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isSpeakGrading, setIsSpeakGrading] = useState(false);
  const [speakResult, setSpeakResult] = useState(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [prepSeconds, setPrepSeconds] = useState(15 * 60);
  const [prepRunning, setPrepRunning] = useState(false);
  
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [speakChat, isAiTyping]);

  // Dừng phát âm thanh khi chuyển tab hoặc unmount component
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  // Handle Text-to-Speech (TTS)
  const speakText = (text) => {
    speak(text);
  };

  // Speak the initial AI greeting when topic changes
  useEffect(() => {
    setTimeout(() => {
      const lastMsg = speakChat[speakChat.length - 1];
      if (lastMsg && lastMsg.sender === 'ai' && lastMsg.id === 3) {
        speakText(lastMsg.text);
      } else if (speakChat.length === 3) {
        speakText(speakChat[2].text);
      }
    }, 600);
  }, [selectedSpeakTopic]);

  // Timer for recording simulation
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordSeconds(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);


  useEffect(() => {
    if (!prepRunning || prepSeconds <= 0) return undefined;
    const timer = setInterval(() => setPrepSeconds(value => {
      if (value <= 1) { setPrepRunning(false); return 0; }
      return value - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [prepRunning, prepSeconds]);

  const formatPrep = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  const handleTopicChange = (e) => {
    const topic = SPRECHEN_TOPICS.find(t => t.id === parseInt(e.target.value));
    if (topic) {
      setSelectedSpeakTopic(topic);
      setSpeakChat(topic.aiMessages);
      setIsRecording(false);
      setIsSpeakGrading(false);
      setSpeakResult(null);
      setIsAiTyping(false);
      setPrepSeconds(15 * 60);
      setPrepRunning(false);
    }
  };

  // Speech-to-Text (STT) initialization
  const startSpeechRecognition = () => {
    if (!currentUser) {
      showToast('Hội thoại với giám khảo AI là tính năng Premium. Vui lòng đăng nhập hoặc đăng ký tài khoản miễn phí để trải nghiệm!', 'warning');
      onAuthClick();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      showToast('Trình duyệt không hỗ trợ nhận diện giọng nói Web Speech. Vui lòng dùng Chrome!', 'error');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'de-DE';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsRecording(true);
        startTimeRef.current = Date.now();
      };

      recognition.onresult = (event) => {
        const userSpeechText = event.results[0][0].transcript;
        const durationMins = startTimeRef.current ? (Date.now() - startTimeRef.current) / 60000 : 0.05;
        handleUserSpeechResult(userSpeechText, durationMins);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          showToast('Vui lòng cấp quyền truy cập Microphone cho trình duyệt để luyện nói!', 'error');
        } else {
          showToast(`Nhận dạng giọng nói bị lỗi: ${event.error}`, 'warning');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleStopRecord = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(false);
    }
  };

  const handleUserSpeechResult = async (text, durationMins = 0.05) => {
    const newUserMsg = { id: Date.now(), sender: 'user', text };
    const newChat = [...speakChat, newUserMsg];
    setSpeakChat(newChat);

    setIsAiTyping(true);
    try {
      if (currentUser) {
        await deductSpeechMinutesOnDb(currentUser.uid, durationMins);
      }

      const aiText = await chatWithExaminer(
        selectedSpeakTopic.title,
        selectedSpeakTopic.scenario,
        selectedSpeakTopic.prompts,
        newChat,
        text
      );
      
      const newAiResponse = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: aiText 
      };
      
      setSpeakChat(prev => [...prev, newAiResponse]);
      speakText(aiText);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Lỗi khi tải phản hồi từ giám khảo AI.', 'warning');
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleSpeakEvaluation = async () => {
    if (!currentUser) {
      showToast('Tính năng chấm điểm Nói bằng AI yêu cầu đăng nhập tài khoản. Vui lòng đăng nhập hoặc đăng ký tài khoản miễn phí để tiếp tục!', 'warning');
      onAuthClick();
      return;
    }
    setIsSpeakGrading(true);
    try {
      const evaluationResult = await gradeSpeaking(
        selectedSpeakTopic.title,
        selectedSpeakTopic.level,
        selectedSpeakTopic.prompts,
        speakChat
      );

      setSpeakResult(evaluationResult);

      const speakingScore = Math.round((evaluationResult.fluency + evaluationResult.grammar + evaluationResult.vocabulary) / 3);
      recordAttempt({
        module: 'Sprechen',
        part: selectedSpeakTopic.type,
        correct: speakingScore,
        total: 100,
        errors: evaluationResult.grammaticalFixes.map(error => ({ question: selectedSpeakTopic.title, answer: error.wrong, correction: error.right, explanation: error.reason })),
      });
      // Save to local speaking history
      const savedHistoryRaw = localStorage.getItem('goethe_sprechen_history');
      const savedHistory = savedHistoryRaw ? JSON.parse(savedHistoryRaw) : [];
      
      const newSpeakRecord = {
        id: Date.now(),
        topicTitle: selectedSpeakTopic.title,
        date: new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        ...evaluationResult
      };

      localStorage.setItem('goethe_sprechen_history', JSON.stringify([newSpeakRecord, ...savedHistory]));
      showToast('Đánh giá bài nói thành công!', 'success');

      // Trigger streak update
      if (onActivityComplete) {
        onActivityComplete();
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Lỗi kết nối AI. Vui lòng thử lại sau!', 'error');
    } finally {
      setIsSpeakGrading(false);
    }
  };

  return (
    <div className="page-section">
      <div className="content-header">
        <div>
          <h1 className="content-title">AI Sprechen Partner</h1>
          <p className="content-subtitle">Hội thoại tương tác giọng nói với giám khảo ảo AI cho phần thi Nói.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Topic & Instructions */}
        <div className="col-4 glass-panel panel anim-slide-left">
          <div className="form-group">
            <label className="form-label" htmlFor="speak-topic-select">Chọn Đề thi Nói</label>
            <select 
              id="speak-topic-select" 
              className="form-control" 
              value={selectedSpeakTopic.id}
              onChange={handleTopicChange}
            >
              {SPRECHEN_TOPICS.map(t => (
                <option key={t.id} value={t.id}>[{t.level}] {t.title}</option>
              ))}
            </select>
          </div>


          {selectedSpeakTopic.level === 'B2' && (
            <div className="inner-card" style={{ marginBottom: 18, padding: 14 }}>
              <div className="flex-between" style={{ marginBottom: 9 }}>
                <span className="font-semibold flex-row gap-xs"><Clock size={15} /> Chuẩn bị cá nhân</span>
                <span className="badge badge-primary">{formatPrep(prepSeconds)}</span>
              </div>
              <p className="text-muted" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>
                15 phút ghi chú. {selectedSpeakTopic.type.startsWith('Teil 1') ? 'Vortrag khoảng 4 phút, sau đó trả lời câu hỏi.' : 'Diskussion khoảng 5 phút: phản hồi và tóm tắt lập trường.'}
              </p>
              <button className="btn btn-secondary btn-sm" onClick={() => setPrepRunning(value => !value)}>{prepRunning ? 'Tạm dừng' : prepSeconds < 900 ? 'Tiếp tục' : 'Bắt đầu chuẩn bị'}</button>
            </div>
          )}
          <div style={{ marginBottom: '20px' }}>
            <span className="badge badge-secondary" style={{ marginBottom: '10px', display: 'inline-flex' }}>{selectedSpeakTopic.type}</span>
            <p className="font-semibold" style={{ fontSize: '15px', marginBottom: '8px' }}>Tình huống:</p>
            <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.55, marginBottom: '14px' }}>
              {selectedSpeakTopic.scenario}
            </p>
          </div>

          <div>
            <p className="font-semibold" style={{ fontSize: '14px', marginBottom: '10px' }}>Các ý cần đàm thoại:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              {selectedSpeakTopic.prompts.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Audio Chat Simulator */}
        <div className="col-8 flex-col gap-xl">
          <div className="glass-panel panel flex-col anim-fade-in-up" style={{ minHeight: '420px' }}>
            <h3 style={{ fontSize: '17px', marginBottom: '16px' }}>Giao tiếp âm thanh thực tế</h3>
            
            {/* Chat logs */}
            <div className="chat-container">
              {speakChat.map((msg, idx) => (
                <div 
                  key={msg.id}
                  className={`chat-bubble ${msg.sender === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex-between" style={{ marginBottom: '4px', alignItems: 'center' }}>
                    <div className={`chat-sender ${msg.sender === 'ai' ? 'chat-sender-ai' : 'chat-sender-user'}`}>
                      {msg.sender === 'ai' ? 'GIÁM KHẢO AI' : 'BẠN (HỌC VIÊN)'}
                    </div>
                    {msg.sender === 'ai' && (
                      <button 
                        className="btn-text-primary" 
                        onClick={() => speakText(msg.text)} 
                        title="Đọc phát âm"
                        style={{ display: 'inline-flex', padding: '2px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <Volume2 size={14} className="hover-pulse" />
                      </button>
                    )}
                  </div>
                  <p className="chat-text">{msg.text}</p>
                </div>
              ))}
              {isAiTyping && <TypingIndicator />}
              <div ref={chatEndRef}></div>
            </div>

            {/* Mic & Controller bar */}
            <div className="mic-bar">
              <div>
                {isRecording ? (
                  <div className="recording-indicator">
                    <div className="recording-dot"></div>
                    <span className="recording-text">Hãy nói (tiếng Đức): {recordSeconds}s</span>
                  </div>
                ) : (
                  <span className="mic-hint">Bấm nút và nói qua Microphone của bạn</span>
                )}
              </div>

              <div className="flex-row gap-md">
                {isRecording ? (
                  <button className="btn btn-danger" onClick={handleStopRecord} aria-label="Dừng ghi âm và gửi">
                    <Square size={16} />
                    Dừng & Gửi
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={startSpeechRecognition} aria-label="Bắt đầu ghi âm">
                    <Mic size={16} />
                    Bắt đầu nói
                  </button>
                )}
                
                <button 
                  className="btn btn-secondary" 
                  onClick={handleSpeakEvaluation} 
                  disabled={speakChat.length < 4 || isSpeakGrading}
                  aria-label="Xem đánh giá nói"
                >
                  {isSpeakGrading ? (
                    <>
                      <RefreshCw className="spin-slow" size={16} />
                      Đang phân tích...
                    </>
                  ) : (
                    <>
                      <Award size={16} />
                      Xem Đánh Giá
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Sprechen Results Panel */}
          {speakResult && (
            <div className="glass-panel panel-lg anim-fade-in-up" style={{ borderLeft: '3px solid var(--secondary)' }}>
              <h3 className="section-title">
                <Sparkles className="text-secondary" size={20} />
                Đánh giá khả năng Nói
              </h3>

              {/* Stats Grid */}
              <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
                {[
                  { label: 'Mạch lạc diễn đạt', value: speakResult.fluency, suffix: '%' },
                  { label: 'Từ vựng', value: speakResult.vocabulary, suffix: '%' },
                  { label: 'Ngữ pháp', value: speakResult.grammar, suffix: '%' },
                  { label: 'Đánh giá chung', value: null, text: speakResult.overall, isText: true },
                ].map((s, idx) => (
                  <div key={idx} className={`col-3 inner-card score-criteria anim-fade-in-up anim-delay-${idx + 1}`}>
                    <div className="score-criteria-label">{s.label}</div>
                    <div className="score-criteria-value" style={{ color: s.isText ? 'var(--success)' : 'var(--secondary)' }}>
                      {s.isText ? s.text : <AnimatedScore target={s.value} suffix={s.suffix} />}
                    </div>
                  </div>
                ))}
              </div>

          <div style={{ marginBottom: '20px' }}>
                <p className="font-semibold" style={{ fontSize: '14px', marginBottom: '6px' }}>Nhận xét chi tiết:</p>
                <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.6 }}>{speakResult.feedback}</p>
              </div>

              <div className="section-divider">
                <p className="font-semibold text-accent" style={{ fontSize: '14px', marginBottom: '12px' }}>Sửa lỗi ngữ pháp nói:</p>
                {speakResult.grammaticalFixes.map((f, idx) => (
                  <div key={idx} className="error-card">
                    <div className="flex-row gap-sm" style={{ marginBottom: '6px' }}>
                      <span className="error-original">"{f.wrong}"</span>
                      <ChevronRight size={12} className="text-muted" />
                      <span className="error-correct">"{f.right}"</span>
                    </div>
                    <p className="error-reason">
                      <strong>Quy tắc:</strong> {f.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
