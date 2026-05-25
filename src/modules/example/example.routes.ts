// Example module route definitions that demonstrate the standard module wiring pattern.
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { getExample } from "@/modules/example/example.handler";
import { exampleQuerySchema } from "@/modules/example/example.schema";
import type { AppHonoEnv } from "@/types/app";

export const exampleRoutes = new Hono<AppHonoEnv>().get(
  "/",
  zValidator("query", exampleQuerySchema),
  getExample,
);
