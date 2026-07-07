import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import { getExample } from "@/modules/example/usecase/getExample";
import { successResponse } from "@/utils/response";

export const getExampleHandler = async (c: Context<AppHonoEnv>) => {
  const logger = c.var.logger;

  const data = await getExample(logger);

  return c.json(successResponse(data, "Example data fetched successfully"));
};
