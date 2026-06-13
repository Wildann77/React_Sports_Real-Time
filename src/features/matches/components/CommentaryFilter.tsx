import { Select } from '@/shared/ui/native-select';
import { CommentaryEventType } from '@/shared/types/models';

interface CommentaryFilterProps {
  value: CommentaryEventType | 'all';
  onChange: (value: CommentaryEventType | 'all') => void;
}

export function CommentaryFilter({ value, onChange }: CommentaryFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        Filter Events:
      </label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as CommentaryEventType | 'all')}
        className="bg-secondary/20 border-border/50 focus:ring-primary focus:ring-offset-0 h-8 text-xs rounded-md w-36 cursor-pointer py-1"
      >
        <option value="all">All Events</option>
        <option value="goal">Goals</option>
        <option value="yellow-card">Yellow Cards</option>
        <option value="red-card">Red Cards</option>
        <option value="substitution">Substitutions</option>
        <option value="half_time">Half Time</option>
        <option value="full_time">Full Time</option>
        <option value="info">Info/Other</option>
      </Select>
    </div>
  );
}
