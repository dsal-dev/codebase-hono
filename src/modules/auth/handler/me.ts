import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import { me } from "@/modules/auth/usecase/me";
import type { MeUsecase } from "@/modules/auth/usecase/me";
import { successResponse } from "@/utils/response";

export const meHandler = async (c: Context<AppHonoEnv>) => {
  const logger = c.var.logger;
  const user = c.var.user;

  const result = await me(user.sub, logger);

  return c.json(successResponse(result, "User fetched successfully"));
};

export const createMeHandler = (meUsecase: MeUsecase) => {
  return async (c: Context<AppHonoEnv>) => {
    const logger = c.var.logger;
    const user = c.var.user;

    const result = await meUsecase(user.sub, logger);

    return c.json(successResponse(result, "User fetched successfully"));
  };
};
