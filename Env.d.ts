declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: {
        DB: D1Database;
        CLERK_PUBLISHABLE_KEY: string;
        CLERK_SECRET_KEY: string;
      };
    };
  }
}

export {};
