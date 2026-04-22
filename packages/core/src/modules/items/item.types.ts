export const ITEM_TYPES = [
  "job",
  "transaction",
  "note",
  "todo",
  "bookmark",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export type JobStatus = "applied" | "interview" | "offer" | "rejected";
export type TransactionType = "income" | "expense";
export type TodoPriority = "low" | "medium" | "high";

export type CreateJobInput = {
  company: string;
  role: string;
  status: JobStatus;
  source?: string;
  link?: string;
  appliedAt?: string;
};

export type CreateTransactionInput = {
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
};

export type CreateNoteInput = {
  content: string;
};

export type CreateTodoInput = {
  completed?: boolean;
  dueDate?: string;
  priority?: TodoPriority;
};

export type CreateBookmarkInput = {
  url: string;
};

export type CreateItemInput = {
  title: string;
  type: ItemType;
  content?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  job?: CreateJobInput;
  transaction?: CreateTransactionInput;
  note?: CreateNoteInput;
  todo?: CreateTodoInput;
  bookmark?: CreateBookmarkInput;
};

export type UpdateItemInput = {
  title?: string;
  content?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  job?: {
    company?: string;
    role?: string;
    status?: JobStatus;
    source?: string;
    link?: string;
    appliedAt?: string;
  };
};

export type ItemListRecord = {
  id: string;
  title: string;
  content: string | null;
  tags: string[];
  type: ItemType;
  createdAt: Date;
  updatedAt: Date;
  job: {
    company: string;
    role: string;
    status: JobStatus;
    source: string | null;
    link: string | null;
    appliedAt: Date | null;
  } | null;
  transaction: {
    amount: number;
    category: string;
    date: Date;
    type: TransactionType;
  } | null;
  note: {
    content: string;
  } | null;
  todo: {
    completed: boolean;
    dueDate: Date | null;
    priority: TodoPriority;
  } | null;
  bookmark: {
    url: string;
  } | null;
};
