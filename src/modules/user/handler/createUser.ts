import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { CreateUserUsecase } from "@/modules/user/usecase/createUser";
import { createUserSchema } from "@/modules/user/schema/userSchema";
import { successResponse } from "@/utils/response";
import { UnprocessableEntityError } from "@/middlewares/error-handler";

export const createCreateUserHandler = (createUserUsecase: CreateUserUsecase) => {
  return async (c: Context<AppHonoEnv>) => {
    const logger = c.var.logger;

    const parsed = createUserSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      throw new UnprocessableEntityError("Invalid input", parsed.error.issues);
    }

    const result = await createUserUsecase(parsed.data, logger);

    return c.json(successResponse(result, "User created successfully"));
  };
};
