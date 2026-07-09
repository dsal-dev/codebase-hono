import { db } from "@/db";
import { StorageDbRepository } from "@/modules/storage/repository";
import { StorageUsecaseImpl } from "@/modules/storage/usecase";
import { StorageHandler } from "@/modules/storage/handler";
import { createStorageRoutes } from "@/modules/storage/storage.routes";

export const createStorageModule = () => {
  const storageRepo = new StorageDbRepository(db);
  const storageUsecase = new StorageUsecaseImpl(storageRepo);
  const storageHandlers = new StorageHandler(storageUsecase);
  return createStorageRoutes(storageHandlers);
};
