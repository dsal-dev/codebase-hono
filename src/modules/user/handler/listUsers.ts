import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import { listUsers } from "@/modules/user/usecase/listUsers";
import type { ListUsersUsecase } from "@/modules/user/usecase/listUsers";
import { listUsersQuerySchema } from "@/modules/user/schema/userSchema";
import { successResponse } from "@/utils/response";

export const listUsersHandler = async (c: Context<AppHonoEnv>) => {
  const logger = c.var.logger;
  const query = listUsersQuerySchema.parse(c.req.query());

  const result = await listUsers(query, logger);

  const totalPages = Math.ceil(result.total / query.limit);

  return c.json(
    successResponse(result.data, "Users fetched successfully", {
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages,
    }),
  );
};

export const createListUsersHandler = (listUsersUsecase: ListUsersUsecase) => {
  return async (c: Context<AppHonoEnv>) => {
    const logger = c.var.logger;
    const query = listUsersQuerySchema.parse(c.req.query());

    const result = await listUsersUsecase(query, logger);

    const totalPages = Math.ceil(result.total / query.limit);

    return c.json(
      successResponse(result.data, "Users fetched successfully", {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages,
      }),
    );
  };
};
