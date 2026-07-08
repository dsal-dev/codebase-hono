import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";

import { AuthHandler } from "@/modules/auth/handler";
import type { AuthUsecase } from "@/modules/auth/usecase";
import type { AppHonoEnv } from "@/types/app";

const createTestContext = (
  overrides: Record<string, any> = {},
): Context<AppHonoEnv> => {
  return {
    req: {
      param: vi.fn((key: string) => overrides.params?.[key]),
      json: vi.fn().mockResolvedValue(overrides.body || {}),
      query: vi.fn().mockReturnValue({}),
    },
    var: {
      logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
      user: overrides.user || {
        sub: "1",
        email: "test@test.com",
        role: "user",
      },
      requestId: "test-id",
    },
    json: vi.fn().mockReturnValue(new Response("{}")),
  } as unknown as Context<AppHonoEnv>;
};

const createMockUsecase = (): AuthUsecase => ({
  login: vi.fn(),
  me: vi.fn(),
});

describe("AuthHandler", () => {
  describe("login", () => {
    it("should call usecase and return token", async () => {
      const mockUsecase = createMockUsecase();
      mockUsecase.login = vi.fn().mockResolvedValue({
        accessToken: "token123",
        user: { id: "1", email: "test@test.com", name: "Test", role: "user" },
      });

      const handler = new AuthHandler(mockUsecase);
      const c = createTestContext({
        body: { email: "test@test.com", password: "secret123" },
      });

      await handler.login(c);

      expect(mockUsecase.login).toHaveBeenCalledOnce();
      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("should throw on invalid input", async () => {
      const mockUsecase = createMockUsecase();
      const handler = new AuthHandler(mockUsecase);
      const c = createTestContext({
        body: { email: "invalid" },
      });

      await expect(handler.login(c)).rejects.toThrow();
      expect(mockUsecase.login).not.toHaveBeenCalled();
    });
  });

  describe("me", () => {
    it("should return current user", async () => {
      const mockUsecase = createMockUsecase();
      mockUsecase.me = vi.fn().mockResolvedValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
        role: "user",
      });

      const handler = new AuthHandler(mockUsecase);
      const c = createTestContext({
        user: { sub: "1", email: "test@test.com", role: "user" },
      });

      await handler.me(c);

      expect(mockUsecase.me).toHaveBeenCalledWith("1");
    });
  });

  describe("logout", () => {
    it("should return success", async () => {
      const mockUsecase = createMockUsecase();
      const handler = new AuthHandler(mockUsecase);
      const c = createTestContext();

      await handler.logout(c);

      expect(c.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: null }),
      );
    });
  });
});
