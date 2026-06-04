import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '@/shared/utils';

interface LoadingStateProps {
  mode?: 'spinner' | 'skeleton';
  className?: string;
}

export function LoadingState({ mode = 'spinner', className }: LoadingStateProps) {
  if (mode === 'skeleton') {
    return (
      <div className={cn('p-6 space-y-4 w-full max-w-md mx-auto', className)}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-3 w-[70%]" />
          </div>
        </div>
        <Skeleton className="h-[120px] w-full" />
      </div>
    );
  }

  return (
    <div className={cn('flex justify-center items-center p-12 h-full min-h-[250px]', className)}>
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary/20 border-t-primary"></div>
      </div>
    </div>
  );
}
export default LoadingState;
