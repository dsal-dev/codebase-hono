import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import { getUser } from "@/modules/user/usecase/getUser";
import type { GetUserUsecase } from "@/modules/user/usecase/getUser";
import { successResponse } from "@/utils/response";
import { BadRequestError } from "@/middlewares/error-handler";

export const getUserHandler = async (c: Context<AppHonoEnv>) => {
  const logger = c.var.logger;
  const id = c.req.param("id");

  if (!id) {
    throw new BadRequestError("User ID is required");
  }

  const result = await getUser(id, logger);

  return c.json(successResponse(result, "User fetched successfully"));
};

export const createGetUserHandler = (getUserUsecase: GetUserUsecase) => {
  return async (c: Context<AppHonoEnv>) => {
    const logger = c.var.logger;
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    const result = await getUserUsecase(id, logger);

    return c.json(successResponse(result, "User fetched successfully"));
  };
};
