export const ErrorCodeEnum = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  DATABASE_ERROR: "DATABASE_ERROR",
  SECURITY_ERROR: "SECURITY_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCodeEnum)[keyof typeof ErrorCodeEnum];

export type ApiError = {
  code: ErrorCode;
  details?: unknown;
};

export type ApiResponse<TData = unknown, TMeta = unknown> = {
  success: boolean;
  message: string;
  data: TData | null;
  meta: TMeta | null;
  error: ApiError | null;
};
