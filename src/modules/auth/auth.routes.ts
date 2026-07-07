import { Hono } from "hono";

import type { AuthHandlers } from "@/modules/auth/handler";
import { authMiddleware } from "@/middlewares/auth";
import type { AppHonoEnv } from "@/types/app";

export const createAuthRoutes = (handlers: AuthHandlers) =>
  new Hono<AppHonoEnv>()
    .post("/login", handlers.loginHandler)
    .post("/logout", handlers.logoutHandler)
    .get("/me", authMiddleware, handlers.meHandler);
