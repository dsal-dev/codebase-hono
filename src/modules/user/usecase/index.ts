import type { UserRepository } from "@/modules/user/repository";
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "@/middlewares/error-handler";
import { getLogger } from "@/utils/requestContext";

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

export type GetUserOutput = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

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

export type UpdateUserInput = {
  email?: string | undefined;
  name?: string | undefined;
  password?: string | undefined;
  role?: string | undefined;
};

export type UpdateUserOutput = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type DeleteUserOutput = void;

export interface UserUsecase {
  listUsers(input: ListUsersInput): Promise<ListUsersOutput>;
  getUser(id: string): Promise<GetUserOutput>;
  createUser(input: CreateUserInput): Promise<CreateUserOutput>;
  updateUser(id: string, input: UpdateUserInput): Promise<UpdateUserOutput>;
  deleteUser(id: string): Promise<void>;
}

export class UserUsecaseImpl implements UserUsecase {
  constructor(private userRepo: UserRepository) {}

  async listUsers(input: ListUsersInput): Promise<ListUsersOutput> {
    const logger = getLogger();
    logger.info({ page: input.page, limit: input.limit }, "Listing users");

    const { data, total } = await this.userRepo.findAllUsers(input.page, input.limit);

    return {
      data: data.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      })),
      total,
    };
  }

  async getUser(id: string): Promise<GetUserOutput> {
    const logger = getLogger();
    logger.info({ id }, "Getting user");

    const user = await this.userRepo.findUserById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async createUser(input: CreateUserInput): Promise<CreateUserOutput> {
    const logger = getLogger();
    logger.info({ email: input.email }, "Creating user");

    const existing = await this.userRepo.findUserByEmail(input.email);

    if (existing) {
      throw new ConflictError("Email already exists");
    }

    const passwordHash = await Bun.password.hash(input.password);

    const user = await this.userRepo.insertUser({
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
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<UpdateUserOutput> {
    const logger = getLogger();
    logger.info({ id }, "Updating user");

    const existing = await this.userRepo.findUserById(id);

    if (!existing) {
      throw new NotFoundError("User not found");
    }

    if (input.email && input.email !== existing.email) {
      const emailExists = await this.userRepo.findUserByEmail(input.email);

      if (emailExists) {
        throw new ConflictError("Email already exists");
      }
    }

    const updateData: Record<string, string> = {};

    if (input.email !== undefined) updateData.email = input.email;
    if (input.name !== undefined) updateData.name = input.name;
    if (input.role !== undefined) updateData.role = input.role;
    if (input.password !== undefined) {
      updateData.passwordHash = await Bun.password.hash(input.password);
    }

    const user = await this.userRepo.updateUserById(id, updateData);

    if (!user) {
      throw new InternalServerError("Failed to update user");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async deleteUser(id: string): Promise<void> {
    const logger = getLogger();
    logger.info({ id }, "Deleting user");

    const existing = await this.userRepo.findUserById(id);

    if (!existing) {
      throw new NotFoundError("User not found");
    }

    await this.userRepo.deleteUserById(id);
  }
}
