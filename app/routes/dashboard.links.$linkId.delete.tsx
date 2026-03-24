import { redirect, type ActionFunctionArgs } from "react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import { getDb } from "~/db/client";
import { users, links } from "~/db/schema";
import { eq, and } from "drizzle-orm";

export async function action({ request, params, context }: ActionFunctionArgs) {
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

  await db
    .delete(links)
    .where(and(eq(links.id, linkId), eq(links.userId, user.id)));

  return redirect("/dashboard");
}
