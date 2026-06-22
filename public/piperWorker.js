// ─────────────────────────────────────────────────────────────────────────────
// Piper TTS Web Worker — Chạy mô hình tiếng Đức cục bộ bằng WebAssembly
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_NAME = 'goethe-piper-tts-cache-v1';
const BASE_CDN = 'https://huggingface.co/csukuangfj/sherpa-onnx-tts-de-thorsten/resolve/main';

const FILES = {
  wasmJs: `${BASE_CDN}/sherpa-onnx-tts-worker.js`,
  wasmWasm: `${BASE_CDN}/sherpa-onnx-tts.wasm`,
  espeakData: `${BASE_CDN}/espeak-ng-data.tar`,
  model: `${BASE_CDN}/de_DE-thorsten-medium.onnx`,
  tokens: `${BASE_CDN}/tokens.txt`
};

let ttsInstance = null;
let Module = null;

// Hàm tải tệp tin có báo cáo tiến độ và lưu vào Cache Storage
async function fetchWithProgress(url, fileKey, onProgress) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(url);
  
  if (cachedResponse) {
    console.log(`[Piper Worker] Đọc từ cache: ${fileKey}`);
    const blob = await cachedResponse.blob();
    return await blob.arrayBuffer();
  }

  console.log(`[Piper Worker] Bắt đầu tải mới: ${fileKey}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Không thể tải tệp: ${url} (Status: ${response.status})`);

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  let loaded = 0;

  const reader = response.body.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    if (total > 0 && onProgress) {
      onProgress(fileKey, loaded, total);
    }
  }

  const allChunks = new Uint8Array(loaded);
  let position = 0;
  for (const chunk of chunks) {
    allChunks.set(chunk, position);
    position += chunk.length;
  }

  // Lưu response vào cache để dùng offline lần sau
  const headers = new Headers({ 'Content-Length': String(loaded) });
  const responseToCache = new Response(allChunks.buffer, { headers });
  await cache.put(url, responseToCache);

  return allChunks.buffer;
}

// Khởi động tải tất cả tài nguyên cần thiết cho Piper
async function loadResources() {
  try {
    self.postMessage({ type: 'status', status: 'downloading', message: 'Bắt đầu tải gói giọng nói...' });

    const totalSizes = {
      model: 63100000,     // ~63MB
      espeakData: 2300000, // ~2.3MB
      tokens: 35000,       // ~35KB
      wasmWasm: 4200000,   // ~4.2MB
      wasmJs: 80000        // ~80KB
    };

    let loadedSizes = {};
    const reportProgress = (fileKey, loaded, total) => {
      loadedSizes[fileKey] = loaded;
      const totalLoaded = Object.values(loadedSizes).reduce((a, b) => a + b, 0);
      const grandTotal = Object.values(totalSizes).reduce((a, b) => a + b, 0);
      const percent = Math.min(Math.round((totalLoaded / grandTotal) * 100), 99);
      
      self.postMessage({ 
        type: 'progress', 
        percent, 
        message: `Đang tải bộ giọng nói Đức Thorsten: ${percent}% (${Math.round(totalLoaded/1024/1024)}MB / ${Math.round(grandTotal/1024/1024)}MB)` 
      });
    };

    // Tải song song tất cả tài nguyên
    const [modelBuf, espeakBuf, tokensBuf, wasmBuf, jsBuf] = await Promise.all([
      fetchWithProgress(FILES.model, 'model', reportProgress),
      fetchWithProgress(FILES.espeakData, 'espeakData', reportProgress),
      fetchWithProgress(FILES.tokens, 'tokens', reportProgress),
      fetchWithProgress(FILES.wasmWasm, 'wasmWasm', reportProgress),
      fetchWithProgress(FILES.wasmJs, 'wasmJs', reportProgress)
    ]);

    self.postMessage({ type: 'status', status: 'initializing', message: 'Đang khởi tạo bộ giải dịch WASM...' });

    // Chuyển đổi jsBuffer thành chuỗi text để import động
    const jsDecoder = new TextDecoder('utf-8');
    const jsCode = jsDecoder.decode(new Uint8Array(jsBuf));
    
    // Inject mã của worker vào runtime
    // Đoạn code glue js này sẽ định nghĩa biến toàn cục Module
    const blob = new Blob([jsCode], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);
    importScripts(blobUrl);
    URL.revokeObjectURL(blobUrl);

    // Module sẽ được cung cấp bởi thư viện sherpa-onnx-tts-worker.js
    if (typeof createSherpaOnnxTts === 'undefined' && typeof self.createSherpaOnnxTts === 'undefined') {
      throw new Error('createSherpaOnnxTts is not defined in the loaded JS.');
    }

    const initTts = typeof createSherpaOnnxTts !== 'undefined' ? createSherpaOnnxTts : self.createSherpaOnnxTts;

    // Khởi tạo đối tượng WebAssembly Module
    Module = await initTts({
      wasmBinary: wasmBuf,
      print: console.log,
      printErr: console.error
    });

    // Ghi các file buffer vào hệ thống tệp ảo của Emscripten (FS)
    Module.FS.writeFile('/de_DE-thorsten-medium.onnx', new Uint8Array(modelBuf));
    Module.FS.writeFile('/tokens.txt', new Uint8Array(tokensBuf));
    Module.FS.writeFile('/espeak-ng-data.tar', new Uint8Array(espeakBuf));
    
    // Tạo thư mục và giải nén espeak-ng-data
    Module.FS.mkdir('/espeak-ng-data');
    // sherpa-onnx cung cấp hàm giải nén tar ảo nội bộ
    if (Module.unzipTar) {
      Module.unzipTar('/espeak-ng-data.tar', '/espeak-ng-data');
    } else {
      // Fallback nếu không có hàm unzip: sherpa-onnx sẽ tự động giải nén khi khởi tạo nếu đọc file tar
      Module.FS.writeFile('/espeak-ng-data.tar', new Uint8Array(espeakBuf));
    }

    // Cấu hình khởi tạo bộ TTS của Sherpa-Onnx
    const ttsConfig = {
      vits: {
        model: '/de_DE-thorsten-medium.onnx',
        tokens: '/tokens.txt',
        dataDir: '/espeak-ng-data',
        noiseScale: 0.667,
        noiseScaleW: 0.8,
        lengthScale: 1.0
      },
      numThreads: 1,
      provider: 'cpu'
    };

    ttsInstance = new Module.SherpaOnnxTts(ttsConfig);

    self.postMessage({ type: 'status', status: 'ready', message: 'Giọng đọc Piper Đức (Thorsten) đã sẵn sàng!' });
  } catch (error) {
    console.error('[Piper Worker] Lỗi khởi tạo:', error);
    self.postMessage({ type: 'status', status: 'error', message: `Lỗi tải giọng nói: ${error.message}` });
  }
}

