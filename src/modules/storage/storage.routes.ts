import { Hono } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { StorageHandler } from "@/modules/storage/handler";
import { authMiddleware } from "@/middlewares/auth";
import { adminMiddleware } from "@/middlewares/admin";

export const createStorageRoutes = (handlers: StorageHandler) =>
  new Hono<AppHonoEnv>()
    .post("/upload", authMiddleware, handlers.upload)
    .get("/files", authMiddleware, adminMiddleware, handlers.listFiles)
    .get("/files/:id", authMiddleware, adminMiddleware, handlers.getFile)
    .delete("/files/:id", authMiddleware, adminMiddleware, handlers.deleteFile)
    .get("/download/:id", handlers.getDownloadUrl);
