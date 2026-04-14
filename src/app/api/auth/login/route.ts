import { NextResponse } from "next/server";
import { z } from "zod";
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { setHttpOnlyCookie } from "@/lib/http";
import { cookies } from "next/headers";
import { saveRefreshToken } from "@/lib/token-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  csrfToken: z.string().min(10),
});

export async function POST(request: Request) {
  const accessTtlSeconds = Number(process.env.ACCESS_TOKEN_TTL ?? 900);
  const refreshTtlSeconds = Number(process.env.REFRESH_TOKEN_TTL ?? 2592000);
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limiter = rateLimit(`login:${ip}`, 10, 60_000);
  if (!limiter.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get("csrf_token")?.value;
  if (!csrfCookie || csrfCookie !== parsed.data.csrfToken) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const mockUsers = [
    {
      id: "admin-001",
      role: "ADMIN",
      email: process.env.ADMIN_EMAIL ?? "admin@moxman.local",
      password: process.env.ADMIN_PASSWORD ?? "Admin@1234",
      name: "System Admin",
      branchId: null,
    },
    {
      id: "partner-001",
      role: "PARTNER",
      email: process.env.PARTNER_EMAIL ?? "partner@moxman.local",
      password: process.env.PARTNER_PASSWORD ?? "Partner@1234",
      name: "Partner User",
      branchId: null,
    },
    {
      id: "rm-001",
      role: "RELATIONSHIP_MANAGER",
      email: process.env.RM_EMAIL ?? "rm@moxman.local",
      password: process.env.RM_PASSWORD ?? "RM@1234",
      name: "Relationship Manager",
      branchId: "BR-01",
    },
    {
      id: "bm-001",
      role: "BRANCH_MANAGER",
      email: process.env.BM_EMAIL ?? "bm@moxman.local",
      password: process.env.BM_PASSWORD ?? "BM@1234",
      name: "Branch Manager",
      branchId: "BR-01",
    },
    {
      id: "subadmin-001",
      role: "SUB_ADMIN",
      email: process.env.SUBADMIN_EMAIL ?? "subadmin@moxman.local",
      password: process.env.SUBADMIN_PASSWORD ?? "SubAdmin@1234",
      name: "Sub Admin",
      branchId: "BR-02",
    },
  ];

  const matchedUser = mockUsers.find(
    (user) =>
      user.email === parsed.data.email && user.password === parsed.data.password,
  );

  if (!matchedUser) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const payload = {
    sub: matchedUser.id,
    role: matchedUser.role,
    email: matchedUser.email,
    name: matchedUser.name,
    branchId: matchedUser.branchId,
  };

  const accessToken = await signAccessToken(payload);
  const refreshToken = await signRefreshToken(payload);

  saveRefreshToken(hashToken(refreshToken), {
    userId: payload.sub,
    role: payload.role,
    email: payload.email,
    name: payload.name,
    branchId: payload.branchId,
    expiresAt: Date.now() + 1000 * refreshTtlSeconds,
  });

  await setHttpOnlyCookie("access_token", accessToken, accessTtlSeconds);
  await setHttpOnlyCookie("refresh_token", refreshToken, refreshTtlSeconds);

  return NextResponse.json({
    user: {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      branchId: payload.branchId,
    },
  });
}
