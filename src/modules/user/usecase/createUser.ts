import type { UserRepository } from "@/modules/user/repository";
import { ConflictError, InternalServerError } from "@/middlewares/error-handler";
import { getLogger } from "@/lib/requestContext";

export type CreateUserInput = {
  email: string;
  name: string;
  password: string;
  role: string;
};

export type CreateUserOutput = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserUsecase = (
  input: CreateUserInput,
) => Promise<CreateUserOutput>;

export const createCreateUserUsecase = (
  userRepo: UserRepository,
): CreateUserUsecase => {
  return async (input) => {
    const logger = getLogger();
    logger.info({ email: input.email }, "Creating user");

    const existing = await userRepo.findUserByEmail(input.email);

    if (existing) {
      throw new ConflictError("Email already exists");
    }

    const passwordHash = await Bun.password.hash(input.password);

    const user = await userRepo.insertUser({
      email: input.email,
      name: input.name,
      passwordHash,
      role: input.role,
    });

    if (!user) {
      throw new InternalServerError("Failed to create user");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  };
};
