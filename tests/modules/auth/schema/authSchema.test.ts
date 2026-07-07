import { describe, it, expect } from "vitest";
import {
  loginSchema,
  loginResponseSchema,
  userResponseSchema,
} from "@/modules/auth/schema/authSchema";

describe("loginSchema", () => {
  it("should accept valid login input", () => {
    const result = loginSchema.parse({
      email: "user@example.com",
      password: "secret123",
    });

    expect(result.email).toBe("user@example.com");
    expect(result.password).toBe("secret123");
  });

  it("should reject invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });

    expect(result.success).toBe(false);
  });

  it("should reject short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "12345",
    });

    expect(result.success).toBe(false);
  });

  it("should reject missing fields", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginResponseSchema", () => {
  it("should accept valid login response", () => {
    const result = loginResponseSchema.parse({
      accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0",
      user: {
        id: "1",
        email: "user@example.com",
        name: "John",
        role: "user",
      },
    });

    expect(result.accessToken).toBeTypeOf("string");
    expect(result.user.email).toBe("user@example.com");
  });

  it("should reject missing user fields", () => {
    const result = loginResponseSchema.safeParse({
      accessToken: "token",
      user: { id: "1" },
    });

    expect(result.success).toBe(false);
  });
});

describe("userResponseSchema (auth)", () => {
  it("should accept valid user response", () => {
    const result = userResponseSchema.parse({
      id: "1",
      email: "user@example.com",
      name: "John",
      role: "user",
    });

    expect(result.id).toBe("1");
  });

  it("should reject missing fields", () => {
    const result = userResponseSchema.safeParse({ id: "1" });

    expect(result.success).toBe(false);
  });
});
