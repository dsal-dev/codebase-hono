// Application entry point that wires middleware, routes, error handling, and the Bun server.
import { Hono } from "hono";

import { env } from "@/config/env";
import { closeDatabase } from "@/db";
import { errorHandler } from "@/middlewares/error-handler";
import { corsMiddleware } from "@/middlewares/cors";
import { requestLogger } from "@/middlewares/logger";
import { securityHeadersMiddleware } from "@/middlewares/security";
import { registerRoutes } from "@/routes";
import type { AppHonoEnv } from "@/types/app";
import { logger } from "@/utils/logger";
import { errorResponse } from "@/utils/response";

const app = new Hono<AppHonoEnv>();

app.use("*", requestLogger);
app.use("*", corsMiddleware);
app.use("*", securityHeadersMiddleware);

registerRoutes(app);

app.onError(errorHandler);
app.notFound((c) => c.json(errorResponse("Route not found", "NOT_FOUND"), 404));

const server = Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
});

const shutdown = async (signal: string) => {
  logger.info({ signal }, "Shutting down gracefully");
  await closeDatabase();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

logger.info({ port: server.port }, "Server started");
