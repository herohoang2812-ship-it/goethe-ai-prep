import { useState, useEffect } from 'react';

export default function AnimatedScore({ target, suffix = '' }) {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (frame >= totalFrames) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [target]);

  return <>{current}{suffix}</>;
}
