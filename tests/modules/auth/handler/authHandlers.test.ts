import { createLoginHandler } from "@/modules/auth/handler/login";
import { createLogoutHandler } from "@/modules/auth/handler/logout";
import { createMeHandler } from "@/modules/auth/handler/me";
import type { AppHonoEnv } from "@/types/app";
import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";

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

describe("loginHandler", () => {
  it("should call usecase and return token", async () => {
    const mockUsecase = vi.fn().mockResolvedValue({
      accessToken: "token123",
      user: { id: "1", email: "test@test.com", name: "Test", role: "user" },
    });
    const handler = createLoginHandler(mockUsecase);
    const c = createTestContext({
      body: { email: "test@test.com", password: "secret123" },
    });

    await handler(c);

    expect(mockUsecase).toHaveBeenCalledOnce();
    expect(c.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true }),
    );
  });

  it("should throw on invalid input", async () => {
    const mockUsecase = vi.fn();
    const handler = createLoginHandler(mockUsecase);
    const c = createTestContext({
      body: { email: "invalid" },
    });

    await expect(handler(c)).rejects.toThrow();
    expect(mockUsecase).not.toHaveBeenCalled();
  });
});

describe("meHandler", () => {
  it("should return current user", async () => {
    const mockUsecase = vi.fn().mockResolvedValue({
      id: "1",
      email: "test@test.com",
      name: "Test",
      role: "user",
    });
    const handler = createMeHandler(mockUsecase);
    const c = createTestContext({
      user: { sub: "1", email: "test@test.com", role: "user" },
    });

    await handler(c);

    expect(mockUsecase).toHaveBeenCalledWith("1", expect.anything());
  });
});

describe("logoutHandler", () => {
  it("should return success", async () => {
    const handler = createLogoutHandler();
    const c = createTestContext();

    await handler(c);

    expect(c.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: null }),
    );
  });
});
