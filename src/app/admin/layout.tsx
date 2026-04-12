import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import AdminShell from "@/features/admin/layout/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <AdminShell userName={user.name} userRole={user.role}>
      {children}
    </AdminShell>
  );
}
