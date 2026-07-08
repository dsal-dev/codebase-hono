import { describe, it, expect, vi } from "vitest";
import { UserUsecaseImpl } from "@/modules/user/usecase";
import type { UserRepository } from "@/modules/user/repository";
import {
  ConflictError,
  NotFoundError,
  InternalServerError,
} from "@/middlewares/error-handler";

const createMockRepo = (overrides: Partial<Record<keyof UserRepository, any>> = {}): UserRepository => {
  const repo: any = {
    findAllUsers: vi.fn(),
    findUserById: vi.fn(),
    findUserByEmail: vi.fn(),
    insertUser: vi.fn(),
    updateUserById: vi.fn(),
    deleteUserById: vi.fn(),
    ...overrides,
  };
  return repo;
};

const date = new Date("2024-01-01T00:00:00.000Z");

describe("UserUsecase", () => {
  describe("createUser", () => {
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

      const usecase = new UserUsecaseImpl(repo);
      const result = await usecase.createUser({
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

      const usecase = new UserUsecaseImpl(repo);

      await expect(
        usecase.createUser({
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

      const usecase = new UserUsecaseImpl(repo);

      await expect(
        usecase.createUser({
          email: "user@example.com",
          name: "John",
          password: "secret123",
          role: "user",
        }),
      ).rejects.toThrow(InternalServerError);
    });
  });

  describe("getUser", () => {
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

      const usecase = new UserUsecaseImpl(repo);
      const result = await usecase.getUser("1");

      expect(result.id).toBe("1");
      expect(result.email).toBe("user@example.com");
    });

    it("should throw NotFoundError when user not found", async () => {
      const repo = createMockRepo({
        findUserById: vi.fn().mockResolvedValue(undefined),
      });

      const usecase = new UserUsecaseImpl(repo);

      await expect(usecase.getUser("nonexistent")).rejects.toThrow(NotFoundError);
    });
  });

  describe("listUsers", () => {
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

      const usecase = new UserUsecaseImpl(repo);
      const result = await usecase.listUsers({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.data[0]!.email).toBe("user@example.com");
      expect(result.data[0]!.createdAt).toBe(date.toISOString());
    });
  });

  describe("updateUser", () => {
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

      const usecase = new UserUsecaseImpl(repo);
      const result = await usecase.updateUser("1", { email: "new@example.com" });

      expect(result.email).toBe("new@example.com");
      expect(repo.findUserById).toHaveBeenCalledWith("1");
      expect(repo.updateUserById).toHaveBeenCalledOnce();
    });

    it("should throw NotFoundError when user not found", async () => {
      const repo = createMockRepo({
        findUserById: vi.fn().mockResolvedValue(undefined),
      });

      const usecase = new UserUsecaseImpl(repo);

      await expect(
        usecase.updateUser("nonexistent", { name: "New" }),
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

      const usecase = new UserUsecaseImpl(repo);

      await expect(
        usecase.updateUser("1", { email: "taken@example.com" }),
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

      const usecase = new UserUsecaseImpl(repo);

      await expect(usecase.updateUser("1", { name: "New" })).rejects.toThrow(
        InternalServerError,
      );
    });
  });

  describe("deleteUser", () => {
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

      const usecase = new UserUsecaseImpl(repo);
      await usecase.deleteUser("1");

      expect(repo.findUserById).toHaveBeenCalledWith("1");
      expect(repo.deleteUserById).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError when user not found", async () => {
      const repo = createMockRepo({
        findUserById: vi.fn().mockResolvedValue(undefined),
      });

      const usecase = new UserUsecaseImpl(repo);

      await expect(usecase.deleteUser("nonexistent")).rejects.toThrow(NotFoundError);
    });
  });
});
