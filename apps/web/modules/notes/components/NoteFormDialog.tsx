"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { NoteFormValues, NoteItem } from "../types";

const DEFAULT_VALUES: NoteFormValues = {
  title: "",
  content: "",
  tags: "",
};

type NoteFormDialogProps = {
  mode: "create" | "edit";
  note?: NoteItem;
  triggerLabel: string;
  triggerVariant?: "default" | "outline" | "ghost";
  onSubmit: (values: NoteFormValues) => Promise<unknown>;
};

export default function NoteFormDialog({
  mode,
  note,
  triggerLabel,
  triggerVariant = "default",
  onSubmit,
}: NoteFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!note) {
      reset(DEFAULT_VALUES);
      return;
    }

    reset({
      title: note.title,
      content: note.content ?? note.note?.content ?? "",
      tags: note.tags.join(", "),
    });
  }, [note, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSubmitError(null);
      if (mode === "create") {
        reset(DEFAULT_VALUES);
      }
    }
  };

  const submit = handleSubmit(async (values) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(values);
      setOpen(false);
      if (mode === "create") {
        reset(DEFAULT_VALUES);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save note",
      );
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Note" : "Edit Note"}</DialogTitle>
          <DialogDescription>
            Capture ideas, reference notes, and anything worth keeping.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={submit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Sprint retro notes"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title ? (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Content</label>
            <textarea
              {...register("content", { required: "Content is required" })}
              placeholder="Write your note here..."
              className={cn(
                "min-h-40 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
            />
            {errors.content ? (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tags</label>
            <Input placeholder="work,ideas,meeting" {...register("tags")} />
          </div>
          {submitError ? (
            <p className="text-sm text-red-500">{submitError}</p>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : mode === "create" ? "Create note" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
