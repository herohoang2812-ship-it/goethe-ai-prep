// ─────────────────────────────────────────────────────────────────────────────
// Piper TTS Web Worker — Tải và chạy mô hình tiếng Đức cục bộ từ máy chủ nội bộ
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_NAME = 'goethe-piper-tts-local-cache-v1';

const FILES = {
  wasmJs: '/piper/sherpa-onnx-wasm-main-tts.js',
  ttsJs: '/piper/sherpa-onnx-tts.js',
  wasmWasm: '/piper/sherpa-onnx-wasm-main-tts.wasm',
  wasmData: '/piper/sherpa-onnx-wasm-main-tts.data'
};

let ttsInstance = null;

// Hàm tải tệp có báo cáo tiến độ và lưu vào Cache Storage
async function fetchWithProgress(url, fileKey, onProgress, cache) {
  const cachedResponse = await cache.match(url);
  
  if (cachedResponse) {
    console.log(`[Piper Worker] Đọc từ cache: ${fileKey}`);
    return await cachedResponse.blob();
  }

  console.log(`[Piper Worker] Tải mới: ${fileKey} từ ${url}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Không thể tải tệp ${fileKey}: ${response.statusText}`);

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

  const blob = new Blob([allChunks.buffer], { type: response.headers.get('content-type') || 'application/octet-stream' });
  
  // Lưu vào Cache
  const headers = new Headers({ 'Content-Length': String(loaded) });
  const responseToCache = new Response(blob, { headers });
  await cache.put(url, responseToCache);

  return blob;
}

// Khởi chạy tải tất cả tài nguyên từ server nội bộ
async function loadResources() {
  try {
    self.postMessage({ type: 'status', status: 'downloading', message: 'Bắt đầu tải gói giọng nói...' });

    // Tổng dung lượng dự kiến: ~106MB
    const totalSizes = {
      wasmJs: 80000,       // ~80KB
      ttsJs: 50000,        // ~50KB
      wasmWasm: 11590000,  // ~11.5MB
      wasmData: 94700000   // ~94.7MB
    };

    let loadedSizes = {};
    const cache = await caches.open(CACHE_NAME);

    const reportProgress = (fileKey, loaded, total) => {
      loadedSizes[fileKey] = loaded;
      const totalLoaded = Object.values(loadedSizes).reduce((a, b) => a + b, 0);
      const grandTotal = Object.values(totalSizes).reduce((a, b) => a + b, 0);
      const percent = Math.min(Math.round((totalLoaded / grandTotal) * 100), 99);
      
      self.postMessage({ 
        type: 'progress', 
        percent, 
        message: `Đang tải giọng nói Đức: ${percent}% (${Math.round(totalLoaded/1024/1024)}MB / ${Math.round(grandTotal/1024/1024)}MB)` 
      });
    };

    // Tải song song tất cả tài nguyên từ domain của app
    const [wasmJsBlob, ttsJsBlob, wasmWasmBlob, wasmDataBlob] = await Promise.all([
      fetchWithProgress(FILES.wasmJs, 'wasmJs', reportProgress, cache),
      fetchWithProgress(FILES.ttsJs, 'ttsJs', reportProgress, cache),
      fetchWithProgress(FILES.wasmWasm, 'wasmWasm', reportProgress, cache),
      fetchWithProgress(FILES.wasmData, 'wasmData', reportProgress, cache)
    ]);

    self.postMessage({ type: 'status', status: 'initializing', message: 'Đang khởi tạo bộ giải dịch WASM...' });

    // Tạo Object URL cho wasm và data để Emscripten load
    const wasmWasmUrl = URL.createObjectURL(wasmWasmBlob);
    const wasmDataUrl = URL.createObjectURL(wasmDataBlob);

    // Cấu hình Emscripten Module
    self.Module = {
      locateFile: function (path) {
        if (path === 'sherpa-onnx-wasm-main-tts.wasm') return wasmWasmUrl;
        if (path === 'sherpa-onnx-wasm-main-tts.data') return wasmDataUrl;
        return path;
      },
      setStatus: function (status) {
        console.log('[Piper WASM status]', status);
      },
      onRuntimeInitialized: function () {
        console.log('[Piper Worker] WASM Runtime initialized!');
        try {
          // Cấu hình cụ thể đường dẫn tệp trong VFS của WASM (.data file)
          const myConfig = {
            offlineTtsModelConfig: {
              offlineTtsVitsModelConfig: {
                model: './de_DE-thorsten_emotional-medium.onnx',
                lexicon: '',
                tokens: './tokens.txt',
                dataDir: './espeak-ng-data',
                noiseScale: 0.667,
                noiseScaleW: 0.8,
                lengthScale: 1.0,
              },
              numThreads: 1,
              debug: 1,
              provider: 'cpu',
            },
            ruleFsts: '',
            ruleFars: '',
            maxNumSentences: 1,
          };

          // Khởi tạo TTS engine với cấu hình đúng đường dẫn mô hình
          ttsInstance = createOfflineTts(self.Module, myConfig);
          self.postMessage({ type: 'status', status: 'ready', message: 'Giọng đọc Piper Đức (Thorsten) đã sẵn sàng!' });
        } catch (e) {
          console.error('[Piper Worker] Lỗi khởi tạo TTS:', e);
          self.postMessage({ type: 'status', status: 'error', message: `Lỗi khởi tạo TTS: ${e.message}` });
        }
      }
    };

    // Tạo Object URL cho các file JS và import động để chạy
    const wasmJsUrl = URL.createObjectURL(wasmJsBlob);
    const ttsJsUrl = URL.createObjectURL(ttsJsBlob);

    importScripts(wasmJsUrl);
    importScripts(ttsJsUrl);

    // Thu hồi URL tạm của JS sau khi import
    URL.revokeObjectURL(wasmJsUrl);
    URL.revokeObjectURL(ttsJsUrl);

  } catch (error) {
    console.error('[Piper Worker] Lỗi tải tài nguyên:', error);
    self.postMessage({ type: 'status', status: 'error', message: `Lỗi tải giọng nói: ${error.message}` });
  }
}

