import admin from 'firebase-admin';

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

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Xác thực API Key từ SePay gửi về qua Header Authorization
  const authHeader = request.headers.authorization;
  const expectedKey = process.env.SEPAY_WEBHOOK_API_KEY || 'goethe_sepay_secret_token';
  
  if (!authHeader || authHeader !== `Apikey ${expectedKey}`) {
    console.error('[payment-webhook] Unauthorized webhook call');
    return response.status(401).json({ error: 'Unauthorized: Sai mã xác thực SePay' });
  }

  const sepayData = request.body || {};
  const { content = '', transferAmount, transferType, id: sepayTransactionId, referenceCode, gateway } = sepayData;

  // Chỉ xử lý giao dịch nhận tiền (transferType = "in")
  if (transferType && transferType.toLowerCase() !== 'in') {
    return response.status(200).json({ success: true, message: 'Bỏ qua giao dịch tiền ra (out)' });
  }

  // 2. Trích xuất orderCode (mã đơn hàng) từ nội dung chuyển tiền bằng Regex
  // Hỗ trợ cả trường hợp viết thường/hoa, có hoặc không có dấu cách, e.g. "GT1719213456789", "gt 1719213456789"
  const match = content.match(/GT\s*(\d+)/i);
  if (!match) {
    console.warn('[payment-webhook] Nội dung chuyển tiền không chứa mã đơn dạng GT <orderCode>:', content);
    return response.status(200).json({ success: false, message: 'Nội dung chuyển khoản không chứa mã đơn hợp lệ' });
  }

  const orderCode = match[1];
  const amount = Number(transferAmount);

  try {
    const db = getDb();
    const sessionRef = db.collection('payment_sessions').doc(String(orderCode));
    const userDocRef = db.collection('users');

    // 3. Thực hiện Transaction trên Firestore đảm bảo an toàn tuyệt đối
    const result = await db.runTransaction(async (dbTx) => {
      const sessionDoc = await dbTx.get(sessionRef);
      if (!sessionDoc.exists) {
        return { success: false, code: 'NOT_FOUND', message: `Không tìm thấy phiên giao dịch: ${orderCode}` };
      }

      const sessionData = sessionDoc.data();
      // Nếu đã được xử lý trước đó rồi thì trả về thành công ngay lập tức để tránh xử lý trùng lặp
      if (sessionData.status !== 'pending') {
        return { success: true, code: 'ALREADY_PROCESSED', message: 'Giao dịch này đã được kích hoạt trước đó' };
      }

      // 4. Kiểm tra khớp số tiền
      if (Number(sessionData.amount) !== amount) {
        console.warn(`[payment-webhook] Số tiền không khớp cho đơn ${orderCode}: yêu cầu ${sessionData.amount}, nhận được ${amount}`);
        dbTx.update(sessionRef, {
          status: 'amount_mismatch',
          actualAmount: amount,
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
          sepayTransactionId: sepayTransactionId || null
        });
        return { success: false, code: 'AMOUNT_MISMATCH', message: 'Số tiền chuyển khoản không khớp với giá trị gói cước' };
      }

      const { uid, planId, billing } = sessionData;
      const userRef = userDocRef.doc(uid);
      const userDoc = await dbTx.get(userRef);

      if (!userDoc.exists) {
        return { success: false, code: 'USER_NOT_FOUND', message: 'Không tìm thấy tài khoản học viên tương ứng' };
      }

      // 5. Cập nhật Subscription hạn dùng
      const now = new Date();
      const days = billing === 'annual' ? 365 : 30;
      const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      // Cấp quota hạn mức gói cước mới
      const quota = QUOTAS[planId] || { aiCredits: 3, speechMinutes: 10 };

      dbTx.update(userRef, {
        'subscription.planId': planId,
        'subscription.status': 'active',
        'subscription.startDate': now.toISOString(),
        'subscription.endDate': endDate.toISOString(),
        'quota.aiCredits': quota.aiCredits,
        'quota.speechMinutes': quota.speechMinutes,
        updatedAt: now.toISOString()
      });

      // 6. Cập nhật session thanh toán hoàn tất
      dbTx.update(sessionRef, {
        status: 'completed',
        actualAmount: amount,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        reference: referenceCode || null,
        sepayTransactionId: sepayTransactionId || null,
        gateway: gateway || 'SePay'
      });

      return { success: true, code: 'SUCCESS', uid, planId, billing };
    });

    console.log(`[payment-webhook] Xử lý webhook SePay hoàn thành:`, result);
    return response.status(200).json(result);
  } catch (error) {
    console.error('[payment-webhook] Error processing transaction webhook:', error);
    return response.status(500).json({ error: 'Lỗi máy chủ khi cập nhật dữ liệu giao dịch' });
  }
}
