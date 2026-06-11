import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsClient, WebSocketEvent } from '@/shared/lib/websocket';
import { QueryKeys } from '@/shared/constants/query-keys';
import { Commentary, Match } from '@/shared/types/models';

export function useMatchLiveUpdates(matchId: number, isReady: boolean) {
  const queryClient = useQueryClient();

  const handleEvent = useCallback(
    (event: WebSocketEvent) => {
      if (!('matchId' in event) || event.matchId !== matchId) {
        return;
      }

      if (import.meta.env.DEV) {
        console.log('[useMatchLiveUpdates] Event received:', event);
      }

      if (event.type === 'match.updated') {
        if (import.meta.env.DEV) {
          console.log('[useMatchLiveUpdates] match.updated event:', event.data);
        }
        queryClient.setQueryData<Match | undefined>(
          QueryKeys.matchDetail(matchId),
          (current) => {
            if (!current) {
              return current;
            }

            return {
              ...current,
              homeScore: event.data.homeScore,
              awayScore: event.data.awayScore,
              status: event.data.status,
            };
          }
        );
        queryClient.invalidateQueries({ queryKey: QueryKeys.matches });
      }

      if (event.type === 'commentary.created') {
        if (import.meta.env.DEV) {
          console.log('[useMatchLiveUpdates] commentary.created event:', event.data);
        }
        queryClient.setQueryData<Commentary[]>(
          QueryKeys.matchCommentary(matchId),
          (current = []) => {
            if (current.some((item) => item.id === event.data.id)) {
              return current;
            }

            return [...current, event.data].sort(
              (left, right) =>
                new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
            );
          }
        );

        // Update match score if payload contains score changes
        if (event.data.payload && ('homeScore' in event.data.payload || 'awayScore' in event.data.payload)) {
          if (import.meta.env.DEV) {
            console.log('[useMatchLiveUpdates] Updating score from commentary payload:', event.data.payload);
          }
          queryClient.setQueryData<Match | undefined>(
            QueryKeys.matchDetail(matchId),
            (current) => {
              if (!current) return current;
              const updated = {
                ...current,
                homeScore: event.data.payload.homeScore ?? current.homeScore,
                awayScore: event.data.payload.awayScore ?? current.awayScore,
              };
              if (import.meta.env.DEV) {
                console.log('[useMatchLiveUpdates] Score updated:', { from: current, to: updated });
              }
              return updated;
            }
          );
        }
      }
    },
    [matchId, queryClient]
  );

  useEffect(() => {
    if (!matchId || !isReady) {
      return;
    }

    wsClient.connect();
    wsClient.subscribeMatch(matchId);
    const unsub = wsClient.subscribe(handleEvent);

    return () => {
      unsub();
      wsClient.unsubscribeMatch(matchId);
    };
  }, [matchId, isReady, handleEvent]);
}
