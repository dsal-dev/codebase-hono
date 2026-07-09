import { vi } from "vitest";

process.env.APP_NAME = "test-app";
process.env.NODE_ENV = "test";
process.env.PORT = "3000";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.JWT_SECRET = "test-secret";
process.env.LOG_LEVEL = "silent";
process.env.REDIS_URL = "";
process.env.STORAGE_ENDPOINT = "http://localhost:9000";
process.env.STORAGE_REGION = "us-east-1";
process.env.STORAGE_ACCESS_KEY = "minioadmin";
process.env.STORAGE_SECRET_KEY = "minioadmin";
process.env.STORAGE_BUCKET = "test-bucket";
process.env.STORAGE_USE_SSL = "false";

if (typeof Bun === "undefined") {
  (globalThis as any).Bun = {
    password: {
      hash: vi.fn((password: string) => Promise.resolve(`hashed:${password}`)),
      verify: vi.fn((password: string, hash: string) =>
        Promise.resolve(hash === `hashed:${password}`),
      ),
    },
  };
}
