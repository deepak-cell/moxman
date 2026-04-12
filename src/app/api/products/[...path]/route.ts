import type { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/api/gateway";

export async function GET(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, "products", context.params.path ?? []);
}

export async function POST(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, "products", context.params.path ?? []);
}

export async function PUT(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, "products", context.params.path ?? []);
}

export async function PATCH(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, "products", context.params.path ?? []);
}

export async function DELETE(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyRequest(request, "products", context.params.path ?? []);
}
