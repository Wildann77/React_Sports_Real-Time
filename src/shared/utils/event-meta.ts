import { 
  Trophy, 
  Layers, 
  AlertTriangle, 
  Repeat, 
  Clock, 
  CheckCircle, 
  Info,
  LucideIcon 
} from 'lucide-react';

export function getEventIcon(eventType: string): LucideIcon {
  const e = eventType.toUpperCase();
  if (e === 'GOAL') return Trophy;
  if (e === 'YELLOW_CARD') return Layers;
  if (e === 'RED_CARD') return AlertTriangle;
  if (e === 'SUBSTITUTION') return Repeat;
  if (e === 'HALF_TIME') return Clock;
  if (e === 'FULL_TIME') return CheckCircle;
  return Info;
}

export function getEventColorClasses(eventType: string): { bg: string; text: string; border: string } {
  const e = eventType.toUpperCase();
  if (e === 'GOAL') {
    return {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
    };
  }
  if (e === 'YELLOW_CARD') {
    return {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-500',
      border: 'border-yellow-500/20',
    };
  }
  if (e === 'RED_CARD') {
    return {
      bg: 'bg-red-500/10',
      text: 'text-red-500',
      border: 'border-red-500/20',
    };
  }
  if (e === 'SUBSTITUTION') {
    return {
      bg: 'bg-blue-500/10',
      text: 'text-blue-500',
      border: 'border-blue-500/20',
    };
  }
  if (e === 'HALF_TIME' || e === 'FULL_TIME') {
    return {
      bg: 'bg-purple-500/10',
      text: 'text-purple-500',
      border: 'border-purple-500/20',
    };
  }
  return {
    bg: 'bg-secondary',
    text: 'text-muted-foreground',
    border: 'border-border/40',
  };
}
