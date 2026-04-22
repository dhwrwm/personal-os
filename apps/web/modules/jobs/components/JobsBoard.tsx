"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { JOB_STATUS_LABELS, type JobFormValues, type JobItem } from "../types";
import JobFormDialog from "./JobFormDialog";

const JOB_COLUMNS = [
  { key: "applied", label: "Applied" },
  { key: "interview", label: "Interviewing" },
  { key: "rejected", label: "Rejected / Archived" },
  { key: "offer", label: "Shortlisted" },
] as const;

type JobsBoardProps = {
  jobs: JobItem[];
  loading: boolean;
  error: string | null;
  onCreate: (values: JobFormValues) => Promise<unknown>;
  onEdit: (id: string, values: JobFormValues) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
  onMove: (id: string, status: JobItem["job"]["status"]) => Promise<void>;
};

export default function JobsBoard({
  jobs,
  loading,
  error,
  onCreate,
  onEdit,
  onDelete,
  onMove,
}: JobsBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const jobsByColumn = useMemo(() => {
    return JOB_COLUMNS.reduce<Record<string, JobItem[]>>((acc, column) => {
      acc[column.key] = jobs.filter((job) => job.job.status === column.key);
      return acc;
    }, {});
  }, [jobs]);

  const handleDrop = async (
    jobId: string,
    status: JobItem["job"]["status"],
  ) => {
    setActionError(null);

    try {
      await onMove(jobId, status);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Failed to move job",
      );
    } finally {
      setDraggingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionError(null);

    try {
      await onDelete(id);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Failed to delete job",
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Loading jobs...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-sm text-muted-foreground">
            Drag cards between columns to change status, Jira-style.
          </p>
        </div>
        <JobFormDialog
          mode="create"
          triggerLabel="Add job"
          onSubmit={onCreate}
        />
      </div>
      {actionError ? (
        <div className="text-sm text-red-500">{actionError}</div>
      ) : null}
      <div className="-mx-6 overflow-x-auto px-6 pb-2">
        <div className="flex min-w-max gap-4 xl:grid xl:min-w-0 xl:grid-cols-4">
        {JOB_COLUMNS.map((column) => (
          <section
            key={column.key}
            className="flex w-[280px] shrink-0 flex-col rounded-2xl border border-border/70 bg-muted/30 p-3 sm:w-[320px] xl:w-auto xl:min-w-0"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();

              const jobId = event.dataTransfer.getData("text/plain");
              if (!jobId) {
                return;
              }

              void handleDrop(jobId, column.key);
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {column.label}
              </h2>
              <span className="rounded-full bg-background px-2 py-1 text-xs text-muted-foreground">
                {jobsByColumn[column.key]?.length ?? 0}
              </span>
            </div>
            <div className="flex max-h-[calc(100dvh-16rem)] min-h-[18rem] flex-1 flex-col gap-3 overflow-y-auto pr-1">
              {jobsByColumn[column.key]?.map((job) => (
                <Card
                  key={job.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", job.id);
                    setDraggingId(job.id);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  className={
                    draggingId === job.id
                      ? "cursor-grabbing border-primary/40 opacity-70"
                      : "cursor-grab border-border/70"
                  }
                >
                  <CardHeader className="pb-0">
                    <CardTitle className="text-sm">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {job.job.company}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      {job.job.role}
                    </div>
                    {job.content ? (
                      <p className="text-sm text-muted-foreground">
                        {job.content}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary px-2 py-1 text-[11px] text-secondary-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="grid gap-2 text-xs text-muted-foreground">
                      {job.job.source ? (
                        <span>Source: {job.job.source}</span>
                      ) : null}
                      {job.job.appliedAt ? (
                        <span>
                          Applied:{" "}
                          {new Date(job.job.appliedAt).toLocaleDateString()}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-2 py-1 text-[11px] uppercase tracking-wide text-secondary-foreground">
                        {JOB_STATUS_LABELS[job.job.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <JobFormDialog
                        mode="edit"
                        job={job}
                        triggerLabel="Edit"
                        triggerVariant="outline"
                        onSubmit={(values) => onEdit(job.id, values)}
                      />
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => void handleDelete(job.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {jobsByColumn[column.key]?.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Drop a job here.
                </div>
              ) : null}
            </div>
          </section>
        ))}
        </div>
      </div>
    </div>
  );
}
