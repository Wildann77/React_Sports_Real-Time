import {
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createMatch, getMatchDetail, getMatches } from '../api/matches';
import { QueryKeys } from '@/shared/constants/query-keys';
import { Match, MatchStatus } from '@/shared/types/models';
import { MatchFormValues } from '../schemas/match.schema';
import { GetMatchesParams } from '../types';

export function useMatches(params: GetMatchesParams = {}) {
  const filterStatus = params.status === 'all' ? undefined : params.status;
  const normalizedParams = { ...params, status: filterStatus };

  return useQuery({
    queryKey: QueryKeys.matchesByFilter(normalizedParams),
    queryFn: () => getMatches(normalizedParams),
    refetchInterval: params.status === 'live' || !params.status ? 30_000 : undefined,
  });
}

export function useMatchDetail(id: number) {
  return useQuery({
    queryKey: QueryKeys.matchDetail(id),
    queryFn: () => getMatchDetail(id),
    enabled: !!id,
  });
}

export function useCreateMatch(
  options?: UseMutationOptions<Match | null, unknown, MatchFormValues>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: MatchFormValues) => {
      const payload = {
        sport: values.sport.trim(),
        homeTeam: values.homeTeam.trim(),
        awayTeam: values.awayTeam.trim(),
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
        homeScore: values.homeScore,
        awayScore: values.awayScore,
        metadata: JSON.parse(values.metadata) as Record<string, unknown>,
      };

      return createMatch(payload);
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.matches });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
