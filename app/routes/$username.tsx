import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  redirect,
} from "react-router";
import { useLoaderData, Form } from "react-router";
import { getDb } from "~/db/client";
import { users, links, analytics } from "~/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { env } from "./../../worker-configuration.d";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { username } = params;

  // 1. Ensure env is typed correctly for Cloudflare
  const db = getDb(env);

  const user = await db.query.users.findFirst({
    where: eq(users.username, username?.toLowerCase() || ""),
  });

  if (!user) {
    throw new Response("User Not Found", { status: 404 });
  }

  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, user.id),
    orderBy: [desc(links.position)],
  });

  return { user, links: userLinks };
}
export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const linkId = formData.get("linkId") as string;
  const url = formData.get("url") as string;

  if (!linkId || !url) return { error: "Missing data" };

  const db = getDb(context.cloudflare.env);

  // 1. Get info from the Request object instead of the browser 'window'
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referrer = request.headers.get("referer") || "direct";

  // 2. Cloudflare provides the visitor's country via headers
  const country = request.headers.get("cf-ipcountry") || "unknown";
  await db.insert(analytics).values({
    id: crypto.randomUUID(), // Ensure your schema has an 'id' field if it's not auto-inc
    linkId: linkId,
    userId: Date.now().toString(), // Ensure your schema allows null for this field
    // Drizzle/SQLite usually prefers a Date object or an ISO string
    // depending on how you defined your timestamp column
    clickedAt: new Date(),
    referrer: referrer,
    userAgent: userAgent,
    country: country,
  });

  return redirect(url);
}

export default function PublicProfile() {
  const { user, links } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container py-12">
        <div className="mx-auto max-w-2xl px-4">
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
            {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
          </div>

          {/* Links */}
          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No links yet</p>
              </div>
            ) : (
              links.map((link) => (
                // Use the built-in Form component
                <Form key={link.id} method="post">
                  <input type="hidden" name="linkId" value={link.id} />
                  <input type="hidden" name="url" value={link.url} />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-white p-4 text-left shadow-md transition-all hover:scale-[1.01] hover:shadow-lg dark:bg-zinc-900"
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
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        )}
                      </div>
                      <svg
                        className="h-5 w-5 text-muted-foreground"
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
                </Form>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Create your own link-in-bio page
            </p>
            <a
              href="/"
              className="mt-2 inline-block font-semibold text-primary hover:underline"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
