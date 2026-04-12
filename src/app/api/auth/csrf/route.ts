import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/auth";
import { setPublicCookie } from "@/lib/http";

export async function GET() {
  const token = generateCsrfToken();
  await setPublicCookie("csrf_token", token, 60 * 60);
  return NextResponse.json({ csrfToken: token });
}
