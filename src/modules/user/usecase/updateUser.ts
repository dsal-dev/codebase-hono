import type { UserRepository } from "@/modules/user/repository";
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "@/middlewares/error-handler";
import { getLogger } from "@/lib/requestContext";

export type UpdateUserInput = {
  email?: string | undefined;
  name?: string | undefined;
  password?: string | undefined;
  role?: string | undefined;
};

export type UpdateUserOutput = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserUsecase = (
  id: string,
  input: UpdateUserInput,
) => Promise<UpdateUserOutput>;

export const createUpdateUserUsecase = (
  userRepo: UserRepository,
): UpdateUserUsecase => {
  return async (id, input) => {
    const logger = getLogger();
    logger.info({ id }, "Updating user");

    const existing = await userRepo.findUserById(id);

    if (!existing) {
      throw new NotFoundError("User not found");
    }

    if (input.email && input.email !== existing.email) {
      const emailExists = await userRepo.findUserByEmail(input.email);

      if (emailExists) {
        throw new ConflictError("Email already exists");
      }
    }

    const updateData: Record<string, string> = {};

    if (input.email !== undefined) updateData.email = input.email;
    if (input.name !== undefined) updateData.name = input.name;
    if (input.role !== undefined) updateData.role = input.role;
    if (input.password !== undefined) {
      updateData.passwordHash = await Bun.password.hash(input.password);
    }

    const user = await userRepo.updateUserById(id, updateData);

    if (!user) {
      throw new InternalServerError("Failed to update user");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  };
};
