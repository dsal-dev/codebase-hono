import type { Job, WorkOptions } from "pg-boss";

export type SendEmailPayload = {
  to: string;
  subject: string;
  body: string;
};

export const sendEmailJob = {
  queue: "send-email",
  options: {
    batchSize: 10,
    pollingIntervalSeconds: 2,
  } satisfies WorkOptions,
  handler: async (jobs: Job<SendEmailPayload>[]): Promise<void> => {
    for (const job of jobs) {
      const { to, subject, body } = job.data;
      // TODO: replace with actual email sending logic
      console.log(`[send-email] Sending email to ${to}: ${subject}`);
      console.log(`[send-email] Body: ${body}`);
    }
  },
};
