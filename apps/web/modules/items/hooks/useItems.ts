import { useEffect, useState } from "react";

import { createItem as createItemRequest, fetchItems } from "../api/items.api";
import type { CreateItemPayload, Item } from "../types";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (input: CreateItemPayload) => {
    const item = await createItemRequest(input);
    setItems((currentItems) => [item, ...currentItems]);
    return item;
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchItems();
        if (isMounted) setItems(data);
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load items",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { items, loading, error, reload: loadItems, createItem };
}
