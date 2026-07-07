import { describe, it, expect, vi } from "vitest";
import { createCreateUserUsecase } from "@/modules/user/usecase/createUser";
import { createGetUserUsecase } from "@/modules/user/usecase/getUser";
import { createListUsersUsecase } from "@/modules/user/usecase/listUsers";
import { createUpdateUserUsecase } from "@/modules/user/usecase/updateUser";
import { createDeleteUserUsecase } from "@/modules/user/usecase/deleteUser";
import type { UserRepository } from "@/modules/user/repository";
import {
  ConflictError,
  NotFoundError,
  InternalServerError,
} from "@/middlewares/error-handler";

const createMockRepo = (
  overrides: Partial<UserRepository> = {},
): UserRepository => ({
  findAllUsers: vi.fn(),
  findUserById: vi.fn(),
  findUserByEmail: vi.fn(),
  insertUser: vi.fn(),
  updateUserById: vi.fn(),
  deleteUserById: vi.fn(),
  ...overrides,
});

const date = new Date("2024-01-01T00:00:00.000Z");

describe("createUserUsecase", () => {
  it("should create a user successfully", async () => {
    const repo = createMockRepo({
      findUserByEmail: vi.fn().mockResolvedValue(undefined),
      insertUser: vi.fn().mockResolvedValue({
        id: "1",
        email: "user@example.com",
        name: "John",
        role: "user",
        createdAt: date,
        updatedAt: date,
      }),
    });

    const usecase = createCreateUserUsecase(repo);
    const result = await usecase({
      email: "user@example.com",
      name: "John",
      password: "secret123",
      role: "user",
    });

    expect(result.id).toBe("1");
    expect(result.email).toBe("user@example.com");
    expect(repo.findUserByEmail).toHaveBeenCalledWith("user@example.com");
    expect(repo.insertUser).toHaveBeenCalledOnce();
  });

  it("should throw ConflictError when email already exists", async () => {
    const repo = createMockRepo({
      findUserByEmail: vi.fn().mockResolvedValue({ id: "existing" }),
    });

    const usecase = createCreateUserUsecase(repo);

    await expect(
      usecase({
        email: "existing@example.com",
        name: "John",
        password: "secret123",
        role: "user",
      }),
    ).rejects.toThrow(ConflictError);
  });

  it("should throw InternalServerError when insert returns undefined", async () => {
    const repo = createMockRepo({
      findUserByEmail: vi.fn().mockResolvedValue(undefined),
      insertUser: vi.fn().mockResolvedValue(undefined),
    });

    const usecase = createCreateUserUsecase(repo);

    await expect(
      usecase({
        email: "user@example.com",
        name: "John",
        password: "secret123",
        role: "user",
      }),
    ).rejects.toThrow(InternalServerError);
  });
});

describe("getUserUsecase", () => {
  it("should return a user when found", async () => {
    const repo = createMockRepo({
      findUserById: vi.fn().mockResolvedValue({
        id: "1",
        email: "user@example.com",
        name: "John",
        role: "user",
        createdAt: date,
        updatedAt: date,
      }),
    });

    const usecase = createGetUserUsecase(repo);
    const result = await usecase("1");

    expect(result.id).toBe("1");
    expect(result.email).toBe("user@example.com");
  });

  it("should throw NotFoundError when user not found", async () => {
    const repo = createMockRepo({
      findUserById: vi.fn().mockResolvedValue(undefined),
    });

    const usecase = createGetUserUsecase(repo);

    await expect(usecase("nonexistent")).rejects.toThrow(NotFoundError);
  });
});

describe("listUsersUsecase", () => {
  it("should return paginated users", async () => {
    const repo = createMockRepo({
      findAllUsers: vi.fn().mockResolvedValue({
        data: [
          {
            id: "1",
            email: "user@example.com",
            name: "John",
            role: "user",
            createdAt: date,
            updatedAt: date,
          },
        ],
        total: 1,
      }),
    });

    const usecase = createListUsersUsecase(repo);
    const result = await usecase({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.data[0]!.email).toBe("user@example.com");
    expect(result.data[0]!.createdAt).toBe(date.toISOString());
  });
});

describe("updateUserUsecase", () => {
  it("should update a user successfully", async () => {
    const repo = createMockRepo({
      findUserById: vi.fn().mockResolvedValue({
        id: "1",
        email: "old@example.com",
        name: "John",
        role: "user",
        createdAt: date,
        updatedAt: date,
      }),
      findUserByEmail: vi.fn().mockResolvedValue(undefined),
      updateUserById: vi.fn().mockResolvedValue({
        id: "1",
        email: "new@example.com",
        name: "John",
        role: "user",
        createdAt: date,
        updatedAt: date,
      }),
    });

    const usecase = createUpdateUserUsecase(repo);
    const result = await usecase("1", { email: "new@example.com" });

    expect(result.email).toBe("new@example.com");
    expect(repo.findUserById).toHaveBeenCalledWith("1");
    expect(repo.updateUserById).toHaveBeenCalledOnce();
  });

  it("should throw NotFoundError when user not found", async () => {
    const repo = createMockRepo({
      findUserById: vi.fn().mockResolvedValue(undefined),
    });

    const usecase = createUpdateUserUsecase(repo);

    await expect(
      usecase("nonexistent", { name: "New" }),
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw ConflictError when new email already exists", async () => {
    const repo = createMockRepo({
      findUserById: vi.fn().mockResolvedValue({
        id: "1",
        email: "old@example.com",
        name: "John",
        role: "user",
        createdAt: date,
        updatedAt: date,
      }),
      findUserByEmail: vi
        .fn()
        .mockResolvedValue({ id: "2", email: "taken@example.com" }),
    });

    const usecase = createUpdateUserUsecase(repo);

    await expect(
      usecase("1", { email: "taken@example.com" }),
    ).rejects.toThrow(ConflictError);
  });

  it("should throw InternalServerError when update returns undefined", async () => {
    const repo = createMockRepo({
      findUserById: vi.fn().mockResolvedValue({
        id: "1",
        email: "old@example.com",
        name: "John",
        role: "user",
        createdAt: date,
        updatedAt: date,
      }),
      findUserByEmail: vi.fn().mockResolvedValue(undefined),
      updateUserById: vi.fn().mockResolvedValue(undefined),
    });

    const usecase = createUpdateUserUsecase(repo);

    await expect(usecase("1", { name: "New" })).rejects.toThrow(
      InternalServerError,
    );
  });
});

describe("deleteUserUsecase", () => {
  it("should delete a user successfully", async () => {
    const repo = createMockRepo({
      findUserById: vi.fn().mockResolvedValue({
        id: "1",
        email: "user@example.com",
        name: "John",
        role: "user",
        createdAt: date,
        updatedAt: date,
      }),
      deleteUserById: vi.fn().mockResolvedValue(undefined),
    });

    const usecase = createDeleteUserUsecase(repo);
    await usecase("1");

    expect(repo.findUserById).toHaveBeenCalledWith("1");
    expect(repo.deleteUserById).toHaveBeenCalledWith("1");
  });

  it("should throw NotFoundError when user not found", async () => {
    const repo = createMockRepo({
      findUserById: vi.fn().mockResolvedValue(undefined),
    });

    const usecase = createDeleteUserUsecase(repo);

    await expect(usecase("nonexistent")).rejects.toThrow(NotFoundError);
  });
});
