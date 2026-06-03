import { useEffect, useState } from 'react';
import { MatchStatus } from '@/shared/types/models';

export function useLiveDuration(startTime: string, status: MatchStatus): string | null {
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'live') {
      setDuration(null);
      return;
    }

    const calculateDuration = () => {
      const start = new Date(startTime).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, now - start);
      
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      
      if (hours > 0) {
        return `${hours}h ${mins}m`;
      }
      return `${mins}m`;
    };

    setDuration(calculateDuration());

    const interval = setInterval(() => {
      setDuration(calculateDuration());
    }, 60000);

    return () => clearInterval(interval);
  }, [startTime, status]);

  return duration;
}
