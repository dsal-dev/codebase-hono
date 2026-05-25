// CORS middleware configured as a shared global middleware export.
import { cors } from "hono/cors";

export const corsMiddleware = cors();
