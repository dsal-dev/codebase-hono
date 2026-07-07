import type { Logger } from "pino";

import { findUserById, deleteUserById } from "@/modules/user/repository/user";
import { NotFoundError } from "@/middlewares/error-handler";

export const deleteUser = async (
  id: string,
  logger: Logger,
): Promise<void> => {
  logger.info({ id }, "Deleting user");

  const existing = await findUserById(id, logger);

  if (!existing) {
    throw new NotFoundError("User not found");
  }

  await deleteUserById(id, logger);
};
