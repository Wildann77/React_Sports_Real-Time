import React from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/shared/utils';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  lightText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className, lightText = false }) => {
  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const textSizes = {
    sm: 'text-sm font-bold tracking-tight',
    md: 'text-lg font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tighter',
  };

  const gapSizes = {
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-2.5',
  };

  return (
    <div className={cn('flex items-center text-primary select-none font-display', gapSizes[size], className)}>
      <Trophy className={cn(iconSizes[size], 'stroke-[2.5]')} />
      <span className={cn(lightText ? 'text-white' : 'text-foreground', textSizes[size])}>
        Sports <span className="text-primary">Dashboard</span>
      </span>
    </div>
  );
};
