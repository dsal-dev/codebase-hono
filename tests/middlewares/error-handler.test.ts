import { describe, it, expect } from "vitest";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  TooManyRequestsError,
  InternalServerError,
} from "@/middlewares/error-handler";

describe("AppError", () => {
  it("should create a basic AppError with status, code, and message", () => {
    const error = new AppError(400, "BAD_REQUEST", "Bad request");

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("BAD_REQUEST");
    expect(error.message).toBe("Bad request");
    expect(error.name).toBe("AppError");
  });

  it("should include optional errors detail", () => {
    const errors = [{ field: "email" }];
    const error = new AppError(422, "INVALID", "Invalid", errors);

    expect(error.errors).toEqual(errors);
  });

  it("should default errors to undefined", () => {
    const error = new AppError(500, "ERR", "Error");

    expect(error.errors).toBeUndefined();
  });
});

describe("BadRequestError", () => {
  it("should create with default values", () => {
    const error = new BadRequestError();

    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("BAD_REQUEST");
    expect(error.message).toBe("Bad request");
    expect(error.name).toBe("BadRequestError");
  });

  it("should accept custom message and errors", () => {
    const error = new BadRequestError("Invalid ID", { id: "required" });
    expect(error.message).toBe("Invalid ID");
    expect(error.errors).toEqual({ id: "required" });
  });
});

describe("UnauthorizedError", () => {
  it("should create with default values", () => {
    const error = new UnauthorizedError();

    expect(error.statusCode).toBe(401);
    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.message).toBe("Unauthorized");
    expect(error.name).toBe("UnauthorizedError");
  });
});

describe("ForbiddenError", () => {
  it("should create with default values", () => {
    const error = new ForbiddenError();

    expect(error.statusCode).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
    expect(error.message).toBe("Forbidden");
    expect(error.name).toBe("ForbiddenError");
  });
});

describe("NotFoundError", () => {
  it("should create with default values", () => {
    const error = new NotFoundError();

    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("Resource not found");
    expect(error.name).toBe("NotFoundError");
  });

  it("should accept custom message", () => {
    const error = new NotFoundError("User not found");
    expect(error.message).toBe("User not found");
  });
});

describe("ConflictError", () => {
  it("should create with default values", () => {
    const error = new ConflictError();

    expect(error.statusCode).toBe(409);
    expect(error.code).toBe("CONFLICT");
    expect(error.message).toBe("Conflict");
    expect(error.name).toBe("ConflictError");
  });
});

describe("UnprocessableEntityError", () => {
  it("should create with default values", () => {
    const error = new UnprocessableEntityError();

    expect(error.statusCode).toBe(422);
    expect(error.code).toBe("UNPROCESSABLE_ENTITY");
    expect(error.message).toBe("Unprocessable entity");
    expect(error.name).toBe("UnprocessableEntityError");
  });
});

describe("TooManyRequestsError", () => {
  it("should create with default values", () => {
    const error = new TooManyRequestsError();

    expect(error.statusCode).toBe(429);
    expect(error.code).toBe("TOO_MANY_REQUESTS");
    expect(error.message).toBe("Too many requests");
    expect(error.name).toBe("TooManyRequestsError");
  });
});

describe("InternalServerError", () => {
  it("should create with default values", () => {
    const error = new InternalServerError();

    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("INTERNAL_SERVER_ERROR");
    expect(error.message).toBe("Internal server error");
    expect(error.name).toBe("InternalServerError");
  });
});
