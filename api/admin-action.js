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

  const { adminUid, action, orderCode } = request.body || {};

  if (!adminUid || !action || !orderCode) {
    return response.status(400).json({ error: 'Thiếu tham số yêu cầu' });
  }

  if (action !== 'approve' && action !== 'reject') {
    return response.status(400).json({ error: 'Hành động không hợp lệ' });
  }

  try {
    const db = getDb();

    // 1. Xác thực quyền Admin của người gửi yêu cầu (adminUid)
    const adminUserDoc = await db.collection('users').doc(String(adminUid)).get();
    if (!adminUserDoc.exists || adminUserDoc.data().isAdmin !== true) {
      console.warn(`[admin-action] Quyền truy cập bị từ chối cho UID: ${adminUid}`);
      return response.status(403).json({ error: 'Không có quyền thực hiện hành động này' });
    }

    const sessionRef = db.collection('payment_sessions').doc(String(orderCode));
    const userDocRef = db.collection('users');

    // 2. Chạy Transaction đảm bảo an toàn nâng cấp gói cước học viên
    const result = await db.runTransaction(async (dbTx) => {
      const sessionDoc = await dbTx.get(sessionRef);
      if (!sessionDoc.exists) {
        return { success: false, code: 'NOT_FOUND', message: 'Không tìm thấy phiên giao dịch cần xử lý' };
      }

      const sessionData = sessionDoc.data();
      if (sessionData.status !== 'pending' && sessionData.status !== 'pending_approval') {
        return { success: false, code: 'ALREADY_PROCESSED', message: `Giao dịch đã ở trạng thái: ${sessionData.status}` };
      }

      if (action === 'reject') {
        dbTx.update(sessionRef, {
          status: 'rejected',
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
          processedBy: adminUid
        });
        return { success: true, code: 'REJECTED', message: 'Đã từ chối yêu cầu thanh toán thành công' };
      }

      // Xử lý Duyệt ('approve') nâng cấp gói cước học viên
      const { uid: studentUid, planId, billing } = sessionData;
      const studentRef = userDocRef.doc(studentUid);
      const studentDoc = await dbTx.get(studentRef);

      if (!studentDoc.exists) {
        return { success: false, code: 'USER_NOT_FOUND', message: 'Không tìm thấy tài khoản học viên tương ứng với đơn hàng' };
      }

      // Tính ngày kết thúc mới
      const now = new Date();
      const days = billing === 'annual' ? 365 : 30;
      const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      // Lấy quota của gói cước mới
      const quota = QUOTAS[planId] || { aiCredits: 3, speechMinutes: 10 };

      // Thực thi cập nhật Subscription và nạp lại Quota
      dbTx.update(studentRef, {
        'subscription.planId': planId,
        'subscription.status': 'active',
        'subscription.startDate': now.toISOString(),
        'subscription.endDate': endDate.toISOString(),
        'quota.aiCredits': quota.aiCredits,
        'quota.speechMinutes': quota.speechMinutes,
        updatedAt: now.toISOString()
      });

      // Kích hoạt trạng thái session hoàn thành
      dbTx.update(sessionRef, {
        status: 'completed',
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        processedBy: adminUid
      });

      return { success: true, code: 'APPROVED', studentUid, planId, billing };
    });

    console.log(`[admin-action] Admin ${adminUid} completed action [${action}] on order ${orderCode}:`, result);
    return response.status(200).json(result);
  } catch (error) {
    console.error('[admin-action] Error:', error);
    return response.status(500).json({ error: 'Lỗi xử lý cơ sở dữ liệu trên máy chủ' });
  }
}
