import React, { ReactNode, memo } from 'react';
import { Match } from '@/shared/types/models';
import { Badge } from '@/shared/ui/badge';
import { MatchStatusBadge } from './MatchStatusBadge';
import { cn } from '@/shared/utils';

interface MatchListItemProps {
  match: Match;
  action?: ReactNode;
}

export const MatchListItem = memo(function MatchListItem({ match, action }: MatchListItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card/40 border border-border/40 hover:border-primary/20 hover:bg-card/80 rounded-xl transition-all duration-200 gap-4">
      <div className="flex flex-row flex-wrap items-center gap-3 sm:grid sm:grid-cols-[90px_110px_1fr] sm:gap-4 min-w-0 flex-1">
        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 w-full justify-center">
          {match.sport}
        </Badge>
        
        <div className="flex sm:justify-start">
          <MatchStatusBadge status={match.status} />
        </div>

        <div className="flex items-center gap-2 font-display text-sm font-semibold truncate">
          <span className="text-foreground font-bold">{match.homeTeam}</span>
          <span className="text-muted-foreground font-medium">vs</span>
          <span className="text-foreground font-bold">{match.awayTeam}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
        <div className="flex items-center gap-1.5 font-mono text-base font-bold tabular-nums bg-secondary/80 px-2.5 py-1 rounded-md border border-border/60">
          <span>{match.homeScore}</span>
          <span className="text-primary font-sans text-xs">:</span>
          <span>{match.awayScore}</span>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
});
