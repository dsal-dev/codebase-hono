import crypto from "node:crypto";

import type { StorageRepository } from "@/modules/storage/repository";
import { NotFoundError } from "@/middlewares/error-handler";
import { getLogger } from "@/utils/requestContext";

export type UploadInput = {
  filename: string;
  mimeType: string;
  body: Uint8Array;
  uploadedBy: string | null;
};

export type FileOutput = {
  id: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListFilesOutput = {
  data: FileOutput[];
  total: number;
};

export interface StorageUsecase {
  upload(input: UploadInput): Promise<FileOutput>;
  getFile(id: string): Promise<FileOutput>;
  deleteFile(id: string): Promise<void>;
  listFiles(page: number, limit: number): Promise<ListFilesOutput>;
  getDownloadUrl(id: string): Promise<string>;
}

export class StorageUsecaseImpl implements StorageUsecase {
  constructor(private storageRepo: StorageRepository) {}

  async upload(input: UploadInput): Promise<FileOutput> {
    const logger = getLogger();
    logger.info({ filename: input.filename }, "Uploading file");

    const key = `${crypto.randomUUID()}/${input.filename}`;

    await this.storageRepo.uploadObject(key, input.body, input.mimeType);

    const file = await this.storageRepo.insertFile({
      key,
      filename: input.filename,
      mimeType: input.mimeType,
      size: input.body.byteLength,
      uploadedBy: input.uploadedBy,
    });

    return this.toOutput(file);
  }

  async getFile(id: string): Promise<FileOutput> {
    const logger = getLogger();
    logger.info({ id }, "Getting file");

    const file = await this.storageRepo.findFileById(id);

    if (!file) {
      throw new NotFoundError("File not found");
    }

    return this.toOutput(file);
  }

  async deleteFile(id: string): Promise<void> {
    const logger = getLogger();
    logger.info({ id }, "Deleting file");

    const file = await this.storageRepo.findFileById(id);

    if (!file) {
      throw new NotFoundError("File not found");
    }

    await this.storageRepo.deleteObject(file.key);
    await this.storageRepo.deleteFileRecord(id);
  }

  async listFiles(page: number, limit: number): Promise<ListFilesOutput> {
    const logger = getLogger();
    logger.info({ page, limit }, "Listing files");

    const { data, total } = await this.storageRepo.findAllFiles(page, limit);

    return {
      data: data.map((f) => this.toOutput(f)),
      total,
    };
  }

  async getDownloadUrl(id: string): Promise<string> {
    const logger = getLogger();
    logger.info({ id }, "Generating download URL");

    const file = await this.storageRepo.findFileById(id);

    if (!file) {
      throw new NotFoundError("File not found");
    }

    return this.storageRepo.getDownloadUrl(file.key);
  }

  private toOutput(file: {
    id: string;
    key: string;
    filename: string;
    mimeType: string;
    size: number;
    uploadedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): FileOutput {
    return {
      id: file.id,
      key: file.key,
      filename: file.filename,
      mimeType: file.mimeType,
      size: file.size,
      uploadedBy: file.uploadedBy,
      createdAt: file.createdAt.toISOString(),
      updatedAt: file.updatedAt.toISOString(),
    };
  }
}
