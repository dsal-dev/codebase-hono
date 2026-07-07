import { eq, count, asc } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "@/db/schema";
import type * as schema from "@/db/schema";
import { getLogger } from "@/lib/requestContext";

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
  ): Promise<{ data: UserRow[]; total: number }> => {
    const logger = getLogger();
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

  findUserById: async (id: string): Promise<UserRow | undefined> => {
    const logger = getLogger();
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

  findUserByEmail: async (email: string): Promise<UserRow | undefined> => {
    const logger = getLogger();
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