// Xử lý ghi file WAV từ Float32 samples
function writeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

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

self.onmessage = async (e) => {
  const { type, text, speed = 1.0, speakerId = 0 } = e.data;

  if (type === 'load') {
    await loadResources();
  } else if (type === 'speak') {
    if (!ttsInstance) {
      self.postMessage({ type: 'speak_error', message: 'Mô hình chưa được khởi tạo thành công.', text });
      return;
    }

    try {
      // Gọi generate âm thanh từ ttsInstance
      const audioObj = ttsInstance.generate({
        text: text,
        sid: speakerId || 0,
        speed: speed || 1.0
      });

      if (!audioObj || !audioObj.samples || audioObj.samples.length === 0) {
        throw new Error('Dữ liệu PCM sinh ra bị trống.');
      }

      const wavBlob = writeWav(audioObj.samples, ttsInstance.sampleRate);
      
      self.postMessage({ 
        type: 'speak_success', 
        blob: wavBlob, 
        text 
      });
    } catch (err) {
      console.error('[Piper Worker] Lỗi phát âm:', err);
      self.postMessage({ type: 'speak_error', message: `Lỗi phát âm: ${err.message}`, text });
    }
  } else if (type === 'check_status') {
    if (ttsInstance) {
      self.postMessage({ type: 'status', status: 'ready', message: 'Giọng đọc Piper Đức (Thorsten) đã sẵn sàng!' });
    } else {
      const cache = await caches.open(CACHE_NAME);
      const cachedWasm = await cache.match(FILES.wasmWasm);
      const cachedData = await cache.match(FILES.wasmData);
      const isCached = cachedWasm && cachedData;
      
      self.postMessage({ 
        type: 'status', 
        status: isCached ? 'cached' : 'not_loaded', 
        message: isCached ? 'Gói giọng nói đã tải về máy. Cần kích hoạt.' : 'Chưa tải gói giọng nói.' 
      });
    }
  }
};
