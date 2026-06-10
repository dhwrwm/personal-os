"use client";

import { BellRing } from "lucide-react";

import { useJobAlerts } from "../hooks/useJobAlerts";
import AddJobAlertForm from "./AddJobAlertForm";
import JobAlertCard from "./JobAlertCard";

export default function JobAlertsPageClient() {
  const { alerts, loading, error, addAlert, removeAlert, runCheck, markSeen } = useJobAlerts();

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <BellRing className="size-5 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Job Alerts</h1>
          <p className="text-sm text-muted-foreground">
            Monitor job boards for new postings matching your criteria.
          </p>
        </div>
      </div>

      <AddJobAlertForm onAdd={async (values) => { await addAlert(values); }} />

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading alerts...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No alerts yet. Add one above to start monitoring job boards.
          </p>
        ) : (
          alerts.map((alert) => (
            <JobAlertCard
              key={alert.id}
              alert={alert}
              onDelete={() => removeAlert(alert.id)}
              onCheck={() => runCheck(alert.id)}
              onMarkSeen={() => markSeen(alert.id)}
            />

          ))
        )}
      </div>

      <div className="mt-8 rounded-lg border border-border/40 bg-muted/20 p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground/70">Setup required</p>
        <p className="mt-1">
          Add <code className="rounded bg-muted px-1">SERPER_API_KEY</code> to your{" "}
          <code className="rounded bg-muted px-1">.env</code> file to enable &quot;Check now&quot;.
          Get a free key (2,500 queries/month) at{" "}
          <a
            href="https://serper.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            serper.dev
          </a>.
        </p>
      </div>
    </div>
  );
}
