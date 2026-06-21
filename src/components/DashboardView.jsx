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

export default function DashboardView({ setActiveTab, userStreak, userProfile, setUserProfile }) {
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

  useEffect(() => {
    const update = () => setDiagnostic(getDiagnosticResult());
    window.addEventListener('goethe-progress-updated', update);
    return () => window.removeEventListener('goethe-progress-updated', update);
  }, []);

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      alert('Vui lòng điền tên hợp lệ!');
      return;
    }
    const updatedProfile = { ...editForm };
    setUserProfile(updatedProfile);
    localStorage.setItem('goethe_user_profile', JSON.stringify(updatedProfile));
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

        {/* Right Column: AI Insights */}
        <div className="col-4 glass-panel panel-lg flex-col anim-fade-in-up anim-delay-4" style={{ justifyContent: 'stretch' }}>
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

              <div className="form-group" style={{ marginBottom: '20px' }}>
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
    </div>
  );
}
