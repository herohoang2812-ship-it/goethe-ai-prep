import { useMemo, useState, useEffect } from 'react';
import { BadgeCheck, Check, ChevronRight, CircleDollarSign, Copy, Info, LockKeyhole, ShieldCheck, Sparkles, X } from 'lucide-react';
import { BILLING_DISCOUNT, formatVnd, getPlanPrice, PRICING_PLANS } from '../data/pricingPlans';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function PricingView({ showToast, currentUser, userProfile, onAuthClick }) {
  const [billing, setBilling] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const annualSaving = Math.round(BILLING_DISCOUNT * 100);
  const pendingPlan = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('goethe_pending_subscription') || 'null'); } catch { return null; }
  }, []);

  // Lắng nghe sự kiện Firestore realtime khi có activeSession
  useEffect(() => {
    if (!activeSession?.orderCode || !db) return;

    const sessionDocRef = doc(db, 'payment_sessions', String(activeSession.orderCode));
    const unsubscribe = onSnapshot(sessionDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'completed') {
          // Kích hoạt trạng thái thành công
          setIsSuccess(true);
          showToast?.('Nâng cấp tài khoản thành công! Cảm ơn bạn đã đồng hành cùng Goethe AI Prep.', 'success');
          localStorage.removeItem('goethe_pending_subscription');
          
          // Tự động đóng popup sau 4 giây để học viên trải nghiệm giao diện chúc mừng
          setTimeout(() => {
            setSelectedPlan(null);
            setActiveSession(null);
            setIsSuccess(false);
          }, 4500);
        } else if (data.status === 'amount_mismatch') {
          showToast?.('Số tiền chuyển khoản không khớp. Vui lòng liên hệ bộ phận hỗ trợ học viên.', 'warning');
          setActiveSession(null);
        }
      }
    });

    return () => unsubscribe();
  }, [activeSession?.orderCode, db, showToast]);

  const choosePlan = plan => {
    if (plan.id === 'free') return;
    setSelectedPlan(plan); setAccepted(false);
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    showToast?.(message || 'Đã sao chép vào bộ nhớ tạm!', 'success');
  };

  const handleClose = () => {
    if (loading) return;
    setSelectedPlan(null);
    setActiveSession(null);
    setIsSuccess(false);
  };

  const confirmSelection = async () => {
    if (!accepted || !selectedPlan) return;

    if (!currentUser) {
      showToast?.('Vui lòng đăng nhập tài khoản học viên để thực hiện thanh toán mua gói.', 'warning');
      setSelectedPlan(null);
      onAuthClick?.();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          planId: selectedPlan.id,
          billing
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khởi tạo thanh toán');
      }

      // Lưu lựa chọn chờ xử lý cục bộ
      const pending = {
        planId: selectedPlan.id,
        billing,
        price: getPlanPrice(selectedPlan, billing),
        status: 'pending_payment',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('goethe_pending_subscription', JSON.stringify(pending));
      
      // Thiết lập session thanh toán active để mở QR Code
      setActiveSession(data);
    } catch (error) {
      console.error('[PricingView] Payment Error:', error);
      showToast?.(error.message || 'Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  return <div className="page-section pricing-page">
    <header className="pricing-header">
      <div><span className="badge badge-primary"><Sparkles size={13}/> Premium learning</span><h1 className="content-title">Chọn gói phù hợp với nhịp học</h1><p className="content-subtitle">Nội dung học cốt lõi vẫn miễn phí. Tài khoản trả phí mở chấm bài nâng cao và luyện phát âm theo hạn mức rõ ràng.</p></div>
      <div className="billing-switch" role="tablist" aria-label="Chu kỳ thanh toán"><button className={billing === 'monthly' ? 'active' : ''} onClick={() => setBilling('monthly')}>Theo tháng</button><button className={billing === 'annual' ? 'active' : ''} onClick={() => setBilling('annual')}>Theo năm <span>Tiết kiệm {annualSaving}%</span></button></div>
    </header>

    {pendingPlan && <div className="pending-plan-note"><Info size={16}/><span>Bạn đang có lựa chọn chờ thanh toán: <strong>{PRICING_PLANS.find(plan => plan.id === pendingPlan.planId)?.name}</strong>. Gói chưa được kích hoạt.</span></div>}

    <div className="pricing-grid">{PRICING_PLANS.map(plan => {
      const price = getPlanPrice(plan, billing);
      const annualTotal = price * 12;
      return <article key={plan.id} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
        {plan.featured && <div className="popular-ribbon"><BadgeCheck size={14}/> Được chọn nhiều nhất</div>}
        <div className="pricing-card-top"><span className="pricing-eyebrow">{plan.eyebrow}</span><h2>{plan.name}</h2><p>{plan.description}</p></div>
        <div className="pricing-price"><span className="currency">₫</span><strong>{formatVnd(price)}</strong>{price > 0 && <small>/ tháng</small>}</div>
        <p className="billing-note">{price === 0 ? 'Không yêu cầu thẻ thanh toán' : billing === 'annual' ? `Thanh toán ${formatVnd(annualTotal)}₫ mỗi năm` : 'Thanh toán theo tháng · hủy gia hạn bất kỳ lúc nào'}</p>
        {plan.quota && <div className="plan-quota"><CircleDollarSign size={14}/>{plan.quota}</div>}
        <button className={`pricing-cta ${plan.featured ? 'primary' : ''}`} onClick={() => choosePlan(plan)} disabled={plan.id === 'free' || userProfile?.subscription?.planId === plan.id}>{plan.id === 'free' ? 'Gói cơ bản' : userProfile?.subscription?.planId === plan.id ? 'Gói hiện tại' : 'Chọn gói'}{plan.id !== 'free' && userProfile?.subscription?.planId !== plan.id && <ChevronRight size={16}/>}</button>
        <div className="pricing-divider"/>
        <ul className="pricing-features">{plan.features.map(([feature, included]) => <li key={feature} className={included ? '' : 'unavailable'}>{included ? <Check size={15}/> : <X size={14}/>}<span>{feature}</span></li>)}</ul>
      </article>;
    })}</div>

    <section className="pricing-transparency"><ShieldCheck size={22}/><div><h3>Minh bạch về tính phí</h3><p>Lượt nâng cao dùng cho chấm bài hoặc phản hồi hội thoại. Phút phát âm dùng cho nhận dạng và phân tích giọng nói. Hết hạn mức, app quay về chế độ cơ bản và không tự động mua thêm.</p></div></section>

    {selectedPlan && (
      <div className="modal-overlay pricing-modal-overlay" onClick={handleClose}>
        <div className="glass-panel panel pricing-checkout" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onClick={event => event.stopPropagation()}>
          {!loading && (
            <button className="pricing-modal-close" onClick={handleClose} aria-label="Đóng"><X size={18}/></button>
          )}

          {isSuccess ? (
            <div className="qr-success-screen">
              <div className="qr-success-icon">
                <Check size={36} />
              </div>
              <h3>Nâng cấp thành công!</h3>
              <p>Hệ thống đã nhận được thanh toán cho gói <strong>{selectedPlan.name}</strong>.</p>
              <p style={{ marginTop: '6px' }}>Cước phí mới đã được kích hoạt trên tài khoản của bạn.</p>
            </div>
          ) : activeSession ? (
            <div>
              <span className="badge badge-primary"><Sparkles size={13}/> Quét mã VietQR chuyển khoản</span>
              <h2 id="checkout-title">{selectedPlan.name}</h2>
              <div className="qr-checkout-container">
                <div className="qr-image-wrapper">
                  <img 
                    className="qr-image" 
                    src={`https://img.vietqr.io/image/${import.meta.env.VITE_BANK_ID || 'TCB'}-${import.meta.env.VITE_BANK_ACCOUNT || '123456789'}-compact2.png?amount=${activeSession.amount}&addInfo=${encodeURIComponent(activeSession.description)}&accountName=${encodeURIComponent(import.meta.env.VITE_BANK_ACCOUNT_NAME || 'NGUYEN VAN A')}`} 
                    alt="VietQR Techcombank" 
                  />
                </div>
                
                <div className="qr-status-pulse">
                  <div className="qr-status-dot"></div>
                  <span>Đang chờ giao dịch từ ngân hàng...</span>
                </div>

                <div className="qr-details-list">
                  <div className="qr-detail-row">
                    <span className="qr-detail-label">Số tài khoản</span>
                    <span className="qr-detail-value">
                      {import.meta.env.VITE_BANK_ACCOUNT || '123456789'}
                      <button className="qr-copy-btn" onClick={() => copyToClipboard(import.meta.env.VITE_BANK_ACCOUNT || '123456789', 'Đã sao chép số tài khoản nhận!')}>
                        <Copy size={11} />
                      </button>
                    </span>
                  </div>
                  <div className="qr-detail-row">
                    <span className="qr-detail-label">Số tiền</span>
                    <span className="qr-detail-value" style={{ color: 'var(--primary)' }}>
                      {formatVnd(activeSession.amount)}₫
                      <button className="qr-copy-btn" onClick={() => copyToClipboard(String(activeSession.amount), 'Đã sao chép số tiền!')}>
                        <Copy size={11} />
                      </button>
                    </span>
                  </div>
                  <div className="qr-detail-row" style={{ borderColor: 'var(--success)' }}>
                    <span className="qr-detail-label" style={{ color: 'var(--success)', fontWeight: '600' }}>Nội dung chuyển khoản</span>
                    <span className="qr-detail-value" style={{ color: 'var(--success)' }}>
                      <strong>{activeSession.description}</strong>
                      <button className="qr-copy-btn" style={{ borderColor: 'var(--success)', color: 'var(--success)' }} onClick={() => copyToClipboard(activeSession.description, 'Đã sao chép nội dung chuyển khoản bắt buộc!')}>
                        <Copy size={11} />
                      </button>
                    </span>
                  </div>
                </div>
                <div className="checkout-warning" style={{ margin: '0' }}>
                  <Info size={16}/>
                  <p style={{ fontSize: '11px' }}><strong>QUAN TRỌNG:</strong> Bạn cần nhập chính xác nội dung chuyển khoản màu xanh lá ở trên để hệ thống tự động nhận diện và kích hoạt gói cước.</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <span className="badge badge-primary"><LockKeyhole size={13}/> Xác nhận lựa chọn</span>
              <h2 id="checkout-title">{selectedPlan.name}</h2>
              <div className="checkout-summary">
                <div><span>Chu kỳ</span><strong>{billing === 'annual' ? 'Theo năm' : 'Theo tháng'}</strong></div>
                <div><span>Đơn giá quy đổi</span><strong>{formatVnd(getPlanPrice(selectedPlan, billing))}₫/tháng</strong></div>
                <div><span>Thanh toán hiện tại</span><strong>{formatVnd(getPlanPrice(selectedPlan, billing) * (billing === 'annual' ? 12 : 1))}₫</strong></div>
              </div>
              <div className="checkout-warning">
                <Info size={16}/>
                <p>Mã QR VietQR Techcombank điền sẵn số tiền và nội dung chuyển khoản sẽ được hiển thị ngay sau khi bạn nhấn nút xác nhận.</p>
              </div>
              <label className="checkout-consent">
                <input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} disabled={loading}/>
                <span>Tôi hiểu và đồng ý thanh toán số tiền trên để mua hạn mức sử dụng gói cước.</span>
              </label>
              <button className="btn btn-primary checkout-confirm" disabled={!accepted || loading} onClick={confirmSelection}>
                {loading ? 'Đang kết nối VietQR...' : 'Thanh toán ngay qua VietQR'}
              </button>
            </div>
          )}
        </div>
      </div>
    )}
  </div>;
}