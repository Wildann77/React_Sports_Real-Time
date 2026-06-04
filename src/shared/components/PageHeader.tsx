import React, { ReactNode } from 'react';
import { cn } from '@/shared/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
  breadcrumb?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  eyebrow,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end pb-2', className)}>
      <div className="space-y-1">
        {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
        {eyebrow && (
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-primary font-display block mb-1">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl font-black tracking-tight font-display sm:text-4xl text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 pt-2 sm:pt-0">{action}</div>}
    </div>
  );
}
export default PageHeader;
