import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import { login } from "@/modules/auth/usecase/login";
import { loginSchema } from "@/modules/auth/schema/authSchema";
import { successResponse } from "@/utils/response";
import { UnprocessableEntityError } from "@/middlewares/error-handler";

export const loginHandler = async (c: Context<AppHonoEnv>) => {
  const logger = c.var.logger;

  const parsed = loginSchema.safeParse(await c.req.json());

  if (!parsed.success) {
    throw new UnprocessableEntityError("Invalid input", parsed.error.issues);
  }

  const result = await login(parsed.data, logger);

  return c.json(successResponse(result, "Login successful"));
};
