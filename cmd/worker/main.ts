import { startQueue, stopQueue } from "@/queue";
import { registerAllJobs } from "@/queue/jobs";
import { logger } from "@/utils/logger";

const main = async (): Promise<void> => {
  const boss = await startQueue();

  if (!boss) {
    logger.warn("Queue is disabled. Worker exiting.");
    process.exit(0);
  }

  registerAllJobs(boss);

  const queues = await boss.getQueues();
  logger.info({ queueCount: queues.length, queues: queues.map((q) => q.name) }, "Worker started. Waiting for jobs...");
};

const shutdown = async (signal: string): Promise<void> => {
  logger.info({ signal }, "Worker shutting down gracefully");
  await stopQueue();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

main().catch((err) => {
  logger.error({ err }, "Failed to start worker");
  process.exit(1);
});
