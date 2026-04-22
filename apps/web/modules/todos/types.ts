import type { Item } from "@/modules/items/types";

export type TodoItem = Item & {
  type: "todo";
  todo: NonNullable<Item["todo"]>;
};

export type TodoFormValues = {
  title: string;
  content: string;
  tags: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
};
