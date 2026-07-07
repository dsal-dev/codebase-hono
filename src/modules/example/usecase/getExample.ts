import type { Logger } from "pino";

import { getExample as repo } from "@/modules/example/repository/getExample";

type GetExampleOutput = {
  message: string;
  timestamp: string;
};

export const getExample = async (logger: Logger): Promise<GetExampleOutput> => {
  logger.info("Executing getExample usecase");

  const data = await repo(logger);

  return data;
};
