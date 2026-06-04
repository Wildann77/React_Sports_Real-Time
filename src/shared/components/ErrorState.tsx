import React, { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
  icon?: ReactNode;
  tone?: 'destructive' | 'warning' | 'info';
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading content.',
  retry,
  icon,
  tone = 'destructive',
  className,
}: ErrorStateProps) {
  const toneConfigs = {
    destructive: {
      bg: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]',
      defaultIcon: <ShieldAlert className="h-6 w-6" />,
    },
    warning: {
      bg: 'bg-warning/10 text-warning border-warning/20',
      defaultIcon: <AlertTriangle className="h-6 w-6" />,
    },
    info: {
      bg: 'bg-primary/10 text-primary border-primary/20',
      defaultIcon: <AlertCircle className="h-6 w-6" />,
    },
  };

  const current = toneConfigs[tone] || toneConfigs.destructive;

  return (
    <div className={cn('flex flex-col justify-center items-center p-8 h-full min-h-[300px] text-center max-w-sm mx-auto space-y-4', className)}>
      <div className={cn('p-4 rounded-full flex items-center justify-center border shadow-sm', current.bg)}>
        {icon || current.defaultIcon}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-bold tracking-tight font-display text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
          {message}
        </p>
      </div>

      {retry && (
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={retry}
            className="rounded-full font-bold border-border/80 hover:bg-secondary cursor-pointer"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
export default ErrorState;
