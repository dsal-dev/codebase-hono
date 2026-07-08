import { describe, it, expect, vi } from "vitest";
import type { Context } from "hono";

import { UserHandler } from "@/modules/user/handler";
import type { UserUsecase } from "@/modules/user/usecase";
import type { AppHonoEnv } from "@/types/app";

const createTestContext = (overrides: Record<string, any> = {}): Context<AppHonoEnv> => {
  const mockC = {
    req: {
      param: vi.fn((key: string) => overrides.params?.[key]),
      json: vi.fn().mockResolvedValue(overrides.body || {}),
      query: vi.fn().mockReturnValue(overrides.query || {}),
    },
    var: {
      logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
      requestId: "test-id",
    },
    json: vi.fn().mockReturnValue(new Response("{}")),
  } as unknown as Context<AppHonoEnv>;

  return mockC;
};

const createMockUsecase = (): UserUsecase => ({
  listUsers: vi.fn(),
  getUser: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
});

describe("UserHandler", () => {
  describe("createUser", () => {
    it("should call usecase and return success", async () => {
      const mockUsecase = createMockUsecase();
      mockUsecase.createUser = vi.fn().mockResolvedValue({ id: "1", email: "test@test.com" });
      const handler = new UserHandler(mockUsecase);
      const c = createTestContext({
        body: { email: "test@test.com", name: "Test", password: "secret123" },
      });

      await handler.createUser(c);

      expect(mockUsecase.createUser).toHaveBeenCalledOnce();
      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: expect.objectContaining({ id: "1" }) }),
      );
    });

    it("should throw on invalid input", async () => {
      const mockUsecase = createMockUsecase();
      const handler = new UserHandler(mockUsecase);
      const c = createTestContext({
        body: { email: "invalid" },
      });

      await expect(handler.createUser(c)).rejects.toThrow();
      expect(mockUsecase.createUser).not.toHaveBeenCalled();
    });
  });

  describe("getUser", () => {
    it("should return user when found", async () => {
      const mockUsecase = createMockUsecase();
      mockUsecase.getUser = vi.fn().mockResolvedValue({ id: "1", email: "test@test.com" });
      const handler = new UserHandler(mockUsecase);
      const c = createTestContext({ params: { id: "1" } });

      await handler.getUser(c);

      expect(mockUsecase.getUser).toHaveBeenCalledWith("1");
    });

    it("should throw when no id provided", async () => {
      const mockUsecase = createMockUsecase();
      const handler = new UserHandler(mockUsecase);

      const c = createTestContext({ params: {} });

      await expect(handler.getUser(c)).rejects.toThrow("User ID is required");
    });
  });

  describe("listUsers", () => {
    it("should pass parsed query to usecase", async () => {
      const mockUsecase = createMockUsecase();
      mockUsecase.listUsers = vi.fn().mockResolvedValue({ data: [], total: 0 });
      const handler = new UserHandler(mockUsecase);
      const c = createTestContext({ query: { page: "1", limit: "10" } });

      await handler.listUsers(c);

      expect(mockUsecase.listUsers).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10 }),
      );
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const mockUsecase = createMockUsecase();
      mockUsecase.updateUser = vi.fn().mockResolvedValue({ id: "1", name: "Updated" });
      const handler = new UserHandler(mockUsecase);
      const c = createTestContext({
        params: { id: "1" },
        body: { name: "Updated" },
      });

      await handler.updateUser(c);

      expect(mockUsecase.updateUser).toHaveBeenCalledWith("1", { name: "Updated" });
    });

    it("should throw when no id provided", async () => {
      const mockUsecase = createMockUsecase();
      const handler = new UserHandler(mockUsecase);
      const c = createTestContext({ params: {}, body: {} });

      await expect(handler.updateUser(c)).rejects.toThrow("User ID is required");
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      const mockUsecase = createMockUsecase();
      mockUsecase.deleteUser = vi.fn().mockResolvedValue(undefined);
      const handler = new UserHandler(mockUsecase);
      const c = createTestContext({ params: { id: "1" } });

      await handler.deleteUser(c);

      expect(mockUsecase.deleteUser).toHaveBeenCalledWith("1");
    });

    it("should throw when no id provided", async () => {
      const mockUsecase = createMockUsecase();
      const handler = new UserHandler(mockUsecase);
      const c = createTestContext({ params: {} });

      await expect(handler.deleteUser(c)).rejects.toThrow("User ID is required");
    });
  });
});
