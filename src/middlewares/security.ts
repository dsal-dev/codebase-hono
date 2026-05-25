// Security headers middleware that applies Hono's safe default HTTP headers.
import { secureHeaders } from "hono/secure-headers";

export const securityHeadersMiddleware = secureHeaders();
