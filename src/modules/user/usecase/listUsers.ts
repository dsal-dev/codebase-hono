import type { Logger } from "pino";

import { findAllUsers } from "@/modules/user/repository/user";

export type ListUsersInput = {
  page: number;
  limit: number;
};

export type ListUsersOutput = {
  data: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
};

export const listUsers = async (
  input: ListUsersInput,
  logger: Logger,
): Promise<ListUsersOutput> => {
  logger.info({ page: input.page, limit: input.limit }, "Listing users");

  const { data, total } = await findAllUsers(input.page, input.limit, logger);

  return {
    data: data.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    })),
    total,
  };
};
