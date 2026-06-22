import admin from 'firebase-admin';

const PLANS = {
  plus: { monthlyPrice: 49000, name: 'B2 Plus' },
  pro: { monthlyPrice: 99000, name: 'B2 Pro' },
  intensive: { monthlyPrice: 199000, name: 'Intensiv' }
};

function getDb() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      })
    });
  }
  return admin.firestore();
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { uid, planId, billing } = request.body || {};

  if (!uid || !planId || !billing) {
    return response.status(400).json({ error: 'Thiếu thông tin người dùng hoặc gói cước' });
  }

  const plan = PLANS[planId];
  if (!plan) {
    return response.status(400).json({ error: 'Gói cước không hợp lệ' });
  }

  if (billing !== 'monthly' && billing !== 'annual') {
    return response.status(400).json({ error: 'Chu kỳ thanh toán không hợp lệ' });
  }

  try {
    // 1. Tính toán giá cước chính xác từ phía backend để bảo mật
    let price = plan.monthlyPrice;
    if (billing === 'annual') {
      const discountedMonthly = Math.round((plan.monthlyPrice * 0.8) / 1000) * 1000;
      price = discountedMonthly * 12;
    }

    // 2. Tạo mã đơn hàng duy nhất dạng số (orderCode)
    const orderCode = Date.now();

    // 3. Khởi tạo Firestore DB và ghi nhận phiên thanh toán pending
    const db = getDb();
    const sessionRef = db.collection('payment_sessions').doc(String(orderCode));
    await sessionRef.set({
      orderCode,
      uid,
      planId,
      billing,
      amount: price,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 4. Trả về thông tin đơn hàng để Frontend tạo mã QR chuyển khoản Techcombank
    return response.status(200).json({
      orderCode,
      amount: price,
      description: `GT ${orderCode}`
    });
  } catch (error) {
    console.error('[create-payment] Server Error:', error);
    return response.status(500).json({ error: 'Lỗi máy chủ trong quá trình xử lý tạo mã thanh toán' });
  }
}
