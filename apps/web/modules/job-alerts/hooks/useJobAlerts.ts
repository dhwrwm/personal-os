"use client";

import { useEffect, useState } from "react";

import {
  checkJobAlert,
  createJobAlert,
  deleteJobAlert,
  fetchJobAlerts,
  markAlertSeen,
} from "../api/job-alerts.api";
import type { AddJobAlertFormValues, JobAlert } from "../types";

export function useJobAlerts() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJobAlerts();
        if (isMounted) setAlerts(data);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void load();
    return () => { isMounted = false; };
  }, []);

  const addAlert = async (values: AddJobAlertFormValues) => {
    const keywords = values.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const alert = await createJobAlert({
      site: values.site.trim(),
      keywords,
      location: values.location.trim() || undefined,
    });

    setAlerts((prev) => [alert, ...prev]);
    return alert;
  };

  const removeAlert = async (id: string) => {
    await deleteJobAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const runCheck = async (id: string) => {
    const result = await checkJobAlert(id);

    const updated = await fetchJobAlerts();
    setAlerts(updated);

    return result;
  };

  const markSeen = async (id: string) => {
    await markAlertSeen(id);
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              results: a.results.map((r) => ({
                ...r,
                seenAt: r.seenAt ?? new Date().toISOString(),
              })),
            }
          : a,
      ),
    );
  };

  return { alerts, loading, error, addAlert, removeAlert, runCheck, markSeen };
}
