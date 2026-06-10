"use client";

import { ExternalLink, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JobAlert } from "../types";

type Props = {
  alert: JobAlert;
  onDelete: () => Promise<void>;
  onCheck: () => Promise<{ newCount: number }>;
  onMarkSeen: () => Promise<void>;
};

export default function JobAlertCard({ alert, onDelete, onCheck, onMarkSeen }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkMsg, setCheckMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const unseenCount = alert.results.filter((r) => !r.seenAt).length;

  const handleCheck = async () => {
    setChecking(true);
    setCheckMsg(null);
    try {
      const { newCount } = await onCheck();
      setCheckMsg(newCount > 0 ? `${newCount} new result${newCount === 1 ? "" : "s"} found` : "No new results");
    } catch (err) {
      setCheckMsg(err instanceof Error ? err.message : "Check failed");
    } finally {
      setChecking(false);
    }
  };

  const handleExpand = async () => {
    const wasExpanded = expanded;
    setExpanded((v) => !v);
    if (!wasExpanded && unseenCount > 0) {
      await onMarkSeen().catch(() => undefined);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
    } catch {
      setDeleting(false);
    }
  };

  const queryLabel = [
    `site:${alert.site}`,
    ...alert.keywords.map((k) => `"${k}"`),
    ...(alert.location ? [`"${alert.location}"`] : []),
  ].join(" ");

  const lastChecked = alert.lastCheckedAt
    ? new Date(alert.lastCheckedAt).toLocaleString()
    : "Never";

  return (
    <div className="rounded-lg border border-border/60 bg-card">
      <div className="flex items-start justify-between gap-3 p-4">
        <button
          className="min-w-0 flex-1 text-left"
          onClick={handleExpand}
          type="button"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{alert.site}</span>
            {alert.keywords.map((k) => (
              <span key={k} className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                {k}
              </span>
            ))}
            {alert.location ? (
              <span className="rounded-md border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
                {alert.location}
              </span>
            ) : null}
            {unseenCount > 0 ? (
              <span className="rounded-md bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {unseenCount} new
              </span>
            ) : null}
          </div>
          <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
            {queryLabel}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Last checked: {lastChecked}
          </p>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleCheck}
            disabled={checking}
            title="Check now"
          >
            <RefreshCw className={cn("size-3.5", checking && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete alert"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {checkMsg ? (
        <p className="border-t border-border/40 px-4 py-2 text-xs text-muted-foreground">
          {checkMsg}
        </p>
      ) : null}

      {expanded && alert.results.length > 0 ? (
        <ul className="divide-y divide-border/40 border-t border-border/40">
          {alert.results.map((result) => (
            <li key={result.id} className="px-4 py-3">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-sm font-medium group-hover:underline">
                    {result.title}
                    <ExternalLink className="inline size-3 shrink-0 text-muted-foreground" />
                    {!result.seenAt ? (
                      <span className="ml-1 inline-block size-1.5 rounded-full bg-blue-500" />
                    ) : null}
                  </p>
                  {result.snippet ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {result.snippet}
                    </p>
                  ) : null}
                  <p className="mt-0.5 truncate text-xs text-muted-foreground/60">
                    {result.url}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : expanded && alert.results.length === 0 ? (
        <p className="border-t border-border/40 px-4 py-3 text-sm text-muted-foreground">
          No results yet. Click the refresh button to check now.
        </p>
      ) : null}
    </div>
  );
}
