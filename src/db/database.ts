import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/config/env";
import * as schema from "@/db/schema";

export type Database = PostgresJsDatabase<typeof schema>;

export const dbClient = postgres(env.DATABASE_URL);

export const closeDatabase = async (): Promise<void> => {
  await dbClient.end();
};

export const db: Database = drizzle(dbClient, { schema });
