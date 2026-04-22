"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { NoteFormValues, NoteItem } from "../types";
import NoteFormDialog from "./NoteFormDialog";

type NotesGridProps = {
  notes: NoteItem[];
  loading: boolean;
  error: string | null;
  onCreate: (values: NoteFormValues) => Promise<unknown>;
  onEdit: (id: string, values: NoteFormValues) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
};

export default function NotesGrid({
  notes,
  loading,
  error,
  onCreate,
  onEdit,
  onDelete,
}: NotesGridProps) {
  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading notes...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notes</h1>
          <p className="text-sm text-muted-foreground">
            Keep quick notes, reference material, and longer-form thoughts in one place.
          </p>
        </div>
        <NoteFormDialog
          mode="create"
          triggerLabel="Add note"
          onSubmit={onCreate}
        />
      </div>
      {notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
          No notes yet. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="border-border/70">
              <CardHeader className="pb-0">
                <CardTitle className="text-base">{note.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-8 whitespace-pre-wrap text-sm text-muted-foreground">
                  {note.content ?? note.note?.content ?? ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {note.tags.length > 0 ? (
                    note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-2 py-1 text-[11px] text-secondary-foreground"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No tags</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <NoteFormDialog
                    mode="edit"
                    note={note}
                    triggerLabel="Edit"
                    triggerVariant="outline"
                    onSubmit={(values) => onEdit(note.id, values)}
                  />
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => void onDelete(note.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
