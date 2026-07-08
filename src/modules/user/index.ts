import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { UserDbRepository } from "@/modules/user/repository";
import { UserUsecaseImpl } from "@/modules/user/usecase";
import { UserHandler } from "@/modules/user/handler";

import type { AppHonoEnv } from "@/types/app";
import { authMiddleware } from "@/middlewares/auth";
import { adminMiddleware } from "@/middlewares/admin";
import {
  listUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
} from "@/modules/user/schema/userSchema";

const registerApi = (handlers: UserHandler) => {
  const api = new Hono<AppHonoEnv>();

  api
    .use("/*", authMiddleware, adminMiddleware)
    .get("/", zValidator("query", listUsersQuerySchema), handlers.listUsers)
    .post("/", zValidator("json", createUserSchema), handlers.createUser)
    .get("/:id", handlers.getUser)
    .put("/:id", zValidator("json", updateUserSchema), handlers.updateUser)
    .delete("/:id", handlers.deleteUser);

  return api;
};

export const createUserModule = () => {
  const userRepo = new UserDbRepository(db);
  const userUsecase = new UserUsecaseImpl(userRepo);
  const userHandlers = new UserHandler(userUsecase);
  return registerApi(userHandlers);
};
