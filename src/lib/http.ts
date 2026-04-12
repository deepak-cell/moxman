import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

export async function setHttpOnlyCookie(
  name: string,
  value: string,
  maxAgeSeconds: number
) {
  const store = await cookies();
  store.set({ name, value, maxAge: maxAgeSeconds, ...cookieOptions });
}

export async function clearCookie(name: string) {
  const store = await cookies();
  store.set({ name, value: "", maxAge: 0, ...cookieOptions });
}

export async function setPublicCookie(
  name: string,
  value: string,
  maxAgeSeconds: number
) {
  const store = await cookies();
  store.set({
    name,
    value,
    maxAge: maxAgeSeconds,
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
}
