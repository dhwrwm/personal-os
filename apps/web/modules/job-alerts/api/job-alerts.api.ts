import type { JobAlert } from "../types";

async function readJson<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;

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

export async function fetchJobAlerts(): Promise<JobAlert[]> {
  const res = await fetch("/api/job-alerts");
  return readJson<JobAlert[]>(res);
}

export async function createJobAlert(input: {
  site: string;
  keywords: string[];
  location?: string;
}): Promise<JobAlert> {
  const res = await fetch("/api/job-alerts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return readJson<JobAlert>(res);
}

export async function deleteJobAlert(id: string): Promise<void> {
  const res = await fetch(`/api/job-alerts/${id}`, { method: "DELETE" });
  return readJson<void>(res);
}

export async function checkJobAlert(id: string): Promise<{ newCount: number }> {
  const res = await fetch(`/api/job-alerts/${id}/check`, { method: "POST" });
  return readJson<{ newCount: number }>(res);
}

export async function markAlertSeen(id: string): Promise<void> {
  const res = await fetch(`/api/job-alerts/${id}/seen`, { method: "PATCH" });
  return readJson<void>(res);
}
