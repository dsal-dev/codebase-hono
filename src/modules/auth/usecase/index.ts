import { Jwt } from "hono/utils/jwt";

import { env } from "@/config/env";
import type { AuthRepository } from "@/modules/auth/repository";
import { UnauthorizedError, NotFoundError } from "@/middlewares/error-handler";
import { getOrSet } from "@/utils/cache";
import { getLogger } from "@/utils/requestContext";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginOutput = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
};

export type MeOutput = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export interface AuthUsecase {
  login(input: LoginInput): Promise<LoginOutput>;
  me(userId: string): Promise<MeOutput>;
}

export class AuthUsecaseImpl implements AuthUsecase {
  constructor(private authRepo: AuthRepository) {}

  async login(input: LoginInput): Promise<LoginOutput> {
    const logger = getLogger();
    logger.info({ email: input.email }, "Login attempt");

    const user = await this.authRepo.findUserByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const passwordValid = await Bun.password.verify(
      input.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = await Jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async me(userId: string): Promise<MeOutput> {
    const logger = getLogger();
    logger.info({ userId }, "Fetching current user");

    const user = await getOrSet(
      `auth:me:${userId}`,
      () => this.authRepo.findUserById(userId),
      300,
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
