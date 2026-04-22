"use client";

import { useJobs } from "../hooks/useJobs";
import JobsBoard from "./JobsBoard";

export default function JobsPageClient() {
  const { jobs, loading, error, addJob, editJob, moveJob, removeJob } = useJobs();

  return (
    <main className="p-6">
      <JobsBoard
        jobs={jobs}
        loading={loading}
        error={error}
        onCreate={addJob}
        onEdit={editJob}
        onMove={moveJob}
        onDelete={removeJob}
      />
    </main>
  );
}
