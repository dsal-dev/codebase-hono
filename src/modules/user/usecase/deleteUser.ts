import type { UserRepository } from "@/modules/user/repository";
import { NotFoundError } from "@/middlewares/error-handler";
import { getLogger } from "@/lib/requestContext";

export type DeleteUserUsecase = (id: string) => Promise<void>;

export const createDeleteUserUsecase = (
  userRepo: UserRepository,
): DeleteUserUsecase => {
  return async (id) => {
    const logger = getLogger();
    logger.info({ id }, "Deleting user");

    const existing = await userRepo.findUserById(id);

    if (!existing) {
      throw new NotFoundError("User not found");
    }

    await userRepo.deleteUserById(id);
  };
};
