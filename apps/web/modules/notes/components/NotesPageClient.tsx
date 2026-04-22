"use client";

import NotesGrid from "./NotesGrid";
import { useNotes } from "../hooks/useNotes";

export default function NotesPageClient() {
  const { notes, loading, error, addNote, editNote, removeNote } = useNotes();

  return (
    <main className="p-6">
      <NotesGrid
        notes={notes}
        loading={loading}
        error={error}
        onCreate={addNote}
        onEdit={editNote}
        onDelete={removeNote}
      />
    </main>
  );
}
