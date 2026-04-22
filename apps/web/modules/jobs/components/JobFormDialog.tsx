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

import { JOB_STATUS_LABELS, type JobFormValues, type JobItem } from "../types";
import { importJobDetails } from "../api/jobs.api";

const DEFAULT_VALUES: JobFormValues = {
  title: "",
  company: "",
  role: "",
  status: "applied",
  content: "",
  tags: "",
  source: "",
  link: "",
  appliedAt: "",
};

type JobFormDialogProps = {
  mode: "create" | "edit";
  job?: JobItem;
  triggerLabel: string;
  triggerVariant?: "default" | "outline" | "ghost";
  onSubmit: (values: JobFormValues) => Promise<unknown>;
};

export default function JobFormDialog({
  mode,
  job,
  triggerLabel,
  triggerVariant = "default",
  onSubmit,
}: JobFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    getValues,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JobFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const status = useWatch({
    control,
    name: "status",
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setImportText("");
      setImportMessage(null);
      setSubmitError(null);
    }
  };

  useEffect(() => {
    if (!job) {
      reset(DEFAULT_VALUES);
      return;
    }

    reset({
      title: job.title,
      company: job.job.company,
      role: job.job.role,
      status: job.job.status,
      content: job.content ?? "",
      tags: job.tags.join(", "),
      source: job.job.source ?? "",
      link: job.job.link ?? "",
      appliedAt: job.job.appliedAt
        ? new Date(job.job.appliedAt).toISOString().slice(0, 10)
        : "",
    });
  }, [job, reset]);

  const handleImport = async () => {
    setImportMessage(null);
    setSubmitError(null);

    try {
      const mappedFields = await importJobDetails(importText);
      const entries = Object.entries(mappedFields).filter(
        ([, value]) => typeof value === "string" && value.trim().length > 0,
      );

      if (entries.length === 0) {
        setImportMessage("AI did not find any confident field mappings.");
        return;
      }

      entries.forEach(([key, value]) => {
        const currentValue = getValues(key as keyof JobFormValues);
        if (!currentValue || String(currentValue).trim().length === 0) {
          setValue(key as keyof JobFormValues, value as never, {
            shouldValidate: true,
            shouldDirty: true,
          });
          return;
        }

        setValue(key as keyof JobFormValues, value as never, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });

      setImportMessage(
        `AI mapped ${entries.length} field${entries.length === 1 ? "" : "s"} from the pasted input.`,
      );
    } catch (error) {
      setImportMessage(
        error instanceof Error ? error.message : "AI import failed",
      );
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
        error instanceof Error ? error.message : "Failed to save job",
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Job" : "Edit Job"}
          </DialogTitle>
          <DialogDescription>
            Manage job applications from one board and keep the details attached
            to each card.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={submit}>
          {/* <div className="grid gap-2 rounded-xl border border-border/70 bg-muted/30 p-3">
            <label className="text-sm font-medium">
              Paste job link or description
            </label>
            <textarea
              value={importText}
              onChange={(event) => {
                setImportText(event.target.value);
                setImportMessage(null);
              }}
              placeholder="Paste a LinkedIn/Greenhouse URL or the raw job description here, then map fields."
              className={cn(
                "min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                AI fetches the job page when you paste a link, then maps title,
                company, role, notes, source, link, and status into the form.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleImport()}
                disabled={importText.trim().length === 0}
              >
                Use AI
              </Button>
            </div>
            {importMessage ? (
              <p className="text-xs text-muted-foreground">{importMessage}</p>
            ) : null}
          </div> */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Senior Frontend Engineer"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title ? (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Company</label>
              <Input
                placeholder="Acme"
                {...register("company", {
                  required: "Company is required",
                })}
              />
              {errors.company ? (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Role</label>
              <Input
                placeholder="Frontend Engineer"
                {...register("role", {
                  required: "Role is required",
                })}
              />
              {errors.role ? (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue("status", value as JobFormValues["status"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">
                    {JOB_STATUS_LABELS.applied}
                  </SelectItem>
                  <SelectItem value="interview">
                    {JOB_STATUS_LABELS.interview}
                  </SelectItem>
                  <SelectItem value="offer">
                    {JOB_STATUS_LABELS.offer}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {JOB_STATUS_LABELS.rejected}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Applied On</label>
              <Input type="date" {...register("appliedAt")} />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Notes</label>
            <Input
              placeholder="Referral, compensation, notes"
              {...register("content")}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tags</label>
            <Input
              placeholder="remote,frontend,priority"
              {...register("tags")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Source</label>
              <Input placeholder="LinkedIn, referral" {...register("source")} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Link</label>
              <Input placeholder="https://..." {...register("link")} />
            </div>
          </div>
          {submitError ? (
            <p className="text-sm text-red-500">{submitError}</p>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : mode === "create"
                  ? "Create job"
                  : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
