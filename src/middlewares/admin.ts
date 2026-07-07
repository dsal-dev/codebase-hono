import { createMiddleware } from "hono/factory";

import type { AppHonoEnv } from "@/types/app";
import { ForbiddenError } from "@/middlewares/error-handler";

export const adminMiddleware = createMiddleware<AppHonoEnv>(async (c, next) => {
  const user = c.var.user;

  if (user.role !== "admin") {
    throw new ForbiddenError("Admin access required");
  }

  await next();
});
