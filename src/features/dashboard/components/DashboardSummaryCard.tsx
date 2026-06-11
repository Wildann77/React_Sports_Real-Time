import { Card, CardContent } from '@/shared/ui/card';

interface DashboardSummaryCardProps {
  displayName?: string;
  totalMatches: number;
  liveMatches: number;
}

export function DashboardSummaryCard({ displayName = 'Admin', totalMatches, liveMatches }: DashboardSummaryCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/40 bg-gradient-to-r from-card to-card/75 rounded-2xl shadow-lg p-6">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
      <CardContent className="relative z-10 p-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest text-primary font-display">
            Workspace
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
            Welcome back, {displayName}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            You have full control of the real-time match centre. Update live scores and broadcast commentaries instantly.
          </p>
        </div>

        <div className="flex gap-6 mt-2 sm:mt-0">
          <div className="space-y-0.5 border-l border-border/60 pl-4">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Total Managed
            </span>
            <div className="text-2xl font-black font-display text-foreground">{totalMatches}</div>
          </div>
          <div className="space-y-0.5 border-l border-border/60 pl-4">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Live Broadcasts
            </span>
            <div className="text-2xl font-black font-display text-primary flex items-center gap-1.5">
              {liveMatches}
              {liveMatches > 0 && (
                <span className="h-2 w-2 rounded-full bg-primary motion-safe:animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
