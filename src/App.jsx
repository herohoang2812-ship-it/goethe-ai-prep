import { useState, useCallback, useEffect } from 'react';
import { Menu, LogIn } from 'lucide-react';
import Toast from './components/Toast';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import SchreibenView from './components/SchreibenView';
import SprechenView from './components/SprechenView';
import LesenView from './components/LesenView';
import VocabView from './components/VocabView';
import GrammarView from './components/GrammarView';
import HorenView from './components/HorenView';
import LanguageLabView from './components/LanguageLabView';
import ProgressView from './components/ProgressView';
import DiagnosticView from './components/DiagnosticView';
import PricingView from './components/PricingView';
import AuthModal from './components/AuthModal';
import LeaderboardView from './components/LeaderboardView';

import { auth } from './services/firebase';
import { onAuthStateChangedListener } from './services/authService';
import { syncUserProfile, syncUserProgress, saveUserProgressOnDb, subscribeToUserProfile, syncUserLeaderboard } from './services/dbService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('goethe_user_streak')) || 0);
  const [theme, setTheme] = useState(localStorage.getItem('goethe_theme') || 'dark');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('goethe_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Nguyễn Văn Minh',
      level: 'B1',
      specialty: 'pflege'
    };
  });

  // Sync theme with body class
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('goethe_theme', theme);
  }, [theme]);

  const showToast = useCallback((message, type = 'warning') => {
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Lắng nghe sự kiện thay đổi tài khoản đăng nhập từ Firebase
  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChangedListener(async (user) => {
      // Dọn dẹp listener cũ
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (user) {
        setCurrentUser(user);
        try {
          const localProfile = JSON.parse(localStorage.getItem('goethe_user_profile')) || {
            name: user.displayName || 'Học viên Goethe',
            level: 'B1',
            specialty: 'pflege'
          };
          localProfile.avatarUrl = user.photoURL || null;
          
          // Đồng bộ thông tin hồ sơ ban đầu
          const cloudProfile = await syncUserProfile(user.uid, localProfile);
          setUserProfile(cloudProfile);
          localStorage.setItem('goethe_user_profile', JSON.stringify(cloudProfile));

          // Đồng bộ bảng xếp hạng lúc đăng nhập
          await syncUserLeaderboard(user.uid, cloudProfile.name, cloudProfile.avatarUrl);

          // Đăng ký lắng nghe thay đổi thời gian thực hồ sơ trên Cloud
          unsubscribeProfile = subscribeToUserProfile(user.uid, (updatedProfile) => {
            setUserProfile(updatedProfile);
            localStorage.setItem('goethe_user_profile', JSON.stringify(updatedProfile));
          });

          // Đồng bộ tiến độ
          const localProgress = {
            streak: Number(localStorage.getItem('goethe_user_streak')) || 0,
            completedLessons: JSON.parse(localStorage.getItem('goethe_completed_lessons')) || { lesen: [], horen: [] },
            vocabSrs: JSON.parse(localStorage.getItem('goethe_vocab_srs')) || { learnedWordsCount: 0, lastSrsReview: null },
            diagnostic: JSON.parse(localStorage.getItem('goethe_diagnostic_result')) || null
          };
          
          const cloudProgress = await syncUserProgress(user.uid, localProgress);
          setStreak(cloudProgress.streak || 0);
          localStorage.setItem('goethe_user_streak', String(cloudProgress.streak || 0));
          if (cloudProgress.completedLessons) {
            localStorage.setItem('goethe_completed_lessons', JSON.stringify(cloudProgress.completedLessons));
          }
          if (cloudProgress.vocabSrs) {
            localStorage.setItem('goethe_vocab_srs', JSON.stringify(cloudProgress.vocabSrs));
          }
          if (cloudProgress.diagnostic) {
            localStorage.setItem('goethe_diagnostic_result', JSON.stringify(cloudProgress.diagnostic));
          }

          showToast(`Đồng bộ tài khoản học viên: ${cloudProfile.name || user.email}`, 'success');
        } catch (err) {
          console.error('[App] Lỗi đồng bộ dữ liệu đám mây:', err);
          showToast('Lỗi đồng bộ đám mây. Tiến độ học của bạn đang chạy tạm thời ở bộ nhớ cục bộ.', 'warning');
        }
      } else {
        setCurrentUser(null);
        // Khôi phục hồ sơ lưu cục bộ khách
        const saved = localStorage.getItem('goethe_user_profile');
        if (saved) {
          setUserProfile(JSON.parse(saved));
        }
        setStreak(Number(localStorage.getItem('goethe_user_streak')) || 0);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, [showToast]);

  const triggerStudyActivity = useCallback(() => {
    const now = new Date();
    const key = (date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
    const today = key(now);

    // Đồng bộ lên Cloud & Bảng xếp hạng nếu đã đăng nhập (chạy mỗi lần hoàn thành bài học)
    if (auth.currentUser) {
      const progressData = {
        completedLessons: JSON.parse(localStorage.getItem('goethe_completed_lessons')) || { lesen: [], horen: [] },
        vocabSrs: JSON.parse(localStorage.getItem('goethe_vocab_srs')) || { learnedWordsCount: 0, lastSrsReview: null },
        diagnostic: JSON.parse(localStorage.getItem('goethe_diagnostic_result')) || null
      };
      
      const last = localStorage.getItem('goethe_last_study_date');
      if (last !== today) {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const next = last === key(yesterday) ? (Number(localStorage.getItem('goethe_user_streak')) || 0) + 1 : 1;
        localStorage.setItem('goethe_user_streak', String(next));
        localStorage.setItem('goethe_last_study_date', today);
        setStreak(next);
        progressData.streak = next;
        showToast('Tuyệt vời! Chuỗi ngày học tập của bạn đã tăng lên!', 'success');
      }
      
      saveUserProgressOnDb(auth.currentUser.uid, progressData).catch(err => {
        console.error('[App] Lỗi đồng bộ tiến độ lên Firestore:', err);
      });
      
      // Đồng bộ điểm lên bảng xếp hạng
      syncUserLeaderboard(auth.currentUser.uid, userProfile?.name, userProfile?.avatarUrl);
    } else {
      // Trường hợp khách offline
      const last = localStorage.getItem('goethe_last_study_date');
      if (last !== today) {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const next = last === key(yesterday) ? (Number(localStorage.getItem('goethe_user_streak')) || 0) + 1 : 1;
        localStorage.setItem('goethe_user_streak', String(next));
        localStorage.setItem('goethe_last_study_date', today);
        setStreak(next);
        showToast('Tuyệt vời! Chuỗi ngày học tập của bạn đã tăng lên!', 'success');
      }
    }
  }, [showToast, userProfile]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-container">
      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast 
            key={t.id} 
            message={t.message} 
            type={t.type} 
            onClose={() => removeToast(t.id)} 
          />
        ))}
      </div>

      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="hamburger-btn" 
          onClick={() => setSidebarOpen(true)} 
          aria-label="Mở menu"
        >
          <Menu size={20} />
        </button>
        <span className="sidebar-logo-text" style={{ fontSize: '16px' }}>Goethe AI-Prep</span>
        
        {/* Mobile top-right account button */}
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          style={{ 
            border: 0, 
            background: 'transparent', 
            color: 'var(--primary)', 
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Tài khoản học viên"
        >
          {currentUser ? (
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              {userProfile?.name ? userProfile.name.trim().charAt(0).toUpperCase() : 'U'}
            </div>
          ) : (
            <LogIn size={20} />
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        handleTabChange={handleTabChange} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        theme={theme}
        toggleTheme={toggleTheme}
        userProfile={userProfile}
        currentUser={currentUser}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />

      {/* === MAIN CONTENT === */}
      <main className="main-content">
        {/* Desktop Top-Right Profile / Login Button */}
        <div className="desktop-top-profile">
          {currentUser ? (
            <div 
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                padding: '6px 14px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="glass-panel-hover"
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 'bold',
                fontSize: '13px'
              }}>
                {userProfile?.name ? userProfile.name.trim().charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                {userProfile?.name}
              </span>
              <span className="badge badge-primary" style={{ fontSize: '9px', padding: '1px 5px' }}>
                {userProfile?.level}
              </span>
            </div>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                borderRadius: '12px',
                padding: '8px 18px',
                fontSize: '13.5px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.25)',
                border: '1px solid rgba(139, 92, 246, 0.4)'
              }}
            >
              <LogIn size={15} />
              Đăng nhập học viên
            </button>
          )}
        </div>
        {activeTab === 'dashboard' && (
          <DashboardView 
            setActiveTab={handleTabChange} 
            userStreak={streak} 
            userProfile={userProfile} 
            setUserProfile={setUserProfile} 
            currentUser={currentUser}
            onAuthClick={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'schreiben' && (
          <SchreibenView 
            showToast={showToast} 
            onActivityComplete={triggerStudyActivity} 
            currentUser={currentUser}
            onAuthClick={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'sprechen' && (
          <SprechenView 
            showToast={showToast} 
            onActivityComplete={triggerStudyActivity} 
            currentUser={currentUser}
            onAuthClick={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'horen' && (
          <HorenView showToast={showToast} onActivityComplete={triggerStudyActivity} />
        )}

        {activeTab === 'lesen' && (
          <LesenView showToast={showToast} onActivityComplete={triggerStudyActivity} />
        )}

        {activeTab === 'vocab' && (
          <VocabView showToast={showToast} onActivityComplete={triggerStudyActivity} />
        )}

        {activeTab === 'grammar' && (
          <GrammarView showToast={showToast} onActivityComplete={triggerStudyActivity} />
        )}
        {activeTab === 'languageLab' && (
          <LanguageLabView showToast={showToast} onActivityComplete={triggerStudyActivity} />
        )}

        {activeTab === 'diagnostic' && <DiagnosticView showToast={showToast} onActivityComplete={triggerStudyActivity} setActiveTab={handleTabChange} />}

        {activeTab === 'leaderboard' && (
          <LeaderboardView 
            currentUser={currentUser}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'pricing' && <PricingView showToast={showToast} />}

        {activeTab === 'progress' && <ProgressView />}
      </main>

      {/* Auth Modal for Student Accounts */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        currentUser={currentUser}
        userProfile={userProfile}
      />
    </div>
  );
}
