import { Activity, Target, Flame, Trophy, LucideIcon } from 'lucide-react';

export function getSportIcon(sport: string): LucideIcon {
  const s = sport.toLowerCase();
  if (s === 'football' || s === 'soccer') return Activity;
  if (s === 'basketball') return Target;
  if (s === 'tennis') return Flame;
  if (s === 'hockey') return Trophy;
  return Activity;
}

export function getSportGradient(sport: string): string {
  const s = sport.toLowerCase();
  if (s === 'football' || s === 'soccer') {
    return 'linear-gradient(135deg, hsl(162, 70%, 15%) 0%, hsl(142, 76%, 10%) 100%)';
  }
  if (s === 'basketball') {
    return 'linear-gradient(135deg, hsl(25, 70%, 15%) 0%, hsl(15, 80%, 10%) 100%)';
  }
  if (s === 'tennis') {
    return 'linear-gradient(135deg, hsl(75, 60%, 15%) 0%, hsl(85, 70%, 10%) 100%)';
  }
  if (s === 'hockey') {
    return 'linear-gradient(135deg, hsl(210, 70%, 15%) 0%, hsl(220, 80%, 10%) 100%)';
  }
  return 'linear-gradient(135deg, hsl(0, 0%, 14%) 0%, hsl(0, 0%, 7%) 100%)';
}
