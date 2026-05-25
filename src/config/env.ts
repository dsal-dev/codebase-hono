// Centralized environment configuration with startup validation.
type NodeEnv = "development" | "test" | "production";
type LogLevel =
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace"
  | "silent";

type AppEnv = {
  APP_NAME: string;
  NODE_ENV: NodeEnv;
  PORT: number;
  DATABASE_URL: string;
  LOG_LEVEL: LogLevel;
};

const required = (key: keyof AppEnv): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} environment variable is required.`);
  }

  return value;
};

const parseNodeEnv = (value: string): NodeEnv => {
  if (value === "development" || value === "test" || value === "production") {
    return value;
  }

  throw new Error("NODE_ENV must be one of: development, test, production.");
};

const parsePort = (value: string): number => {
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
    throw new Error("PORT must be a valid TCP port number.");
  }

  return port;
};

const parseLogLevel = (value: string): LogLevel => {
  if (
    value === "fatal" ||
    value === "error" ||
    value === "warn" ||
    value === "info" ||
    value === "debug" ||
    value === "trace" ||
    value === "silent"
  ) {
    return value;
  }

  throw new Error(
    "LOG_LEVEL must be one of: fatal, error, warn, info, debug, trace, silent.",
  );
};

const nodeEnv = parseNodeEnv(required("NODE_ENV"));

export const env: AppEnv = {
  APP_NAME: required("APP_NAME"),
  NODE_ENV: nodeEnv,
  PORT: parsePort(required("PORT")),
  DATABASE_URL: required("DATABASE_URL"),
  LOG_LEVEL: parseLogLevel(
    process.env.LOG_LEVEL ?? (nodeEnv === "production" ? "info" : "debug"),
  ),
};
