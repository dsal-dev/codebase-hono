import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import { deleteUser } from "@/modules/user/usecase/deleteUser";
import { successResponse } from "@/utils/response";
import { BadRequestError } from "@/middlewares/error-handler";

export const deleteUserHandler = async (c: Context<AppHonoEnv>) => {
  const logger = c.var.logger;
  const id = c.req.param("id");

  if (!id) {
    throw new BadRequestError("User ID is required");
  }

  await deleteUser(id, logger);

  return c.json(successResponse(null, "User deleted successfully"));
};
