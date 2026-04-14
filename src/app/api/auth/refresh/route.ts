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
  const accessTtlSeconds = Number(process.env.ACCESS_TOKEN_TTL ?? 900);
  const refreshTtlSeconds = Number(process.env.REFRESH_TOKEN_TTL ?? 2592000);
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
      expiresAt: Date.now() + 1000 * refreshTtlSeconds,
    });

    await setHttpOnlyCookie("access_token", accessToken, accessTtlSeconds);
    await setHttpOnlyCookie("refresh_token", newRefreshToken, refreshTtlSeconds);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
