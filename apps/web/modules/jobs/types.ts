import type { Item, JobStatus } from "@/modules/items/types";

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  applied: "Applied",
  interview: "Interviewing",
  rejected: "Rejected / Archived",
  offer: "Shortlisted",
};

export type JobItem = Item & {
  job: NonNullable<Item["job"]>;
};

export type JobFormValues = {
  title: string;
  company: string;
  role: string;
  status: JobStatus;
  content: string;
  tags: string;
  source: string;
  link: string;
  appliedAt: string;
};
