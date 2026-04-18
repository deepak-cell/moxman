import IncentiveTiersPage from "@/features/admin/slabs/IncentiveTiersPage";
import { getSessionUser } from "@/lib/session";

export default async function Page() {
  const user = await getSessionUser();
  return <IncentiveTiersPage actorRole={user?.role ?? null} />;
}
