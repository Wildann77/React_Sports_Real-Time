import { StatCard } from '@/shared/components/StatCard';
import { Activity, Timer, Calendar, Trophy } from 'lucide-react';

interface QuickStatsWidgetProps {
  totalCount: number;
  liveCount: number;
  scheduledCount: number;
  finishedCount: number;
}

export function QuickStatsWidget({
  totalCount,
  liveCount,
  scheduledCount,
  finishedCount,
}: QuickStatsWidgetProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
      <StatCard
        icon={Activity}
        label="Total Matches"
        value={totalCount}
        tone="default"
      />
      <StatCard
        icon={Timer}
        label="Live Now"
        value={liveCount}
        tone={liveCount > 0 ? 'live' : 'default'}
        pulse={liveCount > 0}
      />
      <StatCard
        icon={Calendar}
        label="Scheduled"
        value={scheduledCount}
        tone="default"
      />
      <StatCard
        icon={Trophy}
        label="Finished Today"
        value={finishedCount}
        tone="success"
      />
    </div>
  );
}
