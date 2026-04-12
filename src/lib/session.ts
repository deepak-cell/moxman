import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  try {
    const payload = await verifyAccessToken(token);
    return {
      id: payload.sub,
      name: payload.name,
      role: payload.role,
      email: payload.email,
      branchId: payload.branchId ?? null,
    };
  } catch {
    return null;
  }
}
