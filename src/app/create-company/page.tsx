import RegisterForm from "@/frontend/components/auth/register-form";
import { getCurrentUser } from "@/backend/auth";
import { redirect } from "next/navigation";

export default async function Register() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }
  return (
    <main className="min-h-screen bg-[#f8f9fc] px-6 py-10 sm:px-10 lg:px-12 lg:py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:max-w-[540px] lg:grid-cols-[minmax(220px,0.7fr)_500px] lg:justify-center lg:gap-24 lg:max-w-5xl">
        <aside className="hidden lg:block">
          <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-indigo-600 uppercase">
            Nexora
          </p>
          <h2 className="max-w-xs text-3xl font-semibold leading-tight tracking-tight text-gray-900">
            Start with a workspace built for your team.
          </h2>
          <div className="mt-10 border-l border-gray-200 pl-5">
            <p className="mb-5 text-sm leading-6 text-gray-500">
              Three simple steps to get your company moving.
            </p>
            <ol className="space-y-5">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  1
                </span>
                <span className="pt-0.5 text-sm font-medium text-gray-700">
                  Create your workspace
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-500">
                  2
                </span>
                <span className="pt-0.5 text-sm font-medium text-gray-700">
                  Invite your team
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-500">
                  3
                </span>
                <span className="pt-0.5 text-sm font-medium text-gray-700">
                  Manage projects together
                </span>
              </li>
            </ol>
          </div>
        </aside>
        <section className="w-full max-w-[500px] justify-self-center rounded-lg border border-gray-200 bg-white px-6 py-8 sm:px-10 sm:py-10">
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
