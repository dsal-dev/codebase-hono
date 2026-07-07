import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { ListUsersUsecase } from "@/modules/user/usecase/listUsers";
import { listUsersQuerySchema } from "@/modules/user/schema/userSchema";
import { successResponse } from "@/utils/response";
import { buildPaginationMeta } from "@/utils/pagination";

export const createListUsersHandler = (listUsersUsecase: ListUsersUsecase) => {
  return async (c: Context<AppHonoEnv>) => {
    const logger = c.var.logger;
    const query = listUsersQuerySchema.parse(c.req.query());

    const result = await listUsersUsecase(query, logger);
    const meta = buildPaginationMeta(query.page, query.limit, result.total);

    return c.json(
      successResponse(result.data, "Users fetched successfully", meta),
    );
  };
};
