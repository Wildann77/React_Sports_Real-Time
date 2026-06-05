import React from 'react';
import { Activity, MessageSquare, Check } from 'lucide-react';
import { cn } from '@/shared/utils';

interface ScopeToggleProps {
  scope: 'matches:write' | 'commentary:write';
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ScopeToggle: React.FC<ScopeToggleProps> = ({
  scope,
  description,
  checked,
  onChange,
}) => {
  const Icon = scope === 'matches:write' ? Activity : MessageSquare;

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={cn(
        'w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none',
        checked
          ? 'bg-primary/5 border-primary/45 shadow-[0_0_15px_rgba(29,185,84,0.05)]'
          : 'bg-card/40 border-border/40 hover:border-border hover:bg-card'
      )}
    >
      <div className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm transition-all',
        checked 
          ? 'bg-primary/10 text-primary border-primary/20' 
          : 'bg-secondary text-muted-foreground border-border/60'
      )}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            'font-mono text-sm font-bold tracking-tight',
            checked ? 'text-primary' : 'text-foreground'
          )}>
            {scope}
          </span>
          {checked && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30">
              <Check className="h-3 w-3 stroke-[3]" />
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
};
export default ScopeToggle;
