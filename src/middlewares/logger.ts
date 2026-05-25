// Request logger middleware that records method, path, status, and response time.
import { createMiddleware } from "hono/factory";

export const requestLogger = createMiddleware(async (c, next) => {
  const startedAt = performance.now();
  let status = 500;

  try {
    await next();
    status = c.res.status;
  } finally {
    const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;
    console.info(`${c.req.method} ${c.req.path} ${status} ${durationMs}ms`);
  }
});
