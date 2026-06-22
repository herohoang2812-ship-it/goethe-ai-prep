import { useEffect, useState, useMemo } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { 
  Users, 
  Radio, 
  Sparkles, 
  Clock, 
  Search, 
  Check, 
  X, 
  ShieldAlert, 
  Mail, 
  GraduationCap, 
  Compass, 
  Calendar 
} from 'lucide-react';
import { formatVnd, PRICING_PLANS } from '../data/pricingPlans';

export default function AdminView({ currentUser, showToast }) {
  const [users, setUsers] = useState([]);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCode, setLoadingCode] = useState(null);

  // 1. Lắng nghe real-time danh sách học viên đăng ký
  useEffect(() => {
    if (!db) return;
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (querySnap) => {
      const usersData = [];
      querySnap.forEach((docSnap) => {
        usersData.push({ id: docSnap.id, ...docSnap.data() });
      });
      setUsers(usersData);
    }, (error) => {
      console.error('[AdminView] Lỗi load danh sách học viên:', error);
      showToast?.('Quyền đọc dữ liệu bị từ chối hoặc tài khoản không phải Admin.', 'error');
    });

    return () => unsubscribe();
  }, [showToast]);

  // 2. Lắng nghe real-time hàng chờ duyệt nâng cấp (chờ thanh toán thủ công)
  useEffect(() => {
    if (!db) return;
    const sessionsRef = collection(db, 'payment_sessions');
    const pendingQuery = query(sessionsRef, where('status', '==', 'pending_approval'));
    
    const unsubscribe = onSnapshot(pendingQuery, (querySnap) => {
      const sessionsData = [];
      querySnap.forEach((docSnap) => {
        sessionsData.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sắp xếp các phiên mới nhất lên đầu
      sessionsData.sort((a, b) => {
        const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setPendingSessions(sessionsData);
    }, (error) => {
      console.error('[AdminView] Lỗi load hàng chờ thanh toán:', error);
    });

    return () => unsubscribe();
  }, []);

  // 3. Tính toán các thống kê thời gian thực
  const stats = useMemo(() => {
    const totalStudents = users.length;
    const now = Date.now();
    
    // Học viên hoạt động trong 24 giờ qua (DAU)
    const activeToday = users.filter(user => {
      if (!user.lastActiveAt) return false;
      const lastActive = new Date(user.lastActiveAt).getTime();
      return now - lastActive < 24 * 60 * 60 * 1000;
    }).length;

    // Học viên đang Online (hoạt động trong 15 phút qua)
    const onlineNow = users.filter(user => {
      if (!user.lastActiveAt) return false;
      const lastActive = new Date(user.lastActiveAt).getTime();
      return now - lastActive < 15 * 60 * 1000;
    }).length;

    return { totalStudents, activeToday, onlineNow };
  }, [users]);

  // 4. Gọi API duyệt hoặc từ chối gói cước
  const handleAdminAction = async (orderCode, action) => {
    if (!currentUser) return;
    setLoadingCode(orderCode);
    try {
      const response = await fetch('/api/admin-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUid: currentUser.uid,
          action,
          orderCode
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi xử lý duyệt cước');
      }

      if (action === 'approve') {
        showToast?.(`Đã duyệt nâng cấp gói cước thành công đơn hàng #${orderCode}!`, 'success');
      } else {
        showToast?.(`Đã từ chối và hủy đơn hàng #${orderCode}.`, 'warning');
      }
    } catch (err) {
      console.error('[AdminView] Lỗi duyệt gói cước:', err);
      showToast?.(err.message || 'Không thể kết nối máy chủ quản trị.', 'error');
    } finally {
      setLoadingCode(null);
    }
  };

  // 5. Lọc học viên theo ô tìm kiếm
  const filteredUsers = users.filter(user => {
    const queryStr = searchQuery.toLowerCase().trim();
    if (!queryStr) return true;
    const name = (user.name || '').toLowerCase();
    const email = (user.email || user.id || '').toLowerCase();
    return name.includes(queryStr) || email.includes(queryStr);
  });

  const getPlanLabel = (planId) => {
    const found = PRICING_PLANS.find(p => p.id === planId);
    return found ? found.name : planId;
  };

  return (
    <div className="page-section admin-dashboard-page">
      <header className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <span className="badge badge-primary"><ShieldAlert size={13}/> Trung tâm Quản trị</span>
          <h1 className="content-title">Hệ thống Quản lý Goethe AI Prep</h1>
          <p className="content-subtitle">Bảng theo dõi học viên và duyệt nâng cấp gói cước thời gian thực.</p>
        </div>
      </header>

      {/* === THẺ THỐNG KÊ (STATS CARDS) === */}
      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <article className="glass-panel panel admin-stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div className="admin-stat-icon" style={{ display: 'grid', placeItems: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', color: 'rgb(99,102,241)' }}>
            <Users size={22} />
          </div>
          <div>
            <h3 style={{ margin: '0', fontSize: '13px', color: 'var(--text-muted)' }}>Tổng học viên đăng ký</h3>
            <strong style={{ display: 'block', fontSize: '28px', marginTop: '4px' }}>{stats.totalStudents}</strong>
          </div>
        </article>

        <article className="glass-panel panel admin-stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div className="admin-stat-icon" style={{ display: 'grid', placeItems: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(14,165,233,0.1)', color: 'rgb(14,165,233)' }}>
            <Clock size={22} />
          </div>
          <div>
            <h3 style={{ margin: '0', fontSize: '13px', color: 'var(--text-muted)' }}>Hoạt động hôm nay (DAU)</h3>
            <strong style={{ display: 'block', fontSize: '28px', marginTop: '4px' }}>{stats.activeToday}</strong>
          </div>
        </article>

        <article className="glass-panel panel admin-stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div className="admin-stat-icon" style={{ display: 'grid', placeItems: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', color: 'rgb(34,197,94)' }}>
            <Radio size={22} className="qr-status-dot" style={{ background: 'transparent' }} />
          </div>
          <div>
            <h3 style={{ margin: '0', fontSize: '13px', color: 'var(--text-muted)' }}>Học viên đang Online</h3>
            <strong style={{ display: 'block', fontSize: '28px', marginTop: '4px', color: 'var(--success)' }}>{stats.onlineNow}</strong>
          </div>
        </article>
      </div>

      {/* === HÀNG CHỜ DUYỆT (APPROVAL QUEUE) === */}
      <section className="glass-panel panel admin-section" style={{ marginBottom: '32px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          <h2 style={{ margin: '0', fontSize: '18px' }}>Yêu cầu nâng cấp chờ duyệt ({pendingSessions.length})</h2>
        </div>

        {pendingSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
            <p style={{ margin: '0', fontSize: '14px' }}>Hiện tại không có yêu cầu nâng cấp nào đang chờ xử lý.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 8px' }}>Học viên</th>
                  <th style={{ padding: '12px 8px' }}>Gói đăng ký</th>
                  <th style={{ padding: '12px 8px' }}>Số tiền</th>
                  <th style={{ padding: '12px 8px' }}>Mã Chuyển khoản</th>
                  <th style={{ padding: '12px 8px' }}>Thời gian gửi</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingSessions.map(session => (
                  <tr key={session.orderCode} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px 8px' }}>
                      <strong style={{ display: 'block' }}>{session.name || 'Học viên'}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{session.email || 'N/A'}</span>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <span className="badge badge-primary">{getPlanLabel(session.planId)}</span>
                      <small style={{ marginLeft: '6px', color: 'var(--text-muted)' }}>
                        ({session.billing === 'annual' ? 'Năm' : 'Tháng'})
                      </small>
                    </td>
                    <td style={{ padding: '16px 8px', fontWeight: '600' }}>{formatVnd(session.amount)}₫</td>
                    <td style={{ padding: '16px 8px' }}>
                      <code style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontWeight: '700', color: 'var(--success)' }}>
                        GT {session.orderCode}
                      </code>
                    </td>
                    <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>
                      {session.createdAt?.seconds 
                        ? new Date(session.createdAt.seconds * 1000).toLocaleString('vi-VN') 
                        : new Date(session.createdAt).toLocaleString('vi-VN')
                      }
                    </td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '12px', gap: '4px', background: 'var(--success)', borderColor: 'var(--success)', color: '#fff' }}
                          disabled={loadingCode !== null}
                          onClick={() => handleAdminAction(session.orderCode, 'approve')}
                        >
                          <Check size={13} />
                          {loadingCode === session.orderCode ? 'Đang duyệt...' : 'Duyệt'}
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '6px 12px', fontSize: '12px', gap: '4px', borderColor: 'var(--warning)', color: 'var(--warning)', background: 'transparent' }}
                          disabled={loadingCode !== null}
                          onClick={() => handleAdminAction(session.orderCode, 'reject')}
                        >
                          <X size={13} />
                          Hủy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* === DANH BẠ HỌC VIÊN (STUDENT DIRECTORY) === */}
      <section className="glass-panel panel admin-section" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} style={{ color: 'var(--primary)' }} />
            <h2 style={{ margin: '0', fontSize: '18px' }}>Danh bạ học viên ({filteredUsers.length})</h2>
          </div>
          
          <div className="search-wrapper" style={{ position: 'relative', width: 'min(300px, 100%)' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc Email..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', fontSize: '13px', color: 'var(--text)' }}
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
            <p style={{ margin: '0', fontSize: '14px' }}>Không tìm thấy học viên nào phù hợp.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 8px' }}>Học viên</th>
                  <th style={{ padding: '12px 8px' }}>Trình độ / Ngành</th>
                  <th style={{ padding: '12px 8px' }}>Gói cước</th>
                  <th style={{ padding: '12px 8px' }}>Hoạt động cuối</th>
                  <th style={{ padding: '12px 8px' }}>Ngày gia nhập</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const isOnline = user.lastActiveAt && (Date.now() - new Date(user.lastActiveAt).getTime() < 15 * 60 * 1000);
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ position: 'relative' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>
                              {(user.name || 'H').slice(0, 1)}
                            </div>
                            {isOnline && (
                              <div style={{ position: 'absolute', right: '-2px', bottom: '-2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--bg-color)' }} />
                            )}
                          </div>
                          <div>
                            <strong style={{ display: 'block' }}>{user.name || 'Học viên'}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={10} /> {user.email || user.id || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <GraduationCap size={12} /> {user.level || 'B1'}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <Compass size={12} /> {user.specialty === 'pflege' ? 'Điều dưỡng' : 'Nhà hàng'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <span className={`badge ${user.subscription?.planId && user.subscription.planId !== 'free' ? 'badge-primary' : ''}`}>
                          {getPlanLabel(user.subscription?.planId || 'free')}
                        </span>
                        {user.subscription?.planId && user.subscription.planId !== 'free' && (
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Hạn đến: {new Date(user.subscription.endDate).toLocaleDateString('vi-VN')}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        {isOnline ? (
                          <span style={{ color: 'var(--success)', fontWeight: '600' }}>Đang Online</span>
                        ) : user.lastActiveAt ? (
                          new Date(user.lastActiveAt).toLocaleString('vi-VN')
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 8px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
