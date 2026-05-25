// Request logger middleware that records method, path, status, and response time.
import { createMiddleware } from "hono/factory";

import type { AppHonoEnv } from "@/types/app";
import { createChildLogger } from "@/utils/logger";

const getRequestLogLevel = (status: number): "info" | "warn" | "error" => {
  if (status >= 500) {
    return "error";
  }

  if (status >= 400) {
    return "warn";
  }

  return "info";
};

export const requestLogger = createMiddleware<AppHonoEnv>(async (c, next) => {
  const startedAt = performance.now();
  const requestId = c.req.header("x-request-id") ?? crypto.randomUUID();
  const requestScopedLogger = createChildLogger({ requestId });
  let status = 500;

  c.set("requestId", requestId);
  c.set("logger", requestScopedLogger);
  c.header("x-request-id", requestId);

  try {
    await next();
    status = c.res.status;
  } finally {
    const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;
    const level = getRequestLogLevel(status);

    requestScopedLogger[level](
      {
        request: {
          method: c.req.method,
          path: c.req.path,
        },
        response: {
          status,
          durationMs,
        },
      },
      "Request completed",
    );
  }
});
