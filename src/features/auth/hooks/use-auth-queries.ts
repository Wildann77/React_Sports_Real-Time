import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api/auth';
import { QueryKeys } from '@/shared/constants/query-keys';

export function useMe() {
  return useQuery({
    queryKey: QueryKeys.me,
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });
}
