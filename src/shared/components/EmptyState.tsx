import React, { ReactNode } from 'react';
import { FileQuestion, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/shared/utils';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: 'empty' | 'info' | 'warn';
  className?: string;
}

export function EmptyState({
  title = 'No data found',
  message,
  icon,
  action,
  tone = 'empty',
  className,
}: EmptyStateProps) {
  const toneConfigs = {
    empty: {
      bg: 'bg-secondary text-muted-foreground',
      defaultIcon: <FileQuestion className="h-6 w-6" />,
    },
    info: {
      bg: 'bg-primary/10 text-primary',
      defaultIcon: <Info className="h-6 w-6" />,
    },
    warn: {
      bg: 'bg-warning/10 text-warning',
      defaultIcon: <AlertTriangle className="h-6 w-6" />,
    },
  };

  const current = toneConfigs[tone] || toneConfigs.empty;

  return (
    <div className={cn('flex flex-col justify-center items-center p-8 h-full min-h-[300px] text-center max-w-sm mx-auto space-y-4', className)}>
      <div className={cn('p-4 rounded-full flex items-center justify-center border border-border/20 shadow-sm', current.bg)}>
        {icon || current.defaultIcon}
      </div>
      
      <div className="space-y-1.5">
        <h3 className="text-lg font-bold tracking-tight font-display">{title}</h3>
        {message && (
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            {message}
          </p>
        )}
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
export default EmptyState;
