import { Hono } from "hono";

import { loginHandler } from "@/modules/auth/handler/login";
import { logoutHandler } from "@/modules/auth/handler/logout";
import { meHandler } from "@/modules/auth/handler/me";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import type { AppHonoEnv } from "@/types/app";

export const authRoutes = new Hono<AppHonoEnv>()
  .post("/login", loginHandler)
  .post("/logout", logoutHandler)
  .get("/me", authMiddleware, meHandler);
