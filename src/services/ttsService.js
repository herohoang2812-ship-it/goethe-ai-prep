// ─────────────────────────────────────────────────────────────────────────────
// ttsService — Dịch vụ phát âm tập trung hỗ trợ đa nguồn (Google, Piper WASM, System)
// ─────────────────────────────────────────────────────────────────────────────

import { recordAttempt } from "../utils/learningStore";

let piperWorker = null;
let currentAudio = null;
let audioQueue = [];
let queueIndex = 0;
let isPlaying = false;
let isPiperWorkerReady = false;
let currentOnEnd = null;

// Callbacks cập nhật giao diện khi tải mô hình Piper
let onPiperProgress = null;
let onPiperStatus = null;

// Khởi tạo Web Worker cho Piper TTS
function initPiperWorker() {
  if (piperWorker) return;

  // Khởi chạy Worker tĩnh từ thư mục public
  piperWorker = new Worker('/piperWorker.js');

  piperWorker.onmessage = (e) => {
    const { type, percent, message, status, blob } = e.data;

    if (type === 'progress') {
      if (onPiperProgress) onPiperProgress(percent, message);
    } else if (type === 'status') {
      if (status === 'ready') {
        isPiperWorkerReady = true;
        localStorage.setItem('goethe_piper_cached', 'true');
      } else if (status === 'cached') {
        localStorage.setItem('goethe_piper_cached', 'true');
      }
      if (onPiperStatus) onPiperStatus(status, message);
    } else if (type === 'speak_success') {
      playWavBlob(blob);
    } else if (type === 'speak_error') {
      console.error('[ttsService] Piper Speak Error:', message);
      isPlaying = false;
      // Fallback về giọng hệ thống nếu Piper lỗi
      fallbackSystemSpeak(e.data.text);
    }
  };

  // Gửi lệnh kiểm tra trạng thái
  piperWorker.postMessage({ type: 'check_status' });
}

// Cắt chuỗi văn bản dài thành các cụm dưới 180 ký tự theo dấu câu
function splitTextIntoChunks(text, maxLength = 180) {
  if (!text) return [];
  // Tách câu theo dấu chấm, chấm hỏi, chấm than, dấu phẩy, dấu chấm phẩy
  const sentences = text.match(/[^.!?;,]+[.!?;,]*/g) || [text];
  const chunks = [];
  let currentChunk = "";
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks.filter(Boolean);
}

// Dừng tất cả âm thanh đang phát (Google, System, Piper)
export function stop() {
  isPlaying = false;
  audioQueue = [];
  queueIndex = 0;
  currentOnEnd = null;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Phát âm dùng Web Speech API (Hệ thống)
function fallbackSystemSpeak(text, options = {}) {
  if (!('speechSynthesis' in window)) {
    if (currentOnEnd) currentOnEnd();
    return;
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = options.rate || 0.95;
  utterance.pitch = options.pitch || 1.0;

  const voices = window.speechSynthesis.getVoices();
  const deVoice = voices.find(voice => voice.lang.startsWith('de'));
  if (deVoice) {
    utterance.voice = deVoice;
  }

  utterance.onend = () => {
    if (currentOnEnd) currentOnEnd();
  };
  utterance.onerror = () => {
    if (currentOnEnd) currentOnEnd();
  };

  window.speechSynthesis.speak(utterance);
}

// Phát tệp âm thanh WAV Blob nhận được từ Piper Worker
function playWavBlob(blob) {
  try {
    if (currentAudio) {
      currentAudio.pause();
    }

    const audioUrl = URL.createObjectURL(blob);
    currentAudio = new Audio(audioUrl);
    
    currentAudio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
      isPlaying = false;
      playNextQueue();
    };

    currentAudio.onerror = (err) => {
      console.error('[ttsService] Audio playback error:', err);
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
      isPlaying = false;
      playNextQueue();
    };

    currentAudio.play().catch(e => {
      console.error('[ttsService] Play failed:', e);
      isPlaying = false;
      playNextQueue();
    });
  } catch (e) {
    console.error('[ttsService] playWavBlob error:', e);
    isPlaying = false;
  }
}

// Phát âm dùng Google Translate TTS API (Có cắt chuỗi và tạo hàng đợi)
function playGoogleTTS(text, options = {}) {
  stop();
  const chunks = splitTextIntoChunks(text, 180);
  if (!chunks.length) return;

  audioQueue = chunks;
  queueIndex = 0;
  isPlaying = true;
  playNextGoogleChunk();
}

function playNextGoogleChunk() {
  if (!isPlaying || queueIndex >= audioQueue.length) {
    isPlaying = false;
    if (currentOnEnd) currentOnEnd();
    return;
  }

  const chunk = audioQueue[queueIndex];
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=de&client=tw-ob&q=${encodeURIComponent(chunk)}`;
  
  if (currentAudio) {
    currentAudio.pause();
  }

  currentAudio = new Audio(url);
  currentAudio.onended = () => {
    queueIndex++;
    playNextGoogleChunk();
  };

  currentAudio.onerror = (e) => {
    console.warn('[ttsService] Google TTS error, falling back to system voice.');
    fallbackSystemSpeak(chunk);
    queueIndex++;
    playNextGoogleChunk();
  };

  currentAudio.play().catch(err => {
    console.error(err);
    fallbackSystemSpeak(chunk);
    queueIndex++;
    playNextGoogleChunk();
  });
}

// Quản lý hàng đợi phát âm chung cho Piper
function playNextQueue() {
  if (!isPlaying || queueIndex >= audioQueue.length) {
    isPlaying = false;
    if (currentOnEnd) currentOnEnd();
    return;
  }

  const chunk = audioQueue[queueIndex];
  queueIndex++;

  if (piperWorker && isPiperWorkerReady) {
    piperWorker.postMessage({
      type: 'speak',
      text: chunk,
      speed: 1.0,
      speakerId: 0
    });
  } else {
    fallbackSystemSpeak(chunk);
    playNextQueue();
  }
}

// Phương thức phát âm chính
export function speak(text, options = {}) {
  const provider = localStorage.getItem('goethe_tts_provider') || 'google';
  currentOnEnd = options.onEnd || null;

  if (provider === 'system') {
    fallbackSystemSpeak(text, options);
  } else if (provider === 'piper') {
    if (!isPiperWorkerReady) {
      console.warn('[ttsService] Piper chưa được tải, tự động chuyển về Google AI');
      playGoogleTTS(text, options);
      return;
    }
    // Cắt text và đưa vào hàng đợi
    stop();
    const chunks = splitTextIntoChunks(text, 180);
    audioQueue = chunks;
    queueIndex = 0;
    isPlaying = true;
    playNextQueue();
  } else {
    // Mặc định: google
    playGoogleTTS(text, options);
  }
}

// Bắt đầu tải và cache gói mô hình Piper
export function loadPiper(onProgress, onStatus) {
  onPiperProgress = onProgress;
  onPiperStatus = onStatus;

  initPiperWorker();
  
  // Gửi lệnh tải tài nguyên
  if (piperWorker) {
    piperWorker.postMessage({ type: 'load' });
  }
}

// Kiểm tra nhanh xem Piper đã được tải về máy trước đó chưa
export function checkPiperStatus(onStatus) {
  onPiperStatus = onStatus;
  initPiperWorker();
}

export function isPiperLoaded() {
  return localStorage.getItem('goethe_piper_cached') === 'true';
}
