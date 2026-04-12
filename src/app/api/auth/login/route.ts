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

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@moxman.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@1234";

  if (
    parsed.data.email !== adminEmail ||
    parsed.data.password !== adminPassword
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const payload = {
    sub: "admin-001",
    role: "ADMIN",
    email: adminEmail,
    name: "System Admin",
    branchId: null,
  };

  const accessToken = await signAccessToken(payload);
  const refreshToken = await signRefreshToken(payload);

  saveRefreshToken(hashToken(refreshToken), {
    userId: payload.sub,
    role: payload.role,
    email: payload.email,
    name: payload.name,
    branchId: payload.branchId,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
  });

  await setHttpOnlyCookie("access_token", accessToken, 60 * 15);
  await setHttpOnlyCookie("refresh_token", refreshToken, 60 * 60 * 24 * 30);

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
