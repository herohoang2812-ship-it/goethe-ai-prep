// ─────────────────────────────────────────────────────────────────────────────
// ttsService — Dịch vụ phát âm tập trung hỗ trợ đa nguồn (Google, Piper WASM, System)
// ─────────────────────────────────────────────────────────────────────────────

let piperWorker = null;
let currentAudio = null;
let currentUtterance = null;
let audioQueue = [];
let queueIndex = 0;
let isPlaying = false;
let isPiperWorkerReady = false;
let currentOnEnd = null;
let currentOptions = {};

// Callbacks cập nhật giao diện khi tải mô hình Piper
let onPiperProgress = null;
let onPiperStatus = null;

// Khởi tạo Web Worker cho Piper TTS
function initPiperWorker() {
  if (piperWorker) return;

  // Khởi chạy Worker tĩnh từ thư mục public
  piperWorker = new Worker('/piperWorker.js');

  piperWorker.onmessage = (e) => {
    const { type, percent, message, status, blob, text } = e.data;

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
      // Kiểm tra xem có đang chạy và khớp với chunk hiện tại không
      if (isPlaying && audioQueue[queueIndex]?.trim() === text?.trim()) {
        playWavBlob(blob);
      }
    } else if (type === 'speak_error') {
      console.error('[ttsService] Piper Speak Error:', message);
      if (isPlaying && audioQueue[queueIndex]?.trim() === text?.trim()) {
        // Fallback về giọng hệ thống cho chunk này
        playSystemChunk(text, currentOptions);
      }
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
  currentOptions = {};

  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch (e) {
      console.error('[ttsService] stop currentAudio pause error:', e);
    }
    currentAudio = null;
  }

  if (currentUtterance) {
    currentUtterance.onend = null;
    currentUtterance.onerror = null;
    currentUtterance = null;
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.error('[ttsService] stop speechSynthesis cancel error:', e);
    }
  }
}

// Khi một chunk hoàn thành, chuyển sang phát chunk tiếp theo
function onChunkFinished() {
  if (!isPlaying) return;
  queueIndex++;
  playCurrentChunk();
}

// Phát âm một chunk bằng giọng hệ thống
function playSystemChunk(chunk, options = {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('[ttsService] Web Speech API không được hỗ trợ.');
    onChunkFinished();
    return;
  }

  if (currentUtterance) {
    currentUtterance.onend = null;
    currentUtterance.onerror = null;
  }

  const trimmed = chunk.trim();
  if (!trimmed) {
    onChunkFinished();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = 'de-DE';
  utterance.rate = options.rate || 0.95;
  utterance.pitch = options.pitch || 1.0;

  const voices = window.speechSynthesis.getVoices();
  const deVoice = voices.find(voice => voice.lang.startsWith('de'));
  if (deVoice) {
    utterance.voice = deVoice;
  }

  utterance.onend = () => {
    if (currentUtterance === utterance) {
      currentUtterance = null;
      onChunkFinished();
    }
  };

  utterance.onerror = (e) => {
    console.warn('[ttsService] SpeechSynthesis error:', e);
    if (currentUtterance === utterance) {
      currentUtterance = null;
      onChunkFinished();
    }
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

// Phát tệp âm thanh WAV Blob nhận được từ Piper Worker
function playWavBlob(blob) {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      if (currentAudio === audio) {
        currentAudio = null;
        onChunkFinished();
      }
    };

    audio.onerror = (err) => {
      console.error('[ttsService] Piper WAV play error:', err);
      URL.revokeObjectURL(audioUrl);
      if (currentAudio === audio) {
        currentAudio = null;
        const currentChunk = audioQueue[queueIndex];
        playSystemChunk(currentChunk, currentOptions);
      }
    };

    audio.play().catch(err => {
      console.error('[ttsService] Piper WAV play catch:', err);
      URL.revokeObjectURL(audioUrl);
      if (currentAudio === audio) {
        currentAudio = null;
        const currentChunk = audioQueue[queueIndex];
        playSystemChunk(currentChunk, currentOptions);
      }
    });
  } catch (e) {
    console.error('[ttsService] playWavBlob error:', e);
    onChunkFinished();
  }
}

// Phát âm một chunk bằng Google TTS
function playGoogleChunk(chunk) {
  const trimmed = chunk.trim();
  if (!trimmed) {
    onChunkFinished();
    return;
  }

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=de&client=tw-ob&q=${encodeURIComponent(trimmed)}`;
  
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  const audio = new Audio(url);
  currentAudio = audio;

  audio.onended = () => {
    if (currentAudio === audio) {
      currentAudio = null;
      onChunkFinished();
    }
  };

  audio.onerror = () => {
    console.warn('[ttsService] Google TTS error, falling back to system voice.');
    if (currentAudio === audio) {
      currentAudio = null;
      playSystemChunk(trimmed, currentOptions);
    }
  };

  audio.play().catch(() => {
    console.warn('[ttsService] Google TTS play catch, falling back to system voice.');
    if (currentAudio === audio) {
      currentAudio = null;
      playSystemChunk(trimmed, currentOptions);
    }
  });
}

// Phát âm một chunk bằng Piper WASM
function playPiperChunk(chunk) {
  const trimmed = chunk.trim();
  if (!trimmed) {
    onChunkFinished();
    return;
  }

  if (piperWorker && isPiperWorkerReady) {
    piperWorker.postMessage({
      type: 'speak',
      text: trimmed,
      speed: currentOptions.rate || 1.0,
      speakerId: 0
    });
  } else {
    console.warn('[ttsService] Piper worker not ready, falling back to system voice.');
    playSystemChunk(trimmed, currentOptions);
  }
}

// Điều phối phát chunk hiện tại dựa trên cấu hình nhà cung cấp
function playCurrentChunk() {
  if (!isPlaying) return;

  if (queueIndex >= audioQueue.length) {
    isPlaying = false;
    const onEndCallback = currentOnEnd;
    currentOnEnd = null;
    if (onEndCallback) {
      onEndCallback();
    }
    return;
  }

  const chunk = audioQueue[queueIndex];
  const provider = localStorage.getItem('goethe_tts_provider') || 'google';

  if (provider === 'system') {
    playSystemChunk(chunk, currentOptions);
  } else if (provider === 'piper') {
    if (!isPiperWorkerReady) {
      console.warn('[ttsService] Piper chưa được tải, tự động chuyển về Google AI');
      playGoogleChunk(chunk);
    } else {
      playPiperChunk(chunk);
    }
  } else {
    playGoogleChunk(chunk);
  }
}

// Phương thức phát âm chính
export function speak(text, options = {}) {
  // Dừng mọi âm thanh và hàng đợi cũ trước khi thiết lập phiên phát mới
  stop();

  currentOnEnd = options.onEnd || null;
  currentOptions = options || {};

  const chunks = splitTextIntoChunks(text, 180);
  if (!chunks.length) {
    if (currentOnEnd) {
      const onEndCallback = currentOnEnd;
      currentOnEnd = null;
      onEndCallback();
    }
    return;
  }

  audioQueue = chunks;
  queueIndex = 0;
  isPlaying = true;

  playCurrentChunk();
}

// Bắt đầu tải và cache gói mô hình Piper
export function loadPiper(onProgress, onStatus) {
  onPiperProgress = onProgress;
  onPiperStatus = onStatus;

  initPiperWorker();
  
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
