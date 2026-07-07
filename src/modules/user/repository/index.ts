import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/db/schema";
import { createUserQueries, type UserQueries } from "./queries";
import { createUserCommands, type UserCommands } from "./commands";

export type { UserRow } from "./queries";

export type UserRepository = UserQueries & UserCommands;

export const createUserRepository = (dbInstance: PostgresJsDatabase<typeof schema>): UserRepository => {
  const queries = createUserQueries(dbInstance);
  const commands = createUserCommands(dbInstance);
  return { ...queries, ...commands };
};
