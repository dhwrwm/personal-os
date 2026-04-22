import type { CreateItemPayload, Item } from "@/modules/items/types";

import type { NoteFormValues, NoteItem } from "../types";

type UpdateNotePayload = {
  title?: string;
  content?: string;
  tags?: string[];
};

function isNoteItem(item: Item): item is NoteItem {
  return item.type === "note";
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

function normalizeTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function fetchNotes(): Promise<NoteItem[]> {
  const res = await fetch("/api/items");
  const items = await readJson<Item[]>(res);
  return items.filter(isNoteItem);
}

export async function createNote(values: NoteFormValues): Promise<NoteItem> {
  const payload: CreateItemPayload = {
    title: values.title,
    type: "note",
    content: values.content,
    tags: normalizeTags(values.tags),
  };

  const res = await fetch("/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return readJson<NoteItem>(res);
}

export async function updateNote(
  id: string,
  payload: UpdateNotePayload,
): Promise<NoteItem> {
  const res = await fetch(`/api/items/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return readJson<NoteItem>(res);
}

export async function saveNote(id: string, values: NoteFormValues) {
  return updateNote(id, {
    title: values.title,
    content: values.content,
    tags: normalizeTags(values.tags),
  });
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`/api/items/${id}`, {
    method: "DELETE",
  });

  await readJson<void>(res);
}
