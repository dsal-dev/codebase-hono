import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { DeleteUserUsecase } from "@/modules/user/usecase/deleteUser";
import { successResponse } from "@/utils/response";
import { BadRequestError } from "@/middlewares/error-handler";

export const createDeleteUserHandler = (deleteUserUsecase: DeleteUserUsecase) => {
  return async (c: Context<AppHonoEnv>) => {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    await deleteUserUsecase(id);

    return c.json(successResponse(null, "User deleted successfully"));
  };
};
