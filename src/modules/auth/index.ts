import { Hono } from "hono";
import type { AppHonoEnv } from "@/types/app";
import { authMiddleware } from "@/middlewares/auth";

import { db } from "@/db";
import { AuthDbRepository } from "@/modules/auth/repository";
import { AuthUsecaseImpl } from "@/modules/auth/usecase";
import { AuthHandler } from "@/modules/auth/handler";

export const registerApi = (handlers: AuthHandler) => {
  const api = new Hono<AppHonoEnv>();

  api
    .post("/login", handlers.login)
    .post("/logout", handlers.logout)
    .get("/me", authMiddleware, handlers.me);

  return api;
};

export const createAuthModule = () => {
  const authRepo = new AuthDbRepository(db);
  const authUsecase = new AuthUsecaseImpl(authRepo);
  const authHandlers = new AuthHandler(authUsecase);
  return registerApi(authHandlers);
};
