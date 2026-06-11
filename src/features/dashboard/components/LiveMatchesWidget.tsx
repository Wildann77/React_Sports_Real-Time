import { Link } from 'react-router-dom';
import { Match } from '@/shared/types/models';
import { MatchListItem } from '@/features/matches/components/MatchListItem';
import { Button } from '@/shared/ui/button';
import { MessageSquarePlus, Play } from 'lucide-react';

interface LiveMatchesWidgetProps {
  matches: Match[];
}

export function LiveMatchesWidget({ matches }: LiveMatchesWidgetProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary motion-safe:animate-pulse" />
        <h3 className="text-lg font-bold tracking-tight font-display">Live Matches Now</h3>
      </div>

      <div className="space-y-3">
        {matches.length === 0 ? (
          <div className="rounded-xl border border-border/40 bg-card/40 p-8 text-center text-muted-foreground font-semibold text-sm flex flex-col items-center justify-center gap-2">
            <Play className="h-6 w-6 text-muted-foreground/60" />
            <span>No matches are currently live.</span>
          </div>
        ) : (
          matches.map((match) => (
            <MatchListItem
              key={match.id}
              match={match}
              action={
                <Button variant="outline" size="sm" className="rounded-full font-semibold border-border/85 hover:bg-secondary cursor-pointer" asChild>
                  <Link to={`/admin/matches/${match.id}/commentary`}>
                    <MessageSquarePlus className="mr-1.5 h-3.5 w-3.5" />
                    Commentary
                  </Link>
                </Button>
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
