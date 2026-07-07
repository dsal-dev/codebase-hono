import type { Logger } from "pino";

type ExampleData = {
  message: string;
  timestamp: string;
};

export const getExample = async (logger: Logger): Promise<ExampleData> => {
  logger.info("Fetching example data");

  return {
    message: "Hello from repository",
    timestamp: new Date().toISOString(),
  };
};
