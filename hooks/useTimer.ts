import { useEffect, useState } from 'react';

export function useTimer(startTime: Date | null) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const start = startTime.getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      setTime(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return time;
}
