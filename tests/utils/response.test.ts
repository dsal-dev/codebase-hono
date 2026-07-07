import { describe, it, expect } from "vitest";
import { successResponse, errorResponse } from "@/utils/response";

describe("successResponse", () => {
  it("should return a success response with data", () => {
    const result = successResponse({ id: 1 });

    expect(result).toEqual({
      success: true,
      data: { id: 1 },
    });
  });

  it("should include message when provided", () => {
    const result = successResponse(null, "Operation successful");

    expect(result).toEqual({
      success: true,
      data: null,
      message: "Operation successful",
    });
  });

  it("should include meta when provided", () => {
    const meta = { page: 1, total: 10 };
    const result = successResponse([], "List", meta);

    expect(result).toEqual({
      success: true,
      data: [],
      message: "List",
      meta,
    });
  });

  it("should work without message and meta", () => {
    const result = successResponse("data");

    expect(result.success).toBe(true);
    expect(result.data).toBe("data");
    expect("message" in result).toBe(false);
    expect("meta" in result).toBe(false);
  });
});

describe("errorResponse", () => {
  it("should return an error response with message", () => {
    const result = errorResponse("Something went wrong");

    expect(result).toEqual({
      success: false,
      message: "Something went wrong",
    });
  });

  it("should include code when provided", () => {
    const result = errorResponse("Not found", "NOT_FOUND");

    expect(result).toEqual({
      success: false,
      message: "Not found",
      code: "NOT_FOUND",
    });
  });

  it("should include errors when provided", () => {
    const errors = [{ field: "email", message: "Invalid email" }];
    const result = errorResponse("Validation failed", "VALIDATION_ERROR", errors);

    expect(result).toEqual({
      success: false,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors,
    });
  });

  it("should work without code and errors", () => {
    const result = errorResponse("Error");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Error");
    expect("code" in result).toBe(false);
    expect("errors" in result).toBe(false);
  });
});