// Hàm ghi mã WAV từ mảng PCM Float32
function writeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, 1, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 2, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  // Ghi PCM samples dưới dạng 16-bit signed integer
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Xử lý các tin nhắn từ Main Thread
self.onmessage = async (e) => {
  const { type, text, speed = 1.0, speakerId = 0 } = e.data;

  if (type === 'load') {
    await loadResources();
  } else if (type === 'speak') {
    if (!ttsInstance) {
      self.postMessage({ type: 'speak_error', message: 'Mô hình chưa được khởi tạo thành công.' });
      return;
    }

    try {
      // Cấu hình tốc độ đọc động
      ttsInstance.setSpeed(speed);

      // Tạo giọng nói (generate âm thanh)
      // Hàm generate trả về đối tượng có { samples: Float32Array, sampleRate: number }
      const audioObj = ttsInstance.generate(text, speakerId);
      
      if (!audioObj || !audioObj.samples || audioObj.samples.length === 0) {
        throw new Error('Sinh dữ liệu PCM trống.');
      }

      // Đóng gói mảng Float32 PCM thành file WAV Blob
      const wavBlob = writeWav(audioObj.samples, audioObj.sampleRate);
      
      self.postMessage({ 
        type: 'speak_success', 
        blob: wavBlob, 
        text 
      });
    } catch (err) {
      console.error('[Piper Worker] Lỗi phát âm:', err);
      self.postMessage({ type: 'speak_error', message: `Lỗi phát âm: ${err.message}` });
    }
  } else if (type === 'check_status') {
    if (ttsInstance) {
      self.postMessage({ type: 'status', status: 'ready', message: 'Giọng đọc Piper Đức (Thorsten) đã sẵn sàng!' });
    } else {
      // Kiểm tra xem đã có cache chưa
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(FILES.model);
      self.postMessage({ type: 'status', status: cached ? 'cached' : 'not_loaded', message: cached ? 'Gói giọng nói đã tải về máy học viên. Cần kích hoạt.' : 'Chưa tải gói giọng nói.' });
    }
  }
};
