import { describe, it, expect } from "vitest";
import {
  listUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
  userResponseSchema,
} from "@/modules/user/schema/userSchema";

describe("listUsersQuerySchema", () => {
  it("should use defaults when no query params provided", () => {
    const result = listUsersQuerySchema.parse({});

    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it("should coerce string numbers", () => {
    const result = listUsersQuerySchema.parse({ page: "2", limit: "20" });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(20);
  });

  it("should reject page less than 1", () => {
    const result = listUsersQuerySchema.safeParse({ page: "0" });

    expect(result.success).toBe(false);
  });

  it("should reject limit greater than 100", () => {
    const result = listUsersQuerySchema.safeParse({ limit: "101" });

    expect(result.success).toBe(false);
  });

  it("should reject non-integer values", () => {
    const result = listUsersQuerySchema.safeParse({ page: "1.5" });

    expect(result.success).toBe(false);
  });
});

describe("createUserSchema", () => {
  it("should accept valid input", () => {
    const result = createUserSchema.parse({
      email: "user@example.com",
      name: "John",
      password: "secret123",
    });

    expect(result.email).toBe("user@example.com");
    expect(result.name).toBe("John");
    expect(result.role).toBe("user");
  });

  it("should default role to 'user'", () => {
    const result = createUserSchema.parse({
      email: "user@example.com",
      name: "John",
      password: "secret123",
    });

    expect(result.role).toBe("user");
  });

  it("should accept admin role", () => {
    const result = createUserSchema.parse({
      email: "admin@example.com",
      name: "Admin",
      password: "secret123",
      role: "admin",
    });

    expect(result.role).toBe("admin");
  });

  it("should reject invalid email", () => {
    const result = createUserSchema.safeParse({
      email: "not-an-email",
      name: "John",
      password: "secret123",
    });

    expect(result.success).toBe(false);
  });

  it("should reject short password", () => {
    const result = createUserSchema.safeParse({
      email: "user@example.com",
      name: "John",
      password: "12345",
    });

    expect(result.success).toBe(false);
  });

  it("should reject empty name", () => {
    const result = createUserSchema.safeParse({
      email: "user@example.com",
      name: "",
      password: "secret123",
    });

    expect(result.success).toBe(false);
  });
});

describe("updateUserSchema", () => {
  it("should accept partial update with email only", () => {
    const result = updateUserSchema.parse({ email: "new@example.com" });

    expect(result.email).toBe("new@example.com");
    expect(result.name).toBeUndefined();
    expect(result.password).toBeUndefined();
    expect(result.role).toBeUndefined();
  });

  it("should accept empty object (no fields to update)", () => {
    const result = updateUserSchema.parse({});

    expect(Object.keys(result).length).toBe(0);
  });

  it("should reject invalid role", () => {
    const result = updateUserSchema.safeParse({ role: "superadmin" });

    expect(result.success).toBe(false);
  });

  it("should reject short password", () => {
    const result = updateUserSchema.safeParse({ password: "12345" });

    expect(result.success).toBe(false);
  });
});

describe("userResponseSchema", () => {
  it("should accept a valid user response", () => {
    const result = userResponseSchema.parse({
      id: "123",
      email: "user@example.com",
      name: "John",
      role: "admin",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    });

    expect(result.id).toBe("123");
  });

  it("should reject missing fields", () => {
    const result = userResponseSchema.safeParse({
      id: "123",
      email: "user@example.com",
    });

    expect(result.success).toBe(false);
  });
});
