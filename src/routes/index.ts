// Route registry that mounts API modules behind a versioned prefix.
import { Hono } from "hono";

import { exampleRoutes } from "@/modules/example/example.routes";
import { successResponse } from "@/utils/response";

export const registerRoutes = (app: Hono): void => {
  const api = new Hono();

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

  app.route("/api/v1", api);
};
