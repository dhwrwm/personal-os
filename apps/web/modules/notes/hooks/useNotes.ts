"use client";

import { useEffect, useState } from "react";

import { createNote, deleteNote, fetchNotes, saveNote } from "../api/notes.api";
import type { NoteFormValues, NoteItem } from "../types";

export function useNotes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadNotes() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchNotes();
        if (isMounted) {
          setNotes(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load notes");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  const addNote = async (values: NoteFormValues) => {
    const note = await createNote(values);
    setNotes((currentNotes) => [note, ...currentNotes]);
    return note;
  };

  const editNote = async (id: string, values: NoteFormValues) => {
    const note = await saveNote(id, values);
    setNotes((currentNotes) =>
      currentNotes.map((currentNote) =>
        currentNote.id === id ? note : currentNote,
      ),
    );
    return note;
  };

  const removeNote = async (id: string) => {
    await deleteNote(id);
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  };

  return {
    notes,
    loading,
    error,
    addNote,
    editNote,
    removeNote,
  };
}
