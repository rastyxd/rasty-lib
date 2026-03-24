import { redirect, type LoaderFunctionArgs } from "react-router";
import { getAuth } from "@clerk/react-router/server";
import { useLoaderData, Link, Form } from "react-router";
import { UserButton } from "@clerk/react-router";
import { getDb } from "~/db/client";
import { users, links } from "~/db/schema";
import { eq, desc } from "drizzle-orm";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return redirect("/sign-in");
  }

  const db = getDb(context.cloudflare.env);

  // Get or create user
  let user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    // Create user on first login
    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        clerkId: userId,
        username: userId.toLowerCase(),
      })
      .returning();
    user = newUser;
  }

  // Get user's links
  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, user.id),
    orderBy: [desc(links.position)],
  });

  return { user, links: userLinks };
}

export default function Dashboard() {
  const { user, links } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-border bg-white">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="text-xl font-bold text-primary">
            LinkTree Clone
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard/analytics"
              className="text-sm text-text-muted hover:text-text"
            >
              Analytics
            </Link>
            <Link
              to={`/${user.username}`}
              className="text-sm text-text-muted hover:text-text"
            >
              View Profile
            </Link>
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="container py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
            <p className="text-text-muted">
              Manage your links and customize your profile
            </p>
          </div>

          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Profile</h2>
              <Link
                to="/dashboard/settings"
                className="text-sm text-primary hover:text-primary-dark"
              >
                Edit Profile
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {user.displayName?.[0] || user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">
                  {user.displayName || user.username}
                </p>
                <p className="text-sm text-text-muted">
                  {window.location.origin}/{user.username}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Links</h2>
              <Link
                to="/dashboard/links/new"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                + Add Link
              </Link>
            </div>

            {links.length === 0 ? (
              <div className="py-12 text-center">
                <p className="mb-4 text-text-muted">
                  You haven't added any links yet
                </p>
                <Link
                  to="/dashboard/links/new"
                  className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
                >
                  Create Your First Link
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-surface"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{link.title}</h3>
                      <p className="text-sm text-text-muted">{link.url}</p>
                      <p className="mt-1 text-xs text-text-muted">
                        {link.clicks} clicks
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/links/${link.id}/edit`}
                        className="rounded bg-surface px-3 py-1 text-sm hover:bg-border"
                      >
                        Edit
                      </Link>
                      <Form
                        method="post"
                        action={`/dashboard/links/${link.id}/delete`}
                      >
                        <button
                          type="submit"
                          className="rounded bg-red-50 px-3 py-1 text-sm text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </Form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
