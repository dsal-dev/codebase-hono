import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/db/schema";

export const createAuthCommands = (_dbInstance: PostgresJsDatabase<typeof schema>) => ({});

export type AuthCommands = ReturnType<typeof createAuthCommands>;
