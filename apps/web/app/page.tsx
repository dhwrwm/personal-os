import ItemsDashboard from "@/modules/items/components/ItemsDashboard";
import { requireSession } from "@/lib/auth-session";

export default async function Home() {
  await requireSession();

  return <ItemsDashboard />;
}
