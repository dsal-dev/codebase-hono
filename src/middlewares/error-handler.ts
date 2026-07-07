// Centralized error handling and API error response formatting.
import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { env } from "@/config/env";
import type { AppHonoEnv } from "@/types/app";
import { logger } from "@/utils/logger";
import { errorResponse } from "@/utils/response";

/**
 * Custom application errors.
 *
 * @example
 * throw new NotFoundError("User not found");
 * throw new BadRequestError("Invalid input", { field: "email" });
 */
export class AppError extends Error {
  public readonly statusCode: ContentfulStatusCode;
  public readonly code: string;
  public readonly errors?: unknown;

  public constructor(
    statusCode: ContentfulStatusCode,
    code: string,
    message: string,
    errors?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

export class BadRequestError extends AppError {
  public constructor(message = "Bad request", errors?: unknown) {
    super(400, "BAD_REQUEST", message, errors);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  public constructor(message = "Unauthorized", errors?: unknown) {
    super(401, "UNAUTHORIZED", message, errors);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  public constructor(message = "Forbidden", errors?: unknown) {
    super(403, "FORBIDDEN", message, errors);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  public constructor(message = "Resource not found", errors?: unknown) {
    super(404, "NOT_FOUND", message, errors);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  public constructor(message = "Conflict", errors?: unknown) {
    super(409, "CONFLICT", message, errors);
    this.name = "ConflictError";
  }
}

export class UnprocessableEntityError extends AppError {
  public constructor(message = "Unprocessable entity", errors?: unknown) {
    super(422, "UNPROCESSABLE_ENTITY", message, errors);
    this.name = "UnprocessableEntityError";
  }
}

export class TooManyRequestsError extends AppError {
  public constructor(message = "Too many requests", errors?: unknown) {
    super(429, "TOO_MANY_REQUESTS", message, errors);
    this.name = "TooManyRequestsError";
  }
}

export class InternalServerError extends AppError {
  public constructor(message = "Internal server error", errors?: unknown) {
    super(500, "INTERNAL_SERVER_ERROR", message, errors);
    this.name = "InternalServerError";
  }
}

export const errorHandler: ErrorHandler<AppHonoEnv> = (err, c) => {
  if (err instanceof AppError) {
    return c.json(
      errorResponse(err.message, err.code, err.errors),
      err.statusCode,
    );
  }

  if (err instanceof HTTPException) {
    const status = err.status as ContentfulStatusCode;

    return c.json(errorResponse(err.message, "HTTP_EXCEPTION"), status);
  }

  const requestLogger = c.var.logger ?? logger;

  requestLogger.error({ err }, "Unhandled error");

  const message =
    env.NODE_ENV === "production" ? "Internal server error" : err.message;

  return c.json(errorResponse(message, "INTERNAL_SERVER_ERROR"), 500);
};
