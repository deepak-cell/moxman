import { getSessionUser } from "@/lib/session";

const cards = [
  { label: "Active Clients", value: "1,248" },
  { label: "Policies", value: "3,410" },
  { label: "Monthly Revenue", value: "₹28.4L" },
  { label: "Pending Payouts", value: "₹4.2L" },
];

export default async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen grid md:grid-cols-[260px_1fr]">
      <aside className="bg-[color:var(--color-sidebar)] text-white p-6 hidden md:flex flex-col gap-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            Moxman
          </p>
          <h2 className="text-xl font-semibold">Control Center</h2>
        </div>
        <nav className="space-y-3 text-sm">
          {[
            "Overview",
            "Users",
            "Clients",
            "Policies",
            "Commissions",
            "Payments",
            "Reports",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg px-3 py-2 hover:bg-white/10"
            >
              {item}
            </div>
          ))}
        </nav>
        <div className="mt-auto text-xs text-white/60">
          Signed in as {user?.name ?? "User"}
        </div>
      </aside>

      <main className="bg-[color:var(--color-surface)] p-6 md:p-10 space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-500">Dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Welcome back, {user?.name ?? "Team"}
          </h1>
          <p className="text-sm text-slate-500">
            Role: {user?.role ?? "ADMIN"} · Track your branch performance and
            client activity.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {card.value}
              </p>
              <div className="mt-4 h-1 w-16 rounded-full bg-[color:var(--color-accent)]" />
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Client Activity</h2>
              <span className="text-xs text-slate-400">Last 30 days</span>
            </div>
            <div className="mt-6 h-48 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400">
              Chart placeholder
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            {[
              "New partner onboarded",
              "Policy payout approved",
              "Client status updated",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
