import {
  ITEM_TYPES,
  type CreateItemInput,
  type JobStatus,
  type TodoPriority,
  type TransactionType,
  type UpdateItemInput,
} from "./item.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function asOptionalString(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }

  return value;
}

function asRequiredString(value: unknown, field: string): string {
  const normalized = asOptionalString(value, field);

  if (!normalized) {
    throw new Error(`${field} is required`);
  }

  return normalized;
}

function asDateString(value: unknown, field: string): string | undefined {
  const normalized = asOptionalString(value, field);

  if (!normalized) {
    return undefined;
  }

  if (Number.isNaN(Date.parse(normalized))) {
    throw new Error(`${field} must be a valid date string`);
  }

  return normalized;
}

export function validateCreateItemInput(input: unknown): CreateItemInput {
  if (!isRecord(input)) {
    throw new Error("Request body must be a JSON object");
  }

  const title = asRequiredString(input.title, "title");
  const type = asRequiredString(input.type, "type");

  if (!ITEM_TYPES.includes(type as CreateItemInput["type"])) {
    throw new Error("type is invalid");
  }

  const metadata = input.metadata;
  if (metadata !== undefined && !isRecord(metadata)) {
    throw new Error("metadata must be an object");
  }

  const tags = input.tags;
  if (tags !== undefined && !isStringArray(tags)) {
    throw new Error("tags must be an array of strings");
  }

  const item: CreateItemInput = {
    title,
    type: type as CreateItemInput["type"],
    content: asOptionalString(input.content, "content"),
    metadata: metadata as Record<string, unknown> | undefined,
    tags,
  };

  if (isRecord(input.job)) {
    item.job = {
      company: asRequiredString(input.job.company, "job.company"),
      role: asRequiredString(input.job.role, "job.role"),
      status: asRequiredString(input.job.status, "job.status") as JobStatus,
      source: asOptionalString(input.job.source, "job.source"),
      link: asOptionalString(input.job.link, "job.link"),
      appliedAt: asDateString(input.job.appliedAt, "job.appliedAt"),
    };
  }

  if (isRecord(input.transaction)) {
    const amount = input.transaction.amount;
    if (typeof amount !== "number" || Number.isNaN(amount)) {
      throw new Error("transaction.amount must be a number");
    }

    item.transaction = {
      amount,
      category: asRequiredString(input.transaction.category, "transaction.category"),
      date: asDateString(input.transaction.date, "transaction.date") ?? "",
      type: asRequiredString(
        input.transaction.type,
        "transaction.type",
      ) as TransactionType,
    };
  }

  if (isRecord(input.note)) {
    item.note = {
      content: asRequiredString(input.note.content, "note.content"),
    };
  }

  if (isRecord(input.todo)) {
    const completed = input.todo.completed;
    if (completed !== undefined && typeof completed !== "boolean") {
      throw new Error("todo.completed must be a boolean");
    }

    item.todo = {
      completed,
      dueDate: asDateString(input.todo.dueDate, "todo.dueDate"),
      priority: asOptionalString(
        input.todo.priority,
        "todo.priority",
      ) as TodoPriority | undefined,
    };
  }

  if (isRecord(input.bookmark)) {
    item.bookmark = {
      url: asRequiredString(input.bookmark.url, "bookmark.url"),
    };
  }

  return item;
}

export function validateUpdateItemInput(input: unknown): UpdateItemInput {
  if (!isRecord(input)) {
    throw new Error("Request body must be a JSON object");
  }

  const update: UpdateItemInput = {};

  if ("title" in input) {
    update.title = asRequiredString(input.title, "title");
  }

  if ("content" in input) {
    update.content = asOptionalString(input.content, "content");
  }

  if ("metadata" in input) {
    if (input.metadata !== undefined && !isRecord(input.metadata)) {
      throw new Error("metadata must be an object");
    }

    update.metadata = input.metadata as Record<string, unknown> | undefined;
  }

  if ("tags" in input) {
    if (input.tags !== undefined && !isStringArray(input.tags)) {
      throw new Error("tags must be an array of strings");
    }

    update.tags = input.tags;
  }

  if ("job" in input) {
    if (!isRecord(input.job)) {
      throw new Error("job must be an object");
    }

    update.job = {};

    if ("company" in input.job) {
      update.job.company = asRequiredString(input.job.company, "job.company");
    }

    if ("role" in input.job) {
      update.job.role = asRequiredString(input.job.role, "job.role");
    }

    if ("status" in input.job) {
      update.job.status = asRequiredString(
        input.job.status,
        "job.status",
      ) as JobStatus;
    }

    if ("source" in input.job) {
      update.job.source = asOptionalString(input.job.source, "job.source");
    }

    if ("link" in input.job) {
      update.job.link = asOptionalString(input.job.link, "job.link");
    }

    if ("appliedAt" in input.job) {
      update.job.appliedAt = asDateString(input.job.appliedAt, "job.appliedAt");
    }
  }

  return update;
}
