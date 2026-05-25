// Centralized Pino logger instance and helpers used across the application.
import pino, { type Logger } from "pino";

import { env } from "@/config/env";

export type LogBindings = Record<
  string,
  string | number | boolean | null | undefined
>;

export const logger = pino({
  level: env.LOG_LEVEL,
  name: env.APP_NAME,
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "request.headers.authorization",
      "request.headers.cookie",
      "authorization",
      "cookie",
    ],
    remove: true,
  },
  base: {
    env: env.NODE_ENV,
  },
});

export const createChildLogger = (bindings: LogBindings): Logger =>
  logger.child(bindings);
