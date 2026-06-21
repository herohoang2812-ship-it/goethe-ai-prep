import { useState, useCallback, useEffect } from 'react';
import { Menu } from 'lucide-react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('goethe_user_streak')) || 0);
  const [theme, setTheme] = useState(localStorage.getItem('goethe_theme') || 'dark');
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

  const triggerStudyActivity = useCallback(() => {
    const now = new Date();
    const key = (date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
    const today = key(now);
    const last = localStorage.getItem('goethe_last_study_date');
    if (last === today) return;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const next = last === key(yesterday) ? (Number(localStorage.getItem('goethe_user_streak')) || 0) + 1 : 1;
    localStorage.setItem('goethe_user_streak', String(next));
    localStorage.setItem('goethe_last_study_date', today);
    setStreak(next);
    showToast('Tuyệt vời! Chuỗi ngày học tập của bạn đã tăng lên!', 'success');
  }, [showToast]);
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
        <div style={{ width: '40px' }}></div>
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
      />

      {/* === MAIN CONTENT === */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardView 
            setActiveTab={handleTabChange} 
            userStreak={streak} 
            userProfile={userProfile} 
            setUserProfile={setUserProfile} 
          />
        )}

        {activeTab === 'schreiben' && (
          <SchreibenView showToast={showToast} onActivityComplete={triggerStudyActivity} />
        )}

        {activeTab === 'sprechen' && (
          <SprechenView showToast={showToast} onActivityComplete={triggerStudyActivity} />
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

        {activeTab === 'pricing' && <PricingView showToast={showToast} />}

        {activeTab === 'progress' && <ProgressView />}
      </main>
    </div>
  );
}
