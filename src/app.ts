import { Hono } from "hono";

import { errorHandler } from "@/middlewares/error-handler";
import { corsMiddleware } from "@/middlewares/cors";
import { requestLogger } from "@/middlewares/logger";
import { securityHeadersMiddleware } from "@/middlewares/security";
import { registerRoutes } from "@/routes";
import type { AppHonoEnv } from "@/types/app";
import { errorResponse } from "@/utils/response";

const app = new Hono<AppHonoEnv>();

app.use("*", requestLogger);
app.use("*", corsMiddleware);
app.use("*", securityHeadersMiddleware);

registerRoutes(app);

app.onError(errorHandler);
app.notFound((c) => c.json(errorResponse("Route not found", "NOT_FOUND"), 404));

export default app;
