import type { Logger } from "pino";

import { findUserById } from "@/modules/auth/repository/auth";
import type { AuthRepository } from "@/modules/auth/repository/auth";
import { NotFoundError } from "@/middlewares/error-handler";

export type MeOutput = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export const me = async (userId: string, logger: Logger): Promise<MeOutput> => {
  logger.info({ userId }, "Fetching current user");

  const user = await findUserById(userId, logger);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

export type MeUsecase = (userId: string, logger: Logger) => Promise<MeOutput>;

export const createMeUsecase = (authRepo: AuthRepository): MeUsecase => {
  return async (userId, logger) => {
    logger.info({ userId }, "Fetching current user");

    const user = await authRepo.findUserById(userId, logger);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  };
};
