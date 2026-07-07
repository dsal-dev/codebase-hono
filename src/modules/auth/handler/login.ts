import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { LoginUsecase } from "@/modules/auth/usecase/login";
import { loginSchema } from "@/modules/auth/schema/authSchema";
import { successResponse } from "@/utils/response";
import { UnprocessableEntityError } from "@/middlewares/error-handler";

export const createLoginHandler = (loginUsecase: LoginUsecase) => {
  return async (c: Context<AppHonoEnv>) => {
    const parsed = loginSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      throw new UnprocessableEntityError("Invalid input", parsed.error.issues);
    }

    const result = await loginUsecase(parsed.data);

    return c.json(successResponse(result, "Login successful"));
  };
};
