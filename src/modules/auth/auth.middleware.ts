import { createMiddleware } from "hono/factory";
import { Jwt } from "hono/utils/jwt";

import { env } from "@/config/env";
import type { AppHonoEnv } from "@/types/app";
import { UnauthorizedError } from "@/middlewares/error-handler";

export const authMiddleware = createMiddleware<AppHonoEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid Authorization header");
  }

  const token = authHeader.slice(7);

  try {
    const payload = await Jwt.verify(token, env.JWT_SECRET, "HS256");
    const { sub, email } = payload as { sub: string; email: string };

    if (!sub || !email) {
      throw new UnauthorizedError("Invalid token payload");
    }

    c.set("user", { sub, email });
    await next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
});
