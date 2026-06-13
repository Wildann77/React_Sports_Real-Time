import { memo } from 'react';
import { Match } from '@/shared/types/models';
import { Card, CardContent, Badge } from '@/shared/ui';
import { format } from 'date-fns';
import { Clock, Timer } from 'lucide-react';
import { MatchStatusBadge } from './MatchStatusBadge';
import { FavoriteButton } from './FavoriteButton';
import { ShareButton } from './ShareButton';
import { useLiveDuration } from '@/shared/hooks/use-live-duration';

function MatchDetailHeaderComponent({ match }: { match: Match }) {
  const liveDuration = useLiveDuration(match.startTime, match.status);

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-md rounded-2xl shadow-xl">
      {/* Radial Mood Background Glow */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsl(142, 76%, 41%, 0.3) 0%, transparent 70%)`
        }}
      />

      <CardContent className="relative z-10 p-8 md:p-12">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <Badge variant="secondary" className="text-xs font-bold uppercase tracking-widest px-3 py-1">
            {match.sport}
          </Badge>
          <div className="flex items-center gap-2">
            <FavoriteButton matchId={match.id} />
            <ShareButton />
            <MatchStatusBadge status={match.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-center justify-items-center text-center">
          {/* Home Team */}
          <div className="flex flex-col items-center md:items-end md:text-right w-full min-w-0 px-2">
            <h2 className="text-xl md:text-3xl lg:text-5xl font-black tracking-[-0.03em] font-display truncate max-w-full" title={match.homeTeam}>
              {match.homeTeam}
            </h2>
            <span className="text-xs uppercase font-semibold text-muted-foreground mt-1">Home</span>
          </div>

          {/* Score Panel */}
          <div className="flex flex-col items-center justify-center py-2 px-6">
            <div 
              className="flex items-center justify-center gap-3 text-6xl md:text-8xl font-black font-mono tracking-tighter tabular-nums text-foreground select-none"
              aria-live="polite"
              aria-atomic="true"
            >
              <span>{match.homeScore}</span>
              <span className="text-primary font-sans">:</span>
              <span>{match.awayScore}</span>
            </div>
            
            {/* Live Duration Timer */}
            {match.status === 'live' && liveDuration && (
              <div className="mt-3 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary tracking-wide uppercase border border-primary/20 motion-safe:animate-pulse">
                <Timer className="w-3.5 h-3.5" />
                <span>{liveDuration}</span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center md:items-start md:text-left w-full min-w-0 px-2">
            <h2 className="text-xl md:text-3xl lg:text-5xl font-black tracking-[-0.03em] font-display truncate max-w-full" title={match.awayTeam}>
              {match.awayTeam}
            </h2>
            <span className="text-xs uppercase font-semibold text-muted-foreground mt-1">Away</span>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between text-muted-foreground text-xs font-medium items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Kickoff: <span className="font-semibold text-foreground">{format(new Date(match.startTime), 'PPp')}</span></span>
          </div>
          <div>
            <span>Estimated End: <span className="font-semibold text-foreground">{format(new Date(match.endTime), 'p')}</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const MatchDetailHeader = memo(MatchDetailHeaderComponent);
