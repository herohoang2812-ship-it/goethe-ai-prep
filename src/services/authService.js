// ─────────────────────────────────────────────────────────────────────────────
// Authentication Service — Quản lý đăng ký, đăng nhập và đăng xuất qua Firebase
// ─────────────────────────────────────────────────────────────────────────────

import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

/**
 * Đăng ký tài khoản mới bằng Email/Mật khẩu
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<User>}
 */
export async function signUpWithEmail(email, password, displayName) {
  if (!auth) throw new Error('Dịch vụ xác thực Firebase chưa được cấu hình trên Vercel.');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
}

/**
 * Đăng nhập bằng Email/Mật khẩu
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export async function signInWithEmail(email, password) {
  if (!auth) throw new Error('Dịch vụ xác thực Firebase chưa được cấu hình trên Vercel.');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Đăng nhập nhanh bằng tài khoản Google
 * @returns {Promise<User>}
 */
export async function signInWithGoogle() {
  if (!auth) throw new Error('Dịch vụ xác thực Firebase chưa được cấu hình trên Vercel.');
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
}

/**
 * Đăng xuất tài khoản hiện tại
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Gửi email khôi phục mật khẩu
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  if (!auth) throw new Error('Dịch vụ xác thực Firebase chưa được cấu hình trên Vercel.');
  await sendPasswordResetEmail(auth, email);
}

/**
 * Đăng ký lắng nghe sự kiện thay đổi trạng thái đăng nhập
 * @param {function} callback
 * @returns {import('firebase/auth').Unsubscribe}
 */
export function onAuthStateChangedListener(callback) {
  if (!auth) {
    console.warn('[authService] Firebase Auth chưa được cấu hình. Hoạt động ở chế độ Offline.');
    return () => {}; // Trả về hàm hủy đăng ký giả lập
  }
  return onAuthStateChanged(auth, callback);
}
