import { useQueries } from '@tanstack/react-query';
import { Match, Commentary } from '@/shared/types/models';
import { getMatchCommentary } from '@/features/matches/api/matches';
import { QueryKeys } from '@/shared/constants/query-keys';
import { MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentCommentaryWidgetProps {
  matches: Match[];
}

export function RecentCommentaryWidget({ matches }: RecentCommentaryWidgetProps) {
  // Take the first 3 matches to fetch commentaries in parallel
  const targetMatches = matches.slice(0, 3);

  const commentaryQueries = useQueries({
    queries: targetMatches.map((match) => ({
      queryKey: QueryKeys.matchCommentary(match.id),
      queryFn: () => getMatchCommentary(match.id),
      staleTime: match.status === 'live' ? 10_000 : 60_000,
    })),
  });

  const isLoading = commentaryQueries.some((q) => q.isLoading);

  const allCommentaries = commentaryQueries.reduce<Array<Commentary & { matchName: string }>>(
    (acc, query, index) => {
      const match = targetMatches[index];
      if (query.data) {
        const mapped = query.data.map((c) => ({
          ...c,
          matchName: `${match.homeTeam} vs ${match.awayTeam}`,
        }));
        acc.push(...mapped);
      }
      return acc;
    },
    []
  );

  const recentCommentaries = allCommentaries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h3 className="text-lg font-bold tracking-tight font-display">Recent Commentary Feed</h3>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-16 rounded-xl bg-secondary/20 animate-pulse border border-border/10" />
            ))}
          </div>
        ) : recentCommentaries.length === 0 ? (
          <div className="rounded-xl border border-border/40 bg-card/40 p-6 text-center text-muted-foreground text-xs font-semibold">
            No commentaries recorded yet.
          </div>
        ) : (
          recentCommentaries.map((comm) => (
            <div
              key={comm.id}
              className="p-4 rounded-xl bg-card border border-border/40 hover:border-border/60 transition-all duration-200 space-y-1.5 shadow-sm"
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-extrabold text-primary uppercase tracking-wider">
                  {comm.matchName}
                </span>
                <span className="text-muted-foreground font-medium">
                  Min {comm.minute}' • {formatDistanceToNow(new Date(comm.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground/90">{comm.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
