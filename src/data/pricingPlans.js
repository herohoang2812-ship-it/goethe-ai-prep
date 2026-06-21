export const BILLING_DISCOUNT = 0.2;

export const PRICING_PLANS = [
  {
    id: 'free', name: 'Basis', eyebrow: 'Miễn phí', description: 'Làm quen và tự học có hướng dẫn', monthlyPrice: 0,
    features: [
      ['Diagnostic bằng logic minh bạch', true], ['Lesen/Hören theo dạng Goethe B2', true], ['Sổ lỗi và SRS cơ bản', true],
      ['AI chấm Schreiben/Sprechen', false], ['Microsoft Azure AI Speech', false], ['Phân tích phát âm chuyên sâu', false],
    ],
  },
  {
    id: 'plus', name: 'B2 Plus', eyebrow: 'Học đều mỗi tuần', description: 'Phù hợp người học 3–4 buổi/tuần', monthlyPrice: 149000,
    quota: '20 AI credits · 60 phút Speech/tháng',
    features: [
      ['Toàn bộ tính năng Basis', true], ['20 lượt chấm hoặc hội thoại AI', true], ['60 phút Azure AI Speech', true],
      ['Nhận xét Diagnostic bằng AI', true], ['Lộ trình 30/60/90 ngày', true], ['Ưu tiên xử lý', false],
    ],
  },
  {
    id: 'pro', name: 'B2 Pro', eyebrow: 'Phổ biến nhất', description: 'Luyện thi tăng tốc và sửa bài thường xuyên', monthlyPrice: 299000, featured: true,
    quota: '60 AI credits · 180 phút Speech/tháng',
    features: [
      ['Toàn bộ tính năng B2 Plus', true], ['60 lượt chấm hoặc hội thoại AI', true], ['180 phút Azure AI Speech', true],
      ['Phân tích phát âm và độ trôi chảy', true], ['Báo cáo lỗi lặp lại nâng cao', true], ['Ưu tiên xử lý', true],
    ],
  },
  {
    id: 'intensive', name: 'Intensiv', eyebrow: 'Nước rút', description: 'Dành cho giai đoạn sát ngày thi', monthlyPrice: 499000,
    quota: '150 AI credits · 600 phút Speech/tháng',
    features: [
      ['Toàn bộ tính năng B2 Pro', true], ['150 lượt chấm hoặc hội thoại AI', true], ['600 phút Azure AI Speech', true],
      ['Full test và báo cáo từng tuần', true], ['Lịch học nước rút cá nhân hóa', true], ['Hỗ trợ ưu tiên cao nhất', true],
    ],
  },
];

export const formatVnd = value => new Intl.NumberFormat('vi-VN').format(value);
export const getPlanPrice = (plan, billing) => billing === 'annual' ? Math.round(plan.monthlyPrice * (1 - BILLING_DISCOUNT) / 1000) * 1000 : plan.monthlyPrice;