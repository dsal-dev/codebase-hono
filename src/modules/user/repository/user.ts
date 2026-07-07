import { eq, count, asc } from "drizzle-orm";
import type { Logger } from "pino";

import { db } from "@/db";
import { users } from "@/db/schema";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export const findAllUsers = async (
  page: number,
  limit: number,
  logger: Logger,
) => {
  logger.info({ page, limit }, "Finding all users");

  const offset = (page - 1) * limit;

  const data = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .offset(offset)
    .limit(limit)
    .orderBy(asc(users.createdAt));

  const totalResult = await db.select({ value: count() }).from(users);
  const total = totalResult[0]?.value ?? 0;

  return { data, total };
};

export const findUserById = async (id: string, logger: Logger) => {
  logger.info({ id }, "Finding user by id");

  const result = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0];
};

export const insertUser = async (
  input: {
    email: string;
    name: string;
    passwordHash: string;
    role: string;
  },
  logger: Logger,
) => {
  logger.info({ email: input.email }, "Creating user");

  const result = await db
    .insert(users)
    .values({
      email: input.email,
      name: input.name,
      passwordHash: input.passwordHash,
      role: input.role,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return result[0];
};

export const updateUserById = async (
  id: string,
  input: Partial<{
    email: string;
    name: string;
    passwordHash: string;
    role: string;
  }>,
  logger: Logger,
) => {
  logger.info({ id }, "Updating user");

  const result = await db
    .update(users)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return result[0];
};

export const deleteUserById = async (id: string, logger: Logger) => {
  logger.info({ id }, "Deleting user");

  await db.delete(users).where(eq(users.id, id));
};
