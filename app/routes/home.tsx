import { Link } from "react-router";
import React from "react";
export const SignedOut = (
  props: React.PropsWithChildren<React.PropsWithChildren<unknown>>,
) => {
  return <div>SignedOut</div>;
};

export const UserButton = () => {
  return <div>UserButton</div>;
};

export default function Index() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 via-secondary/5 to-background">
      <nav className="container py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            ReaLink
          </Link>
          <div className="flex items-center gap-4">
            <UserButton />

            <Link
              to="/sign-in"
              className="rounded-lg border border-border px-4 py-2 hover:bg-surface"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            One link for all your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              content
            </span>
          </h1>
          <p className="mb-8 text-xl text-text-muted">
            Create your personalized link-in-bio page and share it everywhere.
            Track clicks, customize your profile, and connect with your
            audience.
          </p>
          <div className="flex justify-center gap-4">
            <SignedOut>
              <Link
                to="/sign-up"
                className="rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white hover:bg-primary-dark"
              >
                Create Your Page
              </Link>
              <Link
                to="/examples"
                className="rounded-lg border-2 border-border px-8 py-3 text-lg font-semibold hover:bg-surface"
              >
                See Examples
              </Link>
            </SignedOut>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Easy Setup</h3>
            <p className="text-text-muted">
              Create your page in minutes. No coding required.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
              <svg
                className="h-6 w-6 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Track Analytics</h3>
            <p className="text-text-muted">
              See how your links perform with detailed analytics.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">Customize Design</h3>
            <p className="text-text-muted">
              Make it yours with themes and custom branding.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
