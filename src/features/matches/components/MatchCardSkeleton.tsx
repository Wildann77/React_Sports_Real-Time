import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/components/Skeleton';

export const MatchCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm rounded-xl">
      {/* Top Zone Skeleton */}
      <div className="h-24 w-full bg-muted/40 relative flex items-end justify-between p-4 border-b border-border/10">
        <Skeleton className="h-10 w-10 rounded-lg bg-muted" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Content Zone Skeleton */}
      <CardContent className="p-5 space-y-4">
        <Skeleton className="h-3 w-16" />

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-8 font-mono" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-6 w-8 font-mono" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-4 pt-4 border-t border-border/40 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4" circle />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
