import { requireSession } from "@/lib/auth-session";
import JobAlertsPageClient from "@/modules/job-alerts/components/JobAlertsPageClient";

export default async function JobAlertsPage() {
  await requireSession();
  return <JobAlertsPageClient />;
}
