import { PgBoss } from "pg-boss";
import type { SendOptions } from "pg-boss";

import { env } from "@/config/env";
import { logger } from "@/utils/logger";

let boss: PgBoss | null = null;
let started = false;

export const getQueueService = (): PgBoss => {
  if (!boss) {
    boss = new PgBoss({
      connectionString: env.QUEUE_DATABASE_URL,
      schema: "queue",
      migrate: true,
    });

    boss.on("error", (err) => {
      logger.error({ err }, "pg-boss error");
    });

    boss.on("warning", (warning) => {
      logger.warn({ warning }, "pg-boss warning");
    });
  }

  return boss;
};

export const startQueue = async (): Promise<PgBoss | null> => {
  if (!env.QUEUE_ENABLED) {
    logger.info("Queue service is disabled via QUEUE_ENABLED=false");
    return null;
  }

  if (started) {
    return boss;
  }

  const instance = getQueueService();

  await instance.start();
  started = true;
  logger.info("Queue service started");

  return instance;
};

export const stopQueue = async (): Promise<void> => {
  if (!boss) {
    return;
  }

  try {
    await boss.stop({ graceful: true, timeout: 30_000 });
    logger.info("Queue service stopped");
  } catch (err) {
    logger.error({ err }, "Error stopping queue service");
  }

  boss = null;
  started = false;
};

export const sendJob = async <T extends object>(
  queue: string,
  data: T,
  options?: SendOptions,
): Promise<string | null> => {
  if (!env.QUEUE_ENABLED) {
    logger.debug({ queue }, "Queue disabled — skipping job");
    return null;
  }

  const instance = getQueueService();

  if (!started) {
    await startQueue();
  }

  return instance.send(queue, data, options);
};
