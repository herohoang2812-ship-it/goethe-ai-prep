import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  PenTool, 
  Mic, 
  GraduationCap, 
  CheckCircle2, 
  Play, 
  AlertCircle, 
  ChevronRight,
  User,
  Settings,
  X,
  ClipboardCheck
} from 'lucide-react';
import { getDiagnosticResult } from '../utils/diagnosticEngine';
import { loadPiper, checkPiperStatus, isPiperLoaded } from '../services/ttsService';
import { updateUserProfileOnDb } from '../services/dbService';

export default function DashboardView({ setActiveTab, userStreak, userProfile, setUserProfile, currentUser, onAuthClick }) {
  const [stats, setStats] = useState({
    predictedScore: '76/100',
    essaysCount: '0 bài',
    speakingFluency: '0%',
    streak: '0 ngày'
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [diagnostic, setDiagnostic] = useState(() => getDiagnosticResult());
  const [editForm, setEditForm] = useState({
    name: userProfile?.name || 'Nguyễn Văn Minh',
    level: userProfile?.level || 'B1',
    specialty: userProfile?.specialty || 'pflege'
  });

  // TTS configurations state
  const [ttsProvider, setTtsProvider] = useState(() => localStorage.getItem('goethe_tts_provider') || 'google');
  const [piperStatus, setPiperStatus] = useState('not_loaded');
  const [piperProgress, setPiperProgress] = useState(0);
  const [piperProgressMsg, setPiperProgressMsg] = useState('Chưa tải gói ngôn ngữ.');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  useEffect(() => {
    const update = () => setDiagnostic(getDiagnosticResult());
    window.addEventListener('goethe-progress-updated', update);
    return () => window.removeEventListener('goethe-progress-updated', update);
  }, []);

  useEffect(() => {
    if (isPiperLoaded()) {
      setPiperStatus('cached');
    }
  }, []);

  const handleTtsProviderChange = (val) => {
    setTtsProvider(val);
    localStorage.setItem('goethe_tts_provider', val);
    if (val === 'piper') {
      checkPiperStatus((status, msg) => {
        setPiperStatus(status);
        if (status === 'ready' || status === 'cached') {
          setPiperStatus('ready');
        }
        if (status === 'error') {
          setPiperProgressMsg(msg || 'Lỗi không xác định.');
        }
      });
    }
  };

  const handleStartDownloadPiper = () => {
    setPiperStatus('downloading');
    setPiperProgress(0);
    setPiperProgressMsg('Đang bắt đầu tải...');
    loadPiper(
      (percent, msg) => {
        setPiperProgress(percent);
        setPiperProgressMsg(msg);
      },
      (status, msg) => {
        setPiperStatus(status);
        if (status === 'ready') {
          setPiperStatus('ready');
        }
        if (status === 'error') {
          setPiperProgressMsg(msg || 'Lỗi tải mô hình.');
        }
      }
    );
  };

  const getPiperStatusText = () => {
    switch (piperStatus) {
      case 'not_loaded': return 'Chưa tải';
      case 'cached': return 'Đã tải (Chưa kích hoạt)';
      case 'downloading': return 'Đang tải về máy...';
      case 'initializing': return 'Đang khởi tạo...';
      case 'ready': return 'Sẵn sàng (Offline)';
      case 'error': return 'Lỗi tải về';
      default: return 'Chưa tải';
    }
  };

  // Map specialty ID to display name in Vietnamese
  const getSpecialtyName = (id) => {
    const map = {
      pflege: 'Điều dưỡng (Pflege)',
      gastro: 'Nhà hàng - Khách sạn (Gastro)',
      kfz: 'Cơ khí - Điện tử (KFZ)',
      allgemein: 'Công sở & Giao tiếp (Beruf)',
      medizin: 'Y tế - Bệnh viện (Medizin)',
      wohnen: 'Nhà ở - Thuê nhà (Wohnen)',
      umwelt: 'Môi trường (Umwelt)'
    };
    return map[id] || id;
  };

  useEffect(() => {
    // 1. Get writing history
    const writingHistoryRaw = localStorage.getItem('goethe_schreiben_history');
    const writingHistory = writingHistoryRaw ? JSON.parse(writingHistoryRaw) : [];
    
    // 2. Get speaking history
    const speakingHistoryRaw = localStorage.getItem('goethe_sprechen_history');
    const speakingHistory = speakingHistoryRaw ? JSON.parse(speakingHistoryRaw) : [];

    // Calculate average writing score
    let avgWriting = 0;
    if (writingHistory.length > 0) {
      const sum = writingHistory.reduce((acc, curr) => acc + Number(curr.result?.score ?? curr.score ?? 0), 0);
      avgWriting = sum / writingHistory.length;
    }

    // Calculate average speaking score and fluency
    let avgSpeaking = 0;
    let avgFluency = 0;
    if (speakingHistory.length > 0) {
      const sumSpeaking = speakingHistory.reduce((acc, curr) => {
        const itemAvg = (curr.fluency + curr.grammar + curr.vocabulary) / 3;
        return acc + itemAvg;
      }, 0);
      avgSpeaking = sumSpeaking / speakingHistory.length;

      const sumFluency = speakingHistory.reduce((acc, curr) => acc + curr.fluency, 0);
      avgFluency = sumFluency / speakingHistory.length;
    }

    // Calculate overall predicted score
    let predicted = 0;
    if (avgWriting > 0 && avgSpeaking > 0) {
      predicted = Math.round((avgWriting + avgSpeaking) / 2);
    } else if (avgWriting > 0) {
      predicted = Math.round(avgWriting);
    } else if (avgSpeaking > 0) {
      predicted = Math.round(avgSpeaking);
    }

    setStats({
      predictedScore: `${diagnostic?.overall ?? predicted}/100`,
      essaysCount: `${writingHistory.length} bài`,
      speakingFluency: avgFluency > 0 ? `${Math.round(avgFluency)}%` : '72%', 
      streak: `${userStreak || 0} ngày`
    });
  }, [userStreak, diagnostic]);

  const handleOpenModal = () => {
    setEditForm({
      name: userProfile.name,
      level: userProfile.level,
      specialty: userProfile.specialty
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      alert('Vui lòng điền tên hợp lệ!');
      return;
    }
    const updatedProfile = { 
      ...userProfile,
      name: editForm.name,
      level: editForm.level,
      specialty: editForm.specialty
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('goethe_user_profile', JSON.stringify(updatedProfile));
    
    if (currentUser) {
      try {
        await updateUserProfileOnDb(currentUser.uid, {
          name: editForm.name,
          level: editForm.level,
          specialty: editForm.specialty
        });
      } catch (err) {
        console.error('[DashboardView] Lỗi cập nhật hồ sơ trên Firestore:', err);
      }
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="page-section">
      <div className="content-header">
        <div>
          <h1 className="content-title">Trung tâm học tập AI</h1>
          <p className="content-subtitle">
            Lộ trình được may đo riêng cho kỳ thi Goethe {userProfile.level} {getSpecialtyName(userProfile.specialty)} của bạn.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary flex-row gap-xs" 
            onClick={handleOpenModal}
            style={{ borderRadius: '12px', padding: '8px 16px', fontSize: '13px' }}
          >
            <Settings size={14} />
            Hồ sơ của tôi
          </button>
          
          <div className="badge badge-success">
            <Sparkles size={12} />
            AI Phân tích: Sẵn sàng
          </div>
        </div>
      </div>
      
      {/* Stat Cards Row */}
      <div className="dashboard-grid" style={{ marginBottom: '28px' }}>
        {[
          { icon: TrendingUp, value: stats.predictedScore, label: `Điểm Dự Phóng ${diagnostic ? 'B2' : userProfile.level}`, iconClass: 'stat-icon-purple', delay: '1' },
          { icon: PenTool, value: stats.essaysCount, label: 'Bài viết đã chấm', iconClass: 'stat-icon-cyan', delay: '2' },
          { icon: Mic, value: stats.speakingFluency, label: 'Mạch lạc khi Nói', iconClass: 'stat-icon-green', delay: '3' },
          { icon: GraduationCap, value: stats.streak, label: 'Chuỗi học tập', iconClass: 'stat-icon-amber', delay: '4' },
        ].map((stat, idx) => (
          <div key={idx} className={`col-3 glass-panel stat-card glass-panel-hover anim-fade-in-up anim-delay-${stat.delay}`}>
            <div className={`stat-icon ${stat.iconClass}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <section className={`glass-panel panel dashboard-diagnostic-banner ${diagnostic ? 'has-result' : ''}`} style={{ marginBottom: '28px' }}>
        <div className="dashboard-diagnostic-icon"><ClipboardCheck size={24}/></div>
        <div className="dashboard-diagnostic-copy">
          <span className="badge badge-primary">Diagnostic B2</span>
          <h3>{diagnostic ? `Điểm xuất phát: ${diagnostic.overall}/100` : 'Chưa có hồ sơ năng lực đầu vào'}</h3>
          <p className="text-muted">{diagnostic ? `Ưu tiên hiện tại: ${diagnostic.weakest[0].skill} (${diagnostic.weakest[0].score}%). Lộ trình 30/60/90 ngày đã sẵn sàng.` : 'Làm bài chẩn đoán bốn kỹ năng để app ngừng đoán mò và xây lộ trình đúng điểm yếu của bạn.'}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('diagnostic')}>{diagnostic ? 'Xem lộ trình' : 'Bắt đầu diagnostic'}<ChevronRight size={15}/></button>
      </section>
      {/* Dashboard Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Learning Roadmap */}
        <div className="col-8 glass-panel glass-card-accent panel-lg anim-fade-in-up anim-delay-3">
          <h3 className="section-title">Lộ trình ôn thi Goethe {userProfile.level} của bạn</h3>
          
          <div className="flex-col">
            <div className="roadmap-step">
              <div className="roadmap-icon roadmap-icon-done">
                <CheckCircle2 size={16} />
              </div>
              <div className="roadmap-body">
                <div className="roadmap-title">Module 1: Từ vựng chuyên ngành cơ bản</div>
                <div className="roadmap-desc">
                  Đã làm quen với từ vựng về {getSpecialtyName(userProfile.specialty)}. Hoàn thành ôn tập SRS và trắc nghiệm.
                </div>
              </div>
              <div className="badge badge-success">Đã xong</div>
            </div>
            
            <div className="roadmap-step">
              <div className="roadmap-icon roadmap-icon-active">
                <Play size={14} />
              </div>
              <div className="roadmap-body">
                <div className="roadmap-title">Module 2: Đề viết Schreiben Teil 1</div>
                <div className="roadmap-desc">Luyện viết đề tài tương ứng cấp độ {userProfile.level} với chấm điểm AI thực tế.</div>
              </div>
              <div className="badge badge-primary">Đang làm</div>
            </div>
            
            <div className="roadmap-step roadmap-locked">
              <div className="roadmap-icon roadmap-icon-locked">
                <AlertCircle size={16} />
              </div>
              <div className="roadmap-body">
                <div className="roadmap-title">Module 3: Đàm thoại Nói Sprechen với AI</div>
                <div className="roadmap-desc">Luyện thuyết trình hoặc đàm thoại kế hoạch và nhận sửa lỗi trực tiếp.</div>
              </div>
              <div className="badge badge-secondary">Khóa</div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights & Quotas */}
        <div className="col-4 flex-col gap-md">
          {/* AI Insights Card */}
          <div className="glass-panel panel-lg flex-col anim-fade-in-up anim-delay-4" style={{ justifyContent: 'stretch', flex: 1 }}>
            <h3 className="section-title">
              <Sparkles className="text-primary" size={18} />
              Gợi ý từ AI
            </h3>
            <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              Hệ thống phân tích khuyên bạn nên làm quen với các mẫu câu đặc trưng (Redemittel) của trình độ <strong style={{ color: 'var(--primary)' }}>{userProfile.level}</strong> chuyên ngành <strong style={{ color: 'var(--primary)' }}>{getSpecialtyName(userProfile.specialty)}</strong> để nâng cao band điểm nhanh nhất.
            </p>
            
            <div className="ai-insight-box" style={{ marginBottom: '20px' }}>
              <div className="ai-insight-label">Đề xuất hành động</div>
              <div className="ai-insight-text">Luyện viết một đề viết mới và áp dụng tối thiểu 3 câu mẫu Redemittel hữu ích.</div>
            </div>

            <button className="btn btn-primary mt-auto" onClick={() => setActiveTab('schreiben')} aria-label="Đi đến luyện viết">
              Luyện Viết Ngay
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Account Status and Quotas Card */}
          <div className="glass-panel panel-lg flex-col anim-fade-in-up anim-delay-5">
            <h3 className="section-title">
              <User className="text-primary" size={18} />
              Tài khoản & Hạn mức
            </h3>
            
            {currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                <div className="flex-between">
                  <span className="text-muted" style={{ fontSize: '13px' }}>Gói hiện tại:</span>
                  <span className="badge badge-success" style={{ fontWeight: '700' }}>
                    {userProfile.subscription?.planId === 'free' ? 'Basis (Miễn phí)' : 
                     userProfile.subscription?.planId === 'plus' ? 'B2 Plus' : 
                     userProfile.subscription?.planId === 'pro' ? 'B2 Pro (Premium)' : 
                     userProfile.subscription?.planId === 'intensive' ? 'Intensiv (Nước rút)' : 'Basis (Miễn phí)'}
                  </span>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <div className="flex-between" style={{ marginBottom: '6px', fontSize: '13px' }}>
                    <span>Lượt dùng AI (Credits):</span>
                    <strong style={{ color: 'var(--primary)' }}>
                      {userProfile.subscription?.planId === 'free' ? 'Học thử miễn phí' : `${userProfile.quota?.aiCredits ?? 0} lượt`}
                    </strong>
                  </div>
                  {userProfile.subscription?.planId && userProfile.subscription?.planId !== 'free' && (
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min(100, ((userProfile.quota?.aiCredits ?? 0) / (userProfile.subscription?.planId === 'plus' ? 20 : userProfile.subscription?.planId === 'pro' ? 60 : 150)) * 100)}%`, 
                        height: '100%', 
                        background: 'var(--primary)' 
                      }}></div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex-between" style={{ marginBottom: '6px', fontSize: '13px' }}>
                    <span>Số phút phát âm (Speech):</span>
                    <strong style={{ color: 'var(--success)' }}>
                      {userProfile.subscription?.planId === 'free' ? 'Học thử miễn phí' : `${Math.round(userProfile.quota?.speechMinutes ?? 0)} phút`}
                    </strong>
                  </div>
                  {userProfile.subscription?.planId && userProfile.subscription?.planId !== 'free' && (
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min(100, ((userProfile.quota?.speechMinutes ?? 0) / (userProfile.subscription?.planId === 'plus' ? 60 : userProfile.subscription?.planId === 'pro' ? 180 : 600)) * 100)}%`, 
                        height: '100%', 
                        background: 'var(--success)' 
                      }}></div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', lineHeight: 1.5, color: '#f59e0b' }}>
                  ⚠️ Bạn đang sử dụng tài khoản Khách. Tiến trình học và kết quả làm bài của bạn chỉ lưu tạm ở trình duyệt này.
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={onAuthClick}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Sparkles size={16} />
                  Đăng ký tài khoản miễn phí
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div 
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="glass-panel panel flex-col anim-fade-in-up"
            style={{
              width: '90%',
              maxWidth: '440px',
              border: '1px solid var(--border-color)',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-dialog-title"
          >
            <button 
              className="btn-text-primary"
              onClick={() => setIsEditModalOpen(false)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} className="text-primary" />
              Thiết lập hồ sơ cá nhân
            </h3>

            <form onSubmit={handleSaveProfile} className="flex-col gap-md">
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" htmlFor="profile-name">Họ và Tên</label>
                <input 
                  type="text" 
                  id="profile-name"
                  className="form-control"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Cấp độ mục tiêu</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['B1', 'B2'].map(lvl => (
                    <label 
                      key={lvl} 
                      style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '10px', 
                        borderRadius: '8px', 
                        border: editForm.level === lvl ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: editForm.level === lvl ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="profile-level" 
                        value={lvl} 
                        checked={editForm.level === lvl}
                        onChange={() => setEditForm(prev => ({ ...prev, level: lvl }))}
                        style={{ display: 'none' }}
                      />
                      Goethe {lvl}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" htmlFor="profile-specialty">Chuyên ngành học tập</label>
                <select 
                  id="profile-specialty"
                  className="form-control"
                  value={editForm.specialty}
                  onChange={(e) => setEditForm(prev => ({ ...prev, specialty: e.target.value }))}
                >
                  <option value="pflege">Điều dưỡng (Pflege)</option>
                  <option value="gastro">Nhà hàng - Khách sạn (Gastro)</option>
                  <option value="kfz">Cơ khí - Điện tử (KFZ)</option>
                  <option value="allgemein">Công sở & Giao tiếp (Beruf)</option>
                  <option value="medizin">Y tế - Bệnh viện (Medizin)</option>
                  <option value="wohnen">Nhà ở - Thuê nhà (Wohnen)</option>
                  <option value="umwelt">Môi trường (Umwelt)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Giọng đọc phát âm (TTS)</label>
                <select 
                  className="form-control"
                  value={ttsProvider}
                  onChange={(e) => handleTtsProviderChange(e.target.value)}
                >
                  <option value="google">Giọng chuẩn Google AI (Online - Khuyên dùng)</option>
                  <option value="piper">Giọng offline Piper TTS (Tải về máy học viên)</option>
                  <option value="system">Giọng hệ thống mặc định (Offline)</option>
                </select>
              </div>

              {ttsProvider === 'piper' && (
                <div className="inner-card" style={{ padding: '12px', marginBottom: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <div className="flex-between" style={{ marginBottom: '6px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: '600' }}>Trạng thái Piper TTS:</span>
                    <span className="badge badge-secondary" style={{ fontSize: '10.5px' }}>{getPiperStatusText()}</span>
                  </div>
                  
                  {(piperStatus === 'not_loaded' || piperStatus === 'error') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      {piperStatus === 'error' && (
                        <p style={{ fontSize: '11px', color: '#ff6b6b', margin: '0 0 4px 0', lineHeight: '1.4', textAlign: 'left' }}>
                          ⚠️ {piperProgressMsg || 'Lỗi tải mô hình. Vui lòng kết nối mạng hoặc thử lại.'}
                        </p>
                      )}
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => setShowConfirmPopup(true)}
                        style={{ width: '100%', fontSize: '12px', padding: '6px' }}
                      >
                        {piperStatus === 'error' ? 'Thử tải lại' : 'Tải gói giọng nói (63MB)'}
                      </button>
                    </div>
                  )}

                  {(piperStatus === 'downloading' || piperStatus === 'initializing') && (
                    <div style={{ marginTop: '6px' }}>
                      <div className="flex-between" style={{ fontSize: '10.5px', marginBottom: '4px' }}>
                        <span className="text-muted" style={{ maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{piperProgressMsg}</span>
                        <span>{piperProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${piperProgress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.15s ease' }}></div>
                      </div>
                    </div>
                  )}

                  {(piperStatus === 'ready' || piperStatus === 'cached') && (
                    <p style={{ fontSize: '11.5px', color: 'var(--success)', margin: 0 }}>✓ Gói giọng nói đã cài đặt và chạy offline trên máy của bạn.</p>
                  )}
                </div>
              )}

              <div className="flex-end gap-md" style={{ marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Piper Confirm Download Popup */}
      {showConfirmPopup && (
        <div 
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div 
            className="glass-panel panel flex-col anim-fade-in-up"
            style={{
              width: '90%',
              maxWidth: '380px',
              border: '1px solid var(--border-color)',
              padding: '20px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ℹ️ Tải gói giọng nói offline
            </h3>
            <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '18px' }}>
              Ứng dụng chuẩn bị tải gói mô hình giọng nói Đức chất lượng cao **Piper (Thorsten de_DE - 63MB)** về trình duyệt của bạn.
              <br /><br />
              💡 **Bạn có thể hoàn toàn an tâm**:
              <br />
              • Gói này chỉ cần **tải 1 lần duy nhất**.
              <br />
              • Dữ liệu mô hình sẽ được **lưu trữ vĩnh viễn vào bộ nhớ cục bộ** máy của bạn (trình duyệt Cache/IndexedDB).
              <br />
              • Ở các lần sau, app sẽ **chạy offline hoàn toàn trên máy bạn** mà không cần tải lại, không tốn dung lượng internet.
            </p>
            <div className="flex-end gap-md">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowConfirmPopup(false)} style={{ fontSize: '12px', padding: '6px 12px' }}>
                Hủy
              </button>
              <button 
                type="button" 
                className="btn btn-primary btn-sm" 
                onClick={() => {
                  setShowConfirmPopup(false);
                  handleStartDownloadPiper();
                }}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Đồng ý tải về
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
