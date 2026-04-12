import { NextResponse } from "next/server";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { setHttpOnlyCookie } from "@/lib/http";
import { cookies } from "next/headers";
import { getRefreshToken, revokeRefreshToken, saveRefreshToken } from "@/lib/token-store";

export async function POST() {
  const token = cookies().get("refresh_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });
  }

  const tokenHash = hashToken(token);
  const existing = getRefreshToken(tokenHash);

  if (!existing) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  try {
    const payload = await verifyRefreshToken(token);

    const accessToken = await signAccessToken({
      sub: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
      branchId: payload.branchId,
    });

    const newRefreshToken = await signRefreshToken({
      sub: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
      branchId: payload.branchId,
    });

    revokeRefreshToken(tokenHash);
    saveRefreshToken(hashToken(newRefreshToken), {
      userId: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
      branchId: payload.branchId,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
    });

    setHttpOnlyCookie("access_token", accessToken, 60 * 15);
    setHttpOnlyCookie("refresh_token", newRefreshToken, 60 * 60 * 24 * 30);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
