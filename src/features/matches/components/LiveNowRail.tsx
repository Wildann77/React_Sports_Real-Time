import React from 'react';
import { Match } from '@/shared/types/models';
import { MatchCard } from './MatchCard';

interface LiveNowRailProps {
  matches: Match[];
}

export const LiveNowRail: React.FC<LiveNowRailProps> = ({ matches }) => {
  if (matches.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>
        <h2 className="text-lg font-black tracking-tight font-display uppercase">
          Live Now
        </h2>
        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-500">
          {matches.length}
        </span>
      </div>

      <div className="flex w-full gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin">
        {matches.map((match) => (
          <div 
            key={match.id} 
            className="w-[300px] sm:w-[340px] shrink-0 snap-start rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(29,185,84,0.05)] transition-all hover:border-primary/40 hover:shadow-[0_0_20px_rgba(29,185,84,0.1)]"
          >
            <MatchCard match={match} />
          </div>
        ))}
      </div>
    </section>
  );
};
