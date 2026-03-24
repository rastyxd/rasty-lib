import { redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import { Form, Link, useActionData } from "react-router";
import { getDb } from "~/db/client";
import { users, links } from "~/db/schema";
import { eq } from "drizzle-orm";

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId } = await getAuth(request);
  if (!userId) {
    return redirect("/sign-in");
  }
  return {};
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { userId } = await getAuth(request);
  if (!userId) {
    return redirect("/sign-in");
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;

  if (!title || !url) {
    return { error: "Title and URL are required" };
  }

  const db = getDb(context.cloudflare.env);

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return { error: "User not found" };
  }

  // Get the current max position
  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, user.id),
  });

  const maxPosition = userLinks.length > 0
    ? Math.max(...userLinks.map((l) => l.position))
    : 0;

  await db.insert(links).values({
    id: crypto.randomUUID(),
    userId: user.id,
    title,
    url,
    description: description || null,
    icon: icon || null,
    position: maxPosition + 1,
    enabled: true,
    clicks: 0,
  });

  return redirect("/dashboard");
}

export default function NewLink() {
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
            <h1 className="mb-2 text-3xl font-bold">Add New Link</h1>
            <p className="text-text-muted">
              Create a new link to add to your profile
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow">
            <Form method="post" className="space-y-6">
              {actionData?.error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {actionData.error}
                </div>
              )}

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="My Portfolio"
                />
              </div>

              <div>
                <label
                  htmlFor="url"
                  className="mb-2 block text-sm font-semibold"
                >
                  URL *
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  required
                  className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold"
                >
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Check out my work..."
                />
              </div>

              <div>
                <label
                  htmlFor="icon"
                  className="mb-2 block text-sm font-semibold"
                >
                  Icon (optional)
                </label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  maxLength={2}
                  className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="🎨"
                />
                <p className="mt-1 text-xs text-text-muted">
                  Enter an emoji to display next to your link
                </p>
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
                  Create Link
                </button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
