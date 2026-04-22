export type JobStatus = "applied" | "interview" | "offer" | "rejected";
export type ItemType = "job" | "transaction" | "note" | "todo" | "bookmark";

export type Item = {
  id: string;
  title: string;
  content: string | null;
  tags: string[];
  type: ItemType;
  createdAt: string;
  updatedAt: string;
  job: {
    company: string;
    role: string;
    status: JobStatus;
    source: string | null;
    link: string | null;
    appliedAt: string | null;
  } | null;
  transaction: {
    amount: number;
    category: string;
    date: string;
    type: "income" | "expense";
  } | null;
  note: {
    content: string;
  } | null;
  todo: {
    completed: boolean;
    dueDate: string | null;
    priority: "low" | "medium" | "high";
  } | null;
  bookmark: {
    url: string;
  } | null;
};

export type CreateItemPayload = {
  title: string;
  type: ItemType;
  content?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  job?: {
    company: string;
    role: string;
    status: JobStatus;
  };
};

export type UpdateJobPayload = {
  title?: string;
  content?: string;
  tags?: string[];
  job?: {
    company?: string;
    role?: string;
    status?: JobStatus;
    source?: string;
    link?: string;
    appliedAt?: string;
  };
};
