// Database client setup that exposes a typed Drizzle instance and raw postgres client.
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/config/env";
import * as schema from "@/db/schema";

export const dbClient = postgres(env.DATABASE_URL);

export const db = drizzle(dbClient, { schema });

export const closeDatabase = async (): Promise<void> => {
  await dbClient.end();
};
