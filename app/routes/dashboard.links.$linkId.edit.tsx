import { redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import { Form, Link, useLoaderData, useActionData } from "react-router";
import { getDb } from "~/db/client";
import { users, links } from "~/db/schema";
import { eq, and } from "drizzle-orm";

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { userId } = await getAuth(request);
  if (!userId) {
    return redirect("/sign-in");
  }

  const { linkId } = params;
  if (!linkId) {
    return redirect("/dashboard");
  }

  const db = getDb(context.cloudflare.env);

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return redirect("/sign-in");
  }

  const link = await db.query.links.findFirst({
    where: and(eq(links.id, linkId), eq(links.userId, user.id)),
  });

  if (!link) {
    return redirect("/dashboard");
  }

  return { link };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { userId } = await getAuth(request);
  if (!userId) {
    return redirect("/sign-in");
  }

  const { linkId } = params;
  if (!linkId) {
    return redirect("/dashboard");
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const enabled = formData.get("enabled") === "on";

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

  await db
    .update(links)
    .set({
      title,
      url,
      description: description || null,
      icon: icon || null,
      enabled,
      updatedAt: new Date(),
    })
    .where(and(eq(links.id, linkId), eq(links.userId, user.id)));

  return redirect("/dashboard");
}

export default function EditLink() {
  const { link } = useLoaderData<typeof loader>();
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
            <h1 className="mb-2 text-3xl font-bold">Edit Link</h1>
            <p className="text-text-muted">
              Update your link information
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
                  defaultValue={link.title}
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
                  defaultValue={link.url}
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
                  defaultValue={link.description || ""}
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
                  defaultValue={link.icon || ""}
                  className="w-full rounded-lg border border-border px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="🎨"
                />
                <p className="mt-1 text-xs text-text-muted">
                  Enter an emoji to display next to your link
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <input
                  type="checkbox"
                  id="enabled"
                  name="enabled"
                  defaultChecked={link.enabled}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                />
                <label htmlFor="enabled" className="font-semibold">
                  Link is visible on profile
                </label>
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
