import * as React from 'react';
import { Select } from '@/shared/ui/native-select';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { MatchSortOption } from '../types';

interface MatchAdvancedFiltersProps {
  sport: string;
  onSportChange: (sport: string) => void;
  sort: MatchSortOption;
  onSortChange: (sort: MatchSortOption) => void;
  onReset: () => void;
}

export function MatchAdvancedFilters({
  sport,
  onSportChange,
  sort,
  onSortChange,
  onReset,
}: MatchAdvancedFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hasActiveFilters = sport !== '' || sort !== 'date_desc';

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full px-4 h-9 font-semibold text-xs transition-colors duration-200 border-border/40 ${
            isOpen || hasActiveFilters
              ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-primary'
              : 'bg-secondary/30 hover:bg-secondary/60'
          }`}
        >
          <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
          {isOpen ? 'Hide Filters' : 'Advanced Filters'}
          {hasActiveFilters && (
            <span className="ml-1.5 rounded-full bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center font-bold">
              !
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="rounded-full h-9 px-3 text-xs text-muted-foreground hover:text-foreground font-semibold"
          >
            <RotateCcw className="mr-1.5 h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-card/60 border border-border/30 backdrop-blur-sm transition-all duration-300">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Filter by Sport
            </label>
            <Input
              type="text"
              value={sport}
              onChange={(e) => onSportChange(e.target.value)}
              placeholder="e.g. Football, Basketball..."
              className="bg-secondary/20 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0 h-9 text-xs rounded-md"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Sort Matches By
            </label>
            <Select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as MatchSortOption)}
              className="bg-secondary/20 border-border/50 focus:ring-primary focus:ring-offset-0 h-9 text-xs rounded-md cursor-pointer"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="status">Status (Live First)</option>
              <option value="team">Team Name (A-Z)</option>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
