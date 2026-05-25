// Application entry point that wires middleware, routes, error handling, and the Bun server.
import { Hono } from "hono";

import { env } from "@/config/env";
import { errorHandler } from "@/middlewares/error-handler";
import { corsMiddleware } from "@/middlewares/cors";
import { requestLogger } from "@/middlewares/logger";
import { securityHeadersMiddleware } from "@/middlewares/security";
import { registerRoutes } from "@/routes";
import { errorResponse } from "@/utils/response";

const app = new Hono();

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

console.info(`Server is running on port ${server.port}`);
