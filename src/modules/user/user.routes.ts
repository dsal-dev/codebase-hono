import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import type { AppHonoEnv } from "@/types/app";
import type { UserHandlers } from "@/modules/user/handler";
import { authMiddleware } from "@/middlewares/auth";
import { adminMiddleware } from "@/middlewares/admin";
import {
  listUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
} from "@/modules/user/schema/userSchema";

export const createUserRoutes = (handlers: UserHandlers) =>
  new Hono<AppHonoEnv>()
    .get(
      "/",
      authMiddleware,
      adminMiddleware,
      zValidator("query", listUsersQuerySchema),
      handlers.listUsersHandler,
    )
    .post(
      "/",
      authMiddleware,
      adminMiddleware,
      zValidator("json", createUserSchema),
      handlers.createUserHandler,
    )
    .get("/:id", authMiddleware, adminMiddleware, handlers.getUserHandler)
    .put(
      "/:id",
      authMiddleware,
      adminMiddleware,
      zValidator("json", updateUserSchema),
      handlers.updateUserHandler,
    )
    .delete("/:id", authMiddleware, adminMiddleware, handlers.deleteUserHandler);
