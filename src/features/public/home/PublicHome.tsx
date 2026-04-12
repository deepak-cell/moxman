import Link from "next/link";

export default function PublicHome() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 bg-white shadow-sm">
        <div className="text-sm font-semibold tracking-[0.3em] text-[color:var(--color-primary)]">
          MOXMAN
        </div>
        <Link
          href="/login"
          className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          Sign in
        </Link>
      </header>
      <main className="flex-1 grid place-items-center px-8">
        <div className="max-w-2xl text-center space-y-4">
          <h1 className="text-4xl font-semibold text-slate-900">
            Insurance operations, unified and secure.
          </h1>
          <p className="text-base text-slate-500">
            Moxman Fintech App helps teams manage clients, policies, and
            commissions with role-based visibility.
          </p>
          <Link
            href="/login"
            className="inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Access Portal
          </Link>
        </div>
      </main>
    </div>
  );
}
