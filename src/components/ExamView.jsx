import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Trophy, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Square, 
  Volume2, 
  Check, 
  X, 
  Sparkles, 
  Award, 
  AlertCircle, 
  RefreshCw, 
  ListOrdered,
  BookOpenText,
  FileText,
  User,
  ChevronDown,
  Info
} from 'lucide-react';
import { MOCK_EXAMS } from '../data/mockExams';
import { speak, stop } from '../services/ttsService';
import { gradeWriting, gradeSpeaking, chatWithExaminer } from '../services/aiService';
import { recordAttempt } from '../utils/learningStore';
import { syncUserLeaderboard, deductSpeechMinutesOnDb } from '../services/dbService';
import AnimatedScore from './AnimatedScore';
import CorrectionPracticeCard from './CorrectionPracticeCard';

const MODULE_TIMES = {
  lesen: 65 * 60,    // 65 minutes
  hoeren: 40 * 60,   // 40 minutes
  schreiben: 60 * 60,// 60 minutes
  sprechen: 15 * 60  // 15 minutes
};

export default function ExamView({ showToast, onActivityComplete, currentUser, onAuthClick }) {
  // Navigation states
  const [activeMode, setActiveMode] = useState('dashboard'); // 'dashboard' | 'exam' | 'result'
  const [selectedExam, setSelectedExam] = useState(null);
  const [isFullExam, setIsFullExam] = useState(false);
  const [activeModule, setActiveModule] = useState('lesen'); // 'lesen' | 'hoeren' | 'schreiben' | 'sprechen'
  const [currentPartIdx, setCurrentPartIdx] = useState(0);

  // Time left for the active module
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Answers and state of active test
  const [answers, setAnswers] = useState({}); // { [qId]: selectedIndex / selectedLetter }
  const [writingAnswers, setWritingAnswers] = useState({ task1: '', task2: '', task3: '' });
  
  // Audio playing state for Hören
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegmentIdx, setActiveSegmentIdx] = useState(-1);
  const [playsCount, setPlaysCount] = useState({}); // { [partId]: count }
  const [showTranscript, setShowTranscript] = useState(false);

  // Sprechen session state
  const [sprechPartIdx, setSprechPartIdx] = useState(0); // 0: Teil 1, 1: Teil 2, 2: Teil 3
  const [sprechChatTeil1, setSprechChatTeil1] = useState([]);
  const [sprechChatTeil3, setSprechChatTeil3] = useState([]);
  const [sprechTextTeil2, setSprechTextTeil2] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const recognitionRef = useRef(null);
  const recordTimerRef = useRef(null);
  const chatEndRef = useRef(null);

  // Grading states
  const [isGradingSchreiben, setIsGradingSchreiben] = useState(false);
  const [isGradingSprechen, setIsGradingSprechen] = useState(false);
  
  // Results of the session
  const [sessionResults, setSessionResults] = useState(null);
  const [examHistory, setExamHistory] = useState([]);
  
  // Audio player variables
  const playTimeoutRef = useRef(null);

  // Load past exam history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('goethe_mock_exams_history');
    if (savedHistory) {
      try {
        setExamHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Lỗi phân tích lịch sử thi thử:', e);
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleModuleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  // Sprechen chat auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sprechChatTeil1, sprechChatTeil3, isAiTyping]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stop();
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  // Format time (MM:SS)
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleModuleTimeOut = () => {
    showToast(`Hết thời gian làm bài phần ${activeModule.toUpperCase()}! Hệ thống đang tự động ghi nhận kết quả.`, 'warning');
    if (isFullExam) {
      goToNextModule(true);
    } else {
      handleSubmitModule(true);
    }
  };

  // Start exam session
  const startExam = (exam, fullMode = false, specificModule = null) => {
    stop();
    setSelectedExam(exam);
    setIsFullExam(fullMode);
    
    // Set active module
    const module = specificModule || 'lesen';
    setActiveModule(module);
    setCurrentPartIdx(0);
    setAnswers({});
    setWritingAnswers({ task1: '', task2: '', task3: '' });
    setSprechPartIdx(0);
    setSprechTextTeil2('');
    setPlaysCount({});
    setShowTranscript(false);
    
    // Initialize Sprechen chats
    const defaultTeil1Chat = [
      { id: 1, sender: 'ai', text: `Hallo! Ich bin dein Prüfungspartner. Lass uns gemeinsam Teil 1 planen: "${exam.sprechen.parts[0].scenario}". Wer möchte anfangen?` }
    ];
    setSprechChatTeil1(defaultTeil1Chat);
    setSprechChatTeil3([
      { id: 1, sender: 'ai', text: `Hallo! Bitte halte zuerst deine Präsentation in Teil 2. Danach werde ich dir Fragen zu deinem Thema stellen.` }
    ]);

    // Set timer
    setTimeLeft(MODULE_TIMES[module]);
    setTimerRunning(true);
    setActiveMode('exam');

    if (module === 'hoeren') {
      showToast('Hãy chuẩn bị sẵn tai nghe hoặc loa để bắt đầu phần thi Nghe (Hören).', 'info');
    }
  };

  // Vinyl record animation & TTS logic for Hören
  const stopHorenAudio = () => {
    stop();
    setIsPlaying(false);
    setActiveSegmentIdx(-1);
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
  };

  const playHorenPart = (part) => {
    const currentPlays = playsCount[part.id] || 0;
    if (currentPlays >= part.maxPlays && !showTranscript) {
      showToast(`Teil này đã phát đủ hạn mức ${part.maxPlays} lần quy định.`, 'warning');
      return;
    }

    stopHorenAudio();
    setPlaysCount(prev => ({ ...prev, [part.id]: currentPlays + 1 }));
    setIsPlaying(true);

    let idx = 0;
    const playNext = () => {
      if (idx >= part.segments.length) {
        setIsPlaying(false);
        setActiveSegmentIdx(-1);
        return;
      }
      setActiveSegmentIdx(idx);
      const segment = part.segments[idx];
      idx++;

      speak(segment.text, {
        rate: 0.95,
        onEnd: () => {
          playTimeoutRef.current = setTimeout(playNext, 800);
        }
      });
    };
    playNext();
  };

  // Handle Radio Answer Selections
  const handleSelectAnswer = (qId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSelectMatching = (qId, optionLetter) => {
    setAnswers(prev => ({ ...prev, [qId]: optionLetter }));
  };

  // Next / Prev steps in the same module
  const handleNextPart = () => {
    stopHorenAudio();
    setCurrentPartIdx(prev => prev + 1);
  };

  const handlePrevPart = () => {
    stopHorenAudio();
    setCurrentPartIdx(prev => prev - 1);
  };

  // Speech-to-Text (STT) for Sprechen Partner Chat
  const startSpeechRecognition = (chatList, setChatList, examinerPrompt) => {
    if (!currentUser) {
      showToast('Tính năng tương tác giọng nói với Giám khảo yêu cầu đăng nhập.', 'warning');
      onAuthClick();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Trình duyệt của bạn không hỗ trợ Web Speech API. Hãy sử dụng Google Chrome!', 'error');
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'de-DE';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      recognitionRef.current = rec;

      rec.onstart = () => {
        setIsRecording(true);
        setRecordSeconds(0);
        recordTimerRef.current = setInterval(() => {
          setRecordSeconds(s => s + 1);
        }, 1000);
      };

      rec.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        clearInterval(recordTimerRef.current);
        setIsRecording(false);
        
        // Deduct speak minutes based on rough duration (approx 5-15 seconds per turn)
        try {
          await deductSpeechMinutesOnDb(currentUser.uid, 0.1);
        } catch (e) {
          console.warn('Không thể trừ speech minutes:', e);
        }

        handleSprechenTurn(text, chatList, setChatList, examinerPrompt);
      };

      rec.onerror = (e) => {
        console.error(e);
        clearInterval(recordTimerRef.current);
        setIsRecording(false);
        showToast('Không nhận diện được giọng nói. Bạn có thể sử dụng bàn phím để gõ câu trả lời.', 'warning');
      };

      rec.onend = () => {
        clearInterval(recordTimerRef.current);
        setIsRecording(false);
      };

      rec.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const handleSprechenTurn = async (text, chatList, setChatList, examinerPrompt) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text };
    const nextChat = [...chatList, userMsg];
    setChatList(nextChat);

    setIsAiTyping(true);
    try {
      const response = await chatWithExaminer(
        selectedExam.sprechen.parts[sprechPartIdx].title,
        selectedExam.sprechen.parts[sprechPartIdx].scenario || 'Thảo luận chủ đề thi nói B1',
        selectedExam.sprechen.parts[sprechPartIdx].prompts || [],
        nextChat,
        text
      );
      const aiResponse = { id: Date.now() + 1, sender: 'ai', text: response };
      setChatList(prev => [...prev, aiResponse]);
      speak(response);
    } catch (e) {
      console.error(e);
      showToast('Giám khảo AI đang bận, xin vui lòng gõ hoặc thử nói lại.', 'warning');
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleSprechenTextSubmit = (e, chatList, setChatList, examinerPrompt) => {
    e.preventDefault();
    const input = e.target.elements.speakInput;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    handleSprechenTurn(text, chatList, setChatList, examinerPrompt);
  };

  // Move from Teil 1 -> Teil 2 -> Teil 3 in speaking
  const handleNextSprechenTeil = () => {
    stop();
    if (sprechPartIdx === 0) {
      setSprechPartIdx(1);
      showToast('Đã chuyển sang Teil 2: Thuyết trình theo chủ đề. Hãy viết nháp hoặc nói trực tiếp bài thuyết trình của bạn.', 'info');
    } else if (sprechPartIdx === 1) {
      setSprechPartIdx(2);
      // AI initiates Q&A for Teil 3
      const greetingMsg = { id: Date.now(), sender: 'ai', text: `Danke für deine Präsentation. Ich habe eine Frage dazu: "${selectedExam.sprechen.parts[2].sampleQuestions[0]}?"` };
      setSprechChatTeil3([greetingMsg]);
      speak(greetingMsg.text);
      showToast('Đã chuyển sang Teil 3: Trả lời câu hỏi phản biện của giám khảo.', 'info');
    }
  };

  // Sequential Module Navigation
  const goToNextModule = (autoSubmit = false) => {
    stopHorenAudio();
    stop();
    
    // Evaluate current module score locally
    let moduleScore = 0;
    if (activeModule === 'lesen') {
      moduleScore = calculateLocalModuleScore('lesen');
      setSessionResults(prev => ({ ...prev, lesen: moduleScore }));
      
      showToast(`Đã lưu kết quả Lesen: ${moduleScore}/100.`, 'success');
      setActiveModule('hoeren');
      setCurrentPartIdx(0);
      setTimeLeft(MODULE_TIMES.hoeren);
    } else if (activeModule === 'hoeren') {
      moduleScore = calculateLocalModuleScore('hoeren');
      setSessionResults(prev => ({ ...prev, hoeren: moduleScore }));
      
      showToast(`Đã lưu kết quả Hören: ${moduleScore}/100.`, 'success');
      setActiveModule('schreiben');
      setCurrentPartIdx(0);
      setTimeLeft(MODULE_TIMES.schreiben);
    } else if (activeModule === 'schreiben') {
      setSessionResults(prev => ({ ...prev, schreibenDrafts: { ...writingAnswers } }));
      
      showToast(`Đã nhận các bài viết nháp.`, 'success');
      setActiveModule('sprechen');
      setSprechPartIdx(0);
      setTimeLeft(MODULE_TIMES.sprechen);
    } else if (activeModule === 'sprechen') {
      // Full submission
      handleFinalSubmission();
    }
  };

  // Single module submission
  const handleSubmitModule = (autoSubmit = false) => {
    stopHorenAudio();
    stop();
    setTimerRunning(false);

    if (activeModule === 'lesen' || activeModule === 'hoeren') {
      const score = calculateLocalModuleScore(activeModule);
      
      // Save attempt to localStorage using utility
      recordAttempt({
        module: activeModule === 'lesen' ? 'Lesen' : 'Hören',
        part: `Đề thi thử: ${selectedExam.title}`,
        correct: Math.round(score / 4), // Scale down 0-100 to correct count out of 25/20 if required by recordAttempt logic
        total: activeModule === 'lesen' ? 25 : 20
      });

      // Update best score in local storage
      const savedBestRaw = localStorage.getItem('goethe_best_mock_scores');
      const savedBest = savedBestRaw ? JSON.parse(savedBestRaw) : { lesen: 0, hoeren: 0, schreiben: 0, sprechen: 0 };
      savedBest[activeModule] = Math.max(savedBest[activeModule] || 0, score);
      localStorage.setItem('goethe_best_mock_scores', JSON.stringify(savedBest));

      // Build results
      const results = {
        examId: selectedExam.id,
        examTitle: selectedExam.title,
        level: selectedExam.level,
        type: 'section',
        module: activeModule,
        score,
        answers: { ...answers }
      };

      setSessionResults(results);
      setActiveMode('result');

      // Sync leaderboard
      if (currentUser) {
        const overallMockScore = Math.round(((savedBest.lesen || 0) + (savedBest.hoeren || 0) + (savedBest.schreiben || 0) + (savedBest.sprechen || 0)) / 4);
        syncUserLeaderboard(currentUser.uid, currentUser.displayName, currentUser.photoURL);
        // Dispatch custom leaderboard update event to sync best mock exam scores
        localStorage.setItem('goethe_user_mock_score', String(overallMockScore));
      }
      if (onActivityComplete) onActivityComplete();
    } else if (activeModule === 'schreiben') {
      // Show screen to trigger AI writing grade
      const results = {
        examId: selectedExam.id,
        examTitle: selectedExam.title,
        level: selectedExam.level,
        type: 'section',
        module: 'schreiben',
        drafts: { ...writingAnswers }
      };
      setSessionResults(results);
      setActiveMode('result');
    } else if (activeModule === 'sprechen') {
      // Show screen to trigger AI speaking grade
      const results = {
        examId: selectedExam.id,
        examTitle: selectedExam.title,
        level: selectedExam.level,
        type: 'section',
        module: 'sprechen',
        teil1Chat: [...sprechChatTeil1],
        teil2Text: sprechTextTeil2,
        teil3Chat: [...sprechChatTeil3]
      };
      setSessionResults(results);
      setActiveMode('result');
    }
  };

  // Final full exam submission
  const handleFinalSubmission = () => {
    setTimerRunning(false);
    
    const lesenScore = calculateLocalModuleScore('lesen');
    const hoerenScore = calculateLocalModuleScore('hoeren');

    const results = {
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      level: selectedExam.level,
      type: 'full',
      lesen: lesenScore,
      hoeren: hoerenScore,
      schreibenDrafts: { ...writingAnswers },
      sprechenDrafts: {
        teil1Chat: [...sprechChatTeil1],
        teil2Text: sprechTextTeil2,
        teil3Chat: [...sprechChatTeil3]
      },
      schreiben: null, // to be graded by AI
      sprechen: null // to be graded by AI
    };

    // Save automatic parts to best scores
    const savedBestRaw = localStorage.getItem('goethe_best_mock_scores');
    const savedBest = savedBestRaw ? JSON.parse(savedBestRaw) : { lesen: 0, hoeren: 0, schreiben: 0, sprechen: 0 };
    savedBest.lesen = Math.max(savedBest.lesen || 0, lesenScore);
    savedBest.hoeren = Math.max(savedBest.hoeren || 0, hoerenScore);
    localStorage.setItem('goethe_best_mock_scores', JSON.stringify(savedBest));

    setSessionResults(results);
    setActiveMode('result');

    // Save raw attempt
    recordAttempt({ module: 'Lesen', part: `Thi thử: ${selectedExam.title}`, correct: Math.round(lesenScore / 4), total: 25 });
    recordAttempt({ module: 'Hören', part: `Thi thử: ${selectedExam.title}`, correct: Math.round(hoerenScore / 5), total: 20 });
    
    if (onActivityComplete) onActivityComplete();
  };

  // Local matching grader for Lesen / Hören (0-100 scale)
  const calculateLocalModuleScore = (module) => {
    let correct = 0;
    let total = 0;
    const parts = selectedExam[module].parts;

    parts.forEach(part => {
      part.questions.forEach(q => {
        total++;
        const userAns = answers[q.id];
        if (userAns !== undefined && String(userAns) === String(q.correct)) {
          correct++;
        }
      });
    });

    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  // AI writing grading
  const handleAiWritingGrade = async () => {
    if (!currentUser) {
      showToast('Tính năng chấm điểm AI yêu cầu đăng nhập!', 'warning');
      onAuthClick();
      return;
    }

    setIsGradingSchreiben(true);
    try {
      const textToGrade = `
TASK 1 (E-Mail cá nhân):
${writingAnswers.task1 || '(Không có bài viết)'}

TASK 2 (Ý kiến diễn đàn):
${writingAnswers.task2 || '(Không có bài viết)'}

TASK 3 (Thư trang trọng):
${writingAnswers.task3 || '(Không có bài viết)'}
`;

      const result = await gradeWriting(
        textToGrade,
        `Bài thi thử Schreiben: ${selectedExam.title}`,
        'B1 Mock Exam (Schreiben Tasks 1, 2, 3)',
        [
          'Nhiệm vụ 1: Viết E-Mail cá nhân khoảng 80 từ kể về môi trường học/làm mới',
          'Nhiệm vụ 2: Viết bình luận diễn đàn khoảng 80 từ thảo luận và đưa ý kiến',
          'Nhiệm vụ 3: Viết email trang trọng khoảng 40 từ xin phép nghỉ học/làm'
        ]
      );

      // Update session result
      setSessionResults(prev => {
        const next = { ...prev, schreiben: result.score, schreibenEvaluation: result };
        
        // Save to best scores and sync
        const savedBestRaw = localStorage.getItem('goethe_best_mock_scores');
        const savedBest = savedBestRaw ? JSON.parse(savedBestRaw) : { lesen: 0, hoeren: 0, schreiben: 0, sprechen: 0 };
        savedBest.schreiben = Math.max(savedBest.schreiben || 0, result.score);
        localStorage.setItem('goethe_best_mock_scores', JSON.stringify(savedBest));
        
        // Update history
        saveExamHistoryItem(next, savedBest);

        return next;
      });

      showToast('Chấm điểm Viết AI thành công!', 'success');
      if (onActivityComplete) onActivityComplete();
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Lỗi kết nối dịch vụ chấm điểm AI.', 'error');
    } finally {
      setIsGradingSchreiben(false);
    }
  };

  // AI speaking grading
  const handleAiSpeakingGrade = async () => {
    if (!currentUser) {
      showToast('Tính năng chấm điểm AI yêu cầu đăng nhập!', 'warning');
      onAuthClick();
      return;
    }

    setIsGradingSprechen(true);
    try {
      const chatHist = [
        ...sprechChatTeil1.map(m => ({ sender: m.sender, text: `[Teil 1 - Gemeinsam planen] ${m.text}` })),
        { sender: 'user', text: `[Teil 2 - Präsentation] ${sprechTextTeil2}` },
        ...sprechChatTeil3.map(m => ({ sender: m.sender, text: `[Teil 3 - Q&A] ${m.text}` }))
      ];

      const result = await gradeSpeaking(
        `Bài thi thử Sprechen: ${selectedExam.title}`,
        'B1 Mock Exam (Sprechen)',
        [
          'Teil 1: Lập kế hoạch cùng bạn thi (Abschiedsfeier / Themenabend)',
          'Teil 2: Thuyết trình về một chủ đề xã hội du học nghề',
          'Teil 3: Hỏi đáp, đặt câu hỏi phản biện và trả lời đối tác'
        ],
        chatHist
      );

      const speakingScore = Math.round((result.fluency + result.grammar + result.vocabulary) / 3);

      setSessionResults(prev => {
        const next = { ...prev, sprechen: speakingScore, sprechenEvaluation: result };

        // Save to best scores and sync
        const savedBestRaw = localStorage.getItem('goethe_best_mock_scores');
        const savedBest = savedBestRaw ? JSON.parse(savedBestRaw) : { lesen: 0, hoeren: 0, schreiben: 0, sprechen: 0 };
        savedBest.sprechen = Math.max(savedBest.sprechen || 0, speakingScore);
        localStorage.setItem('goethe_best_mock_scores', JSON.stringify(savedBest));
        
        // Update history
        saveExamHistoryItem(next, savedBest);

        return next;
      });

      showToast('Chấm điểm Nói AI thành công!', 'success');
      if (onActivityComplete) onActivityComplete();
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Lỗi kết nối dịch vụ chấm điểm AI.', 'error');
    } finally {
      setIsGradingSprechen(false);
    }
  };

  const saveExamHistoryItem = (sessionRes, bestScores) => {
    const overallScore = Math.round(
      ((bestScores.lesen || 0) + (bestScores.hoeren || 0) + (bestScores.schreiben || 0) + (bestScores.sprechen || 0)) / 4
    );

    const historyItem = {
      id: Date.now(),
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      level: selectedExam.level,
      date: new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      lesen: sessionRes.lesen !== undefined ? sessionRes.lesen : (bestScores.lesen || 0),
      hoeren: sessionRes.hoeren !== undefined ? sessionRes.hoeren : (bestScores.hoeren || 0),
      schreiben: sessionRes.schreiben !== undefined ? sessionRes.schreiben : (bestScores.schreiben || 0),
      sprechen: sessionRes.sprechen !== undefined ? sessionRes.sprechen : (bestScores.sprechen || 0),
      overallScore: overallScore
    };

    setExamHistory(prev => {
      const next = [historyItem, ...prev.filter(h => h.examId !== selectedExam.id)].slice(0, 50);
      localStorage.setItem('goethe_mock_exams_history', JSON.stringify(next));
      return next;
    });

    if (currentUser) {
      localStorage.setItem('goethe_user_mock_score', String(overallScore));
      syncUserLeaderboard(currentUser.uid, currentUser.displayName, currentUser.photoURL);
    }
  };

  const getBestScores = () => {
    const savedBestRaw = localStorage.getItem('goethe_best_mock_scores');
    return savedBestRaw ? JSON.parse(savedBestRaw) : { lesen: 0, hoeren: 0, schreiben: 0, sprechen: 0 };
  };

  const exitExam = () => {
    if (window.confirm('Bạn có chắc chắn muốn thoát khỏi phòng thi? Toàn bộ tiến trình làm bài hiện tại sẽ không được lưu.')) {
      stopHorenAudio();
      stop();
      setTimerRunning(false);
      setActiveMode('dashboard');
    }
  };

  const getWordCount = (str) => {
    return (str || '').trim().split(/\s+/).filter(Boolean).length;
  };

  const bestScores = getBestScores();
  const calculatedOverallScore = Math.round(
    ((bestScores.lesen || 0) + (bestScores.hoeren || 0) + (bestScores.schreiben || 0) + (bestScores.sprechen || 0)) / 4
  );

  return (
    <div className="page-section">
      {/* ===================== DASHBOARD MODE ===================== */}
      {activeMode === 'dashboard' && (
        <div className="anim-fade-in-up">
          {/* Header */}
          <div className="content-header flex-between">
            <div>
              <h1 className="content-title flex-row gap-sm">
                <Trophy className="text-primary" size={26} />
                Thi thử Goethe B1 (Mock Exams)
              </h1>
              <p className="content-subtitle">
                Đánh giá toàn diện năng lực của bạn thông qua các đề thi mô phỏng đúng chuẩn cấu trúc Goethe-Zertifikat.
              </p>
            </div>
            {calculatedOverallScore > 0 && (
              <div className="flex-row gap-xs glass-panel panel" style={{ padding: '8px 14px', borderRadius: '10px' }}>
                <Award className="text-primary" size={16} />
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Điểm Mock cao nhất: {calculatedOverallScore}/100</span>
              </div>
            )}
          </div>

          <div className="dashboard-grid">
            {/* Left Column: Choose Exam */}
            <div className="col-8 flex-col gap-md">
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)' }}>Chọn đề thi thử</h2>
              
              <div className="flex-col gap-md">
                {MOCK_EXAMS.map((exam, idx) => {
                  const savedExamHistory = examHistory.find(h => h.examId === exam.id);
                  return (
                    <div 
                      key={exam.id}
                      className="glass-panel panel flex-col gap-sm hover-bg-elevated"
                      style={{ transition: 'all 0.2s ease', borderLeft: '4px solid var(--primary)' }}
                    >
                      <div className="flex-between">
                        <div>
                          <span className="badge badge-primary" style={{ marginRight: '8px' }}>{exam.level}</span>
                          <span className="badge badge-secondary">Đề {idx + 1}</span>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '6px', color: 'var(--text-main)' }}>{exam.title}</h3>
                        </div>
                        {savedExamHistory && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ĐÃ THI</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>
                              Tổng: {savedExamHistory.overallScore}/100
                            </div>
                          </div>
                        )}
                      </div>

                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        Bài thi bao gồm 4 kỹ năng chính thức: <strong>Lesen</strong> (65 phút), <strong>Hören</strong> (40 phút), <strong>Schreiben</strong> (60 phút) và <strong>Sprechen</strong> (15 phút). Tích hợp chấm điểm AI nâng cao.
                      </p>

                      <div className="flex-row gap-md" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
                        <button 
                          className="btn btn-primary flex-row gap-xs"
                          onClick={() => startExam(exam, true)}
                        >
                          <Clock size={14} />
                          Thi toàn diện (Full Test)
                        </button>
                        <div className="flex-row gap-xs">
                          <button 
                            className="btn btn-secondary flex-row gap-xs" 
                            style={{ padding: '6px 12px', fontSize: '12.5px' }}
                            onClick={() => startExam(exam, false, 'lesen')}
                          >
                            <BookOpen size={13} />
                            Lesen
                          </button>
                          <button 
                            className="btn btn-secondary flex-row gap-xs" 
                            style={{ padding: '6px 12px', fontSize: '12.5px' }}
                            onClick={() => startExam(exam, false, 'hoeren')}
                          >
                            <Headphones size={13} />
                            Hören
                          </button>
                          <button 
                            className="btn btn-secondary flex-row gap-xs" 
                            style={{ padding: '6px 12px', fontSize: '12.5px' }}
                            onClick={() => startExam(exam, false, 'schreiben')}
                          >
                            <PenTool size={13} />
                            Schreiben
                          </button>
                          <button 
                            className="btn btn-secondary flex-row gap-xs" 
                            style={{ padding: '6px 12px', fontSize: '12.5px' }}
                            onClick={() => startExam(exam, false, 'sprechen')}
                          >
                            <Mic size={13} />
                            Sprechen
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Profile & Info */}
            <div className="col-4 flex-col gap-md">
              <div className="glass-panel panel flex-col gap-sm">
                <h3 style={{ fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={16} className="text-primary" />
                  Quy chế phòng thi thử
                </h3>
                <ul style={{ fontSize: '12.5px', color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: '1.6' }} className="flex-col gap-xs">
                  <li><strong>Chế độ Thi toàn diện:</strong> Đồng hồ đếm ngược sẽ chạy liên tục cho từng kỹ năng. Khi hết giờ, bài thi tự nộp và chuyển kỹ năng tiếp theo.</li>
                  <li><strong>Chấm điểm AI:</strong> Phần viết và nói sẽ được chấm theo barem Goethe chính thức từ máy chủ AI. Cần kết nối mạng ổn định.</li>
                  <li><strong>Luyện tập kỹ năng:</strong> Bạn có thể thi từng module riêng lẻ để tự luyện tập và nâng cao điểm số của kỹ năng đó.</li>
                </ul>
              </div>

              {/* Best scores breakdown */}
              <div className="glass-panel panel flex-col gap-sm" style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} />
                  Kỷ lục điểm số của bạn
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '6px' }}>
                  <div className="inner-card flex-col" style={{ alignItems: 'center', padding: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>LESEN</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{bestScores.lesen || 0}</span>
                  </div>
                  <div className="inner-card flex-col" style={{ alignItems: 'center', padding: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HÖREN</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{bestScores.hoeren || 0}</span>
                  </div>
                  <div className="inner-card flex-col" style={{ alignItems: 'center', padding: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SCHREIBEN</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{bestScores.schreiben || 0}</span>
                  </div>
                  <div className="inner-card flex-col" style={{ alignItems: 'center', padding: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SPRECHEN</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{bestScores.sprechen || 0}</span>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '6px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ĐIỂM TRUNG BÌNH THI THỬ (Leaderboard Rank)</span>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--primary)', marginTop: '2px' }}>
                    {calculatedOverallScore || 0} / 100
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ===================== ACTIVE EXAM SESSION MODE ===================== */}
      {activeMode === 'exam' && selectedExam && (
        <div className="anim-fade-in-up">
          {/* Header Info Panel */}
          <div className="glass-panel panel-lg flex-between" style={{ marginBottom: '20px', padding: '12px 20px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="badge badge-primary">{activeModule.toUpperCase()}</span>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>{selectedExam.title}</h2>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Chế độ: {isFullExam ? 'Thi toàn diện Goethe' : 'Luyện tập kỹ năng'}</span>
              </div>
            </div>

            <div className="flex-row gap-md">
              {/* Countdown Timer */}
              <div className="flex-row gap-sm glass-panel" style={{ padding: '6px 12px', borderRadius: '8px', border: timeLeft < 300 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)' }}>
                <Clock size={16} className={timeLeft < 300 ? 'text-danger pulse' : 'text-primary'} />
                <span style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', color: timeLeft < 300 ? 'var(--danger)' : 'var(--text-main)' }}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Exit button */}
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={exitExam}>Thoát</button>
            </div>
          </div>

          {/* Module-Specific Tabs (Sub-sections) */}
          <div className="glass-panel panel" style={{ marginBottom: '20px', padding: '10px 16px' }}>
            <div className="flex-between">
              {activeModule === 'lesen' && (
                <div className="exam-part-tabs" role="tablist">
                  {selectedExam.lesen.parts.map((part, idx) => (
                    <button 
                      key={part.id} 
                      className={`exam-part-tab ${currentPartIdx === idx ? 'active' : ''}`}
                      onClick={() => { stopHorenAudio(); setCurrentPartIdx(idx); }}
                    >
                      Teil {idx + 1}
                    </button>
                  ))}
                </div>
              )}

              {activeModule === 'hoeren' && (
                <div className="exam-part-tabs" role="tablist">
                  {selectedExam.hoeren.parts.map((part, idx) => (
                    <button 
                      key={part.id} 
                      className={`exam-part-tab ${currentPartIdx === idx ? 'active' : ''}`}
                      onClick={() => { stopHorenAudio(); setCurrentPartIdx(idx); }}
                    >
                      Teil {idx + 1}
                    </button>
                  ))}
                </div>
              )}

              {activeModule === 'schreiben' && (
                <div className="exam-part-tabs" role="tablist">
                  {selectedExam.schreiben.tasks.map((task, idx) => (
                    <button 
                      key={task.id} 
                      className={`exam-part-tab ${currentPartIdx === idx ? 'active' : ''}`}
                      onClick={() => setCurrentPartIdx(idx)}
                    >
                      Nhiệm vụ {idx + 1}
                    </button>
                  ))}
                </div>
              )}

              {activeModule === 'sprechen' && (
                <div className="exam-part-tabs" role="tablist">
                  {selectedExam.sprechen.parts.map((part, idx) => (
                    <button 
                      key={part.id} 
                      className={`exam-part-tab ${sprechPartIdx === idx ? 'active' : ''}`}
                      disabled={sprechPartIdx < idx}
                      onClick={() => { stop(); setSprechPartIdx(idx); }}
                    >
                      {part.title.split(':')[0]}
                    </button>
                  ))}
                </div>
              )}

              {/* Submit Module action button */}
              {isFullExam ? (
                <button 
                  className="btn btn-primary" 
                  onClick={() => goToNextModule(false)}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  {activeModule === 'sprechen' ? 'Nộp bài thi thử' : 'Chuyển phần tiếp theo'}
                </button>
              ) : (
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleSubmitModule(false)}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  Nộp bài {activeModule.toUpperCase()}
                </button>
              )}
            </div>
          </div>


          {/* ===================== LESEN MODULE WORKSPACE ===================== */}
          {activeModule === 'lesen' && (
            <div className="dashboard-grid">
              {/* Left Column: Text pane */}
              <div className="col-6 flex-col gap-md">
                <div className="glass-panel panel" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>
                    Bài đọc Teil {currentPartIdx + 1}
                  </h3>
                  <div 
                    style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-main)', whiteSpace: 'pre-line' }}
                    dangerouslySetInnerHTML={{ __html: selectedExam.lesen.parts[currentPartIdx].text.replace(/\n/g, '<br />') }}
                  />
                </div>
              </div>

              {/* Right Column: Questions pane */}
              <div className="col-6 flex-col gap-md">
                <div className="glass-panel panel flex-col gap-md" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    Câu hỏi & Lựa chọn trả lời
                  </h3>
                  
                  {/* Render Teil 1 / 5: Richtig/Falsch */}
                  {(currentPartIdx === 0 || currentPartIdx === 4) && (
                    <div className="flex-col gap-md">
                      {selectedExam.lesen.parts[currentPartIdx].questions.map(q => {
                        const selectedVal = answers[q.id];
                        return (
                          <div key={q.id} className="inner-card flex-col gap-xs" style={{ padding: '14px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-main)' }}>
                              {q.id}. {q.text}
                            </span>
                            <div className="flex-row gap-md" style={{ marginTop: '8px' }}>
                              <button 
                                className={`quiz-option exam-option ${selectedVal === 0 ? 'selected' : ''}`}
                                style={{ flex: 1, padding: '10px' }}
                                onClick={() => handleSelectAnswer(q.id, 0)}
                              >
                                Richtig (Đúng)
                              </button>
                              <button 
                                className={`quiz-option exam-option ${selectedVal === 1 ? 'selected' : ''}`}
                                style={{ flex: 1, padding: '10px' }}
                                onClick={() => handleSelectAnswer(q.id, 1)}
                              >
                                Falsch (Sai)
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Render Teil 2: Multiple choice a/b/c */}
                  {currentPartIdx === 1 && (
                    <div className="flex-col gap-md">
                      {selectedExam.lesen.parts[currentPartIdx].questions.map(q => {
                        const selectedVal = answers[q.id];
                        return (
                          <div key={q.id} className="inner-card flex-col gap-xs" style={{ padding: '14px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>
                              {q.id}. {q.text}
                            </span>
                            <div className="flex-col gap-sm">
                              {q.options.map((opt, oIdx) => (
                                <button 
                                  key={opt}
                                  className={`quiz-option exam-option ${selectedVal === oIdx ? 'selected' : ''}`}
                                  style={{ textAlign: 'left', padding: '10px 14px' }}
                                  onClick={() => handleSelectAnswer(q.id, oIdx)}
                                >
                                  {oIdx === 0 ? 'a) ' : oIdx === 1 ? 'b) ' : 'c) '}{opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Render Teil 3: Matching persons 11-15 with ads a-g */}
                  {currentPartIdx === 2 && (
                    <div className="flex-col gap-md">
                      <div className="flex-col gap-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Đọc các yêu cầu bên dưới và chọn Quảng cáo (a đến g) thích hợp nhất từ bài đọc:</span>
                      </div>
                      
                      {selectedExam.lesen.parts[currentPartIdx].questions.map(q => {
                        const selectedLetter = answers[q.id] || '';
                        return (
                          <div key={q.id} className="inner-card flex-col gap-xs" style={{ padding: '14px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>
                              {q.id}. {q.text}
                            </span>
                            <div className="flex-row gap-sm" style={{ alignItems: 'center', marginTop: '10px' }}>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quảng cáo chọn:</span>
                              <div style={{ position: 'relative', flex: 1 }}>
                                <select 
                                  value={selectedLetter}
                                  onChange={(e) => handleSelectMatching(q.id, e.target.value)}
                                  className="quiz-option"
                                  style={{ width: '100%', padding: '8px 12px', WebkitAppearance: 'none', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', cursor: 'pointer' }}
                                >
                                  <option value="">-- Chọn quảng cáo --</option>
                                  {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(letter => (
                                    <option key={letter} value={letter}>Quảng cáo {letter.toUpperCase()}</option>
                                  ))}
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Render Teil 4: Matching statements a-e with forum users 16-20 */}
                  {currentPartIdx === 3 && (
                    <div className="flex-col gap-md">
                      <div className="flex-col gap-xs" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: 'var(--text-main)' }}>Các phát biểu (A - E):</span>
                        {selectedExam.lesen.parts[currentPartIdx].statements.map(st => (
                          <div key={st.id} style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <strong>{st.id.toUpperCase()}:</strong> {st.text}
                          </div>
                        ))}
                      </div>

                      {selectedExam.lesen.parts[currentPartIdx].questions.map(q => {
                        const selectedLetter = answers[q.id] || '';
                        return (
                          <div key={q.id} className="inner-card flex-col gap-xs" style={{ padding: '14px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>
                              {q.id}. Ý kiến của <strong>{q.name}</strong> phù hợp với:
                            </span>
                            <div className="flex-row gap-sm" style={{ alignItems: 'center', marginTop: '10px' }}>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Phát biểu chọn:</span>
                              <div style={{ position: 'relative', flex: 1 }}>
                                <select 
                                  value={selectedLetter}
                                  onChange={(e) => handleSelectMatching(q.id, e.target.value)}
                                  className="quiz-option"
                                  style={{ width: '100%', padding: '8px 12px', WebkitAppearance: 'none', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', cursor: 'pointer' }}
                                >
                                  <option value="">-- Chọn phát biểu --</option>
                                  {['a', 'b', 'c', 'd', 'e'].map(letter => (
                                    <option key={letter} value={letter}>Phát biểu {letter.toUpperCase()}</option>
                                  ))}
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* ===================== HÖREN MODULE WORKSPACE ===================== */}
          {activeModule === 'hoeren' && (
            <div className="dashboard-grid">
              {/* Left Column: Virtual Audio player */}
              <div className="col-5 flex-col gap-md">
                <div className="glass-panel panel flex-col" style={{ alignItems: 'center', padding: '24px', textAlign: 'center' }}>
                  <span className="badge badge-secondary" style={{ marginBottom: '14px' }}>
                    Nghe tối đa {selectedExam.hoeren.parts[currentPartIdx].maxPlays} lần
                  </span>
                  
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    Hören - Teil {currentPartIdx + 1}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
                    {selectedExam.hoeren.parts[currentPartIdx].description}
                  </p>

                  {/* Dynamic Vinyl Disc */}
                  <div className="audio-player-card" style={{ marginTop: '24px', width: '100%' }}>
                    <div className={`audio-visualizer-disc ${isPlaying ? 'disc-spinning' : ''}`} style={{ margin: '0 auto 16px auto' }}>
                      <div className="audio-visualizer-center" />
                    </div>
                    
                    <p className="font-semibold" style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                      {isPlaying ? 'Đang phát băng nghe hội thoại...' : 'Sẵn sàng nghe băng'}
                    </p>
                    <p className="text-muted" style={{ fontSize: '11px', marginTop: '4px', marginBottom: '16px' }}>
                      Số lần đã nghe: {playsCount[selectedExam.hoeren.parts[currentPartIdx].id] || 0} / {selectedExam.hoeren.parts[currentPartIdx].maxPlays}
                    </p>

                    <div className="flex-row gap-md" style={{ justifyContent: 'center' }}>
                      {isPlaying ? (
                        <button className="btn btn-danger flex-row gap-xs" onClick={stopHorenAudio}>
                          <Square size={13} />
                          Dừng phát
                        </button>
                      ) : (
                        <button 
                          className="btn btn-primary flex-row gap-xs" 
                          onClick={() => playHorenPart(selectedExam.hoeren.parts[currentPartIdx])}
                          disabled={(playsCount[selectedExam.hoeren.parts[currentPartIdx].id] || 0) >= selectedExam.hoeren.parts[currentPartIdx].maxPlays}
                        >
                          <Play size={13} />
                          Phát Teil {currentPartIdx + 1}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtitle segment tracker for Hören in practice mode */}
                {!isFullExam && (
                  <div className="glass-panel panel flex-col gap-sm" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <div className="flex-between">
                      <h4 style={{ fontSize: '13px', fontWeight: 'bold' }}>Phân đoạn transcript (Luyện tập)</h4>
                      <button className="btn-text-primary" onClick={() => setShowTranscript(!showTranscript)}>
                        {showTranscript ? 'Ẩn' : 'Hiện'}
                      </button>
                    </div>
                    {showTranscript && (
                      <div className="speaker-transcript" style={{ textAlign: 'left', fontSize: '12px' }}>
                        {selectedExam.hoeren.parts[currentPartIdx].segments.map((seg, sIdx) => (
                          <p key={sIdx} className={activeSegmentIdx === sIdx ? 'active-segment' : ''} style={{ margin: '4px 0' }}>
                            <strong>{seg.speaker}:</strong> {seg.text}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Questions */}
              <div className="col-7 flex-col gap-md">
                <div className="glass-panel panel flex-col gap-md" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                    Câu hỏi trắc nghiệm
                  </h3>

                  {/* Render Teil 1 / 3: Richtig/Falsch */}
                  {(currentPartIdx === 0 || currentPartIdx === 2) && (
                    <div className="flex-col gap-md">
                      {selectedExam.hoeren.parts[currentPartIdx].questions.map(q => {
                        const selectedVal = answers[q.id];
                        return (
                          <div key={q.id} className="inner-card flex-col gap-xs" style={{ padding: '14px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-main)' }}>
                              {q.id}. {q.text}
                            </span>
                            <div className="flex-row gap-md" style={{ marginTop: '8px' }}>
                              <button 
                                className={`quiz-option exam-option ${selectedVal === 0 ? 'selected' : ''}`}
                                style={{ flex: 1, padding: '10px' }}
                                onClick={() => handleSelectAnswer(q.id, 0)}
                              >
                                Richtig (Đúng)
                              </button>
                              <button 
                                className={`quiz-option exam-option ${selectedVal === 1 ? 'selected' : ''}`}
                                style={{ flex: 1, padding: '10px' }}
                                onClick={() => handleSelectAnswer(q.id, 1)}
                              >
                                Falsch (Sai)
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Render Teil 2: Lecture a/b/c */}
                  {currentPartIdx === 1 && (
                    <div className="flex-col gap-md">
                      {selectedExam.hoeren.parts[currentPartIdx].questions.map(q => {
                        const selectedVal = answers[q.id];
                        return (
                          <div key={q.id} className="inner-card flex-col gap-xs" style={{ padding: '14px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>
                              {q.id}. {q.text}
                            </span>
                            <div className="flex-col gap-sm">
                              {q.options.map((opt, oIdx) => (
                                <button 
                                  key={opt}
                                  className={`quiz-option exam-option ${selectedVal === oIdx ? 'selected' : ''}`}
                                  style={{ textAlign: 'left', padding: '10px 14px' }}
                                  onClick={() => handleSelectAnswer(q.id, oIdx)}
                                >
                                  {oIdx === 0 ? 'a) ' : oIdx === 1 ? 'b) ' : 'c) '}{opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Render Teil 4: Debate matching who says what */}
                  {currentPartIdx === 3 && (
                    <div className="flex-col gap-md">
                      <div className="flex-col gap-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lắng nghe cuộc thảo luận và chọn người phát biểu tương ứng với ý kiến sau:</span>
                      </div>
                      
                      {selectedExam.hoeren.parts[currentPartIdx].questions.map(q => {
                        const selectedVal = answers[q.id];
                        return (
                          <div key={q.id} className="inner-card flex-col gap-xs" style={{ padding: '14px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>
                              {q.id}. {q.text}
                            </span>
                            <div className="flex-row gap-sm" style={{ alignItems: 'center', marginTop: '10px' }}>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Người phát biểu:</span>
                              <div style={{ position: 'relative', flex: 1 }}>
                                <select 
                                  value={selectedVal === undefined ? '' : selectedVal}
                                  onChange={(e) => handleSelectAnswer(q.id, e.target.value === '' ? undefined : parseInt(e.target.value))}
                                  className="quiz-option"
                                  style={{ width: '100%', padding: '8px 12px', WebkitAppearance: 'none', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px', cursor: 'pointer' }}
                                >
                                  <option value="">-- Chọn người nói --</option>
                                  {q.options.map((opt, oIdx) => (
                                    <option key={oIdx} value={oIdx}>{opt}</option>
                                  ))}
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* ===================== SCHREIBEN MODULE WORKSPACE ===================== */}
          {activeModule === 'schreiben' && (
            <div className="dashboard-grid">
              {/* Left Column: Situation & Instructions */}
              <div className="col-5 flex-col gap-md">
                <div className="glass-panel panel" style={{ padding: '20px' }}>
                  <span className="badge badge-secondary" style={{ marginBottom: '10px' }}>
                    {selectedExam.schreiben.tasks[currentPartIdx].timeHint} · {selectedExam.schreiben.tasks[currentPartIdx].wordCountHint}
                  </span>
                  
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>
                    {selectedExam.schreiben.tasks[currentPartIdx].title}
                  </h3>

                  <div 
                    style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6', background: 'var(--bg-elevated)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', whiteSpace: 'pre-line' }}
                    dangerouslySetInnerHTML={{ __html: selectedExam.schreiben.tasks[currentPartIdx].description.replace(/\n/g, '<br />') }}
                  />
                </div>
              </div>

              {/* Right Column: Text editor */}
              <div className="col-7 flex-col gap-md">
                <div className="glass-panel panel flex-col gap-sm" style={{ padding: '20px' }}>
                  <div className="flex-between">
                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Bài làm viết tiếng Đức của bạn:</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Độ dài: <strong style={{ color: getWordCount(writingAnswers[`task${currentPartIdx + 1}`]) >= (currentPartIdx === 2 ? 40 : 80) ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {getWordCount(writingAnswers[`task${currentPartIdx + 1}`])} từ
                      </strong> / {currentPartIdx === 2 ? '40' : '80'} từ gợi ý
                    </span>
                  </div>

                  <textarea 
                    value={writingAnswers[`task${currentPartIdx + 1}`] || ''}
                    onChange={(e) => setWritingAnswers(prev => ({ ...prev, [`task${currentPartIdx + 1}`]: e.target.value }))}
                    placeholder="Viết thư hoặc email bằng tiếng Đức của bạn vào đây..."
                    style={{ width: '100%', height: '280px', padding: '14px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', resize: 'none', outline: 'none', transition: 'border-color 0.2s' }}
                    className="focus-border-primary"
                  />

                  {/* Navigation steps inside Schreiben */}
                  <div className="flex-between" style={{ marginTop: '12px' }}>
                    <button 
                      className="btn btn-secondary" 
                      disabled={currentPartIdx === 0} 
                      onClick={() => setCurrentPartIdx(prev => prev - 1)}
                    >
                      Nhiệm vụ trước
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      disabled={currentPartIdx === 2} 
                      onClick={() => setCurrentPartIdx(prev => prev + 1)}
                    >
                      Nhiệm vụ tiếp theo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ===================== SPRECHEN MODULE WORKSPACE ===================== */}
          {activeModule === 'sprechen' && (
            <div className="dashboard-grid">
              {/* Left Column: Situation description */}
              <div className="col-5 flex-col gap-md">
                <div className="glass-panel panel" style={{ padding: '20px' }}>
                  <span className="badge badge-secondary" style={{ marginBottom: '10px' }}>Sprechen B1 - Phần {sprechPartIdx + 1}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>
                    {selectedExam.sprechen.parts[sprechPartIdx].title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {selectedExam.sprechen.parts[sprechPartIdx].description}
                  </p>

                  {/* Planning prompts / Presentation structure */}
                  {sprechPartIdx === 0 && (
                    <div style={{ marginTop: '14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>Các điểm cần thảo luận (Prompts):</span>
                      <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '18px', marginTop: '6px' }} className="flex-col gap-xs">
                        {selectedExam.sprechen.parts[0].prompts.map(p => <li key={p}>{p}</li>)}
                      </ul>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', display: 'block', marginTop: '12px' }}>Cấu trúc đề xuất:</span>
                      <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '18px', marginTop: '6px' }} className="flex-col gap-xs">
                        {selectedExam.sprechen.parts[0].usefulPhrases.slice(0, 3).map(ph => <li key={ph}>{ph}</li>)}
                      </ul>
                    </div>
                  )}

                  {sprechPartIdx === 1 && (
                    <div style={{ marginTop: '14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>Chủ đề thuyết trình:</span>
                      <div className="inner-card" style={{ padding: '10px', marginTop: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                        "{selectedExam.sprechen.parts[1].topic}"
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)', display: 'block', marginTop: '12px' }}>Cấu trúc thuyết trình bắt buộc:</span>
                      <ol style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '18px', marginTop: '6px' }} className="flex-col gap-xs">
                        <li>Giới thiệu chủ đề, trải nghiệm cá nhân</li>
                        <li>Trình bày tình hình ở quê hương Việt Nam</li>
                        <li>Nêu các Ưu điểm & Nhược điểm</li>
                        <li>Đưa ra kết luận/Quan điểm riêng</li>
                      </ol>
                    </div>
                  )}

                  {sprechPartIdx === 2 && (
                    <div style={{ marginTop: '14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>Yêu cầu:</span>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.5' }}>
                        Giám khảo sẽ đặt câu hỏi dựa trên bài thuyết trình của bạn ở Teil 2. Bạn hãy phản hồi một cách tự nhiên từ 2-3 câu bằng tiếng Đức.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Interaction Arena */}
              <div className="col-7 flex-col gap-md">
                {/* Chat Interface for Teil 1 and Teil 3 */}
                {(sprechPartIdx === 0 || sprechPartIdx === 2) && (
                  <div className="glass-panel panel flex-col" style={{ padding: '20px', height: '420px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      Mô phỏng hội thoại trực tiếp với giám khảo
                    </h4>

                    {/* Chat log */}
                    <div style={{ flex: 1, overflowY: 'auto', margin: '14px 0', paddingRight: '4px' }} className="flex-col gap-sm">
                      {(sprechPartIdx === 0 ? sprechChatTeil1 : sprechChatTeil3).map(msg => (
                        <div 
                          key={msg.id}
                          style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            background: msg.sender === 'user' ? 'var(--primary-soft)' : 'var(--bg-elevated)',
                            border: msg.sender === 'user' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '10px 14px',
                            fontSize: '13.5px',
                            color: 'var(--text-main)',
                            position: 'relative'
                          }}
                        >
                          {msg.text}
                          {msg.sender === 'ai' && (
                            <button 
                              onClick={() => speak(msg.text)} 
                              style={{ display: 'block', background: 'transparent', border: 0, color: 'var(--primary)', cursor: 'pointer', padding: 0, marginTop: '4px' }}
                              title="Nghe lại phát âm"
                            >
                              <Volume2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      {isAiTyping && <TypingIndicator />}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Text / Microphone controller */}
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <form 
                        onSubmit={(e) => handleSprechenTextSubmit(
                          e, 
                          sprechPartIdx === 0 ? sprechChatTeil1 : sprechChatTeil3,
                          sprechPartIdx === 0 ? setSprechChatTeil1 : setSprechChatTeil3,
                          selectedExam.sprechen.parts[sprechPartIdx].scenario
                        )}
                        style={{ display: 'flex', gap: '8px' }}
                      >
                        <input 
                          type="text" 
                          name="speakInput"
                          placeholder="Gõ tin nhắn tiếng Đức tại đây hoặc bấm mic nói..."
                          disabled={isAiTyping}
                          style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-main)', fontSize: '13.5px', outline: 'none' }}
                          className="focus-border-primary"
                        />

                        {isRecording ? (
                          <button 
                            type="button" 
                            className="btn btn-danger flex-row gap-xs"
                            onClick={handleStopRecord}
                            style={{ padding: '0 14px', borderRadius: '10px' }}
                          >
                            <Square size={13} />
                            Dừng ({recordSeconds}s)
                          </button>
                        ) : (
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => startSpeechRecognition(
                              sprechPartIdx === 0 ? sprechChatTeil1 : sprechChatTeil3,
                              sprechPartIdx === 0 ? setSprechChatTeil1 : setSprechChatTeil3,
                              selectedExam.sprechen.parts[sprechPartIdx].scenario
                            )}
                            disabled={isAiTyping}
                            style={{ padding: '0 14px', borderRadius: '10px' }}
                            title="Nói trực tiếp qua Mic"
                          >
                            <Mic size={15} />
                          </button>
                        )}
                        <button type="submit" className="btn btn-primary" disabled={isAiTyping} style={{ padding: '0 16px', borderRadius: '10px', fontSize: '13px' }}>Gửi</button>
                      </form>

                      {sprechPartIdx === 0 && (
                        <button 
                          className="btn btn-secondary flex-row gap-xs" 
                          style={{ width: '100%', marginTop: '10px', fontSize: '12px' }}
                          onClick={handleNextSprechenTeil}
                        >
                          Xong Teil 1 - Chuyển sang Teil 2
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Editor for Teil 2 (Presentation) */}
                {sprechPartIdx === 1 && (
                  <div className="glass-panel panel flex-col gap-sm" style={{ padding: '20px' }}>
                    <div className="flex-between">
                      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Dàn ý bài thuyết trình của bạn:</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Độ dài nháp: <strong>{getWordCount(sprechTextTeil2)} từ</strong>
                      </span>
                    </div>

                    <textarea 
                      value={sprechTextTeil2}
                      onChange={(e) => setSprechTextTeil2(e.target.value)}
                      placeholder="Gõ nháp các ý chính của bài thuyết trình bằng tiếng Đức..."
                      style={{ width: '100%', height: '260px', padding: '14px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', resize: 'none', outline: 'none' }}
                      className="focus-border-primary"
                    />

                    <button 
                      className="btn btn-primary" 
                      onClick={handleNextSprechenTeil}
                      style={{ width: '100%', marginTop: '10px' }}
                    >
                      Xác nhận bài thuyết trình & chuyển sang Teil 3
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Previous / Next Module Navigation buttons (Only when doing Practice Mode) */}
          {!isFullExam && (
            <div className="flex-between" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {activeModule !== 'lesen' && (
                  <button className="btn btn-secondary" onClick={() => startExam(selectedExam, false, 'lesen')}>Lesen</button>
                )}
                {activeModule !== 'hoeren' && (
                  <button className="btn btn-secondary" onClick={() => startExam(selectedExam, false, 'hoeren')}>Hören</button>
                )}
                {activeModule !== 'schreiben' && (
                  <button className="btn btn-secondary" onClick={() => startExam(selectedExam, false, 'schreiben')}>Schreiben</button>
                )}
                {activeModule !== 'sprechen' && (
                  <button className="btn btn-secondary" onClick={() => startExam(selectedExam, false, 'sprechen')}>Sprechen</button>
                )}
              </div>
            </div>
          )}
        </div>
      )}


      {/* ===================== REVIEW & SCORECARD MODE ===================== */}
      {activeMode === 'result' && sessionResults && (
        <div className="anim-fade-in-up">
          {/* Header */}
          <div className="content-header flex-between">
            <div>
              <span className="badge badge-primary">{selectedExam.level}</span>
              <h1 className="content-title" style={{ marginTop: '6px' }}>Kết quả: {selectedExam.title}</h1>
              <p className="content-subtitle">Bảng tổng kết điểm thi thử và chi tiết đánh giá từ các module.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setActiveMode('dashboard')}>Về bảng điều khiển</button>
          </div>

          <div className="dashboard-grid">
            {/* Left Column: Overall score display & AI triggering */}
            <div className="col-4 flex-col gap-md">
              <div className="glass-panel panel-lg flex-col" style={{ alignItems: 'center', padding: '24px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '15px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Kết quả thi thử</h3>
                
                {/* Score wheel */}
                <div style={{ margin: '20px 0' }}>
                  <AnimatedScore 
                    score={
                      sessionResults.type === 'full' 
                        ? Math.round(
                            ((sessionResults.lesen || 0) + 
                             (sessionResults.hoeren || 0) + 
                             (sessionResults.schreiben || 0) + 
                             (sessionResults.sprechen || 0)) / 4
                          )
                        : (sessionResults.score || 0)
                    } 
                    size={160} 
                  />
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Đạt điểm 60 trở lên ở mỗi kỹ năng để vượt qua kỳ thi Goethe B1 chính thức.
                </p>

                {/* Score details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', width: '100%', marginTop: '18px' }}>
                  <div className="inner-card flex-col" style={{ padding: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>LESEN</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {sessionResults.lesen !== undefined ? `${sessionResults.lesen}/100` : (bestScores.lesen ? `${bestScores.lesen}/100` : '—')}
                    </span>
                  </div>
                  <div className="inner-card flex-col" style={{ padding: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HÖREN</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {sessionResults.hoeren !== undefined ? `${sessionResults.hoeren}/100` : (bestScores.hoeren ? `${bestScores.hoeren}/100` : '—')}
                    </span>
                  </div>
                  <div className="inner-card flex-col" style={{ padding: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SCHREIBEN</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {sessionResults.schreiben !== undefined && sessionResults.schreiben !== null ? `${sessionResults.schreiben}/100` : (bestScores.schreiben ? `${bestScores.schreiben}/100` : '—')}
                    </span>
                  </div>
                  <div className="inner-card flex-col" style={{ padding: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SPRECHEN</span>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {sessionResults.sprechen !== undefined && sessionResults.sprechen !== null ? `${sessionResults.sprechen}/100` : (bestScores.sprechen ? `${bestScores.sprechen}/100` : '—')}
                    </span>
                  </div>
                </div>

                {/* AI writing grading actions */}
                {sessionResults.schreibenDrafts && sessionResults.schreiben === null && (
                  <button 
                    className="btn btn-primary flex-row gap-xs" 
                    style={{ width: '100%', marginTop: '16px' }}
                    onClick={handleAiWritingGrade}
                    disabled={isGradingSchreiben}
                  >
                    {isGradingSchreiben ? <RefreshCw className="spin-slow" size={14} /> : <Sparkles size={14} />}
                    Chấm bài Viết bằng AI (1 credit)
                  </button>
                )}

                {/* AI speaking grading actions */}
                {sessionResults.sprechenDrafts && sessionResults.sprechen === null && (
                  <button 
                    className="btn btn-primary flex-row gap-xs" 
                    style={{ width: '100%', marginTop: '10px' }}
                    onClick={handleAiSpeakingGrade}
                    disabled={isGradingSprechen}
                  >
                    {isGradingSprechen ? <RefreshCw className="spin-slow" size={14} /> : <Sparkles size={14} />}
                    Chấm bài Nói bằng AI (1 credit)
                  </button>
                )}

                {((sessionResults.schreibenDrafts && sessionResults.schreiben === null) || (sessionResults.sprechenDrafts && sessionResults.sprechen === null)) && (
                  <p className="text-muted" style={{ fontSize: '11px', marginTop: '10px', textAlign: 'center' }}>
                    * Lưu ý: Thao tác chấm điểm bằng AI sẽ kết nối đến API và trừ 1 lượt chấm (AI credit) trong tài khoản của bạn.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Review of Sub-modules */}
            <div className="col-8 flex-col gap-md" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              
              {/* Review Lesen / Hören solutions */}
              {(sessionResults.module === 'lesen' || sessionResults.module === 'hoeren' || sessionResults.type === 'full') && (
                <div className="glass-panel panel flex-col gap-sm" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpenText size={16} />
                    Giải thích đáp án Lesen & Hören
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Xem lại các câu trả lời của bạn đối chiếu với đáp án chuẩn chính thức.</p>
                  
                  <div className="flex-col gap-sm" style={{ marginTop: '10px' }}>
                    {['lesen', 'hoeren'].map(modKey => {
                      if (sessionResults.module && sessionResults.module !== modKey && sessionResults.type !== 'full') return null;
                      return (
                        <div key={modKey} className="flex-col gap-xs">
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase' }}>Module: {modKey.toUpperCase()}</span>
                          {selectedExam[modKey].parts.map((p, pIdx) => (
                            <div key={p.id} className="inner-card flex-col gap-xs" style={{ padding: '12px', marginTop: '6px' }}>
                              <strong>Teil {pIdx + 1}: {p.title}</strong>
                              <div className="flex-col gap-xs" style={{ paddingLeft: '8px', marginTop: '4px' }}>
                                {p.questions.map(q => {
                                  const userAns = answers[q.id];
                                  const isCorrect = userAns !== undefined && String(userAns) === String(q.correct);
                                  
                                  let userAnsText = 'Chưa chọn';
                                  let correctAnsText = '';
                                  if (q.options) {
                                    userAnsText = userAns !== undefined ? q.options[userAns] : 'Chưa chọn';
                                    correctAnsText = q.options[q.correct];
                                  } else {
                                    userAnsText = userAns ? String(userAns).toUpperCase() : 'Chưa chọn';
                                    correctAnsText = String(q.correct).toUpperCase();
                                  }

                                  return (
                                    <div key={q.id} style={{ fontSize: '12.5px', borderBottom: '1px solid rgba(255,255,255,0.01)', paddingBottom: '6px' }} className="flex-col gap-xs">
                                      <div className="flex-between">
                                        <span>Câu {q.id}: {q.text || `Nối mục ${q.id}`}</span>
                                        <span className={`badge ${isCorrect ? 'badge-success' : 'badge-danger'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                          {isCorrect ? <Check size={10} /> : <X size={10} />}
                                          Bạn: {userAnsText} (Đáp án: {correctAnsText})
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Review AI Writing evaluation */}
              {sessionResults.schreibenEvaluation && (
                <div className="glass-panel panel flex-col gap-md" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                    <Sparkles size={16} />
                    Nhận xét chi tiết bài Viết (Schreiben) từ AI
                  </h3>

                  <div className="flex-col gap-sm">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
                      <div className="inner-card" style={{ padding: '8px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>NỘI DUNG</div>
                        <strong style={{ fontSize: '14px' }}>{sessionResults.schreibenEvaluation.critCompletion}</strong>
                      </div>
                      <div className="inner-card" style={{ padding: '8px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>BỐ CỤC</div>
                        <strong style={{ fontSize: '14px' }}>{sessionResults.schreibenEvaluation.critCoherence}</strong>
                      </div>
                      <div className="inner-card" style={{ padding: '8px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TỪ VỰNG</div>
                        <strong style={{ fontSize: '14px' }}>{sessionResults.schreibenEvaluation.critVocabulary}</strong>
                      </div>
                      <div className="inner-card" style={{ padding: '8px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>NGỮ PHÁP</div>
                        <strong style={{ fontSize: '14px' }}>{sessionResults.schreibenEvaluation.critGrammar}</strong>
                      </div>
                      <div className="inner-card" style={{ padding: '8px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>VĂN PHONG</div>
                        <strong style={{ fontSize: '14px' }}>{sessionResults.schreibenEvaluation.critRegister}</strong>
                      </div>
                    </div>

                    <div style={{ marginTop: '10px' }} className="flex-col gap-xs">
                      <strong>Điểm mạnh bài viết:</strong>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{sessionResults.schreibenEvaluation.strengths}</p>
                    </div>

                    {sessionResults.schreibenEvaluation.errors.length > 0 && (
                      <div style={{ marginTop: '10px' }} className="flex-col gap-xs">
                        <strong>Các lỗi sai quan trọng phát hiện:</strong>
                        <div className="flex-col gap-sm" style={{ marginTop: '6px' }}>
                          {sessionResults.schreibenEvaluation.errors.map((error, eIdx) => (
                            <CorrectionPracticeCard key={eIdx} error={error} showToast={showToast} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: '12px' }} className="flex-col gap-xs">
                      <strong>Bài viết sửa lại chuẩn Goethe từ AI:</strong>
                      <div 
                        style={{ fontSize: '13px', color: 'var(--text-main)', background: 'var(--bg-elevated)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', lineHeight: '1.6', whiteSpace: 'pre-line' }}
                        dangerouslySetInnerHTML={{ __html: sessionResults.schreibenEvaluation.rewrite.replace(/\n/g, '<br />') }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Review AI Speaking evaluation */}
              {sessionResults.sprechenEvaluation && (
                <div className="glass-panel panel flex-col gap-md" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                    <Sparkles size={16} />
                    Nhận xét chi tiết bài Nói (Sprechen) từ AI
                  </h3>

                  <div className="flex-col gap-sm">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                      <div className="inner-card" style={{ padding: '10px' }}>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>ĐỘ TRÔI CHẢY (FLUENCY)</div>
                        <strong style={{ fontSize: '16px' }}>{sessionResults.sprechenEvaluation.fluency}/100</strong>
                      </div>
                      <div className="inner-card" style={{ padding: '10px' }}>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>TỪ VỰNG (VOCABULARY)</div>
                        <strong style={{ fontSize: '16px' }}>{sessionResults.sprechenEvaluation.vocabulary}/100</strong>
                      </div>
                      <div className="inner-card" style={{ padding: '10px' }}>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>NGỮ PHÁP (GRAMMAR)</div>
                        <strong style={{ fontSize: '16px' }}>{sessionResults.sprechenEvaluation.grammar}/100</strong>
                      </div>
                    </div>

                    <div style={{ marginTop: '10px' }} className="flex-col gap-xs">
                      <strong>Nhận xét tổng quát:</strong>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{sessionResults.sprechenEvaluation.feedback}</p>
                    </div>

                    {sessionResults.sprechenEvaluation.grammaticalFixes.length > 0 && (
                      <div style={{ marginTop: '10px' }} className="flex-col gap-xs">
                        <strong>Lỗi sai cấu trúc nói cần khắc phục:</strong>
                        <div className="flex-col gap-sm" style={{ marginTop: '6px' }}>
                          {sessionResults.sprechenEvaluation.grammaticalFixes.map((error, eIdx) => (
                            <CorrectionPracticeCard key={eIdx} error={error} showToast={showToast} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: '10px' }} className="flex-col gap-xs">
                      <strong>Lời khuyên cải thiện:</strong>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{sessionResults.sprechenEvaluation.improvements}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
