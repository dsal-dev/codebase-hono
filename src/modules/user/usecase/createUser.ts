import type { Logger } from "pino";

import { findUserByEmail, insertUser } from "@/modules/user/repository/user";
import { ConflictError, InternalServerError } from "@/middlewares/error-handler";

export type CreateUserInput = {
  email: string;
  name: string;
  password: string;
  role: string;
};

export type CreateUserOutput = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export const createUser = async (
  input: CreateUserInput,
  logger: Logger,
): Promise<CreateUserOutput> => {
  logger.info({ email: input.email }, "Creating user");

  const existing = await findUserByEmail(input.email);

  if (existing) {
    throw new ConflictError("Email already exists");
  }

  const passwordHash = await Bun.password.hash(input.password);

  const user = await insertUser(
    {
      email: input.email,
      name: input.name,
      passwordHash,
      role: input.role,
    },
    logger,
  );

  if (!user) {
    throw new InternalServerError("Failed to create user");
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
