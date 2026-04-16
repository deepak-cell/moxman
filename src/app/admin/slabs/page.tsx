import SlabsPage from "@/features/admin/slabs/SlabsPage";
import { getSessionUser } from "@/lib/session";

export default async function Page() {
  const user = await getSessionUser();
  return <SlabsPage actorRole={user?.role ?? null} />;
}
