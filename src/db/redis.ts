import Redis from "ioredis";

import { env } from "@/config/env";
import { logger } from "@/utils/logger";

let client: Redis | null = null;

export const getRedis = (): Redis | null => {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!client) {
    client = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn({ times }, "Redis retry limit reached, disabling cache");
          client = null;
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    client.on("error", (err) => {
      logger.error({ err: err.message }, "Redis connection error");
    });
  }

  return client;
};

export const closeRedis = async (): Promise<void> => {
  if (client) {
    await client.quit();
    client = null;
  }
};
