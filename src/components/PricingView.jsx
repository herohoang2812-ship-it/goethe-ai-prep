import { useMemo, useState, useEffect } from 'react';
import { BadgeCheck, Check, ChevronRight, CircleDollarSign, Copy, Info, LockKeyhole, ShieldCheck, Sparkles, X } from 'lucide-react';
import { BILLING_DISCOUNT, formatVnd, getPlanPrice, PRICING_PLANS } from '../data/pricingPlans';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function PricingView({ showToast, currentUser, userProfile, onAuthClick }) {
  const [billing, setBilling] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const annualSaving = Math.round(BILLING_DISCOUNT * 100);
  const pendingPlan = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('goethe_pending_subscription') || 'null'); } catch { return null; }
  }, []);

  // Lấy thông tin tài khoản Techcombank mặc định của chủ ứng dụng
  const bankId = import.meta.env.VITE_BANK_ID || 'TCB';
  const bankAccount = import.meta.env.VITE_BANK_ACCOUNT || '19032995633019';
  const bankAccountName = import.meta.env.VITE_BANK_ACCOUNT_NAME || 'HOANG ANH HUNG';

  // Lắng nghe sự kiện Firestore realtime khi có activeSession
  useEffect(() => {
    if (!activeSession?.orderCode || !db) return;

    const sessionDocRef = doc(db, 'payment_sessions', String(activeSession.orderCode));
    const unsubscribe = onSnapshot(sessionDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Nếu admin duyệt thành công
        if (data.status === 'completed') {
          setIsSuccess(true);
          showToast?.('Nâng cấp tài khoản thành công! Cảm ơn bạn đã đồng hành cùng Goethe AI Prep.', 'success');
          localStorage.removeItem('goethe_pending_subscription');
          
          setTimeout(() => {
            setSelectedPlan(null);
            setActiveSession(null);
            setIsSuccess(false);
          }, 4500);
        } else if (data.status === 'rejected') {
          showToast?.('Yêu cầu thanh toán của bạn đã bị từ chối. Vui lòng kiểm tra lại giao dịch.', 'warning');
          setActiveSession(null);
        } else if (data.status === 'pending_approval' && activeSession.status !== 'pending_approval') {
          setActiveSession(prev => ({ ...prev, status: 'pending_approval' }));
        }
      }
    });

    return () => unsubscribe();
  }, [activeSession?.orderCode, activeSession?.status, db, showToast]);

  const choosePlan = plan => {
    if (plan.id === 'free') return;
    setSelectedPlan(plan); setAccepted(false);
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    showToast?.(message || 'Đã sao chép vào bộ nhớ tạm!', 'success');
  };

  const handleClose = () => {
    if (loading || submittingRequest) return;
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
      const orderCode = Date.now();
      let price = selectedPlan.monthlyPrice;
      if (billing === 'annual') {
        const discountedMonthly = Math.round((selectedPlan.monthlyPrice * 0.8) / 1000) * 1000;
        price = discountedMonthly * 12;
      }

      // Tạo phiên thanh toán trực tiếp từ Client trên Firestore
      const sessionDocRef = doc(db, 'payment_sessions', String(orderCode));
      await setDoc(sessionDocRef, {
        orderCode,
        uid: currentUser.uid,
        name: userProfile?.name || 'Học viên Goethe',
        email: currentUser.email || 'N/A',
        planId: selectedPlan.id,
        billing,
        amount: price,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Thiết lập session thanh toán active để mở QR Code
      setActiveSession({
        orderCode,
        amount: price,
        description: `GT ${orderCode}`,
        status: 'pending'
      });
    } catch (error) {
      console.error('[PricingView] Payment Error:', error);
      showToast?.('Không thể tạo phiên giao dịch trên Cloud. Vui lòng thử lại sau.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  // Học viên xác nhận đã chuyển khoản thủ công trên App ngân hàng
  const handleSubmitApproval = async () => {
    if (!activeSession?.orderCode || !db) return;
    setSubmittingRequest(true);
    try {
      const sessionDocRef = doc(db, 'payment_sessions', String(activeSession.orderCode));
      await updateDoc(sessionDocRef, {
        status: 'pending_approval'
      });
      showToast?.('Đã gửi yêu cầu kích hoạt thành công! Vui lòng chờ quản trị viên đối chiếu và phê duyệt cước.', 'success');
      setActiveSession(prev => ({ ...prev, status: 'pending_approval' }));
    } catch (err) {
      console.error('[PricingView] Error submitting payment approval:', err);
      showToast?.('Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại.', 'warning');
    } finally {
      setSubmittingRequest(false);
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
          {!loading && !submittingRequest && (
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
                    src={`https://img.vietqr.io/image/${bankId}-${bankAccount}-compact2.png?amount=${activeSession.amount}&addInfo=${encodeURIComponent(activeSession.description)}&accountName=${encodeURIComponent(bankAccountName)}`} 
                    alt="VietQR Techcombank" 
                  />
                </div>
                
                {activeSession.status === 'pending_approval' ? (
                  <div className="qr-status-pulse" style={{ color: 'var(--warning)' }}>
                    <div className="qr-status-dot" style={{ background: 'var(--warning)', animation: 'qr-pulse-warning 1.5s infinite' }}></div>
                    <span>Đang chờ Admin duyệt gói cước Techcombank...</span>
                  </div>
                ) : (
                  <div className="qr-status-pulse">
                    <div className="qr-status-dot"></div>
                    <span>Vui lòng quét QR chuyển tiền ngân hàng</span>
                  </div>
                )}

                <div className="qr-details-list">
                  <div className="qr-detail-row">
                    <span className="qr-detail-label">Số tài khoản</span>
                    <span className="qr-detail-value">
                      {bankAccount}
                      <button className="qr-copy-btn" onClick={() => copyToClipboard(bankAccount, 'Đã sao chép số tài khoản nhận!')}>
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
                  <p style={{ fontSize: '11px' }}><strong>QUAN TRỌNG:</strong> Bạn cần nhập chính xác nội dung chuyển khoản màu xanh lá ở trên để Admin đối chiếu và phê duyệt kích hoạt.</p>
                </div>

                {activeSession.status !== 'pending_approval' ? (
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '16px', background: 'var(--success)', borderColor: 'var(--success)' }}
                    disabled={submittingRequest}
                    onClick={handleSubmitApproval}
                  >
                    {submittingRequest ? 'Đang gửi yêu cầu...' : 'Tôi đã chuyển khoản thành công'}
                  </button>
                ) : (
                  <button 
                    className="btn" 
                    style={{ width: '100%', marginTop: '16px', color: 'var(--text-muted)', borderColor: 'var(--border)', cursor: 'default' }}
                    disabled
                  >
                    Đã gửi yêu cầu (Bạn có thể đóng cửa sổ này)
                  </button>
                )}
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