import { eq } from "drizzle-orm";
import type { Logger } from "pino";

import { db } from "@/db";
import { users } from "@/db/schema";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
};

export const findUserByEmail = async (
  email: string,
  logger: Logger,
): Promise<UserRecord | undefined> => {
  logger.info({ email }, "Finding user by email");

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0];
};

export const findUserById = async (
  id: string,
  logger: Logger,
): Promise<UserRecord | undefined> => {
  logger.info({ id }, "Finding user by id");

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result[0];
};
