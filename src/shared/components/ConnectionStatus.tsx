import React from 'react';
import { useWsStatus } from '@/shared/hooks/use-ws-status';
import { cn } from '@/shared/utils';
import { wsClient } from '@/shared/lib/websocket';

interface ConnectionStatusProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ size = 'sm', className }) => {
  const status = useWsStatus();

  const config = {
    connected: {
      color: 'bg-primary',
      text: 'Live',
      pulse: 'shadow-[0_0_8px_rgba(29,185,84,0.5)]',
    },
    connecting: {
      color: 'bg-yellow-500',
      text: 'Connecting',
      pulse: 'motion-safe:animate-pulse',
    },
    reconnecting: {
      color: 'bg-yellow-500',
      text: 'Reconnecting',
      pulse: 'motion-safe:animate-pulse',
    },
    disconnected: {
      color: 'bg-red-500',
      text: 'Offline',
      pulse: '',
    },
  };

  const current = config[status] || config.disconnected;

  return (
    <div 
      className={cn('inline-flex items-center gap-1.5 font-medium tracking-tight', className)}
      aria-live={status === 'disconnected' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <span className="relative flex h-2 w-2">
        {status !== 'disconnected' && current.pulse && (
          <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-75', current.color, current.pulse)} />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', current.color)} />
      </span>
      {size === 'md' ? (
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Connection: <span className={cn('font-semibold', status === 'connected' ? 'text-primary' : 'text-foreground')}>{current.text}</span>
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">{current.text}</span>
      )}
      
      {status === 'disconnected' && (
        <button
          onClick={() => wsClient.resetAndConnect()}
          className="ml-1 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 active:scale-95 transition-all cursor-pointer"
          title="Attempt to reconnect to the live updates server"
        >
          Reconnect
        </button>
      )}
    </div>
  );
};
