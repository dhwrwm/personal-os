import type { CreateItemPayload, Item } from "@/modules/items/types";

import type { TodoFormValues, TodoItem } from "../types";

type UpdateTodoPayload = {
  title?: string;
  content?: string;
  tags?: string[];
  todo?: {
    completed?: boolean;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  };
};

function isTodoItem(item: Item): item is TodoItem {
  return item.type === "todo" && item.todo !== null;
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

export async function fetchTodos(): Promise<TodoItem[]> {
  const res = await fetch("/api/items");
  const items = await readJson<Item[]>(res);
  return items.filter(isTodoItem);
}

export async function createTodo(values: TodoFormValues): Promise<TodoItem> {
  const payload: CreateItemPayload & {
    todo: {
      completed: boolean;
      dueDate?: string;
      priority: "low" | "medium" | "high";
    };
  } = {
    title: values.title,
    type: "todo",
    content: values.content,
    tags: normalizeTags(values.tags),
    todo: {
      completed: false,
      dueDate: values.dueDate || undefined,
      priority: values.priority,
    },
  };

  const res = await fetch("/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return readJson<TodoItem>(res);
}

export async function updateTodo(
  id: string,
  payload: UpdateTodoPayload,
): Promise<TodoItem> {
  const res = await fetch(`/api/items/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return readJson<TodoItem>(res);
}

export async function saveTodo(id: string, values: TodoFormValues) {
  return updateTodo(id, {
    title: values.title,
    content: values.content,
    tags: normalizeTags(values.tags),
    todo: {
      dueDate: values.dueDate || undefined,
      priority: values.priority,
    },
  });
}

export async function setTodoCompleted(id: string, completed: boolean) {
  return updateTodo(id, {
    todo: {
      completed,
    },
  });
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`/api/items/${id}`, {
    method: "DELETE",
  });

  await readJson<void>(res);
}
