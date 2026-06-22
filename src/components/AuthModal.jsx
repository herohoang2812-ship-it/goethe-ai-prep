import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Sparkles, X, LogOut } from 'lucide-react';
import { signUpWithEmail, signInWithEmail, signInWithGoogle, resetPassword, signOutUser } from '../services/authService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, currentUser, userProfile }) {
  const [isRegister, setIsRegister] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const getPlanName = (planId) => {
    const map = {
      free: 'Basis (Miễn phí)',
      plus: 'B2 Plus',
      pro: 'B2 Pro (Premium)',
      intensive: 'Intensiv (Nước rút)'
    };
    return map[planId] || 'Basis (Miễn phí)';
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOutUser();
      onClose();
    } catch (err) {
      console.error('[AuthModal] Logout error:', err);
      setError('Lỗi khi đăng xuất.');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          className="modal-content glass-card card-glow" 
          style={{ 
            maxWidth: '420px', 
            width: '100%', 
            position: 'relative', 
            padding: '30px', 
            borderRadius: '20px',
            animation: 'fadeInUp 0.3s ease'
          }}
        >
          <button 
            className="modal-close" 
            onClick={onClose} 
            style={{ position: 'absolute', top: '16px', right: '16px', border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div 
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                color: '#ffffff', 
                display: 'grid', 
                placeItems: 'center',
                margin: '0 auto 12px',
                fontSize: '24px',
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              {userProfile?.name ? userProfile.name.trim().charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
              {userProfile?.name || 'Học viên Goethe'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {currentUser.email}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {/* Plan and Level */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gói cước</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)' }}>
                  {getPlanName(userProfile?.subscription?.planId)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cấp độ học</div>
                <span className="badge badge-primary" style={{ marginTop: '2px' }}>
                  {userProfile?.level || 'B1'}
                </span>
              </div>
            </div>

            {/* Quotas */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div className="flex-between" style={{ fontSize: '12.5px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Lượt dùng AI (Credits):</span>
                  <strong style={{ color: 'var(--text-main)' }}>
                    {userProfile?.subscription?.planId === 'free' ? 'Học thử miễn phí' : `${userProfile?.quota?.aiCredits ?? 0} lượt`}
                  </strong>
                </div>
                {userProfile?.subscription?.planId && userProfile?.subscription?.planId !== 'free' && (
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(100, ((userProfile?.quota?.aiCredits ?? 0) / (userProfile?.subscription?.planId === 'plus' ? 20 : userProfile?.subscription?.planId === 'pro' ? 60 : 150)) * 100)}%`, 
                      height: '100%', 
                      background: 'var(--primary)' 
                    }}></div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex-between" style={{ fontSize: '12.5px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Số phút phát âm (Speech):</span>
                  <strong style={{ color: 'var(--success)' }}>
                    {userProfile?.subscription?.planId === 'free' ? 'Học thử miễn phí' : `${Math.round(userProfile?.quota?.speechMinutes ?? 0)} phút`}
                  </strong>
                </div>
                {userProfile?.subscription?.planId && userProfile?.subscription?.planId !== 'free' && (
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(100, ((userProfile?.quota?.speechMinutes ?? 0) / (userProfile?.subscription?.planId === 'plus' ? 60 : userProfile?.subscription?.planId === 'pro' ? 180 : 600)) * 100)}%`, 
                      height: '100%', 
                      background: 'var(--success)' 
                    }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handleLogout}
              disabled={loading}
              style={{ width: '100%', borderRadius: '12px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ff4b4b', border: '1px solid rgba(255, 75, 75, 0.2)' }}
            >
              <LogOut size={16} />
              Đăng xuất tài khoản
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isReset) {
        if (!email) throw new Error('Vui lòng nhập Email!');
        await resetPassword(email);
        setSuccessMessage('Yêu cầu khôi phục đã được gửi vào Email của bạn!');
      } else if (isRegister) {
        if (!email || !password || !displayName) throw new Error('Vui lòng điền đầy đủ các thông tin!');
        if (password.length < 6) throw new Error('Mật khẩu phải tối thiểu 6 ký tự!');
        const user = await signUpWithEmail(email, password, displayName);
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      } else {
        if (!email || !password) throw new Error('Vui lòng nhập Email và Mật khẩu!');
        const user = await signInWithEmail(email, password);
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      }
    } catch (err) {
      console.error('[AuthModal] error:', err);
      let friendlyMsg = err.message;
      if (err.code === 'auth/user-not-found') friendlyMsg = 'Tài khoản không tồn tại.';
      if (err.code === 'auth/wrong-password') friendlyMsg = 'Mật khẩu không chính xác.';
      if (err.code === 'auth/email-already-in-use') friendlyMsg = 'Email này đã được đăng ký tài khoản khác.';
      if (err.code === 'auth/invalid-email') friendlyMsg = 'Địa chỉ Email không hợp lệ.';
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (onAuthSuccess) onAuthSuccess(user);
      onClose();
    } catch (err) {
      console.error('[AuthModal] Google Sign-in error:', err);
      setError(err.message || 'Lỗi khi đăng nhập bằng Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="modal-content glass-card card-glow" 
        style={{ 
          maxWidth: '420px', 
          width: '100%', 
          position: 'relative', 
          padding: '30px', 
          borderRadius: '20px',
          animation: 'fadeInUp 0.3s ease'
        }}
      >
        <button 
          className="modal-close" 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', border: 0, background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '14px', 
              background: 'var(--primary-soft)', 
              color: 'var(--primary)', 
              display: 'grid', 
              placeItems: 'center',
              margin: '0 auto 12px'
            }}
          >
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>
            {isReset ? 'Khôi phục mật khẩu' : isRegister ? 'Đăng ký học viên' : 'Đăng nhập Goethe AI-Prep'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {isReset ? 'Nhập email để nhận đường dẫn thay đổi mật khẩu' : 'Đồng bộ tiến độ học tập trên mọi thiết bị'}
          </p>
        </div>

        {error && (
          <div 
            style={{ 
              background: 'rgba(244, 63, 94, 0.1)', 
              color: 'var(--accent)', 
              padding: '10px 14px', 
              borderRadius: '10px', 
              fontSize: '13px', 
              marginBottom: '16px',
              border: '1px solid rgba(244, 63, 94, 0.2)'
            }}
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div 
            style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              color: 'var(--success)', 
              padding: '10px 14px', 
              borderRadius: '10px', 
              fontSize: '13px', 
              marginBottom: '16px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && !isReset && (
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>Họ và tên</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dark)' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nguyễn Văn A" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{ paddingLeft: '38px', borderRadius: '10px' }}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>Địa chỉ Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dark)' }} />
              <input 
                type="email" 
                className="form-control" 
                placeholder="example@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '38px', borderRadius: '10px' }}
                required
              />
            </div>
          </div>

          {!isReset && (
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: 0 }}>Mật khẩu</label>
                {!isRegister && (
                  <button 
                    type="button" 
                    onClick={() => { setIsReset(true); setError(''); setSuccessMessage(''); }}
                    style={{ border: 0, background: 'transparent', fontSize: '11px', color: 'var(--primary)', cursor: 'pointer' }}
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dark)' }} />
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px', borderRadius: '10px' }}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', borderRadius: '10px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
          >
            {loading ? 'Đang xử lý...' : isReset ? 'Gửi yêu cầu' : isRegister ? <><UserPlus size={16} />Đăng ký tài khoản</> : <><LogIn size={16} />Đăng nhập</>}
          </button>
        </form>

        {!isReset && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text-dark)' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              <span style={{ fontSize: '11px', padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hoặc</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            </div>

            <button 
              onClick={handleGoogleSignIn} 
              className="btn btn-secondary" 
              disabled={loading}
              style={{ width: '100%', borderRadius: '10px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Đăng nhập nhanh với Google
            </button>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {isReset ? (
            <button 
              onClick={() => { setIsReset(false); setError(''); setSuccessMessage(''); }}
              style={{ border: 0, background: 'transparent', color: 'var(--primary)', fontWeight: '500', cursor: 'pointer' }}
            >
              Quay lại đăng nhập
            </button>
          ) : isRegister ? (
            <>
              Đã có tài khoản?{' '}
              <button 
                onClick={() => { setIsRegister(false); setError(''); }}
                style={{ border: 0, background: 'transparent', color: 'var(--primary)', fontWeight: '500', cursor: 'pointer' }}
              >
                Đăng nhập ngay
              </button>
            </>
          ) : (
            <>
              Chưa có tài khoản?{' '}
              <button 
                onClick={() => { setIsRegister(true); setError(''); }}
                style={{ border: 0, background: 'transparent', color: 'var(--primary)', fontWeight: '500', cursor: 'pointer' }}
              >
                Đăng ký thành viên
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
