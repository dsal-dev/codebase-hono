import type { Logger } from "pino";

import type { UserRepository } from "@/modules/user/repository";
import { NotFoundError } from "@/middlewares/error-handler";

export type GetUserOutput = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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
