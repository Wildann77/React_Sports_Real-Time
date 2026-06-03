import axios, { AxiosError, AxiosHeaders } from 'axios';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ApiResponse } from '../types/api';
import { env } from './env';

function setAuthorizationHeader(
  headers: AxiosHeaders | undefined,
  token: string | null
) {
  const nextHeaders = AxiosHeaders.from(headers);

  if (token) {
    nextHeaders.set('Authorization', `Bearer ${token}`);
  } else {
    nextHeaders.delete('Authorization');
  }

  return nextHeaders;
}

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  config.headers = setAuthorizationHeader(config.headers as AxiosHeaders | undefined, token);
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestWithRetry = originalRequest as typeof originalRequest & {
      _retry?: boolean;
    };

    const shouldRefresh =
      error.response?.status === 401 &&
      !requestWithRetry._retry &&
      originalRequest.url !== '/login' &&
      originalRequest.url !== '/refresh-token';

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers = setAuthorizationHeader(
            originalRequest.headers as AxiosHeaders | undefined,
            token
          );
          return apiClient(originalRequest);
        })
        .catch((refreshError) => Promise.reject(refreshError));
    }

    requestWithRetry._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<ApiResponse<{ accessToken: string }>>(
        `${apiClient.defaults.baseURL}/refresh-token`,
        undefined,
        { withCredentials: true }
      );

      const newAccessToken = data.data?.accessToken;
      if (!newAccessToken) {
        throw new Error('No access token returned');
      }

      useAuthStore.getState().setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);
      originalRequest.headers = setAuthorizationHeader(
        originalRequest.headers as AxiosHeaders | undefined,
        newAccessToken
      );

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().clearAuth();
      window.location.replace('/login');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
