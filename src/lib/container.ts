import { db } from "@/db";
import { createAuthRepository } from "@/modules/auth/repository";
import { createUserRepository } from "@/modules/user/repository";
import { createAuthUsecase } from "@/modules/auth/usecase";
import { createUserUsecase } from "@/modules/user/usecase";
import { createAuthHandlers } from "@/modules/auth/handler";
import { createUserHandlers } from "@/modules/user/handler";
import { createAuthRoutes } from "@/modules/auth/auth.routes";
import { createUserRoutes } from "@/modules/user/user.routes";

export const createContainer = () => {
  const authRepo = createAuthRepository(db);
  const userRepo = createUserRepository(db);

  const authUsecase = createAuthUsecase(authRepo);
  const userUsecase = createUserUsecase(userRepo);

  const authHandlers = createAuthHandlers(authUsecase);
  const userHandlers = createUserHandlers(userUsecase);

  const authRoutes = createAuthRoutes(authHandlers);
  const userRoutes = createUserRoutes(userHandlers);

  return { authRoutes, userRoutes };
};
