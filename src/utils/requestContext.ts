import { AsyncLocalStorage } from "node:async_hooks";
import type { Logger } from "pino";
import { logger as rootLogger } from "@/utils/logger";

export type RequestStore = {
  logger: Logger;
  requestId: string;
};

export const requestContext = new AsyncLocalStorage<RequestStore>();

export const getLogger = (): Logger => {
  const store = requestContext.getStore();
  return store?.logger ?? rootLogger;
};

export const getRequestId = (): string | undefined => {
  return requestContext.getStore()?.requestId;
};
