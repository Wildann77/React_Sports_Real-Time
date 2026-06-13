import { Tabs, TabsList, TabsTrigger } from '@/shared/ui';
import { MatchStatus, MatchStatusEnum } from '@/shared/types/models';
import { cn } from '@/shared/utils';

export function MatchFilterTabs({
  filter,
  setFilter,
  counts,
}: {
  filter: MatchStatus | 'all';
  setFilter: (val: MatchStatus | 'all') => void;
  counts?: { all: number; live: number; scheduled: number; finished: number };
}) {
  const getBadgeClass = (active: boolean) =>
    cn(
      'ml-1 rounded-full px-1.5 py-0.25 text-[10px] font-extrabold transition-all',
      active
        ? 'bg-background/15 text-background'
        : 'bg-muted-foreground/15 text-muted-foreground'
    );

  return (
    <Tabs value={filter} onValueChange={(val) => setFilter(val as MatchStatus | 'all')}>
      <TabsList className="inline-flex h-11 items-center justify-center rounded-full bg-muted p-1 text-muted-foreground border border-border/40">
        <TabsTrigger
          value="all"
          className={cn(
            'inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all select-none border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer text-muted-foreground hover:text-foreground',
            'data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md'
          )}
        >
          <span>All</span>
          {counts !== undefined && (
            <span className={getBadgeClass(filter === 'all')}>{counts.all}</span>
          )}
        </TabsTrigger>

        <TabsTrigger
          value={MatchStatusEnum.SCHEDULED}
          className={cn(
            'inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all select-none border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer text-muted-foreground hover:text-foreground',
            'data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md'
          )}
        >
          <span>Scheduled</span>
          {counts !== undefined && (
            <span className={getBadgeClass(filter === MatchStatusEnum.SCHEDULED)}>
              {counts.scheduled}
            </span>
          )}
        </TabsTrigger>

        <TabsTrigger
          value={MatchStatusEnum.LIVE}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all select-none border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer text-muted-foreground hover:text-foreground',
            'data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md'
          )}
        >
          {counts !== undefined && counts.live >= 1 && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
          )}
          <span>Live</span>
          {counts !== undefined && (
            <span className={getBadgeClass(filter === MatchStatusEnum.LIVE)}>{counts.live}</span>
          )}
        </TabsTrigger>

        <TabsTrigger
          value={MatchStatusEnum.FINISHED}
          className={cn(
            'inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all select-none border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer text-muted-foreground hover:text-foreground',
            'data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-md'
          )}
        >
          <span>Finished</span>
          {counts !== undefined && (
            <span className={getBadgeClass(filter === MatchStatusEnum.FINISHED)}>
              {counts.finished}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
export default MatchFilterTabs;
