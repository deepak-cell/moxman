import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

export function setHttpOnlyCookie(name: string, value: string, maxAgeSeconds: number) {
  cookies().set({ name, value, maxAge: maxAgeSeconds, ...cookieOptions });
}

export function clearCookie(name: string) {
  cookies().set({ name, value: "", maxAge: 0, ...cookieOptions });
}

export function setPublicCookie(name: string, value: string, maxAgeSeconds: number) {
  cookies().set({
    name,
    value,
    maxAge: maxAgeSeconds,
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
}
