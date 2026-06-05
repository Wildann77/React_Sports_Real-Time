import { useMutation, useQuery, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { getApiKeys, createApiKey, deleteApiKey, CreateApiKeyPayload } from '../api/api-keys';
import { QueryKeys } from '@/shared/constants/query-keys';
import { ApiKey, CreateApiKeyResponse } from '@/shared/types/models';

export function useApiKeys() {
  return useQuery({
    queryKey: QueryKeys.apiKeys,
    queryFn: getApiKeys,
  });
}

export function useCreateApiKey(
  options?: UseMutationOptions<CreateApiKeyResponse, Error, CreateApiKeyPayload>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApiKey,
    ...options,
    onSuccess: (data, variables, context, runtimeContext) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.apiKeys });
      options?.onSuccess?.(data, variables, context, runtimeContext);
    },
  });
}

export function useDeleteApiKey(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApiKey,
    ...options,
    onSuccess: (data, variables, context, runtimeContext) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.apiKeys });
      options?.onSuccess?.(data, variables, context, runtimeContext);
    },
  });
}
