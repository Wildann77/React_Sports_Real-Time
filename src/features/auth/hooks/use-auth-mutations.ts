import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { login, logout, logoutAll } from '../api/auth';
import { useAuthStore } from '../stores/auth-store';
import { ApiResponse } from '@/shared/types/api';
import { AuthSession, LoginPayload } from '../types';

export const useLoginMutation = (
  options?: UseMutationOptions<ApiResponse<AuthSession>, unknown, LoginPayload>
) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: login,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (data.data) {
        setAuth({ accessToken: data.data.accessToken, user: data.data.user });
      }
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useLogoutMutation = (
  options?: UseMutationOptions<ApiResponse<unknown>, unknown, void>
) => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  return useMutation({
    mutationFn: logout,
    ...options,
    onSettled: (data, error, variables, onMutateResult, context) => {
      clearAuth();
      options?.onSettled?.(data, error, variables, onMutateResult, context);
    },
  });
};

export const useLogoutAllMutation = (
  options?: UseMutationOptions<ApiResponse<unknown>, unknown, void>
) => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  return useMutation({
    mutationFn: logoutAll,
    ...options,
    onSettled: (data, error, variables, onMutateResult, context) => {
      clearAuth();
      options?.onSettled?.(data, error, variables, onMutateResult, context);
    },
  });
};
