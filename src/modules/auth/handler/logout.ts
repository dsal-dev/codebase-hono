import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import { successResponse } from "@/utils/response";

export const logoutHandler = async (c: Context<AppHonoEnv>) => {
  c.var.logger.info("User logged out");

  return c.json(successResponse(null, "Logout successful"));
};

export const createLogoutHandler = () => {
  return async (c: Context<AppHonoEnv>) => {
    c.var.logger.info("User logged out");

    return c.json(successResponse(null, "Logout successful"));
  };
};
