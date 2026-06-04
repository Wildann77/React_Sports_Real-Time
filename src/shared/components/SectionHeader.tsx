import React, { ReactNode } from 'react';
import { cn } from '@/shared/utils';

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  eyebrow,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b border-border/40', className)}>
      <div className="space-y-1">
        {eyebrow && (
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-primary font-display">
            {eyebrow}
          </span>
        )}
        <h2 className="text-xl font-bold tracking-tight font-display sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground font-medium">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
