import React, { useEffect, useState, memo } from 'react';
import { Commentary } from '@/shared/types/models';
import { Badge } from '@/shared/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { getEventIcon, getEventColorClasses } from '@/shared/utils/event-meta';
import { cn } from '@/shared/utils';

export const CommentaryItem = memo(function CommentaryItem({ commentary }: { commentary: Commentary }) {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const createdTime = new Date(commentary.createdAt).getTime();
    const now = Date.now();
    // Highlight if created within the last 5 seconds (typically via WS)
    if (now - createdTime < 5000) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [commentary.createdAt]);

  const Icon = getEventIcon(commentary.eventType);
  const colors = getEventColorClasses(commentary.eventType);

  return (
    <div 
      className={cn(
        'p-5 flex gap-4 transition-all duration-700 border-l-2 border-transparent',
        highlight 
          ? 'bg-primary/5 border-l-primary shadow-[inset_4px_0_0_0_rgba(29,185,84,0.4)]' 
          : 'hover:bg-card/40'
      )}
    >
      {/* Event Minute Avatar with Badge Overlay */}
      <div className="relative shrink-0 select-none">
        <div className={cn(
          'w-11 h-11 rounded-full font-black font-display text-sm flex items-center justify-center border shadow-sm transition-all',
          colors.bg,
          colors.text,
          colors.border
        )}>
          {commentary.minute}'
        </div>
        <div className={cn(
          'absolute -bottom-1 -right-1 rounded-full p-1 border shadow-sm',
          colors.bg,
          colors.text,
          colors.border
        )}>
          <Icon className="w-3 h-3 stroke-[2.5]" />
        </div>
      </div>

      {/* Message and Metadata Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <Badge variant="outline" className={cn('text-[10px] uppercase font-bold tracking-wider py-0 px-2 bg-secondary/30', colors.border, colors.text)}>
            {commentary.eventType.replace('-', ' ')}
          </Badge>
          <span className="text-muted-foreground font-semibold" title={format(new Date(commentary.createdAt), 'PPpp')}>
            {formatDistanceToNow(new Date(commentary.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm font-medium leading-relaxed text-foreground break-words">
          {commentary.message}
        </p>
      </div>
    </div>
  );
});

// Simple format helper (fallback if format is needed)
function format(date: Date, pattern: string) {
  try {
    return date.toLocaleString();
  } catch (e) {
    return '';
  }
}
