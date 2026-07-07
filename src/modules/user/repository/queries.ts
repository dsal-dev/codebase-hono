import { eq, count, asc } from "drizzle-orm";
import type { Logger } from "pino";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "@/db/schema";
import type * as schema from "@/db/schema";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export const createUserQueries = (dbInstance: PostgresJsDatabase<typeof schema>) => ({
  findAllUsers: async (
    page: number,
    limit: number,
    logger: Logger,
  ): Promise<{ data: UserRow[]; total: number }> => {
    logger.info({ page, limit }, "Finding all users");

    const offset = (page - 1) * limit;

    const data = await dbInstance
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

    const [totalResult] = await dbInstance.select({ value: count() }).from(users);
    const total = totalResult?.value ?? 0;

    return { data, total };
  },

  findUserById: async (id: string, logger: Logger): Promise<UserRow | undefined> => {
    logger.info({ id }, "Finding user by id");

    const [result] = await dbInstance
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
  },

  findUserByEmail: async (email: string, logger: Logger): Promise<UserRow | undefined> => {
    logger.info({ email }, "Finding user by email");

    const [result] = await dbInstance
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result;
  },
});

export type UserQueries = ReturnType<typeof createUserQueries>;
