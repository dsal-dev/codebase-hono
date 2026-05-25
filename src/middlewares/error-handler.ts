// Centralized error handling and API error response formatting.
import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { env } from "@/config/env";
import { errorResponse } from "@/utils/response";

export class AppError extends Error {
  public readonly statusCode: ContentfulStatusCode;
  public readonly code: string;
  public readonly errors?: unknown;

  public constructor(
    message: string,
    statusCode: ContentfulStatusCode,
    code: string,
    errors?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof AppError) {
    return c.json(errorResponse(err.message, err.code, err.errors), err.statusCode);
  }

  if (err instanceof HTTPException) {
    const status = err.status as ContentfulStatusCode;

    return c.json(errorResponse(err.message, "HTTP_EXCEPTION"), status);
  }

  console.error(err);

  const message = env.NODE_ENV === "production" ? "Internal server error" : err.message;

  return c.json(errorResponse(message, "INTERNAL_SERVER_ERROR"), 500);
};
