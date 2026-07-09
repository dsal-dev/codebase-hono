import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { StorageUsecase } from "@/modules/storage/usecase";
import {
  listFilesQuerySchema,
} from "@/modules/storage/schema/storageSchema";
import { successResponse } from "@/utils/response";
import { buildPaginationMeta } from "@/utils/pagination";
import { BadRequestError } from "@/middlewares/error-handler";

export class StorageHandler {
  constructor(private storageUsecase: StorageUsecase) {}

  upload = async (c: Context<AppHonoEnv>) => {
    const user = c.var.user;

    const contentType = c.req.header("content-type") ?? "";

    if (!contentType.includes("multipart/form-data")) {
      throw new BadRequestError("Content-Type must be multipart/form-data");
    }

    const formData = await c.req.parseBody();

    const file = formData["file"];

    if (!file || !(file instanceof File)) {
      throw new BadRequestError("File is required");
    }

    const arrayBuffer = await file.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);

    const result = await this.storageUsecase.upload({
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      body,
      uploadedBy: user.sub,
    });

    return c.json(successResponse(result, "File uploaded successfully"), 201);
  };

  listFiles = async (c: Context<AppHonoEnv>) => {
    const query = listFilesQuerySchema.parse(c.req.query());

    const result = await this.storageUsecase.listFiles(query.page, query.limit);
    const meta = buildPaginationMeta(query.page, query.limit, result.total);

    return c.json(
      successResponse(result.data, "Files fetched successfully", meta),
    );
  };

  getFile = async (c: Context<AppHonoEnv>) => {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestError("File ID is required");
    }

    const result = await this.storageUsecase.getFile(id);

    return c.json(successResponse(result, "File fetched successfully"));
  };

  deleteFile = async (c: Context<AppHonoEnv>) => {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestError("File ID is required");
    }

    await this.storageUsecase.deleteFile(id);

    return c.json(successResponse(null, "File deleted successfully"));
  };

  getDownloadUrl = async (c: Context<AppHonoEnv>) => {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestError("File ID is required");
    }

    const url = await this.storageUsecase.getDownloadUrl(id);

    return c.json(successResponse({ url }, "Download URL generated successfully"));
  };
}
