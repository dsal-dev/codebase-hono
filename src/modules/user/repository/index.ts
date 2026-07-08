import { eq, count, asc } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "@/db/schema";
import type * as schema from "@/db/schema";
import { getLogger } from "@/utils/requestContext";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserRepository {
  findAllUsers(page: number, limit: number): Promise<{ data: UserRow[]; total: number }>;
  findUserById(id: string): Promise<UserRow | undefined>;
  findUserByEmail(email: string): Promise<UserRow | undefined>;
  insertUser(input: {
    email: string;
    name: string;
    passwordHash: string;
    role: string;
  }): Promise<UserRow | undefined>;
  updateUserById(
    id: string,
    input: Partial<{
      email: string;
      name: string;
      passwordHash: string;
      role: string;
    }>,
  ): Promise<UserRow | undefined>;
  deleteUserById(id: string): Promise<void>;
}

export class UserDbRepository implements UserRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  async findAllUsers(
    page: number,
    limit: number,
  ): Promise<{ data: UserRow[]; total: number }> {
    const logger = getLogger();
    logger.info({ page, limit }, "Finding all users");

    const offset = (page - 1) * limit;

    const data = await this.db
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

    const [totalResult] = await this.db.select({ value: count() }).from(users);
    const total = totalResult?.value ?? 0;

    return { data, total };
  }

  async findUserById(id: string): Promise<UserRow | undefined> {
    const logger = getLogger();
    logger.info({ id }, "Finding user by id");

    const [result] = await this.db
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

    return result;
  }

  async findUserByEmail(email: string): Promise<UserRow | undefined> {
    const logger = getLogger();
    logger.info({ email }, "Finding user by email");

    const [result] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result;
  }

  async insertUser(
    input: {
      email: string;
      name: string;
      passwordHash: string;
      role: string;
    },
  ): Promise<UserRow | undefined> {
    const logger = getLogger();
    logger.info({ email: input.email }, "Creating user");

    const [result] = await this.db
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

    return result;
  }

  async updateUserById(
    id: string,
    input: Partial<{
      email: string;
      name: string;
      passwordHash: string;
      role: string;
    }>,
  ): Promise<UserRow | undefined> {
    const logger = getLogger();
    logger.info({ id }, "Updating user");

    const [result] = await this.db
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

    return result;
  }

  async deleteUserById(id: string): Promise<void> {
    const logger = getLogger();
    logger.info({ id }, "Deleting user");

    await this.db.delete(users).where(eq(users.id, id));
  }
}
