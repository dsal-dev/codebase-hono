import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/db/schema";
import { createAuthQueries, type AuthQueries } from "./queries";
import { createAuthCommands, type AuthCommands } from "./commands";

export type { UserRecord } from "./queries";

export type AuthRepository = AuthQueries & AuthCommands;

export const createAuthRepository = (dbInstance: PostgresJsDatabase<typeof schema>): AuthRepository => {
  const queries = createAuthQueries(dbInstance);
  const commands = createAuthCommands(dbInstance);
  return { ...queries, ...commands };
};
