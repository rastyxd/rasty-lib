import { redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import { Form, Link, useLoaderData, useActionData } from "react-router";
import { getDb } from "~/db/client";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { userId } = await getAuth(request);
  if (!userId) {
    return redirect("/sign-in");
  }

  const db = getDb(context.cloudflare.env);

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return redirect("/sign-in");
  }

  return { user };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { userId } = await getAuth(request);
  if (!userId) {
    return redirect("/sign-in");
  }

  const formData = await request.formData();
  const username = formData.get("username") as string;
  const displayName = formData.get("displayName") as string;
  const bio = formData.get("bio") as string;

  if (!username) {
    return { error: "Username is required" };
  }

  // Validate username format
  const usernameRegex = /^[a-z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { error: "Username can only contain lowercase letters, numbers, hyphens, and underscores" };
  }

  const db = getDb(context.cloudflare.env);

  const currentUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!currentUser) {
    return { error: "User not found" };
  }

  // Check if username is taken (if changed)
  if (username !== currentUser.username) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username.toLowerCase()),
    });

    if (existingUser) {
      return { error: "Username is already taken" };
    }
  }

  await db
    .update(users)
    .set({
      username: username.toLowerCase(),
      displayName: displayName || null,
      bio: bio || null,
      updatedAt: new Date(),
    })
    .where(eq(users.clerkId, userId));

  return { success: true };
}

export default function Settings() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-border bg-white">
        <div className="container flex items-center justify-between py-4">
          <Link to="/dashboard" className="text-xl font-bold text-primary">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="container py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Profile Settings</h1>
            <p className="text-text-muted">
              Customize your profile and public page
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow">
            <Form method="post" className="space-y-6">
              {actionData?.error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {actionData.error}
                </div>
              )}

              {actionData?.success && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600">
                  Profile updated successfully!
                </div>
              )}

              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold"
                >
                  Username *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted">{window.location.origin}/</span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    defaultValue={user.username}
                    pattern="[a-z0-9_-]+"
                    className="flex-1 rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="johndoe"
                  />
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Lowercase letters, numbers, hyphens, and underscores only
                </p>
              </div>

              <div>
                <label
                  htmlFor="displayName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  defaultValue={user.displayName || ""}
                  className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="John Doe"
                />
                <p className="mt-1 text-xs text-text-muted">
                  This is shown on your public profile
                </p>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-semibold"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  maxLength={160}
                  defaultValue={user.bio || ""}
                  className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Tell visitors about yourself..."
                />
                <p className="mt-1 text-xs text-text-muted">
                  Max 160 characters
                </p>
              </div>

              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-2 font-semibold">Your Public URL</h3>
                <a
                  href={`/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {window.location.origin}/{user.username}
                </a>
              </div>

              <div className="flex gap-4">
                <Link
                  to="/dashboard"
                  className="flex-1 rounded-lg border border-border px-6 py-3 text-center font-semibold hover:bg-surface"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
                >
                  Save Changes
                </button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
