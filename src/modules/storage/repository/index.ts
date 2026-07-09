import { eq, count, desc } from "drizzle-orm";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  type _Object,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { files } from "@/db/schema";
import type { Database } from "@/db";
import { getS3Client } from "@/storage";
import { env } from "@/config/env";
import { getLogger } from "@/utils/requestContext";

export type FileRow = {
  id: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface StorageRepository {
  insertFile(input: {
    key: string;
    filename: string;
    mimeType: string;
    size: number;
    uploadedBy: string | null;
  }): Promise<FileRow>;
  findFileById(id: string): Promise<FileRow | undefined>;
  findFileByKey(key: string): Promise<FileRow | undefined>;
  deleteFileRecord(id: string): Promise<void>;
  findAllFiles(page: number, limit: number): Promise<{ data: FileRow[]; total: number }>;
  uploadObject(key: string, body: Uint8Array, mimeType: string): Promise<void>;
  deleteObject(key: string): Promise<void>;
  getDownloadUrl(key: string): Promise<string>;
  listObjects(): Promise<string[]>;
}

export class StorageDbRepository implements StorageRepository {
  constructor(private db: Database) {}

  async insertFile(
    input: {
      key: string;
      filename: string;
      mimeType: string;
      size: number;
      uploadedBy: string | null;
    },
  ): Promise<FileRow> {
    const logger = getLogger();
    logger.info({ key: input.key }, "Inserting file record");

    const [result] = await this.db
      .insert(files)
      .values({
        key: input.key,
        filename: input.filename,
        mimeType: input.mimeType,
        size: input.size,
        uploadedBy: input.uploadedBy,
      })
      .returning();

    return result!;
  }

  async findFileById(id: string): Promise<FileRow | undefined> {
    const logger = getLogger();
    logger.info({ id }, "Finding file by id");

    const [result] = await this.db
      .select()
      .from(files)
      .where(eq(files.id, id))
      .limit(1);

    return result;
  }

  async findFileByKey(key: string): Promise<FileRow | undefined> {
    const logger = getLogger();
    logger.info({ key }, "Finding file by key");

    const [result] = await this.db
      .select()
      .from(files)
      .where(eq(files.key, key))
      .limit(1);

    return result;
  }

  async deleteFileRecord(id: string): Promise<void> {
    const logger = getLogger();
    logger.info({ id }, "Deleting file record");

    await this.db.delete(files).where(eq(files.id, id));
  }

  async findAllFiles(
    page: number,
    limit: number,
  ): Promise<{ data: FileRow[]; total: number }> {
    const logger = getLogger();
    logger.info({ page, limit }, "Finding all files");

    const offset = (page - 1) * limit;

    const data = await this.db
      .select()
      .from(files)
      .offset(offset)
      .limit(limit)
      .orderBy(desc(files.createdAt));

    const [totalResult] = await this.db.select({ value: count() }).from(files);
    const total = totalResult?.value ?? 0;

    return { data, total };
  }

  async uploadObject(key: string, body: Uint8Array, mimeType: string): Promise<void> {
    const logger = getLogger();
    logger.info({ key }, "Uploading object to S3");

    const s3 = getS3Client();

    await s3.send(
      new PutObjectCommand({
        Bucket: env.STORAGE_BUCKET,
        Key: key,
        Body: body,
        ContentType: mimeType,
      }),
    );
  }

  async deleteObject(key: string): Promise<void> {
    const logger = getLogger();
    logger.info({ key }, "Deleting object from S3");

    const s3 = getS3Client();

    await s3.send(
      new DeleteObjectCommand({
        Bucket: env.STORAGE_BUCKET,
        Key: key,
      }),
    );
  }

  async getDownloadUrl(key: string): Promise<string> {
    const logger = getLogger();
    logger.info({ key }, "Generating presigned download URL");

    const s3 = getS3Client();

    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: env.STORAGE_BUCKET,
        Key: key,
      }),
      { expiresIn: 3600 },
    );

    return url;
  }

  async listObjects(): Promise<string[]> {
    const logger = getLogger();
    logger.info("Listing objects in S3 bucket");

    const s3 = getS3Client();

    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: env.STORAGE_BUCKET,
      }),
    );

    return (response.Contents ?? []).map((obj: _Object) => obj.Key ?? "");
  }
}
