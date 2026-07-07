import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { getExampleHandler } from "@/modules/example/handler/getExample";
import { exampleQuerySchema } from "@/modules/example/schema/exampleQuerySchema";
import type { AppHonoEnv } from "@/types/app";

export const exampleRoutes = new Hono<AppHonoEnv>().get(
  "/",
  zValidator("query", exampleQuerySchema),
  getExampleHandler,
);
