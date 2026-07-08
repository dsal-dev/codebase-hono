import { Hono } from "hono";

import { createAuthModule } from "@/modules/auth";
import { createUserModule } from "@/modules/user";
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

  api.route("/auth", createAuthModule());
  api.route("/users", createUserModule());

  app.route("/api/v1", api);
};
