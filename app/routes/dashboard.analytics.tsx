import { redirect, type LoaderFunctionArgs } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import { useLoaderData, Link } from "react-router";
import { getDb } from "~/db/client";
import { users, links, analytics } from "~/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

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

  // Get links with click counts
  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, user.id),
    orderBy: [desc(links.clicks)],
  });

  // Get total clicks
  const totalClicksResult = await db
    .select({ total: sql<number>`sum(${links.clicks})` })
    .from(links)
    .where(eq(links.userId, user.id));

  const totalClicks = totalClicksResult[0]?.total || 0;

  // Get recent analytics
  const recentAnalytics = await db.query.analytics.findMany({
    where: eq(analytics.userId, user.id),
    orderBy: [desc(analytics.clickedAt)],
    limit: 10,
    with: {
      link: true,
    },
  });

  return {
    user,
    links: userLinks,
    totalClicks,
    recentAnalytics,
  };
}

export default function Analytics() {
  const { user, links, totalClicks, recentAnalytics } = useLoaderData<typeof loader>();

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
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Analytics</h1>
            <p className="text-text-muted">
              Track your link performance and visitor engagement
            </p>
          </div>

          {/* Overview Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-2 text-sm font-semibold text-text-muted">
                Total Clicks
              </div>
              <div className="text-4xl font-bold text-primary">{totalClicks}</div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-2 text-sm font-semibold text-text-muted">
                Active Links
              </div>
              <div className="text-4xl font-bold text-secondary">
                {links.filter((l) => l.enabled).length}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-2 text-sm font-semibold text-text-muted">
                Total Links
              </div>
              <div className="text-4xl font-bold">{links.length}</div>
            </div>
          </div>

          {/* Link Performance */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-6 text-xl font-semibold">Link Performance</h2>

            {links.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-text-muted">No links to analyze yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((link, index) => {
                  const percentage = totalClicks > 0
                    ? (link.clicks / totalClicks) * 100
                    : 0;

                  return (
                    <div key={link.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold">{link.title}</h3>
                            <p className="text-sm text-text-muted">{link.url}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{link.clicks}</div>
                          <div className="text-sm text-text-muted">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-6 text-xl font-semibold">Recent Activity</h2>

            {recentAnalytics.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-text-muted">No activity yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="pb-3 text-sm font-semibold text-text-muted">
                        Link
                      </th>
                      <th className="pb-3 text-sm font-semibold text-text-muted">
                        Time
                      </th>
                      <th className="pb-3 text-sm font-semibold text-text-muted">
                        Referrer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAnalytics.map((entry) => (
                      <tr key={entry.id} className="border-b border-border last:border-0">
                        <td className="py-3">
                          <div className="font-semibold">{entry.link?.title}</div>
                        </td>
                        <td className="py-3 text-sm text-text-muted">
                          {new Date(entry.clickedAt).toLocaleString()}
                        </td>
                        <td className="py-3 text-sm text-text-muted">
                          {entry.referrer || "Direct"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
