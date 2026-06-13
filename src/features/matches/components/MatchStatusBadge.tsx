import { Badge } from '@/shared/ui/badge';
import { MatchStatusEnum, MatchStatus } from '@/shared/types/models';
import { Calendar } from 'lucide-react';

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  if (status === MatchStatusEnum.LIVE) {
    return (
      <Badge variant="live" className="flex items-center gap-1 w-fit">
        <span className="relative flex h-1.5 w-1.5 mr-0.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        LIVE
      </Badge>
    );
  }
  if (status === MatchStatusEnum.FINISHED) {
    return <Badge variant="secondary" className="w-fit font-semibold">Finished</Badge>;
  }
  return (
    <Badge variant="outline" className="w-fit flex items-center gap-1 font-semibold text-muted-foreground border-border/80">
      <Calendar className="w-3 h-3 text-muted-foreground" /> Scheduled
    </Badge>
  );
}
