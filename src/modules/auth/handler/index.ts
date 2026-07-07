import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { AuthUsecase } from "@/modules/auth/usecase";
import { createLoginHandler } from "./login";
import { createMeHandler } from "./me";
import { createLogoutHandler } from "./logout";

export type AuthHandlers = {
  loginHandler: (c: Context<AppHonoEnv>) => Promise<Response>;
  meHandler: (c: Context<AppHonoEnv>) => Promise<Response>;
  logoutHandler: (c: Context<AppHonoEnv>) => Promise<Response>;
};

export const createAuthHandlers = (authUsecase: AuthUsecase): AuthHandlers => ({
  loginHandler: createLoginHandler(authUsecase.login),
  meHandler: createMeHandler(authUsecase.me),
  logoutHandler: createLogoutHandler(),
});
