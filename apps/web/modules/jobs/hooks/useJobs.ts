"use client";

import { useEffect, useState } from "react";

import {
  createJob,
  deleteJob,
  fetchJobs,
  updateJob,
  updateJobStatus,
} from "../api/jobs.api";
import type { JobFormValues, JobItem } from "../types";

export function useJobs() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchJobs();
        if (isMounted) {
          setJobs(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load jobs");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const addJob = async (values: JobFormValues) => {
    const job = await createJob({
      ...values,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    setJobs((currentJobs) => [job, ...currentJobs]);
    return job;
  };

  const editJob = async (id: string, values: JobFormValues) => {
    const job = await updateJob(id, {
      title: values.title,
      content: values.content || undefined,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      job: {
        company: values.company,
        role: values.role,
        status: values.status,
        source: values.source || undefined,
        link: values.link || undefined,
        appliedAt: values.appliedAt || undefined,
      },
    });

    setJobs((currentJobs) =>
      currentJobs.map((currentJob) => (currentJob.id === id ? job : currentJob)),
    );

    return job;
  };

  const moveJob = async (id: string, status: JobItem["job"]["status"]) => {
    const previousJobs = jobs;

    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === id
          ? {
              ...job,
              job: {
                ...job.job,
                status,
              },
            }
          : job,
      ),
    );

    try {
      await updateJobStatus(id, status);
    } catch (err) {
      setJobs(previousJobs);
      throw err;
    }
  };

  const removeJob = async (id: string) => {
    await deleteJob(id);
    setJobs((currentJobs) => currentJobs.filter((job) => job.id !== id));
  };

  return {
    jobs,
    loading,
    error,
    addJob,
    editJob,
    moveJob,
    removeJob,
  };
}
