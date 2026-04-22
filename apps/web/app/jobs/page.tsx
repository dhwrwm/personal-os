import JobsPageClient from "@/modules/jobs/components/JobsPageClient";
import { requireSession } from "@/lib/auth-session";

export default async function JobsPage() {
  await requireSession();

  return <JobsPageClient />;
}
