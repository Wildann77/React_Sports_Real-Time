import axios from 'axios';
import { ApiResponse, ErrorCode } from '@/shared/types/api';

export function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiResponse>(error)) {
    if (!error.response) {
      return 'Backend is unreachable. Please make sure the API server is running.';
    }

    const errorCode = error.response.data?.error?.code;
    if (errorCode === 'SERVICE_UNAVAILABLE') {
      return 'Service is temporarily unavailable. Please try again in a moment.';
    }

    return error.response.data?.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function hasErrorCode(error: unknown, code: ErrorCode) {
  if (!axios.isAxiosError<ApiResponse>(error)) {
    return false;
  }

  return error.response?.data?.error?.code === code;
}
