"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { TodoFormValues, TodoItem } from "../types";

const DEFAULT_VALUES: TodoFormValues = {
  title: "",
  content: "",
  tags: "",
  priority: "medium",
  dueDate: "",
};

type TodoFormDialogProps = {
  mode: "create" | "edit";
  todo?: TodoItem;
  triggerLabel: string;
  triggerVariant?: "default" | "outline" | "ghost";
  onSubmit: (values: TodoFormValues) => Promise<unknown>;
};

export default function TodoFormDialog({
  mode,
  todo,
  triggerLabel,
  triggerVariant = "default",
  onSubmit,
}: TodoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TodoFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const priority = useWatch({
    control,
    name: "priority",
  });

  useEffect(() => {
    if (!todo) {
      reset(DEFAULT_VALUES);
      return;
    }

    reset({
      title: todo.title,
      content: todo.content ?? "",
      tags: todo.tags.join(", "),
      priority: todo.todo.priority,
      dueDate: todo.todo.dueDate
        ? new Date(todo.todo.dueDate).toISOString().slice(0, 10)
        : "",
    });
  }, [todo, reset]);

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
        error instanceof Error ? error.message : "Failed to save todo",
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
          <DialogTitle>{mode === "create" ? "Add Todo" : "Edit Todo"}</DialogTitle>
          <DialogDescription>
            Track next actions, follow-ups, and time-bound work.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={submit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Follow up with recruiter"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title ? (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setValue("priority", value as TodoFormValues["priority"], {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input type="date" {...register("dueDate")} />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Details</label>
            <textarea
              {...register("content")}
              placeholder="Add context, checklist details, or meeting notes..."
              className={cn(
                "min-h-32 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tags</label>
            <Input placeholder="work,urgent,follow-up" {...register("tags")} />
          </div>
          {submitError ? (
            <p className="text-sm text-red-500">{submitError}</p>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : mode === "create" ? "Create todo" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
