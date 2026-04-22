"use client";

import type { Item } from "../types";
import ItemCard from "./ItemCard";

type ItemListProps = {
  items: Item[];
  loading: boolean;
  error: string | null;
};

export default function ItemList({ items, loading, error }: ItemListProps) {
  if (loading) return <div className="py-10 text-sm text-muted-foreground">Loading items...</div>;
  if (error) return <div className="py-10 text-sm text-red-500">{error}</div>;
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
        No items yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          title={item.title}
          description={item.content}
          tags={item.tags}
          type={item.type}
        />
      ))}
    </div>
  );
}
