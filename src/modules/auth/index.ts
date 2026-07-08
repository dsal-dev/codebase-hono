import { db } from "@/db";
import { createAuthRepository } from "@/modules/auth/repository";
import { createAuthUsecase } from "@/modules/auth/usecase";
import { createAuthHandlers } from "@/modules/auth/handler";
import { createAuthRoutes } from "@/modules/auth/auth.routes";

export const createAuthModule = () => {
  const authRepo = createAuthRepository(db);
  const authUsecase = createAuthUsecase(authRepo);
  const authHandlers = createAuthHandlers(authUsecase);
  return createAuthRoutes(authHandlers);
};
