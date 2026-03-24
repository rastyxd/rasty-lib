import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getDb } from "~/db/client";
import { users, links, analytics } from "~/db/schema";
import { eq, and } from "drizzle-orm";
import "dotenv";
export async function loader({ params, context, request }: LoaderFunctionArgs) {
  const { username } = params;
  if (!username) {
    throw new Response("Not Found", { status: 404 });
  }
  if (!context.cloudflare) {
    throw new Error("context.cloudflare is undefined");
  }
  const db = getDb(context.cloudflare.env);

  const user = await db.query.users.findFirst({
    where: eq(users.username, username.toLowerCase()),
  });

  if (!user) {
    throw new Response("User Not Found", { status: 404 });
  }

  const userLinks = await db.query.links.findMany({
    where: and(eq(links.userId, user.id), eq(links.enabled, true)),
    orderBy: (links, { desc }) => [desc(links.position)],
  });

  return { user, links: userLinks };
}

export async function action({ params, context, request }: LoaderFunctionArgs) {
  const { username } = params;
  const formData = await request.formData();
  const linkId = formData.get("linkId") as string;

  if (!username || !linkId) {
    return { error: "Invalid request" };
  }

  const db = getDb(context.cloudflare.env);
  const user = await db.query.users.findFirst({
    where: eq(users.username, username.toLowerCase()),
  });

  if (!user) {
    return { error: "User not found" };
  }

  // Increment click count
  const [updatedLink] = await db
    .update(links)
    .set({ clicks: (links.clicks as any) + 1 })
    .where(eq(links.id, linkId))
    .returning();

  // Track analytics
  const userAgent = request.headers.get("user-agent") || "";
  const referrer = request.headers.get("referer") || "";

  await db.insert(analytics).values({
    id: crypto.randomUUID(),
    linkId,
    userId: user.id,
    userAgent,
    referrer,
  });

  return { success: true, url: updatedLink.url };
}

export default function PublicProfile() {
  const { user, links } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container py-12">
        <div className="mx-auto max-w-2xl">
          {/* Profile Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary">
                {user.displayName?.[0] || user.username[0].toUpperCase()}
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold">
              {user.displayName || `@${user.username}`}
            </h1>
            {user.bio && <p className="text-text-muted">{user.bio}</p>}
          </div>

          {/* Links */}
          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-text-muted">No links yet</p>
              </div>
            ) : (
              links.map((link) => (
                <form key={link.id} method="post">
                  <input type="hidden" name="linkId" value={link.id} />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-white p-4 text-left shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                    onClick={async (e) => {
                      e.preventDefault();
                      const form = e.currentTarget.closest("form");
                      if (form) {
                        await fetch(window.location.pathname, {
                          method: "POST",
                          body: new FormData(form),
                        });
                        window.open(link.url, "_blank");
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {link.icon && (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                          {link.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{link.title}</h3>
                        {link.description && (
                          <p className="text-sm text-text-muted">
                            {link.description}
                          </p>
                        )}
                      </div>
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-text-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                </form>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-text-muted">
              Create your own link-in-bio page
            </p>
            <a
              href="/"
              className="mt-2 inline-block font-semibold text-primary hover:text-primary-dark"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
