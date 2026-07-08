import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { AuthUsecase } from "@/modules/auth/usecase";
import { loginSchema } from "@/modules/auth/schema/authSchema";
import { successResponse } from "@/utils/response";
import { UnprocessableEntityError } from "@/middlewares/error-handler";

export class AuthHandler {
  constructor(private authUsecase: AuthUsecase) {}

  login = async (c: Context<AppHonoEnv>) => {
    const parsed = loginSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      throw new UnprocessableEntityError("Invalid input", parsed.error.issues);
    }

    const result = await this.authUsecase.login(parsed.data);

    return c.json(successResponse(result, "Login successful"));
  };

  me = async (c: Context<AppHonoEnv>) => {
    const user = c.var.user;

    const result = await this.authUsecase.me(user.sub);

    return c.json(successResponse(result, "User fetched successfully"));
  };

  logout = async (c: Context<AppHonoEnv>) => {
    c.var.logger.info("User logged out");

    return c.json(successResponse(null, "Logout successful"));
  };
}
