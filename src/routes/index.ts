import { Hono } from "hono";

import { createContainer } from "@/lib/container";
import type { AppHonoEnv } from "@/types/app";
import { successResponse } from "@/utils/response";

export const registerRoutes = (app: Hono<AppHonoEnv>): void => {
  const container = createContainer();
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

  api.route("/auth", container.authRoutes);
  api.route("/users", container.userRoutes);

  app.route("/api/v1", api);
};
