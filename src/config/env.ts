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
  JWT_SECRET: string;
  QUEUE_DATABASE_URL: string;
  QUEUE_ENABLED: boolean;
  REDIS_URL: string;
  STORAGE_ENDPOINT: string;
  STORAGE_REGION: string;
  STORAGE_ACCESS_KEY: string;
  STORAGE_SECRET_KEY: string;
  STORAGE_BUCKET: string;
  STORAGE_USE_SSL: boolean;
};

const required = (key: keyof AppEnv): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} environment variable is required.`);
  }

  return value;
};

export const parseNodeEnv = (value: string): NodeEnv => {
  if (value === "development" || value === "test" || value === "production") {
    return value;
  }

  throw new Error("NODE_ENV must be one of: development, test, production.");
};

export const parsePort = (value: string): number => {
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
    throw new Error("PORT must be a valid TCP port number.");
  }

  return port;
};

export const parseLogLevel = (value: string): LogLevel => {
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
  JWT_SECRET: required("JWT_SECRET"),
  QUEUE_DATABASE_URL: process.env.QUEUE_DATABASE_URL ?? required("DATABASE_URL"),
  QUEUE_ENABLED: process.env.QUEUE_ENABLED !== "false",
  REDIS_URL: process.env.REDIS_URL ?? "",
  STORAGE_ENDPOINT: required("STORAGE_ENDPOINT"),
  STORAGE_REGION: required("STORAGE_REGION"),
  STORAGE_ACCESS_KEY: required("STORAGE_ACCESS_KEY"),
  STORAGE_SECRET_KEY: required("STORAGE_SECRET_KEY"),
  STORAGE_BUCKET: required("STORAGE_BUCKET"),
  STORAGE_USE_SSL: process.env.STORAGE_USE_SSL === "true",
};
