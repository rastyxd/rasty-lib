import {
  Links,
  Meta,
  Outlet,
  Scripts,
  Route,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import "./app.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/react-router";
import { clerkMiddleware } from "@clerk/react-router/server";
export const middleware: Route.MiddlewareFunction[] = [clerkMiddleware()];

export async function loader(args: LoaderFunctionArgs) {
  return rootAuthLoader(args, ({ request }) => {
    const { sessionClaims } = request.auth;
    return {
      clerkPublishableKey: args.context.cloudflare.env.CLERK_PUBLISHABLE_KEY,
      sessionClaims,
    };
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App({ loaderData }: Route.ComponentProps) {
  return (
    <ClerkProvider loaderData={loaderData}>
      <header className="flex items-center justify-center py-8 px-4">
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
      <Outlet />
    </ClerkProvider>
  );
}
