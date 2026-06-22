import { useMemo, useState } from 'react';
import { BadgeCheck, Check, ChevronRight, CircleDollarSign, Info, LockKeyhole, ShieldCheck, Sparkles, X } from 'lucide-react';
import { BILLING_DISCOUNT, formatVnd, getPlanPrice, PRICING_PLANS } from '../data/pricingPlans';

export default function PricingView({ showToast }) {
  const [billing, setBilling] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const annualSaving = Math.round(BILLING_DISCOUNT * 100);
  const pendingPlan = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('goethe_pending_subscription') || 'null'); } catch { return null; }
  }, []);

  const choosePlan = plan => {
    if (plan.id === 'free') return;
    setSelectedPlan(plan); setAccepted(false);
  };

  const confirmSelection = () => {
    if (!accepted || !selectedPlan) return;
    const pending = { planId: selectedPlan.id, billing, price: getPlanPrice(selectedPlan, billing), status: 'pending_payment', createdAt: new Date().toISOString() };
    localStorage.setItem('goethe_pending_subscription', JSON.stringify(pending));
    setSelectedPlan(null);
    showToast?.('Đã lưu lựa chọn. Tài khoản chỉ được nâng cấp sau khi cổng thanh toán xác nhận.', 'success');
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
        <button className={`pricing-cta ${plan.featured ? 'primary' : ''}`} onClick={() => choosePlan(plan)} disabled={plan.id === 'free'}>{plan.id === 'free' ? 'Gói hiện tại' : 'Chọn gói'}{plan.id !== 'free' && <ChevronRight size={16}/>}</button>
        <div className="pricing-divider"/>
        <ul className="pricing-features">{plan.features.map(([feature, included]) => <li key={feature} className={included ? '' : 'unavailable'}>{included ? <Check size={15}/> : <X size={14}/>}<span>{feature}</span></li>)}</ul>
      </article>;
    })}</div>

    <section className="pricing-transparency"><ShieldCheck size={22}/><div><h3>Minh bạch về tính phí</h3><p>Lượt nâng cao dùng cho chấm bài hoặc phản hồi hội thoại. Phút phát âm dùng cho nhận dạng và phân tích giọng nói. Hết hạn mức, app quay về chế độ cơ bản và không tự động mua thêm.</p></div></section>

    {selectedPlan && <div className="modal-overlay pricing-modal-overlay" onClick={() => setSelectedPlan(null)}><div className="glass-panel panel pricing-checkout" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onClick={event => event.stopPropagation()}>
      <button className="pricing-modal-close" onClick={() => setSelectedPlan(null)} aria-label="Đóng"><X size={18}/></button>
      <span className="badge badge-primary"><LockKeyhole size={13}/> Xác nhận lựa chọn</span><h2 id="checkout-title">{selectedPlan.name}</h2>
      <div className="checkout-summary"><div><span>Chu kỳ</span><strong>{billing === 'annual' ? 'Theo năm' : 'Theo tháng'}</strong></div><div><span>Đơn giá quy đổi</span><strong>{formatVnd(getPlanPrice(selectedPlan, billing))}₫/tháng</strong></div><div><span>Thanh toán hiện tại</span><strong>{formatVnd(getPlanPrice(selectedPlan, billing) * (billing === 'annual' ? 12 : 1))}₫</strong></div></div>
      <div className="checkout-warning"><Info size={16}/><p>Đây là bước chuẩn bị giao diện. Chưa có tiền được thu và gói chưa được kích hoạt cho đến khi tích hợp nhà cung cấp thanh toán.</p></div>
      <label className="checkout-consent"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)}/><span>Tôi hiểu đây là lựa chọn đang chờ thanh toán và đồng ý với hạn mức sử dụng hiển thị.</span></label>
      <button className="btn btn-primary checkout-confirm" disabled={!accepted} onClick={confirmSelection}>Lưu lựa chọn chờ thanh toán</button>
    </div></div>}
  </div>;
}