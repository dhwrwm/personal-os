"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Item } from "../types";

type JobsSidebarProps = {
  items: Item[];
};

export default function JobsSidebar({ items }: JobsSidebarProps) {
  const jobs = items.filter((item) => item.type === "job" && item.job);

  return (
    <aside className="w-full xl:w-80">
      <Card className="sticky top-24 border border-border/70">
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <p className="text-sm text-muted-foreground">
            All job items in one place.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobs.length > 0 ? (
            jobs.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-border/70 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.job?.company}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-1 text-[11px] uppercase tracking-wide text-secondary-foreground">
                    {item.job?.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.job?.role}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No job items yet. Create one from the form.
            </p>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
