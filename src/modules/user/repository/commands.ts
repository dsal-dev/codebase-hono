import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { users } from "@/db/schema";
import type * as schema from "@/db/schema";
import type { UserRow } from "./queries";
import { getLogger } from "@/utils/requestContext";

export const createUserCommands = (dbInstance: PostgresJsDatabase<typeof schema>) => ({
  insertUser: async (
    input: {
      email: string;
      name: string;
      passwordHash: string;
      role: string;
    },
  ): Promise<UserRow | undefined> => {
    const logger = getLogger();
    logger.info({ email: input.email }, "Creating user");

    const [result] = await dbInstance
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
  },

  updateUserById: async (
    id: string,
    input: Partial<{
      email: string;
      name: string;
      passwordHash: string;
      role: string;
    }>,
  ): Promise<UserRow | undefined> => {
    const logger = getLogger();
    logger.info({ id }, "Updating user");

    const [result] = await dbInstance
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
  },

  deleteUserById: async (id: string): Promise<void> => {
    const logger = getLogger();
    logger.info({ id }, "Deleting user");

    await dbInstance.delete(users).where(eq(users.id, id));
  },
});

export type UserCommands = ReturnType<typeof createUserCommands>;
