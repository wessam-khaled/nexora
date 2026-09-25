"use client";
import { useState } from "react";
import { registerSchema } from "@/frontend/validators/auth";
import { register } from "@/frontend/services/auth-services";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ZodError } from "zod";
import { ApiError } from "@/frontend/lib/api-error";

export default function RegisterForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    companyName?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  type FieldName = keyof typeof fieldErrors;

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);
    try {
      const input = registerSchema.parse({
        email,
        password,
        name,
        companyName,
      });
      await register(input);
      router.replace("/");
    } catch (error) {
      if (error instanceof ZodError) {
        setFieldErrors(
          error.issues.reduce(
            (acc, issue) => {
              const field = issue.path[0] as FieldName;

              acc[field] = issue.message;

              return acc;
            },
            {} as typeof fieldErrors,
          ),
        );
      } else if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-7">
        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-indigo-600 uppercase">
          Nexora
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Create your company
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Set up your workspace and get started with your team.
        </p>
      </div>
      {error && (
        <p
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
      <form onSubmit={handleRegister} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="companyName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Company name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            placeholder="Enter your company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            aria-invalid={Boolean(fieldErrors.companyName)}
            aria-describedby={
              fieldErrors.companyName ? "company-name-error" : undefined
            }
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
          {fieldErrors.companyName && (
            <p id="company-name-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.companyName}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Your name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
          {fieldErrors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
          {fieldErrors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3.5 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                {showPassword ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.6 10.6 0 0 1 12 5c6.25 0 9.75 7 9.75 7a17.6 17.6 0 0 1-3.1 3.9M6.2 6.2C3.75 7.75 2.25 12 2.25 12s3.5 7 9.75 7c1.55 0 2.9-.4 4.05-1"
                  />
                ) : (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12s3.5-6 9.75-6 9.75 6 9.75 6-3.5 6-9.75 6-9.75-6-9.75-6Z"
                    />
                    <circle cx="12" cy="12" r="2.5" />
                  </>
                )}
              </svg>
            </button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" className="mt-2 text-sm text-red-600">
              {fieldErrors.password}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Create company"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/"
          className="font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
