"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCsrfQuery, useLoginMutation } from "@/lib/api/api";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data: csrfData, isFetching: csrfLoading } = useCsrfQuery();
  const [login, { isLoading: loginLoading }] = useLoginMutation();

  const csrfToken = csrfData?.csrfToken ?? null;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await login({ email, password, csrfToken }).unwrap();
      const next = params.get("next") ?? "/dashboard";
      router.push(next);
    } catch (err) {
      const message =
        typeof err === "object" &&
        err &&
        "data" in err &&
        typeof (err as { data?: { error?: string } }).data?.error === "string"
          ? (err as { data: { error: string } }).data.error
          : "Login failed";
      setError(message);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-2xl bg-white/90 shadow-lg p-8 border border-slate-100"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Moxman Fintech
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Sign in to your workspace
        </h1>
        <p className="text-sm text-slate-500">
          Secure access for administrators, branch teams, and partners.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-[color:var(--color-primary)] focus:outline-none"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-[color:var(--color-primary)] focus:outline-none"
            required
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loginLoading || csrfLoading}
        className="mt-6 w-full rounded-lg bg-[color:var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#001c55] disabled:opacity-70"
      >
        {loginLoading ? "Signing in..." : "Sign in"}
      </button>

      <div className="mt-6 text-xs text-slate-400">
        Protected by role-based security and audit logging.
      </div>
    </form>
  );
}
