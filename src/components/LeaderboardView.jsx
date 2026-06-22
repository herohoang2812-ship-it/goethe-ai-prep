import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Crown, Star, BookOpen, Headphones, PenTool, Mic, RefreshCw } from 'lucide-react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../services/firebase';

const skillsList = [
  { id: 'lesen', label: 'Lesen (Đọc)', icon: BookOpen },
  { id: 'hoeren', label: 'Hören (Nghe)', icon: Headphones },
  { id: 'schreiben', label: 'Schreiben (Viết)', icon: PenTool },
  { id: 'sprechen', label: 'Sprechen (Nói)', icon: Mic }
];

// Mock data to enrich leaderboard if database is empty/has few users
const MOCK_LEADERBOARD = [
  { uid: 'mock1', name: 'Lê Minh Đức', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', lesen: 92, hoeren: 88, schreiben: 85, sprechen: 90 },
  { uid: 'mock2', name: 'Trần Thị Lan', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', lesen: 88, hoeren: 95, schreiben: 82, sprechen: 85 },
  { uid: 'mock3', name: 'Nguyễn Hoàng Nam', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', lesen: 85, hoeren: 82, schreiben: 90, sprechen: 88 },
  { uid: 'mock4', name: 'Phạm Hồng Nhung', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', lesen: 80, hoeren: 85, schreiben: 88, sprechen: 82 },
  { uid: 'mock5', name: 'Vũ Quốc Khánh', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', lesen: 78, hoeren: 80, schreiben: 75, sprechen: 88 },
  { uid: 'mock6', name: 'Hoàng Ngọc Mai', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100', lesen: 75, hoeren: 78, schreiben: 80, sprechen: 78 }
];

export default function LeaderboardView({ currentUser, userProfile }) {
  const [activeSkill, setActiveSkill] = useState('lesen');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      if (db) {
        const leaderRef = collection(db, 'leaderboard');
        const q = query(leaderRef, limit(30));
        const querySnapshot = await getDocs(q);
        
        let fetchedUsers = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push(doc.data());
        });

        // Merge real users with mock users to make it look active (avoiding duplicate UIDs)
        const realUids = new Set(fetchedUsers.map(u => u.uid));
        const filteredMock = MOCK_LEADERBOARD.filter(m => !realUids.has(m.uid));
        
        // Combine and save
        setLeaderboardData([...fetchedUsers, ...filteredMock]);
      } else {
        setLeaderboardData(MOCK_LEADERBOARD);
      }
    } catch (err) {
      console.error('[LeaderboardView] Lỗi tải bảng xếp hạng:', err);
      // Fallback to mock data if Firestore fetch fails
      setLeaderboardData(MOCK_LEADERBOARD);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Sort current dataset based on activeSkill descending
  const sortedData = [...leaderboardData].sort((a, b) => {
    const scoreA = a[activeSkill] ?? 0;
    const scoreB = b[activeSkill] ?? 0;
    return scoreB - scoreA;
  });

  const getRankBadge = (rank) => {
    if (rank === 1) return <Crown size={18} style={{ color: '#fbbf24' }} />; // Gold
    if (rank === 2) return <Medal size={18} style={{ color: '#94a3b8' }} />; // Silver
    if (rank === 3) return <Award size={18} style={{ color: '#b45309' }} />; // Bronze
    return <span className="rank-number-text">{rank}</span>;
  };

  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[parts.length - 2].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="page-section">
      {/* Header */}
      <div className="content-header flex-between" style={{ gap: '16px' }}>
        <div>
          <h1 className="content-title flex-row gap-sm">
            <Trophy className="text-primary" size={26} />
            Bảng xếp hạng Goethe Prep
          </h1>
          <p className="content-subtitle">
            Thi đua học tập cùng các học viên tiếng Đức trên hệ thống qua 4 kỹ năng chính.
          </p>
        </div>
        <button 
          className="btn btn-secondary flex-row gap-xs" 
          onClick={() => fetchLeaderboard(true)}
          disabled={refreshing || loading}
          style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '13px' }}
        >
          <RefreshCw className={refreshing ? 'spin-slow' : ''} size={14} />
          Làm mới
        </button>
      </div>

      {/* Main Container */}
      <div className="dashboard-grid">
        {/* Left Column: Skill selector tabs */}
        <div className="col-4 flex-col gap-sm">
          <div className="glass-panel panel anim-slide-left">
            <h3 style={{ fontSize: '15px', marginBottom: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
              Kỹ năng thi đua
            </h3>
            <div className="flex-col gap-sm">
              {skillsList.map((skill) => {
                const isActive = activeSkill === skill.id;
                const Icon = skill.icon;
                return (
                  <button
                    key={skill.id}
                    className={`redemittel-card ${isActive ? 'active-history-card' : ''}`}
                    onClick={() => setActiveSkill(skill.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      textAlign: 'left',
                      border: 0,
                      padding: '14px',
                      cursor: 'pointer',
                      borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                      background: isActive ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-muted'} />
                    <span style={{ fontSize: '13.5px', fontWeight: isActive ? '600' : '500', color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {skill.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current User Card */}
          {currentUser && (
            <div className="glass-panel panel anim-slide-left flex-col gap-sm" style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <h4 style={{ fontSize: '13.5px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={14} />
                Thành tích của bạn
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                {userProfile?.avatarUrl ? (
                  <img 
                    src={userProfile.avatarUrl} 
                    alt={userProfile.name} 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--primary)' }} 
                  />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-gradient)', color: '#ffffff', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                    {getAvatarInitials(userProfile?.name)}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-main)' }}>{userProfile?.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hạng thử miễn phí ({userProfile?.level})</span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', textAlign: 'center' }}>
                {skillsList.map(s => {
                  const myScores = leaderboardData.find(u => u.uid === currentUser.uid) || {};
                  const scoreVal = myScores[s.id] ?? 0;
                  return (
                    <div key={s.id}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.id}</div>
                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: s.id === activeSkill ? 'var(--primary)' : 'var(--text-main)' }}>{scoreVal}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Standings list */}
        <div className="col-8">
          <div className="glass-panel panel-lg anim-fade-in-up" style={{ minHeight: '380px' }}>
            {loading ? (
              <div style={{ display: 'grid', placeItems: 'center', height: '300px', color: 'var(--text-muted)' }}>
                <div className="flex-col gap-sm" style={{ alignItems: 'center' }}>
                  <RefreshCw className="spin-slow text-primary" size={32} />
                  <span>Đang tải bảng xếp hạng...</span>
                </div>
              </div>
            ) : sortedData.length === 0 ? (
              <div style={{ display: 'grid', placeItems: 'center', height: '300px', color: 'var(--text-muted)' }}>
                Chưa có học viên nào tham gia xếp hạng. Hãy là người đầu tiên!
              </div>
            ) : (
              <div className="flex-col gap-sm">
                {/* Standings Header */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span style={{ width: '40px', textAlign: 'center' }}>Hạng</span>
                  <span style={{ flex: 1, paddingLeft: '12px' }}>Học viên</span>
                  <span style={{ width: '100px', textAlign: 'right' }}>Điểm trung bình</span>
                </div>

                {/* Standings List */}
                <div className="flex-col gap-sm" style={{ maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
                  {sortedData.map((user, idx) => {
                    const rank = idx + 1;
                    const isCurrentUser = currentUser && user.uid === currentUser.uid;
                    const skillScore = user[activeSkill] ?? 0;
                    
                    return (
                      <div
                        key={user.uid}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px',
                          borderRadius: '12px',
                          background: isCurrentUser ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                          border: isCurrentUser ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--border-color)',
                          transition: 'transform 0.2s ease, background 0.2s ease',
                        }}
                        className="glass-panel-hover"
                      >
                        {/* Rank */}
                        <div style={{ 
                          width: '40px', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          fontWeight: '700',
                          fontSize: '14px',
                          color: rank <= 3 ? 'var(--text-main)' : 'var(--text-muted)'
                        }}>
                          {getRankBadge(rank)}
                        </div>

                        {/* Avatar & Name */}
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px' }}>
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              referrerPolicy="no-referrer"
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: rank <= 3 ? '1.5px solid var(--primary)' : '1px solid var(--border-color)' }}
                            />
                          ) : (
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              background: rank === 1 ? 'linear-gradient(135deg, #fcd34d, #fbbf24)' : 
                                          rank === 2 ? 'linear-gradient(135deg, #cbd5e1, #94a3b8)' : 
                                          rank === 3 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 
                                          'rgba(255, 255, 255, 0.05)',
                              color: rank <= 3 ? '#1e1b4b' : 'var(--text-main)', 
                              display: 'grid', 
                              placeItems: 'center', 
                              fontWeight: 'bold', 
                              fontSize: '11px' 
                            }}>
                              {getAvatarInitials(user.name)}
                            </div>
                          )}

                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ 
                              fontSize: '13.5px', 
                              fontWeight: isCurrentUser || rank <= 3 ? '600' : '500',
                              color: isCurrentUser ? 'var(--primary)' : 'var(--text-main)'
                            }}>
                              {user.name}
                              {isCurrentUser && <span style={{ marginLeft: '6px', fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'var(--primary)', color: '#ffffff', fontWeight: 'bold' }}>BẠN</span>}
                            </span>
                          </div>
                        </div>

                        {/* Score */}
                        <div style={{ width: '100px', textAlign: 'right', fontWeight: '700', fontSize: '15px', color: rank <= 3 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          <span style={{ color: skillScore >= 60 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {skillScore}
                          </span>
                          <span style={{ fontSize: '10px', fontWeight: 'normal', color: 'var(--text-muted)', marginLeft: '2px' }}>/100</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
