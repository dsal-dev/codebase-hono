// Example module Zod schemas that show where request and response contracts belong.
import { z } from "zod";

export const exampleQuerySchema = z.object({});

export const exampleResponseSchema = z.object({
  success: z.literal(true),
  data: z.null(),
  message: z.string(),
});
