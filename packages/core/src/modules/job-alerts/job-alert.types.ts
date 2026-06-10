import type { JobAlert, JobAlertResult } from "@prisma/client";

export type JobAlertWithResults = JobAlert & {
  results: JobAlertResult[];
};

export type CreateJobAlertInput = {
  site: string;
  keywords: string[];
  location?: string;
};
