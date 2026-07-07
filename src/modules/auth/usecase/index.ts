import type { AuthRepository } from "@/modules/auth/repository";
import { createLoginUsecase, type LoginUsecase } from "./login";
import { createMeUsecase, type MeUsecase } from "./me";

export type AuthUsecase = {
  login: LoginUsecase;
  me: MeUsecase;
};

export const createAuthUsecase = (authRepo: AuthRepository): AuthUsecase => ({
  login: createLoginUsecase(authRepo),
  me: createMeUsecase(authRepo),
});
