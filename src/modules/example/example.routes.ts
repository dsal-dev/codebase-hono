// Example module route definitions that demonstrate the standard module wiring pattern.
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { getExample } from "@/modules/example/example.handler";
import { exampleQuerySchema } from "@/modules/example/example.schema";

export const exampleRoutes = new Hono().get(
  "/",
  zValidator("query", exampleQuerySchema),
  getExample,
);
