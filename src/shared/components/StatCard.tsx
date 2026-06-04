import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  pulse?: boolean;
  tone?: 'default' | 'live' | 'success';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  pulse = false,
  tone = 'default',
  className,
}) => {
  const toneClasses = {
    default: 'text-muted-foreground bg-secondary/50 border-border/40',
    live: 'text-red-500 bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]',
    success: 'text-primary bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(29,185,84,0.05)]',
  };

  const textClasses = {
    default: 'text-foreground',
    live: 'text-red-500',
    success: 'text-primary',
  };

  return (
    <Card className={cn('overflow-hidden bg-card/60 backdrop-blur-sm transition-all duration-300 border border-border/40', toneClasses[tone], className)}>
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-2 min-w-0">
          <p className="text-xs uppercase font-extrabold tracking-widest text-muted-foreground truncate">
            {label}
          </p>
          <p className={cn('text-3xl font-black font-display tracking-tight tabular-nums', textClasses[tone])}>
            {value}
          </p>
        </div>

        <div className="relative flex items-center justify-center h-12 w-12 rounded-xl bg-card border border-border/20">
          {pulse && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping',
                tone === 'live' ? 'bg-red-500' : 'bg-primary'
              )} />
              <span className={cn(
                'relative inline-flex rounded-full h-3 w-3 border-2 border-card',
                tone === 'live' ? 'bg-red-500' : 'bg-primary'
              )} />
            </span>
          )}
          <Icon className={cn('h-5 w-5', textClasses[tone] || 'text-muted-foreground')} />
        </div>
      </CardContent>
    </Card>
  );
};
