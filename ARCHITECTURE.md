# Moxman Fintech App Architecture

This document describes the current architecture, service boundaries, and security model for the Moxman Fintech App.

## 1. High-Level Overview
- **Frontend**: Next.js App Router (TypeScript, Tailwind).
- **BFF Gateway**: Next.js API routes acting as a secure proxy/gateway.
- **Backend Services**: Separate repos providing domain APIs (clients, policies, payments, etc.).
- **Database**: MySQL (used by backend services; Prisma schema exists for reference and local work).

The frontend never calls backend services directly. All traffic goes through the gateway under `/api/*`.

## 2. Request Flow
1. User interacts with the UI.
2. UI calls `/api/<service>/<path>`.
3. Gateway validates auth, applies RBAC, rate limits, and logs.
4. Gateway proxies to the corresponding backend service URL.
5. Response is returned to the UI.

This provides a single security and observability point.

## 3. Gateway (BFF) Layer
**Location**: `src/lib/api/gateway.ts`

Responsibilities:
- **Auth validation**: Verifies access token from cookies.
- **RBAC enforcement**: Checks role against allowed service access.
- **Rate limiting**: Limits requests per user/service/IP.
- **Logging**: Structured logs for each request.
- **Proxying**: Forwards requests to backend services with headers.
- **Caching**: In-memory GET cache with TTL for faster UX.

### Gateway Routes
Service routes live at:
- `src/app/api/clients/[...path]/route.ts`
- `src/app/api/policies/[...path]/route.ts`
- `src/app/api/products/[...path]/route.ts`
- `src/app/api/payments/[...path]/route.ts`
- `src/app/api/reports/[...path]/route.ts`
- `src/app/api/users/[...path]/route.ts`
- `src/app/api/slabs/[...path]/route.ts`
- `src/app/api/commissions/[...path]/route.ts`

## 4. Authentication
**Type**: Custom JWT

- Access + refresh tokens
- Tokens stored in httpOnly cookies
- Refresh rotation supported
- CSRF protection via `/api/auth/csrf`

Key files:
- `src/lib/auth.ts`
- `src/app/api/auth/*`
- `src/lib/http.ts`

## 5. RBAC Model
Roles:
- `ADMIN`
- `SUB_ADMIN`
- `BRANCH_MANAGER`
- `RELATIONSHIP_MANAGER`
- `PARTNER`

Gateway RBAC is enforced in `src/lib/api/gateway.ts`.

## 6. Theming (Role-Based)
Themes are driven by CSS variables and `data-role` on `<body>`:
- `src/app/globals.css`
- `src/app/layout.tsx`

Each role adjusts sidebar/header/background shades while retaining the brand base colors:
- Primary: `#012269`
- Accent: `#D0142C`

## 7. Environment Configuration
All service endpoints and secrets are stored in `.env`.

Required keys include:
- `AUTH_SECRET`
- `REFRESH_SECRET`
- `API_CLIENTS_BASE_URL`
- `API_POLICIES_BASE_URL`
- `API_PRODUCTS_BASE_URL`
- `API_PAYMENTS_BASE_URL`
- `API_REPORTS_BASE_URL`
- `API_USERS_BASE_URL`
- `API_SLABS_BASE_URL`
- `API_COMMISSIONS_BASE_URL`

Optional:
- `GATEWAY_CACHE_TTL_MS`

## 8. Security and UX Tradeoffs
- The gateway adds a small network hop but provides central control.
- Caching + keep-alive reduce perceived latency.
- RBAC and auth are enforced before backend requests.

## 9. Deployment Notes
- Frontend (Next.js) can deploy to Vercel or any Node hosting.
- Backend services remain independent and can scale separately.
- Configure `.env` on the server for production URLs.

## 10. Extension Points
- Add new services by:
  1. Adding a new env key for the base URL
  2. Adding a proxy route under `src/app/api/<service>/[...path]/route.ts`
  3. Registering service in `serviceMap` in `src/lib/api/gateway.ts`

