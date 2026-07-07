import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { UpdateUserUsecase } from "@/modules/user/usecase/updateUser";
import { updateUserSchema } from "@/modules/user/schema/userSchema";
import { successResponse } from "@/utils/response";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "@/middlewares/error-handler";

export const createUpdateUserHandler = (updateUserUsecase: UpdateUserUsecase) => {
  return async (c: Context<AppHonoEnv>) => {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    const parsed = updateUserSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      throw new UnprocessableEntityError("Invalid input", parsed.error.issues);
    }

    const result = await updateUserUsecase(id, parsed.data);

    return c.json(successResponse(result, "User updated successfully"));
  };
};
