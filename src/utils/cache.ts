import { getRedis } from "@/db/redis";

export const getOrSet = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number,
): Promise<T> => {
  const redis = getRedis();

  if (!redis) {
    return fetchFn();
  }

  try {
    const cached = await redis.get(key);

    if (cached !== null) {
      return JSON.parse(cached) as T;
    }

    const value = await fetchFn();
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
    return value;
  } catch {
    return fetchFn();
  }
};

export const invalidate = async (...keys: string[]): Promise<void> => {
  const redis = getRedis();

  if (!redis || keys.length === 0) {
    return;
  }

  try {
    await redis.del(...keys);
  } catch {
    // silent
  }
};

export const invalidatePattern = async (pattern: string): Promise<void> => {
  const redis = getRedis();

  if (!redis) {
    return;
  }

  try {
    let cursor = "0";

    do {
      const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = nextCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch {
    // silent
  }
};
