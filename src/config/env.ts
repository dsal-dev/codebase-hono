// Centralized environment configuration with startup validation.
type NodeEnv = "development" | "test" | "production";

type AppEnv = {
  NODE_ENV: NodeEnv;
  PORT: number;
  DATABASE_URL: string;
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

export const env: AppEnv = {
  NODE_ENV: parseNodeEnv(required("NODE_ENV")),
  PORT: parsePort(required("PORT")),
  DATABASE_URL: required("DATABASE_URL"),
};
