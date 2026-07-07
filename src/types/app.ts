import type { Logger } from "pino";

export type JwtUserPayload = {
  sub: string;
  email: string;
  role: string;
};

export type AppHonoEnv = {
  Variables: {
    logger: Logger;
    requestId: string;
    user: JwtUserPayload;
  };
};
