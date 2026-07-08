import type { PgBoss } from "pg-boss";

import { sendEmailJob } from "./send-email.job";
import type { SendEmailPayload } from "./send-email.job";

const jobDefinitions = [
  sendEmailJob,
] as const;

export const registerAllJobs = (boss: PgBoss): void => {
  for (const job of jobDefinitions) {
    boss.work(job.queue, job.options ?? {}, job.handler as Parameters<typeof boss.work>[2]);
  }
};

export type { SendEmailPayload };
