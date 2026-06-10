import React from 'react';
import { Activity } from 'lucide-react';

export const CommentaryTimelineEmpty: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-16 px-4 text-center max-w-sm mx-auto space-y-4">
      <div className="p-4 rounded-full bg-secondary border border-border/40 text-muted-foreground shadow-sm">
        <Activity className="h-6 w-6 motion-safe:animate-pulse" />
      </div>
      
      <div className="space-y-1.5">
        <h3 className="text-base font-bold tracking-tight font-display">Awaiting Commentary</h3>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
          No commentary events have been recorded for this match yet. Stay tuned for live updates.
        </p>
      </div>
    </div>
  );
};
export default CommentaryTimelineEmpty;
