import type { CreateItemPayload, Item } from "../types";

async function readJson<T>(res: Response): Promise<T> {
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

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch("/api/items");
  return readJson<Item[]>(res);
}

export async function createItem(data: CreateItemPayload): Promise<Item> {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return readJson<Item>(res);
}
