import type { Context } from "hono";

import type { AppHonoEnv } from "@/types/app";
import type { UserUsecase } from "@/modules/user/usecase";
import {
  listUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
} from "@/modules/user/schema/userSchema";
import { successResponse } from "@/utils/response";
import { buildPaginationMeta } from "@/utils/pagination";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "@/middlewares/error-handler";

export class UserHandler {
  constructor(private userUsecase: UserUsecase) {}

  listUsers = async (c: Context<AppHonoEnv>) => {
    const query = listUsersQuerySchema.parse(c.req.query());

    const result = await this.userUsecase.listUsers(query);
    const meta = buildPaginationMeta(query.page, query.limit, result.total);

    return c.json(
      successResponse(result.data, "Users fetched successfully", meta),
    );
  };

  getUser = async (c: Context<AppHonoEnv>) => {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    const result = await this.userUsecase.getUser(id);

    return c.json(successResponse(result, "User fetched successfully"));
  };

  createUser = async (c: Context<AppHonoEnv>) => {
    const parsed = createUserSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      throw new UnprocessableEntityError("Invalid input", parsed.error.issues);
    }

    const result = await this.userUsecase.createUser(parsed.data);

    return c.json(successResponse(result, "User created successfully"));
  };

  updateUser = async (c: Context<AppHonoEnv>) => {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    const parsed = updateUserSchema.safeParse(await c.req.json());

    if (!parsed.success) {
      throw new UnprocessableEntityError("Invalid input", parsed.error.issues);
    }

    const result = await this.userUsecase.updateUser(id, parsed.data);

    return c.json(successResponse(result, "User updated successfully"));
  };

  deleteUser = async (c: Context<AppHonoEnv>) => {
    const id = c.req.param("id");

    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    await this.userUsecase.deleteUser(id);

    return c.json(successResponse(null, "User deleted successfully"));
  };
}
