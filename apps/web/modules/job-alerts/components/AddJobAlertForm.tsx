"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AddJobAlertFormValues } from "../types";

type Props = {
  onAdd: (values: AddJobAlertFormValues) => Promise<void>;
};

const EMPTY: AddJobAlertFormValues = { site: "", keywords: "", location: "" };

export default function AddJobAlertForm({ onAdd }: Props) {
  const [values, setValues] = useState<AddJobAlertFormValues>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof AddJobAlertFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onAdd(values);
      setValues(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add alert");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4">
      <h3 className="text-sm font-medium">Add job alert</h3>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground" htmlFor="ja-site">
            Site
          </label>
          <Input
            id="ja-site"
            placeholder="boards.greenhouse.io"
            value={values.site}
            onChange={set("site")}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground" htmlFor="ja-keywords">
            Keywords <span className="text-muted-foreground/60">(comma-separated)</span>
          </label>
          <Input
            id="ja-keywords"
            placeholder="Next.js, React"
            value={values.keywords}
            onChange={set("keywords")}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground" htmlFor="ja-location">
            Location <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <Input
            id="ja-location"
            placeholder="remote"
            value={values.location}
            onChange={set("location")}
          />
        </div>
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <Button type="submit" size="sm" disabled={submitting}>
        {submitting ? "Adding..." : "Add alert"}
      </Button>
    </form>
  );
}
