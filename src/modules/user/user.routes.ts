import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import type { AppHonoEnv } from "@/types/app";
import type { UserHandlers } from "@/modules/user/handler";
import { authMiddleware } from "@/middlewares/auth";
import { adminMiddleware } from "@/middlewares/admin";
import { listUsersHandler } from "@/modules/user/handler/listUsers";
import { getUserHandler } from "@/modules/user/handler/getUser";
import { createUserHandler } from "@/modules/user/handler/createUser";
import { updateUserHandler } from "@/modules/user/handler/updateUser";
import { deleteUserHandler } from "@/modules/user/handler/deleteUser";
import {
  listUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
} from "@/modules/user/schema/userSchema";

export const userRoutes = new Hono<AppHonoEnv>()
  .get(
    "/",
    authMiddleware,
    adminMiddleware,
    zValidator("query", listUsersQuerySchema),
    listUsersHandler,
  )
  .post(
    "/",
    authMiddleware,
    adminMiddleware,
    zValidator("json", createUserSchema),
    createUserHandler,
  )
  .get("/:id", authMiddleware, adminMiddleware, getUserHandler)
  .put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    zValidator("json", updateUserSchema),
    updateUserHandler,
  )
  .delete("/:id", authMiddleware, adminMiddleware, deleteUserHandler);

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
