import React from 'react';
import { cn } from '@/shared/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  width, 
  height, 
  circle = false,
  style,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'bg-muted rounded-md motion-safe:animate-pulse',
        circle && 'rounded-full',
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};
