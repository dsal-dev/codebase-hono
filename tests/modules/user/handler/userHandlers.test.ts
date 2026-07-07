import { describe, it, expect, vi } from "vitest";
import { Hono } from "hono";
import type { Context } from "hono";
import { createCreateUserHandler } from "@/modules/user/handler/createUser";
import { createGetUserHandler } from "@/modules/user/handler/getUser";
import { createListUsersHandler } from "@/modules/user/handler/listUsers";
import { createUpdateUserHandler } from "@/modules/user/handler/updateUser";
import { createDeleteUserHandler } from "@/modules/user/handler/deleteUser";
import type { AppHonoEnv } from "@/types/app";

const createTestContext = (overrides: Record<string, any> = {}): Context<AppHonoEnv> => {
  const app = new Hono<AppHonoEnv>();
  const req = new Request("http://localhost", overrides.reqInit || {});
  const c = app.request(req) as any;
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

describe("createUserHandler", () => {
  it("should call usecase and return success", async () => {
    const mockUsecase = vi.fn().mockResolvedValue({ id: "1", email: "test@test.com" });
    const handler = createCreateUserHandler(mockUsecase);
    const c = createTestContext({
      body: { email: "test@test.com", name: "Test", password: "secret123" },
    });

    await handler(c);

    expect(mockUsecase).toHaveBeenCalledOnce();
    expect(c.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: expect.objectContaining({ id: "1" }) }),
    );
  });

  it("should throw on invalid input", async () => {
    const mockUsecase = vi.fn();
    const handler = createCreateUserHandler(mockUsecase);
    const c = createTestContext({
      body: { email: "invalid" },
    });

    await expect(handler(c)).rejects.toThrow();
    expect(mockUsecase).not.toHaveBeenCalled();
  });
});

describe("getUserHandler", () => {
  it("should return user when found", async () => {
    const mockUsecase = vi.fn().mockResolvedValue({ id: "1", email: "test@test.com" });
    const handler = createGetUserHandler(mockUsecase);
    const c = createTestContext({ params: { id: "1" } });

    await handler(c);

    expect(mockUsecase).toHaveBeenCalledWith("1", expect.anything());
  });

  it("should throw when no id provided", async () => {
    const mockUsecase = vi.fn();
    const handler = createGetUserHandler(mockUsecase);

    const c = createTestContext({ params: {} });

    await expect(handler(c)).rejects.toThrow("User ID is required");
  });
});

describe("listUsersHandler", () => {
  it("should pass parsed query to usecase", async () => {
    const mockUsecase = vi.fn().mockResolvedValue({ data: [], total: 0 });
    const handler = createListUsersHandler(mockUsecase);
    const c = createTestContext({ query: { page: "1", limit: "10" } });

    await handler(c);

    expect(mockUsecase).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 }),
      expect.anything(),
    );
  });
});

describe("updateUserHandler", () => {
  it("should update user successfully", async () => {
    const mockUsecase = vi.fn().mockResolvedValue({ id: "1", name: "Updated" });
    const handler = createUpdateUserHandler(mockUsecase);
    const c = createTestContext({
      params: { id: "1" },
      body: { name: "Updated" },
    });

    await handler(c);

    expect(mockUsecase).toHaveBeenCalledWith("1", { name: "Updated" }, expect.anything());
  });

  it("should throw when no id provided", async () => {
    const mockUsecase = vi.fn();
    const handler = createUpdateUserHandler(mockUsecase);
    const c = createTestContext({ params: {}, body: {} });

    await expect(handler(c)).rejects.toThrow("User ID is required");
  });
});

describe("deleteUserHandler", () => {
  it("should delete user successfully", async () => {
    const mockUsecase = vi.fn().mockResolvedValue(undefined);
    const handler = createDeleteUserHandler(mockUsecase);
    const c = createTestContext({ params: { id: "1" } });

    await handler(c);

    expect(mockUsecase).toHaveBeenCalledWith("1", expect.anything());
  });

  it("should throw when no id provided", async () => {
    const mockUsecase = vi.fn();
    const handler = createDeleteUserHandler(mockUsecase);
    const c = createTestContext({ params: {} });

    await expect(handler(c)).rejects.toThrow("User ID is required");
  });
});
