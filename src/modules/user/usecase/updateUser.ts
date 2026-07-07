import type { Logger } from "pino";

import {
  findUserById,
  findUserByEmail,
  updateUserById,
} from "@/modules/user/repository/user";
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "@/middlewares/error-handler";

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

export const updateUser = async (
  id: string,
  input: UpdateUserInput,
  logger: Logger,
): Promise<UpdateUserOutput> => {
  logger.info({ id }, "Updating user");

  const existing = await findUserById(id, logger);

  if (!existing) {
    throw new NotFoundError("User not found");
  }

  if (input.email && input.email !== existing.email) {
    const emailExists = await findUserByEmail(input.email);

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

  const user = await updateUserById(id, updateData, logger);

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
