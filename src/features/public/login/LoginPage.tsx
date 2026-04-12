import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      <div className="hidden lg:flex flex-col justify-between bg-[color:var(--color-primary)] p-12 text-white">
        <div className="text-sm font-semibold tracking-[0.3em]">MOXMAN</div>
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold leading-tight">
            Insurance operations that stay fast, compliant, and connected.
          </h2>
          <p className="text-base text-white/80">
            Monitor clients, policies, slabs, and commissions with role-based
            dashboards built for every team.
          </p>
        </div>
        <div className="text-xs text-white/70">Powered by Moxman Fintech App</div>
      </div>
      <div className="flex items-center justify-center bg-[color:var(--color-surface)] p-8">
        <LoginForm />
      </div>
    </div>
  );
}
