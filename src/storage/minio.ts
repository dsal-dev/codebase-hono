import { S3Client } from "@aws-sdk/client-s3";

import { env } from "@/config/env";

let client: S3Client | null = null;

export const getS3Client = (): S3Client => {
  if (!client) {
    client = new S3Client({
      endpoint: env.STORAGE_ENDPOINT,
      region: env.STORAGE_REGION,
      credentials: {
        accessKeyId: env.STORAGE_ACCESS_KEY,
        secretAccessKey: env.STORAGE_SECRET_KEY,
      },
      forcePathStyle: true,
    });
  }

  return client;
};

export const closeS3Client = async (): Promise<void> => {
  if (client) {
    client.destroy();
    client = null;
  }
};
