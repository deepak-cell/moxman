import IncentivePlanSettings from "@/features/admin/slabs/IncentivePlanSettings";
import { getSessionUser } from "@/lib/session";

export default async function Page() {
  const user = await getSessionUser();
  return <IncentivePlanSettings actorRole={user?.role ?? null} />;
}
