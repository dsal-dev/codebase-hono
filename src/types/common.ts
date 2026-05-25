// Shared API response and pagination types used across modules.
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiSuccessResponse<TData, TMeta = unknown> = {
  success: true;
  data: TData;
  message?: string;
  meta?: TMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  code?: string;
  errors?: unknown;
};

export type ApiResponse<TData, TMeta = unknown> =
  | ApiSuccessResponse<TData, TMeta>
  | ApiErrorResponse;
