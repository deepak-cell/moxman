import type { NextRequest } from "next/server";
import { Agent } from "undici";
import { verifyAccessToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const serviceMap = {
  clients: process.env.API_CLIENTS_BASE_URL,
  policies: process.env.API_POLICIES_BASE_URL,
  products: process.env.API_PRODUCTS_BASE_URL,
  payments: process.env.API_PAYMENTS_BASE_URL,
  reports: process.env.API_REPORTS_BASE_URL,
  users: process.env.API_USERS_BASE_URL,
  slabs: process.env.API_SLABS_BASE_URL,
  commissions: process.env.API_COMMISSIONS_BASE_URL,
} as const;

export type ServiceKey = keyof typeof serviceMap;

type Role =
  | "ADMIN"
  | "SUB_ADMIN"
  | "BRANCH_MANAGER"
  | "RELATIONSHIP_MANAGER"
  | "PARTNER";

const serviceAccess: Record<
  ServiceKey,
  { roles: Role[]; methods?: string[] }
> = {
  clients: {
    roles: [
      "ADMIN",
      "SUB_ADMIN",
      "BRANCH_MANAGER",
      "RELATIONSHIP_MANAGER",
      "PARTNER",
    ],
  },
  policies: {
    roles: [
      "ADMIN",
      "SUB_ADMIN",
      "BRANCH_MANAGER",
      "RELATIONSHIP_MANAGER",
      "PARTNER",
    ],
  },
  products: { roles: ["ADMIN", "SUB_ADMIN"] },
  payments: { roles: ["ADMIN", "SUB_ADMIN", "BRANCH_MANAGER"] },
  reports: { roles: ["ADMIN", "SUB_ADMIN", "BRANCH_MANAGER"] },
  users: { roles: ["ADMIN", "SUB_ADMIN"] },
  slabs: { roles: ["ADMIN", "SUB_ADMIN", "BRANCH_MANAGER"] },
  commissions: {
    roles: [
      "ADMIN",
      "SUB_ADMIN",
      "BRANCH_MANAGER",
      "RELATIONSHIP_MANAGER",
      "PARTNER",
    ],
  },
};

const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
]);

const dispatcher = new Agent({
  keepAliveTimeout: 10_000,
  keepAliveMaxTimeout: 60_000,
});

const cacheStore = new Map<
  string,
  { expiresAt: number; status: number; headers: Record<string, string>; body: ArrayBuffer }
>();
const cacheTtlMs = Number(process.env.GATEWAY_CACHE_TTL_MS ?? 30_000);

function getCacheKey(userId: string, method: string, url: string) {
  return `${userId}:${method}:${url}`;
}

export async function proxyRequest(
  request: NextRequest,
  service: ServiceKey,
  pathSegments: string[] = []
) {
  const start = Date.now();
  const method = request.method.toUpperCase();
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  const accessToken = request.cookies.get("access_token")?.value;
  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: { sub: string; role: string; branchId?: string | null };
  try {
    payload = await verifyAccessToken(accessToken);
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const access = serviceAccess[service];
  const allowedRoles = access.roles;
  const allowedMethods = access.methods;

  if (!allowedRoles.includes(payload.role as Role)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (allowedMethods && !allowedMethods.includes(method)) {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const limitKey = `${service}:${payload.sub}:${ip}`;
  const limiter = rateLimit(limitKey, 120, 60_000);
  if (!limiter.ok) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil((limiter.resetAt - Date.now()) / 1000).toString(),
      },
    });
  }

  const baseUrl = serviceMap[service];
  if (!baseUrl) {
    return new Response(
      JSON.stringify({ error: `Service '${service}' is not configured.` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = new URL(request.url);
  const target = new URL(baseUrl);
  const combinedPath = [target.pathname.replace(/\/$/, ""), ...pathSegments]
    .filter(Boolean)
    .join("/")
    .replace(/\/+/g, "/");

  target.pathname = combinedPath.startsWith("/")
    ? combinedPath
    : `/${combinedPath}`;
  target.search = url.search;

  const targetUrl = target.toString();
  const cacheControl = request.headers.get("cache-control") ?? "";
  const shouldUseCache =
    method === "GET" && cacheTtlMs > 0 && !cacheControl.includes("no-store");
  const cacheKey = shouldUseCache
    ? getCacheKey(payload.sub, method, targetUrl)
    : null;

  if (shouldUseCache && cacheKey) {
    const cached = cacheStore.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return new Response(cached.body.slice(0), {
        status: cached.status,
        headers: { ...cached.headers, "x-cache": "HIT" },
      });
    }
  }

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!hopByHopHeaders.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  headers.set("x-gateway", "moxman-bff");
  headers.set("authorization", `Bearer ${accessToken}`);
  headers.set("x-user-id", payload.sub);
  headers.set("x-user-role", payload.role);
  if (payload.branchId) {
    headers.set("x-branch-id", payload.branchId);
  }

  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const response = await fetch(targetUrl, {
    method,
    headers,
    body,
    redirect: "manual",
    dispatcher,
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("x-gateway", "moxman-bff");

  const durationMs = Date.now() - start;
  console.info("[gateway]", {
    service,
    method,
    path: target.pathname,
    status: response.status,
    durationMs,
    userId: payload.sub,
    role: payload.role,
  });

  if (shouldUseCache && cacheKey && response.status === 200) {
    const clone = response.clone();
    const buffer = await clone.arrayBuffer();
    const headersObj: Record<string, string> = {};
    responseHeaders.forEach((value, key) => {
      headersObj[key] = value;
    });
    cacheStore.set(cacheKey, {
      expiresAt: Date.now() + cacheTtlMs,
      status: response.status,
      headers: headersObj,
      body: buffer,
    });
    responseHeaders.set("x-cache", "MISS");
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
