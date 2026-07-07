import { rateLimiter } from "hono-rate-limiter";

import type { AppHonoEnv } from "@/types/app";

export const rateLimitMiddleware = rateLimiter<AppHonoEnv>({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-6",
  keyGenerator: (c) => {
    const forwarded = c.req.header("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]!.trim();
    return "unknown";
  },
  skip: (c) => {
    return c.req.path === "/api/v1/health";
  },
  message: {
    success: false,
    message: "Too many requests, please try again later",
    code: "TOO_MANY_REQUESTS",
  },
  statusCode: 429,
});
