import { env } from "@/config/env";
import { closeDatabase, closeRedis } from "@/db";
import app from "@/app";
import { startQueue, stopQueue } from "@/queue";
import { closeS3Client } from "@/storage";
import { logger } from "@/utils/logger";

const server = Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
});

const shutdown = async (signal: string) => {
  logger.info({ signal }, "Shutting down gracefully");
  await stopQueue();
  await closeS3Client();
  await closeDatabase();
  await closeRedis();
  process.exit(0);
};

startQueue();

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

logger.info({ port: server.port }, "Server started");
