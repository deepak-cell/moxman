import { NextResponse } from "next/server";
import { hashToken } from "@/lib/auth";
import { clearCookie } from "@/lib/http";
import { cookies } from "next/headers";
import { revokeRefreshToken } from "@/lib/token-store";

export async function POST() {
  const token = cookies().get("refresh_token")?.value;
  if (token) {
    revokeRefreshToken(hashToken(token));
  }

  await clearCookie("access_token");
  await clearCookie("refresh_token");

  return NextResponse.json({ ok: true });
}
