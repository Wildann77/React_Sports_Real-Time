import axios from 'axios';
import { apiClient } from '@/shared/lib/axios';
import { env } from '@/shared/lib/env';
import { ApiResponse } from '@/shared/types/api';
import { User } from '@/shared/types/models';
import { AuthSession, LoginPayload, RefreshTokenResponse } from '../types';

export const login = async (payload: LoginPayload) => {
  const { data } = await apiClient.post<ApiResponse<AuthSession>>('/login', payload);
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post<ApiResponse>('/logout');
  return data;
};

export const logoutAll = async () => {
  const { data } = await apiClient.post<ApiResponse>('/logout-all');
  return data;
};

export const refreshToken = async () => {
  const { data } = await axios.post<ApiResponse<RefreshTokenResponse>>(
    `${env.API_BASE_URL}/refresh-token`,
    undefined,
    { withCredentials: true }
  );

  return data;
};

export const getMe = async () => {
  const { data } = await apiClient.get<ApiResponse<User>>('/me');
  return data.data;
};
