import type { Logger } from "pino";

import { findUserById } from "@/modules/user/repository/user";
import type { UserRepository } from "@/modules/user/repository/user";
import { NotFoundError } from "@/middlewares/error-handler";

export type GetUserOutput = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export const getUser = async (
  id: string,
  logger: Logger,
): Promise<GetUserOutput> => {
  logger.info({ id }, "Getting user");

  const user = await findUserById(id, logger);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};

export type GetUserUsecase = (
  id: string,
  logger: Logger,
) => Promise<GetUserOutput>;

export const createGetUserUsecase = (
  userRepo: UserRepository,
): GetUserUsecase => {
  return async (id, logger) => {
    logger.info({ id }, "Getting user");

    const user = await userRepo.findUserById(id, logger);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  };
};
