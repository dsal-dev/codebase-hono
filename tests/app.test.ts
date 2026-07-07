import { describe, it, expect, vi } from "vitest";
import { errorHandler, NotFoundError } from "@/middlewares/error-handler";
import { successResponse, errorResponse } from "@/utils/response";
import { env } from "@/config/env";

const mockC = (): any => ({
  var: { logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() } },
  json: vi.fn().mockReturnValue(new Response("{}")),
});

describe("errorHandler middleware", () => {
  it("should handle AppError and return correct status and body", () => {
    const c = mockC();
    const err = new NotFoundError("Custom not found");
    errorHandler(err, c);

    expect(c.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Custom not found", code: "NOT_FOUND" }),
      404,
    );
  });

  it("should handle AppError with errors detail", () => {
    const c = mockC();
    const issues = [{ field: "email", message: "Invalid email" }];
    const err = new NotFoundError("Not found", issues);
    errorHandler(err, c);

    expect(c.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Not found", code: "NOT_FOUND", errors: issues }),
      404,
    );
  });

  it("should handle generic Error and return 500", () => {
    const c = mockC();
    const err = new Error("Something broke");
    errorHandler(err, c);

    expect(c.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Something broke", code: "INTERNAL_SERVER_ERROR" }),
      500,
    );
  });

  it("should mask internal error message in production", () => {
    const original = (env as any).NODE_ENV;
    (env as any).NODE_ENV = "production";

    const c = mockC();
    const err = new Error("Secret internal detail");
    errorHandler(err, c);

    expect(c.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Internal server error" }),
      500,
    );

    (env as any).NODE_ENV = original;
  });
});

describe("response utilities", () => {
  it("successResponse should return correct shape", () => {
    const result = successResponse({ foo: "bar" }, "Done");

    expect(result).toEqual({
      success: true,
      data: { foo: "bar" },
      message: "Done",
    });
  });

  it("errorResponse should return correct shape", () => {
    const result = errorResponse("Fail", "ERROR");

    expect(result).toEqual({
      success: false,
      message: "Fail",
      code: "ERROR",
    });
  });
});
