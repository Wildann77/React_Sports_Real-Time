import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/components/Skeleton';

export const MatchInfoSkeleton: React.FC = () => {
  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-sm rounded-xl">
      <CardHeader className="py-4 px-6 border-b border-border/40 bg-secondary/10 rounded-t-xl">
        <CardTitle className="text-base font-bold font-display">
          <Skeleton className="h-5 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Sport row */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="space-y-1 w-full">
            <Skeleton className="h-2 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Kickoff row */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="space-y-1 w-full">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        {/* Event Details border top */}
        <div className="border-t border-border/40 pt-4 mt-2 space-y-3">
          <Skeleton className="h-2.5 w-24 mb-2" />
          <div className="flex justify-between items-center py-1">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <div className="flex justify-between items-center py-1">
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchInfoSkeleton;
