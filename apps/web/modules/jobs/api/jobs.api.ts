import type {
  CreateItemPayload,
  Item,
  JobStatus,
  UpdateJobPayload,
} from "@/modules/items/types";
import type { JobFormValues } from "../types";

function isJobItem(item: Item): item is Item & { job: NonNullable<Item["job"]> } {
  return item.type === "job" && item.job !== null;
}

async function readJson<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as T;
  }

  const payload = (await res.json()) as T | { error?: string };

  if (!res.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "Request failed";

    throw new Error(message);
  }

  return payload as T;
}

export async function fetchJobs(): Promise<Array<Item & { job: NonNullable<Item["job"]> }>> {
  const res = await fetch("/api/items");
  const items = await readJson<Item[]>(res);
  return items.filter(isJobItem);
}

export async function createJob(input: {
  title: string;
  content?: string;
  tags?: string[];
  company: string;
  role: string;
  status: JobStatus;
  source?: string;
  link?: string;
  appliedAt?: string;
}): Promise<Item & { job: NonNullable<Item["job"]> }> {
  const payload: CreateItemPayload = {
    title: input.title,
    type: "job",
    content: input.content,
    tags: input.tags,
    job: {
      company: input.company,
      role: input.role,
      status: input.status,
    },
  };

  const res = await fetch("/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      job: {
        ...payload.job,
        source: input.source,
        link: input.link,
        appliedAt: input.appliedAt,
      },
    }),
  });

  return readJson<Item & { job: NonNullable<Item["job"]> }>(res);
}

export async function updateJob(
  id: string,
  input: UpdateJobPayload,
): Promise<Item & { job: NonNullable<Item["job"]> }> {
  const res = await fetch(`/api/items/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readJson<Item & { job: NonNullable<Item["job"]> }>(res);
}

export async function updateJobStatus(id: string, status: JobStatus) {
  return updateJob(id, {
    job: {
      status,
    },
  });
}

export async function deleteJob(id: string): Promise<void> {
  const res = await fetch(`/api/items/${id}`, {
    method: "DELETE",
  });

  await readJson<void>(res);
}

export async function importJobDetails(sourceText: string): Promise<Partial<JobFormValues>> {
  const res = await fetch("/api/jobs/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sourceText }),
  });

  const payload = await readJson<{
    title: string;
    company: string;
    role: string;
    status: JobStatus;
    content: string;
    tags: string[];
    source: string;
    link: string;
    appliedAt: string;
  }>(res);

  return {
    title: payload.title,
    company: payload.company,
    role: payload.role,
    status: payload.status,
    content: payload.content,
    tags: payload.tags.join(", "),
    source: payload.source,
    link: payload.link,
    appliedAt: payload.appliedAt,
  };
}
