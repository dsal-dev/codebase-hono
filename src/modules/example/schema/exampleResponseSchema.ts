import { z } from "zod";

export const exampleResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    message: z.string(),
    timestamp: z.string(),
  }),
  message: z.string(),
});
