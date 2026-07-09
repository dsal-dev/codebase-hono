import { z } from "zod";

export const uploadQuerySchema = z.object({
  filename: z.string().min(1).max(255),
});

export const listFilesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export const fileResponseSchema = z.object({
  id: z.string(),
  key: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  uploadedBy: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
