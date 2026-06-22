import admin from 'firebase-admin';
import crypto from 'crypto';

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

  // Cấu hình PayOS
  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    return response.status(500).json({ error: 'Dịch vụ thanh toán chưa cấu hình đầy đủ biến môi trường' });
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

    // 4. Xây dựng payload để gọi PayOS
    const origin = request.headers.origin || `https://${request.headers.host}`;
    const description = `Goethe Prep ${planId}`.slice(0, 25);
    const cancelUrl = `${origin}/?payment=cancel`;
    const returnUrl = `${origin}/?payment=success`;

    const paymentData = {
      orderCode,
      amount: price,
      description,
      cancelUrl,
      returnUrl
    };

    // 5. Tạo chữ ký bảo mật signature theo chuẩn PayOS
    const signatureInput = Object.keys(paymentData)
      .sort()
      .map(key => `${key}=${paymentData[key]}`)
      .join('&');
    const signature = crypto
      .createHmac('sha256', checksumKey)
      .update(signatureInput)
      .digest('hex');

    // 6. Gửi request tạo Link thanh toán đến PayOS
    const upstreamUrl = 'https://api-merchant.payos.vn/v2/payment-requests';
    const payosResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        ...paymentData,
        signature
      })
    });

    const payosData = await payosResponse.json();
    if (payosData.code !== '00') {
      console.error('[create-payment] PayOS Response Error:', payosData);
      return response.status(400).json({ error: payosData.desc || 'Lỗi kết nối PayOS' });
    }

    // 7. Trả về checkoutUrl cho frontend chuyển hướng
    return response.status(200).json({
      checkoutUrl: payosData.data.checkoutUrl,
      orderCode
    });
  } catch (error) {
    console.error('[create-payment] Server Error:', error);
    return response.status(500).json({ error: 'Lỗi máy chủ trong quá trình xử lý tạo mã thanh toán' });
  }
}
