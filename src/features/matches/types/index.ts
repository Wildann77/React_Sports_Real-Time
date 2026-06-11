import { MatchStatus } from '@/shared/types/models';

export * from '@/shared/types/models';

export type MatchSortOption = 'date_asc' | 'date_desc' | 'status' | 'team';

export type GetMatchesParams = {
  status?: MatchStatus | 'all';
  sport?: string;
  team?: string;
  page?: number;
  limit?: number;
  sort?: MatchSortOption;
};

export type CreateMatchPayload = {
  sport: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  endTime: string;
  homeScore: number;
  awayScore: number;
  metadata: Record<string, unknown>;
};
