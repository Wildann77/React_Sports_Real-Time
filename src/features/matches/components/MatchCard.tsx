import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/shared/ui/card';
import { Match } from '@/shared/types/models';
import { MatchStatusBadge } from './MatchStatusBadge';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { getSportIcon, getSportGradient } from '@/shared/utils/sport-meta';

export const MatchCard = memo(function MatchCard({ match }: { match: Match }) {
  const SportIcon = getSportIcon(match.sport);
  const gradient = getSportGradient(match.sport);

  const formattedStart = useMemo(() => format(new Date(match.startTime), 'MMM d, HH:mm'), [match.startTime]);
  const formattedEnd = useMemo(() => format(new Date(match.endTime), 'HH:mm'), [match.endTime]);

  return (
    <Link 
      to={`/matches/${match.id}`} 
      className="block group focus-visible:outline-none rounded-xl"
    >
      <Card className="overflow-hidden border-border/40 bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(29,185,84,0.08)] group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background rounded-xl">
        {/* Top Zone */}
        <div 
          className="h-24 w-full relative flex items-end justify-between p-4 border-b border-border/10"
          style={{ background: gradient }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-black/40 backdrop-blur-md text-primary border border-white/5">
            <SportIcon className="h-5 w-5" />
          </div>
          <div className="relative z-10">
            <MatchStatusBadge status={match.status} />
          </div>
        </div>

        {/* Content Zone */}
        <CardContent className="p-5 space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {match.sport}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="truncate pr-4 text-base font-bold font-display group-hover:text-primary transition-colors duration-250" title={match.homeTeam}>
                {match.homeTeam}
              </span>
              <span className="font-mono text-2xl font-semibold tabular-nums">
                {match.homeScore}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="truncate pr-4 text-base font-bold font-display group-hover:text-primary transition-colors duration-250" title={match.awayTeam}>
                {match.awayTeam}
              </span>
              <span className="font-mono text-2xl font-semibold tabular-nums">
                {match.awayScore}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-border/40 text-xs text-muted-foreground flex justify-between items-center font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{formattedStart}</span>
              <span>-</span>
              <span>{formattedEnd}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
