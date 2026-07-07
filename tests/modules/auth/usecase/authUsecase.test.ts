import { describe, it, expect, vi } from "vitest";
import { createLoginUsecase } from "@/modules/auth/usecase/login";
import { createMeUsecase } from "@/modules/auth/usecase/me";
import type { AuthRepository } from "@/modules/auth/repository";
import { UnauthorizedError, NotFoundError } from "@/middlewares/error-handler";

const createMockRepo = (
  overrides: Partial<AuthRepository> = {},
): AuthRepository => ({
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  ...overrides,
});

describe("loginUsecase", () => {
  it("should login successfully and return access token", async () => {
    const passwordHash = await Bun.password.hash("secret123");
    const mockUser = {
      id: "1",
      email: "user@example.com",
      name: "John",
      passwordHash,
      role: "user",
    };

    const repo = createMockRepo({
      findUserByEmail: vi.fn().mockResolvedValue(mockUser),
    });

    const usecase = createLoginUsecase(repo);
    const result = await usecase(
      { email: "user@example.com", password: "secret123" },
    );

    expect(result.accessToken).toBeTypeOf("string");
    expect(result.user.id).toBe("1");
    expect(result.user.email).toBe("user@example.com");
    expect(repo.findUserByEmail).toHaveBeenCalledWith("user@example.com");
  });

  it("should throw UnauthorizedError when user not found", async () => {
    const repo = createMockRepo({
      findUserByEmail: vi.fn().mockResolvedValue(undefined),
    });

    const usecase = createLoginUsecase(repo);

    await expect(
      usecase({ email: "unknown@example.com", password: "secret123" }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should throw UnauthorizedError when password is wrong", async () => {
    const passwordHash = await Bun.password.hash("secret123");
    const mockUser = {
      id: "1",
      email: "user@example.com",
      name: "John",
      passwordHash,
      role: "user",
    };

    const repo = createMockRepo({
      findUserByEmail: vi.fn().mockResolvedValue(mockUser),
    });

    const usecase = createLoginUsecase(repo);

    await expect(
      usecase({ email: "user@example.com", password: "wrongpassword" }),
    ).rejects.toThrow(UnauthorizedError);
  });
});

describe("meUsecase", () => {
  it("should return user profile when found", async () => {
    const repo = createMockRepo({
      findUserById: vi.fn().mockResolvedValue({
        id: "1",
        email: "user@example.com",
        name: "John",
        passwordHash: "hashed",
        role: "user",
      }),
    });

    const usecase = createMeUsecase(repo);
    const result = await usecase("1");

    expect(result.id).toBe("1");
    expect(result.email).toBe("user@example.com");
    expect(result.name).toBe("John");
    expect(result.role).toBe("user");
    expect("passwordHash" in result).toBe(false);
  });

  it("should throw NotFoundError when user not found", async () => {
    const repo = createMockRepo({
      findUserById: vi.fn().mockResolvedValue(undefined),
    });

    const usecase = createMeUsecase(repo);

    await expect(usecase("nonexistent")).rejects.toThrow(NotFoundError);
  });
});
