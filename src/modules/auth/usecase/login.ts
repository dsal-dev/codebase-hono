import { Jwt } from "hono/utils/jwt";
import type { Logger } from "pino";

import { env } from "@/config/env";
import { findUserByEmail } from "@/modules/auth/repository/auth";
import { UnauthorizedError } from "@/middlewares/error-handler";

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

export const login = async (
  input: LoginInput,
  logger: Logger,
): Promise<LoginOutput> => {
  logger.info({ email: input.email }, "Login attempt");

  const user = await findUserByEmail(input.email, logger);

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
};
