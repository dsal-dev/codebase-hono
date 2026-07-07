import { eq } from "drizzle-orm";
import type { Logger } from "pino";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "@/db/schema";
import type * as schema from "@/db/schema";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
};

export const createAuthQueries = (dbInstance: PostgresJsDatabase<typeof schema>) => ({
  findUserByEmail: async (email: string, logger: Logger): Promise<UserRecord | undefined> => {
    logger.info({ email }, "Finding user by email");
    const [result] = await dbInstance.select().from(users).where(eq(users.email, email)).limit(1);
    return result;
  },
  findUserById: async (id: string, logger: Logger): Promise<UserRecord | undefined> => {
    logger.info({ id }, "Finding user by id");
    const [result] = await dbInstance.select().from(users).where(eq(users.id, id)).limit(1);
    return result;
  },
});

export type AuthQueries = ReturnType<typeof createAuthQueries>;
