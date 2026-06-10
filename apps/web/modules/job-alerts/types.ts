export type JobAlertResult = {
  id: string;
  alertId: string;
  title: string;
  url: string;
  snippet: string | null;
  foundAt: string;
  seenAt: string | null;
};

export type JobAlert = {
  id: string;
  site: string;
  keywords: string[];
  location: string | null;
  isActive: boolean;
  lastCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
  results: JobAlertResult[];
};

export type AddJobAlertFormValues = {
  site: string;
  keywords: string;
  location: string;
};
