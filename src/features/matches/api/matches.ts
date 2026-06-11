import { apiClient } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import { Commentary, Match, MatchListMeta } from '@/shared/types/models';
import { CreateMatchPayload, GetMatchesParams } from '../types';

export const getMatches = async (params?: GetMatchesParams) => {
  const { data } = await apiClient.get<ApiResponse<Match[], MatchListMeta>>('/matches', {
    params,
  });
  return data;
};

export const getMatchDetail = async (id: number) => {
  const { data } = await apiClient.get<ApiResponse<Match>>(`/matches/${id}`);
  return data.data;
};

export const getMatchCommentary = async (id: number, params?: { limit?: number }) => {
  const { data } = await apiClient.get<ApiResponse<Commentary[]>>(
    `/matches/${id}/commentary`,
    { params }
  );
  return data.data;
};

export const createMatch = async (payload: CreateMatchPayload) => {
  const { data } = await apiClient.post<ApiResponse<Match>>('/matches', payload);
  return data.data;
};
