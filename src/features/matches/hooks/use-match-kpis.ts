import { useMemo } from 'react';
import { Match, MatchStatusEnum } from '@/shared/types/models';

export function useMatchKpis(matches: Match[] | null | undefined) {
  return useMemo(() => {
    if (!matches || !Array.isArray(matches)) {
      return { liveCount: 0, scheduledCount: 0, finishedCount: 0 };
    }

    let liveCount = 0;
    let scheduledCount = 0;
    let finishedCount = 0;

    for (const match of matches) {
      if (match.status === MatchStatusEnum.LIVE) {
        liveCount++;
      } else if (match.status === MatchStatusEnum.FINISHED) {
        finishedCount++;
      } else {
        scheduledCount++;
      }
    }

    return { liveCount, scheduledCount, finishedCount };
  }, [matches]);
}
