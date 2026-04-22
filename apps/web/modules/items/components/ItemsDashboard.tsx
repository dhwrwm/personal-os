"use client";

import SearchBar from "@/modules/search/SearchBar";

import { useItems } from "../hooks/useItems";
import type { CreateItemPayload } from "../types";
import CreateItem from "./CreateItem";
import ItemList from "./ItemList";
import JobsSidebar from "./JobsSidebar";

export default function ItemsDashboard() {
  const { items, loading, error, createItem } = useItems();

  const handleCreateItem = async (input: CreateItemPayload) => {
    await createItem(input);
  };

  return (
    <main className="p-6">
      <div className="flex flex-col gap-4 pb-6">
        <SearchBar />
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Items</h1>
            <p className="text-sm text-muted-foreground">
              Manage notes, tasks, transactions, bookmarks, and jobs.
            </p>
          </div>
          <CreateItem onCreated={handleCreateItem} />
        </div>
      </div>
      <div className="flex flex-col gap-6 xl:flex-row">
        <section className="min-w-0 flex-1">
          <ItemList items={items} loading={loading} error={error} />
        </section>
        <JobsSidebar items={items} />
      </div>
    </main>
  );
}
