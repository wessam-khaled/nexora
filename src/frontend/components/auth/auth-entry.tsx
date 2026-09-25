import LoginForm from "@/frontend/components/auth/login-form";

export default function AuthEntry() {
  return (
    <main className="min-h-screen bg-[#f8f9fc] lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-white lg:flex lg:flex-col lg:justify-between lg:px-16 lg:py-14 xl:px-24">
        <div className="relative z-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-indigo-600 uppercase">
            Nexora
          </p>
          <div className="mt-[clamp(5rem,18vh,11rem)] max-w-md">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-gray-900 xl:text-5xl">
              Manage your team.
              <br />
              Build better projects.
            </h2>
            <div className="mt-8 h-px w-20 bg-indigo-600" />
          </div>
        </div>
        <p className="relative z-10 text-xs text-gray-400">© 2026 Nexora</p>
        <div className="pointer-events-none absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border border-indigo-100" />
        <div className="pointer-events-none absolute -right-8 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full border border-indigo-100" />
      </section>
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-12 xl:px-20">
        <LoginForm />
      </section>
    </main>
  );
}
