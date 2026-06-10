import { apiClient } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import { Commentary } from '@/shared/types/models';
import { CreateCommentaryPayload } from '../types';

export const createCommentary = async (
  matchId: number,
  payload: CreateCommentaryPayload
) => {
  const { data } = await apiClient.post<ApiResponse<Commentary>>(
    `/matches/${matchId}/commentary`,
    payload
  );

  return data.data;
};
