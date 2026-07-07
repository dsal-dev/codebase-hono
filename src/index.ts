import { env } from "@/config/env";
import { closeDatabase } from "@/db";
import app from "@/app";
import { logger } from "@/utils/logger";

const server = Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
});

const shutdown = async (signal: string) => {
  logger.info({ signal }, "Shutting down gracefully");
  await closeDatabase();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

logger.info({ port: server.port }, "Server started");
