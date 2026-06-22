// ─────────────────────────────────────────────────────────────────────────────
// Database Service — Quản lý đồng bộ tiến độ học và hạn mức tín dụng Firestore
// ─────────────────────────────────────────────────────────────────────────────

import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';

/**
 * Đồng bộ thông tin hồ sơ người dùng từ Firestore.
 * Nếu chưa tồn tại, tạo mới bằng dữ liệu mặc định/cũ từ localStorage.
 * @param {string} uid
 * @param {object} defaultData - dữ liệu dự phòng từ localStorage
 * @returns {Promise<object>}
 */
export async function syncUserProfile(uid, defaultData = {}) {
  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    // Đảm bảo trường phẳng cũng tồn tại để tương thích ngược với code cũ
    return {
      ...data,
      name: data.name || defaultData.name || 'Học viên Goethe',
      level: data.level || data.profile?.level || defaultData.level || 'B1',
      specialty: data.specialty || data.profile?.specialty || defaultData.specialty || 'pflege'
    };
  } else {
    // Tạo mới tài khoản học viên trên Cloud dựa trên dữ liệu hiện tại
    const initialProfile = {
      uid,
      name: defaultData.name || 'Học viên Goethe',
      level: defaultData.level || 'B1',
      specialty: defaultData.specialty || 'pflege',
      profile: {
        level: defaultData.level || 'B1',
        specialty: defaultData.specialty || 'pflege'
      },
      createdAt: new Date().toISOString(),
      subscription: {
        planId: 'free',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // Mặc định 1 năm
      },
      quota: {
        aiCredits: 0,
        speechMinutes: 0
      }
    };
    await setDoc(userDocRef, initialProfile);
    return initialProfile;
  }
}

/**
 * Cập nhật thông tin cấu hình hồ sơ học viên (tên, trình độ, chuyên ngành)
 * @param {string} uid
 * @param {object} profileUpdates
 */
export async function updateUserProfileOnDb(uid, profileUpdates) {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    name: profileUpdates.name,
    level: profileUpdates.level,
    specialty: profileUpdates.specialty,
    'profile.level': profileUpdates.level,
    'profile.specialty': profileUpdates.specialty
  });
}

/**
 * Đồng bộ tiến trình học (Streak, Bài thi đã làm, Từ vựng)
 * @param {string} uid
 * @param {object} defaultProgress
 * @returns {Promise<object>}
 */
export async function syncUserProgress(uid, defaultProgress = {}) {
  const progressDocRef = doc(db, 'progress', uid);
  const docSnap = await getDoc(progressDocRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    const initialProgress = {
      uid,
      streak: defaultProgress.streak || 0,
      completedLessons: defaultProgress.completedLessons || { lesen: [], horen: [] },
      vocabSrs: defaultProgress.vocabSrs || { learnedWordsCount: 0, lastSrsReview: null },
      diagnostic: defaultProgress.diagnostic || null,
      updatedAt: new Date().toISOString()
    };
    await setDoc(progressDocRef, initialProgress);
    return initialProgress;
  }
}

/**
 * Lưu/Cập nhật tiến trình học mới nhất lên Cloud
 * @param {string} uid
 * @param {object} progressData
 */
export async function saveUserProgressOnDb(uid, progressData) {
  const progressDocRef = doc(db, 'progress', uid);
  await setDoc(progressDocRef, {
    uid,
    ...progressData,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Trừ hạn mức chấm điểm AI (AI Credits)
 * Trả về true nếu thành công. Ném lỗi nếu hết hạn mức.
 * @param {string} uid
 * @returns {Promise<boolean>}
 */
export async function deductAiCreditOnDb(uid) {
  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);
  if (!docSnap.exists()) return false;
  
  const data = docSnap.data();
  // Nếu là gói miễn phí (free), cho phép dùng với hạn mức cục bộ
  if (data.subscription?.planId === 'free') {
    return true; 
  }

  const currentCredits = data.quota?.aiCredits || 0;
  if (currentCredits <= 0) {
    throw new Error('Bạn đã sử dụng hết lượt chấm điểm hoặc hội thoại AI của gói cước tháng này.');
  }

  await updateDoc(userDocRef, {
    'quota.aiCredits': increment(-1)
  });
  return true;
}

/**
 * Trừ số phút luyện phát âm Azure AI Speech
 * @param {string} uid
 * @param {number} minutesUsed
 * @returns {Promise<boolean>}
 */
export async function deductSpeechMinutesOnDb(uid, minutesUsed) {
  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);
  if (!docSnap.exists()) return false;

  const data = docSnap.data();
  if (data.subscription?.planId === 'free') {
    return true; 
  }

  const currentMinutes = data.quota?.speechMinutes || 0;
  if (currentMinutes <= 0) {
    throw new Error('Bạn đã sử dụng hết số phút luyện phát âm nói Azure AI Speech của gói cước tháng này.');
  }

  const nextMinutes = Math.max(0, currentMinutes - minutesUsed);
  await updateDoc(userDocRef, {
    'quota.speechMinutes': nextMinutes
  });
  return true;
}

/**
 * Đăng ký lắng nghe thời gian thực hồ sơ người dùng
 * @param {string} uid
 * @param {function} callback
 * @returns {import('firebase/firestore').Unsubscribe}
 */
export function subscribeToUserProfile(uid, callback) {
  return onSnapshot(doc(db, 'users', uid), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback({
        ...data,
        name: data.name,
        level: data.level || data.profile?.level || 'B1',
        specialty: data.specialty || data.profile?.specialty || 'pflege'
      });
    }
  });
}
