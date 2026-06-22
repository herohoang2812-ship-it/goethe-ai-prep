import { useState, useEffect } from 'react';
import { AlertTriangle, Brain } from 'lucide-react';

export default function GradingOverlay({ isActive, message = "Hệ thống AI đang chấm bài của bạn...", estimatedSeconds = 30 }) {
  const [timeLeft, setTimeLeft] = useState(estimatedSeconds);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Reset timers when overlay becomes active
  useEffect(() => {
    if (isActive) {
      setTimeLeft(estimatedSeconds);
      setElapsedTime(0);
    }
  }, [isActive, estimatedSeconds]);

  // Main countdown & elapsed timer
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Tab Title updating logic & clean up
  useEffect(() => {
    if (!isActive) return;

    const originalTitle = document.title;
    
    // Update immediately
    if (timeLeft > 0) {
      document.title = `⏳ Chấm bài (${timeLeft}s) | Goethe Prep`;
    } else {
      document.title = `⏳ Đang lưu kết quả (+${elapsedTime}s) | Goethe Prep`;
    }

    return () => {
      document.title = originalTitle;
    };
  }, [isActive]);

  // Reactive Title update when timeLeft or elapsedTime changes
  useEffect(() => {
    if (!isActive) return;
    
    if (timeLeft > 0) {
      document.title = `⏳ Chấm bài (${timeLeft}s) | Goethe Prep`;
    } else {
      document.title = `⏳ Đang lưu kết quả (+${elapsedTime}s) | Goethe Prep`;
    }
  }, [isActive, timeLeft, elapsedTime]);

  // beforeunload listener to prevent tab close/reload
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e) => {
      const warningText = 'Hệ thống đang chấm bài thi bằng AI. Nếu bạn rời đi bây giờ, kết quả chấm có thể không được lưu lại. Bạn có chắc chắn muốn rời đi?';
      e.preventDefault();
      e.returnValue = warningText;
      return warningText;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive]);

  if (!isActive) return null;

  // Dynamic status messages based on elapsed time
  const getStatusText = () => {
    if (elapsedTime < 8) {
      return "Đang phân tích cấu trúc ngữ pháp và lỗi chính tả";
    } else if (elapsedTime < 16) {
      return "Đang đánh giá tính mạch lạc và từ vựng chuyên sâu";
    } else if (elapsedTime < 24) {
      return "Đang đối chiếu tiêu chí chuẩn khung chấm thi B1/B2";
    } else {
      return "Đang biên soạn bài viết tham khảo nâng cao và trả kết quả";
    }
  };

  return (
    <div className="grading-overlay-backdrop">
      <div className="grading-overlay-card">
        {/* Animated Scanner Effect */}
        <div className="grading-scanner-container">
          <Brain size={44} className="text-primary hover-pulse" style={{ opacity: 0.85 }} />
          <div className="grading-scanner-line"></div>
        </div>

        {/* Dynamic Countdown */}
        <div>
          {timeLeft > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thời gian chờ dự kiến</span>
              <div className="grading-circle-timer">{timeLeft}s</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI đang hoàn tất</span>
              <div className="grading-circle-timer" style={{ color: 'var(--success)', textShadow: '0 0 12px rgba(34, 197, 94, 0.3)' }}>+{elapsedTime}s</div>
            </div>
          )}
        </div>

        {/* Main Status Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{message}</h3>
          <div className="grading-status-step text-primary">
            {getStatusText()}<span className="grading-dots"></span>
          </div>
        </div>

        {/* Visual Pulse Warning */}
        <div className="grading-pulse-warning">
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span style={{ textAlign: 'left' }}>
            Vui lòng <strong>không chuyển tab</strong> hoặc <strong>tải lại trang</strong> để tránh làm gián đoạn kết nối chấm bài của AI!
          </span>
        </div>
      </div>
    </div>
  );
}
