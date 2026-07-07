import { describe, it, expect } from "vitest";
import { buildPaginationMeta } from "@/utils/pagination";

describe("buildPaginationMeta", () => {
  it("should return pagination meta with correct totalPages", () => {
    const result = buildPaginationMeta(1, 10, 25);

    expect(result).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
  });

  it("should return 0 totalPages when total is 0", () => {
    const result = buildPaginationMeta(1, 10, 0);

    expect(result.totalPages).toBe(0);
  });

  it("should handle exact division", () => {
    const result = buildPaginationMeta(2, 10, 20);

    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(2);
  });

  it("should handle single item per page", () => {
    const result = buildPaginationMeta(1, 1, 5);

    expect(result.totalPages).toBe(5);
  });
});
