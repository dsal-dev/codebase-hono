import type { AuthRepository } from "@/modules/auth/repository";
import { NotFoundError } from "@/middlewares/error-handler";
import { getOrSet } from "@/utils/cache";
import { getLogger } from "@/utils/requestContext";

export type MeOutput = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type MeUsecase = (userId: string) => Promise<MeOutput>;

export const createMeUsecase = (authRepo: AuthRepository): MeUsecase => {
  return async (userId) => {
    const logger = getLogger();
    logger.info({ userId }, "Fetching current user");

    const user = await getOrSet(
      `auth:me:${userId}`,
      () => authRepo.findUserById(userId),
      300,
    );

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
