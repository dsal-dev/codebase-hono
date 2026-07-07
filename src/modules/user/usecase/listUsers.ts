import type { Logger } from "pino";

import type { UserRepository } from "@/modules/user/repository";

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

export type ListUsersUsecase = (
  input: ListUsersInput,
  logger: Logger,
) => Promise<ListUsersOutput>;

export const createListUsersUsecase = (
  userRepo: UserRepository,
): ListUsersUsecase => {
  return async (input, logger) => {
    logger.info({ page: input.page, limit: input.limit }, "Listing users");

    const { data, total } = await userRepo.findAllUsers(input.page, input.limit, logger);

    return {
      data: data.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      })),
      total,
    };
  };
};
