import { eq } from "drizzle-orm";

import { users } from "@/db/schema";
import type { Database } from "@/db";
import { getLogger } from "@/utils/requestContext";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
};

export interface AuthRepository {
  findUserByEmail(email: string): Promise<UserRecord | undefined>;
  findUserById(id: string): Promise<UserRecord | undefined>;
}

export class AuthDbRepository implements AuthRepository {
  constructor(private db: Database) {}

  async findUserByEmail(email: string): Promise<UserRecord | undefined> {
    const logger = getLogger();
    logger.info({ email }, "Finding user by email");
    const [result] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result;
  }

  async findUserById(id: string): Promise<UserRecord | undefined> {
    const logger = getLogger();
    logger.info({ id }, "Finding user by id");
    const [result] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result;
  }
}
