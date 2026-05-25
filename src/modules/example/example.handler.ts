// Example module handlers that show where request handling logic belongs.
import type { Context } from "hono";

import { successResponse } from "@/utils/response";

export const getExample = (c: Context) => {
  return c.json(successResponse(null, "Example module is registered"));
};
