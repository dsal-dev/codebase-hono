// Shared Hono environment types for request-scoped variables.
import type { Logger } from "pino";

export type AppHonoEnv = {
  Variables: {
    logger: Logger;
    requestId: string;
  };
};
