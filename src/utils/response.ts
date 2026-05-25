// API response builders that keep success and error payloads consistent.
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/common";

export const successResponse = <TData, TMeta = unknown>(
  data: TData,
  message?: string,
  meta?: TMeta,
): ApiSuccessResponse<TData, TMeta> => ({
  success: true,
  data,
  ...(message !== undefined ? { message } : {}),
  ...(meta !== undefined ? { meta } : {}),
});

export const errorResponse = (
  message: string,
  code?: string,
  errors?: unknown,
): ApiErrorResponse => ({
  success: false,
  message,
  ...(code !== undefined ? { code } : {}),
  ...(errors !== undefined ? { errors } : {}),
});
