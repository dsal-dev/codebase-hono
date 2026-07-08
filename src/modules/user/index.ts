import { db } from "@/db";
import { createUserRepository } from "@/modules/user/repository";
import { createUserUsecase } from "@/modules/user/usecase";
import { createUserHandlers } from "@/modules/user/handler";
import { createUserRoutes } from "@/modules/user/user.routes";

export const createUserModule = () => {
  const userRepo = createUserRepository(db);
  const userUsecase = createUserUsecase(userRepo);
  const userHandlers = createUserHandlers(userUsecase);
  return createUserRoutes(userHandlers);
};
