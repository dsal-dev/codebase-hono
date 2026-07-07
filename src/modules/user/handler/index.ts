import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { UserUsecase } from "@/modules/user/usecase";
import { createListUsersHandler } from "./listUsers";
import { createGetUserHandler } from "./getUser";
import { createCreateUserHandler } from "./createUser";
import { createUpdateUserHandler } from "./updateUser";
import { createDeleteUserHandler } from "./deleteUser";

export type UserHandlers = {
  listUsersHandler: (c: Context<AppHonoEnv>) => Promise<Response>;
  getUserHandler: (c: Context<AppHonoEnv>) => Promise<Response>;
  createUserHandler: (c: Context<AppHonoEnv>) => Promise<Response>;
  updateUserHandler: (c: Context<AppHonoEnv>) => Promise<Response>;
  deleteUserHandler: (c: Context<AppHonoEnv>) => Promise<Response>;
};

export const createUserHandlers = (userUsecase: UserUsecase): UserHandlers => ({
  listUsersHandler: createListUsersHandler(userUsecase.listUsers),
  getUserHandler: createGetUserHandler(userUsecase.getUser),
  createUserHandler: createCreateUserHandler(userUsecase.createUser),
  updateUserHandler: createUpdateUserHandler(userUsecase.updateUser),
  deleteUserHandler: createDeleteUserHandler(userUsecase.deleteUser),
});
