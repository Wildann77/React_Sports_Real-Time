import * as React from 'react';
import { Input } from '@/shared/ui/input';
import { Search, X } from 'lucide-react';

interface MatchSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MatchSearchBar({ value, onChange, placeholder = 'Search by team name...' }: MatchSearchBarProps) {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 bg-secondary/20 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 rounded-full h-11"
      />
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
