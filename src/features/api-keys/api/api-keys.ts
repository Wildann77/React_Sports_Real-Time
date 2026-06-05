import { apiClient } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import { ApiKey, CreateApiKeyResponse } from '@/shared/types/models';

export interface CreateApiKeyPayload {
  name: string;
  scopes: string[];
  expiresAt?: string | null;
}

export const getApiKeys = async (): Promise<ApiKey[]> => {
  const { data } = await apiClient.get<ApiResponse<ApiKey[]>>('/api-keys');
  return data.data || [];
};

export const createApiKey = async (payload: CreateApiKeyPayload): Promise<CreateApiKeyResponse> => {
  const { data } = await apiClient.post<ApiResponse<CreateApiKeyResponse>>('/api-keys', payload);
  if (!data.data) {
    throw new Error(data.message || 'Failed to create API key');
  }
  return data.data;
};

export const deleteApiKey = async (id: number): Promise<void> => {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/api-keys/${id}`);
  if (!data.success) {
    throw new Error(data.message || 'Failed to delete API key');
  }
};
