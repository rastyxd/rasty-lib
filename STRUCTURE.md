# Link-in-Bio Project Structure

```
link-in-bio/
├── app/
│   ├── db/
│   │   ├── client.ts              # Database client setup
│   │   └── schema.ts              # Drizzle schema (users, links, analytics)
│   │
│   ├── routes/
│   │   ├── home.tsx               # Landing page (/)
│   │   ├── sign-in.tsx            # Clerk sign in (/sign-in)
│   │   ├── sign-up.tsx            # Clerk sign up (/sign-up)
│   │   ├── dashboard.tsx          # Main dashboard (/dashboard)
│   │   ├── dashboard.settings.tsx # Profile settings (/dashboard/settings)
│   │   ├── dashboard.analytics.tsx # Analytics page (/dashboard/analytics)
│   │   ├── dashboard.links.new.tsx # Create link (/dashboard/links/new)
│   │   ├── dashboard.links.$linkId.edit.tsx # Edit link
│   │   ├── dashboard.links.$linkId.delete.tsx # Delete link action
│   │   └── $username.tsx          # Public profile (/:username)
│   │
│   ├── root.tsx                   # Root layout with Clerk provider
│   ├── routes.ts                  # Route configuration
│   ├── app.css                    # Tailwind CSS with theme tokens
│   └── env.d.ts                   # TypeScript environment types
│
├── drizzle/
│   └── migrations/                # Database migration files
│
├── .dev.vars.example              # Example local environment variables
├── .env.example                   # Example environment variables
├── .gitignore                     # Git ignore rules
├── drizzle.config.ts              # Drizzle ORM configuration
├── package.json                   # Project dependencies and scripts
├── react-router.config.ts         # React Router configuration
├── schema.sql                     # SQL schema for initial setup
├── setup.sh                       # Quick setup script
├── tsconfig.json                  # TypeScript configuration
├── wrangler.toml                  # Cloudflare configuration
├── README.md                      # Main documentation
└── DEVELOPMENT.md                 # Development guide
```

## Key Files & Their Purpose

### Configuration Files

- **package.json**: Dependencies, scripts, and project metadata
- **tsconfig.json**: TypeScript compiler settings
- **wrangler.toml**: Cloudflare Workers/Pages configuration
- **drizzle.config.ts**: Database ORM configuration
- **react-router.config.ts**: React Router SSR settings

### Application Structure

- **app/root.tsx**: App shell with Clerk authentication provider
- **app/routes.ts**: Centralized route definitions
- **app/app.css**: Tailwind v4 with custom design tokens

### Database Layer

- **app/db/schema.ts**: Table schemas (users, links, analytics)
- **app/db/client.ts**: Database connection setup
- **schema.sql**: Raw SQL for initial database creation

### Routes Overview

| File | Route | Purpose |
|------|-------|---------|
| home.tsx | / | Landing page with features |
| sign-in.tsx | /sign-in | Clerk authentication |
| sign-up.tsx | /sign-up | User registration |
| dashboard.tsx | /dashboard | User's link management |
| dashboard.settings.tsx | /dashboard/settings | Edit profile |
| dashboard.analytics.tsx | /dashboard/analytics | View statistics |
| dashboard.links.new.tsx | /dashboard/links/new | Create new link |
| dashboard.links.$linkId.edit.tsx | /dashboard/links/:id/edit | Edit existing link |
| $username.tsx | /:username | Public profile view |

### Environment Files

- **.dev.vars**: Local development secrets (Clerk keys)
- **.env.example**: Template for environment variables
- **wrangler.toml**: Cloudflare bindings and production vars

## Data Flow

1. **User Registration**: Clerk → Create user in D1 → Dashboard
2. **Link Creation**: Form → Action → Insert into D1 → Redirect
3. **Link Click**: Public profile → Track in analytics → Redirect to URL
4. **Analytics**: Query analytics table → Aggregate → Display stats

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS v4
- **Routing**: React Router 7 (SSR)
- **Auth**: Clerk
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle
- **Deployment**: Cloudflare Pages
- **Tooling**: Wrangler

## Development Workflow

1. Edit code in `app/`
2. Run `npm run dev` for local testing
3. Changes to schema require migration
4. Deploy with `npm run deploy`
