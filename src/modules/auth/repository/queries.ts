import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "@/db/schema";
import type * as schema from "@/db/schema";
import { getLogger } from "@/utils/requestContext";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
};

export const createAuthQueries = (dbInstance: PostgresJsDatabase<typeof schema>) => ({
  findUserByEmail: async (email: string): Promise<UserRecord | undefined> => {
    const logger = getLogger();
    logger.info({ email }, "Finding user by email");
    const [result] = await dbInstance.select().from(users).where(eq(users.email, email)).limit(1);
    return result;
  },
  findUserById: async (id: string): Promise<UserRecord | undefined> => {
    const logger = getLogger();
    logger.info({ id }, "Finding user by id");
    const [result] = await dbInstance.select().from(users).where(eq(users.id, id)).limit(1);
    return result;
  },
});

export type AuthQueries = ReturnType<typeof createAuthQueries>;
