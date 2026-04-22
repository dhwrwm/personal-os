import type { Item } from "@/modules/items/types";

export type NoteItem = Item & {
  type: "note";
};

export type NoteFormValues = {
  title: string;
  content: string;
  tags: string;
};
