import { Hono } from "hono";

import { authRoutes } from "@/modules/auth/auth.routes";
import { userRoutes } from "@/modules/user/user.routes";
import type { AppHonoEnv } from "@/types/app";
import { successResponse } from "@/utils/response";

export const registerRoutes = (app: Hono<AppHonoEnv>): void => {
  const api = new Hono<AppHonoEnv>();

  api.get("/health", (c) =>
    c.json(
      successResponse(
        {
          status: "ok",
          timestamp: new Date().toISOString(),
        },
        "Service is healthy",
      ),
    ),
  );

  api.route("/auth", authRoutes);
  api.route("/users", userRoutes);

  app.route("/api/v1", api);
};
