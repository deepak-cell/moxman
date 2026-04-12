import { SignJWT, jwtVerify } from "jose";
import { createHash, randomBytes } from "crypto";

const accessSecret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-access-secret"
);
const refreshSecret = new TextEncoder().encode(
  process.env.REFRESH_SECRET || "dev-refresh-secret"
);

const accessTtlSeconds = Number(process.env.ACCESS_TOKEN_TTL ?? 900);
const refreshTtlSeconds = Number(process.env.REFRESH_TOKEN_TTL ?? 2592000);

export type JwtPayload = {
  sub: string;
  role: string;
  email: string;
  name: string;
  branchId?: string | null;
};

export async function signAccessToken(payload: JwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${accessTtlSeconds}s`)
    .sign(accessSecret);
}

export async function signRefreshToken(payload: JwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${refreshTtlSeconds}s`)
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify<JwtPayload>(token, accessSecret);
  return payload;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify<JwtPayload>(token, refreshSecret);
  return payload;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateCsrfToken() {
  return randomBytes(24).toString("hex");
}
