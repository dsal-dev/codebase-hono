import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { MeUsecase } from "@/modules/auth/usecase/me";
import { successResponse } from "@/utils/response";

export const createMeHandler = (meUsecase: MeUsecase) => {
  return async (c: Context<AppHonoEnv>) => {
    const user = c.var.user;

    const result = await meUsecase(user.sub);

    return c.json(successResponse(result, "User fetched successfully"));
  };
};
