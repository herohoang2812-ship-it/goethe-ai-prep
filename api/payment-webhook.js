import admin from 'firebase-admin';
import crypto from 'crypto';

const QUOTAS = {
  plus: { aiCredits: 20, speechMinutes: 60 },
  pro: { aiCredits: 60, speechMinutes: 180 },
  intensive: { aiCredits: 150, speechMinutes: 600 }
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

function verifyWebhookSignature(webhookBody, checksumKey) {
  const { data, signature } = webhookBody || {};
  if (!data || !signature) return false;

  // Sắp xếp các key của data theo thứ tự bảng chữ cái để tạo chuỗi chữ ký
  const sortedKeys = Object.keys(data).sort();
  const queryStr = sortedKeys
    .map(key => `${key}=${data[key]}`)
    .join('&');

  const calculatedSignature = crypto
    .createHmac('sha256', checksumKey)
    .update(queryStr)
    .digest('hex');

  return calculatedSignature === signature;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
  if (!checksumKey) {
    return response.status(500).json({ error: 'Checksum key chưa được cấu hình trên máy chủ' });
  }

  const payload = request.body;
  if (!payload) {
    return response.status(400).json({ error: 'Dữ liệu trống' });
  }

  // 1. Xác thực tính trung thực của webhook từ PayOS bằng chữ ký
  const isValid = verifyWebhookSignature(payload, checksumKey);
  if (!isValid) {
    console.error('[payment-webhook] Invalid signature received from PayOS');
    return response.status(400).json({ error: 'Chữ ký không hợp lệ' });
  }

  const { data } = payload;
  const { orderCode, amount } = data || {};

  try {
    const db = getDb();
    const sessionRef = db.collection('payment_sessions').doc(String(orderCode));
    const userDocRef = db.collection('users');

    // 2. Chạy Transaction đảm bảo tính nguyên tử (Atomicity)
    const result = await db.runTransaction(async (transaction) => {
      const sessionDoc = await transaction.get(sessionRef);
      if (!sessionDoc.exists) {
        return { success: false, code: 'NOT_FOUND', message: 'Không tìm thấy phiên thanh toán ứng với orderCode' };
      }

      const sessionData = sessionDoc.data();
      // Nếu đã được xử lý trước đó rồi thì trả về thành công ngay lập tức để tránh xử lý trùng lặp
      if (sessionData.status !== 'pending') {
        return { success: true, code: 'ALREADY_PROCESSED', message: 'Giao dịch này đã được xử lý và kích hoạt trước đó' };
      }

      // Kiểm tra số tiền nhận được có khớp với số tiền gói cước yêu cầu không
      if (Number(sessionData.amount) !== Number(amount)) {
        console.warn(`[webhook] Price mismatch for order ${orderCode}: expected ${sessionData.amount}, got ${amount}`);
        transaction.update(sessionRef, {
          status: 'amount_mismatch',
          actualAmount: amount,
          processedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { success: false, code: 'AMOUNT_MISMATCH', message: 'Số tiền thanh toán thực tế không khớp với giá gói cước' };
      }

      const { uid, planId, billing } = sessionData;
      const userRef = userDocRef.doc(uid);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        return { success: false, code: 'USER_NOT_FOUND', message: 'Không tìm thấy hồ sơ người dùng trong hệ thống' };
      }

      // 3. Tính toán thời hạn sử dụng gói cước mới
      const now = new Date();
      const days = billing === 'annual' ? 365 : 30;
      const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      // Lấy hạn mức quota tương ứng của gói cước
      const quota = QUOTAS[planId] || { aiCredits: 3, speechMinutes: 10 };

      // 4. Cập nhật Subscription và Quota của người dùng
      transaction.update(userRef, {
        'subscription.planId': planId,
        'subscription.status': 'active',
        'subscription.startDate': now.toISOString(),
        'subscription.endDate': endDate.toISOString(),
        'quota.aiCredits': quota.aiCredits,
        'quota.speechMinutes': quota.speechMinutes,
        updatedAt: now.toISOString()
      });

      // 5. Đánh dấu phiên thanh toán là hoàn tất
      transaction.update(sessionRef, {
        status: 'completed',
        actualAmount: amount,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        reference: data.reference || null,
        gatewayTransactionId: data.paymentLinkId || null
      });

      return { success: true, code: 'SUCCESS', uid, planId, billing };
    });

    console.log(`[webhook] Processed payment callback for order ${orderCode}:`, result);
    return response.status(200).json(result);
  } catch (error) {
    console.error('[payment-webhook] Error processing transaction webhook:', error);
    return response.status(500).json({ error: 'Lỗi xử lý cơ sở dữ liệu trên máy chủ' });
  }
}
