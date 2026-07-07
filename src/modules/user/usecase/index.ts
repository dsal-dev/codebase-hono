import type { UserRepository } from "@/modules/user/repository";
import { createListUsersUsecase, type ListUsersUsecase } from "./listUsers";
import { createGetUserUsecase, type GetUserUsecase } from "./getUser";
import { createCreateUserUsecase, type CreateUserUsecase } from "./createUser";
import { createUpdateUserUsecase, type UpdateUserUsecase } from "./updateUser";
import { createDeleteUserUsecase, type DeleteUserUsecase } from "./deleteUser";

export type UserUsecase = {
  listUsers: ListUsersUsecase;
  getUser: GetUserUsecase;
  createUser: CreateUserUsecase;
  updateUser: UpdateUserUsecase;
  deleteUser: DeleteUserUsecase;
};

export const createUserUsecase = (userRepo: UserRepository): UserUsecase => ({
  listUsers: createListUsersUsecase(userRepo),
  getUser: createGetUserUsecase(userRepo),
  createUser: createCreateUserUsecase(userRepo),
  updateUser: createUpdateUserUsecase(userRepo),
  deleteUser: createDeleteUserUsecase(userRepo),
});
