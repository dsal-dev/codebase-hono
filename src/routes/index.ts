import { Hono } from "hono";

import { exampleRoutes } from "@/modules/example/example.routes";
import { authRoutes } from "@/modules/auth/auth.routes";
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

  api.route("/examples", exampleRoutes);
  api.route("/auth", authRoutes);

  app.route("/api", api);
};
