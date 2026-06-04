import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Skeleton } from '@/shared/components/Skeleton';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 space-y-8 animate-pulse">
      {/* PageHeader Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* KPI Stats Strip Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="border-border/40 bg-card/60 rounded-xl p-5 flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-1 w-full">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          </Card>
        ))}
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Matches */}
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-64" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border border-border/40 bg-card/60 rounded-xl">
                <div className="flex items-center gap-3 w-full">
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-8 w-28 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Actions & Management */}
        <div className="space-y-6">
          <Skeleton className="h-5 w-24" />
          
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold font-display">
                <Skeleton className="h-5 w-28" />
              </CardTitle>
              <CardDescription className="text-xs">
                <Skeleton className="h-3 w-40" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-10 w-full rounded-full" />
              <Skeleton className="h-10 w-full rounded-full" />
              <div className="border-t border-border/40 pt-4 mt-2">
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
