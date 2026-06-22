import { 
  LayoutDashboard, 
  PenTool, 
  Mic, 
  BookOpen, 
  Compass, 
  GraduationCap,
  Bookmark,
  Sun,
  Moon,
  Headphones,
  Languages,
  BarChart3,
  ClipboardCheck,
  ClipboardList,
  Crown,
  Trophy,
  LogIn,
  LogOut
} from 'lucide-react';
import { signOutUser } from '../services/authService';

export default function Sidebar({ activeTab, handleTabChange, sidebarOpen, setSidebarOpen, theme, toggleTheme, userProfile, currentUser, onAuthClick }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Trung tâm học tập' },
    { id: 'diagnostic', icon: ClipboardCheck, label: 'Diagnostic & Lộ trình', badge: 'B2' },
    { id: 'exam', icon: ClipboardList, label: 'Thi thử (Mock Exam)', badge: 'B1' },
    { id: 'leaderboard', icon: Trophy, label: 'Bảng xếp hạng', badge: 'MỚI' },
    { id: 'schreiben', icon: PenTool, label: 'Luyện Viết (Schreiben)', badge: 'PLUS' },
    { id: 'sprechen', icon: Mic, label: 'Luyện Nói (Sprechen)', badge: 'PLUS' },
    { id: 'horen', icon: Headphones, label: 'Luyện Nghe (Hören)' },
    { id: 'lesen', icon: BookOpen, label: 'Luyện Đọc (Lesen)' },
    { id: 'vocab', icon: Compass, label: 'Từ vựng Chuyên ngành' },
    { id: 'grammar', icon: Bookmark, label: 'Luyện Ngữ pháp' },
    { id: 'languageLab', icon: Languages, label: 'B2 Language Lab', badge: 'NEW' },
    { id: 'progress', icon: BarChart3, label: 'Tiến độ & Sổ lỗi' },
    { id: 'pricing', icon: Crown, label: 'Gói học & Nâng cấp', badge: 'PRO' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* === SIDEBAR NAVIGATION === */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <GraduationCap size={22} />
          </div>
          <span className="sidebar-logo-text">Goethe Prep</span>
        </div>
        
        <nav className="sidebar-menu">
          {navItems.map(item => (
            <button 
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabChange(item.id)}
              aria-label={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="sidebar-item-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Theme Toggle Button */}
          <button 
            className="sidebar-item" 
            onClick={toggleTheme} 
            aria-label="Chuyển đổi giao diện Sáng/Tối"
            style={{ 
              width: '100%', 
              background: 'var(--bg-elevated)', 
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {theme === 'dark' ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
            <span style={{ marginLeft: '12px', fontSize: '14px' }}>
              {theme === 'dark' ? 'Giao diện Sáng' : 'Giao diện Tối'}
            </span>
          </button>

          {/* User profile / Auth Button */}
          {currentUser ? (
            <div className="sidebar-user" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="sidebar-avatar" style={{ background: 'var(--primary)', color: '#ffffff', fontWeight: 'bold' }}>
                  {userProfile?.name ? userProfile.name.trim().charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px', fontWeight: '600' }}>
                    {userProfile?.name || 'Học viên'}
                  </div>
                  <div className="badge badge-primary sidebar-user-level" style={{ fontSize: '9px', padding: '2px 6px', marginTop: '3px' }}>
                    {userProfile?.level || 'B1'} {
                      userProfile?.specialty === 'pflege' ? 'Pflege' :
                      userProfile?.specialty === 'gastro' ? 'Gastro' :
                      userProfile?.specialty === 'kfz' ? 'KFZ' :
                      userProfile?.specialty === 'allgemein' ? 'Beruf' :
                      userProfile?.specialty === 'medizin' ? 'Medizin' :
                      userProfile?.specialty === 'wohnen' ? 'Wohnen' :
                      userProfile?.specialty === 'umwelt' ? 'Umwelt' : userProfile?.specialty || ''
                    }
                  </div>
                </div>
              </div>
              <button 
                onClick={signOutUser}
                title="Đăng xuất"
                style={{ 
                  border: 0, 
                  background: 'transparent', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="hover-bg-elevated"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="sidebar-item" 
              onClick={onAuthClick} 
              style={{ 
                width: '100%', 
                background: 'var(--primary-soft)', 
                border: '1px solid var(--primary)',
                borderRadius: '12px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--primary)',
                fontWeight: '600'
              }}
            >
              <LogIn size={18} />
              <span style={{ marginLeft: '10px', fontSize: '14px' }}>
                Đăng nhập học viên
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
