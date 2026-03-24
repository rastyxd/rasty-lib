# Link-in-Bio Web App

A modern link-in-bio application built with React Router 7, TypeScript, Tailwind CSS v4, Cloudflare D1, Clerk Authentication, and Drizzle ORM.

## Features

- 🔐 **Authentication** - Secure auth with Clerk
- 🗄️ **Database** - Cloudflare D1 (SQLite) with Drizzle ORM
- 🎨 **Modern UI** - Tailwind CSS v4 with custom design system
- 📊 **Analytics** - Track link clicks and user engagement
- 🚀 **Fast Deployment** - Deploy to Cloudflare Pages
- 🔧 **Type-Safe** - Full TypeScript support

## Tech Stack

- **Framework**: React Router 7 (SSR)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle
- **Auth**: Clerk
- **Deployment**: Cloudflare Pages
- **Tooling**: Wrangler

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Cloudflare account
- Clerk account

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Clerk

1. Create a new application at [clerk.com](https://clerk.com)
2. Get your publishable and secret keys
3. Copy `.dev.vars.example` to `.dev.vars`:

```bash
cp .dev.vars.example .dev.vars
```

4. Add your Clerk keys to `.dev.vars`:

```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Set Up Cloudflare D1 Database

1. Create a D1 database:

```bash
npx wrangler d1 create link-in-bio-db
```

2. Copy the database ID from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "link-in-bio-db"
database_id = "paste-your-database-id-here"
```

3. Generate database migration:

```bash
npm run db:generate
```

4. Apply migration locally:

```bash
npx wrangler d1 execute link-in-bio-db --local --file=./drizzle/migrations/0000_*.sql
```

5. Apply migration to production (when ready):

```bash
npx wrangler d1 execute link-in-bio-db --remote --file=./drizzle/migrations/0000_*.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## Project Structure

```
link-in-bio/
├── app/
│   ├── db/
│   │   ├── schema.ts       # Database schema
│   │   └── client.ts       # Database client
│   ├── routes/
│   │   ├── home.tsx        # Landing page
│   │   ├── sign-in.tsx     # Sign in page
│   │   ├── sign-up.tsx     # Sign up page
│   │   ├── dashboard.tsx   # User dashboard
│   │   └── $username.tsx   # Public profile
│   ├── root.tsx            # Root layout with Clerk
│   ├── routes.ts           # Route configuration
│   ├── app.css             # Tailwind CSS
│   └── env.d.ts            # TypeScript types
├── drizzle/
│   └── migrations/         # Database migrations
├── wrangler.toml           # Cloudflare config
├── drizzle.config.ts       # Drizzle config
└── package.json
```

## Database Schema

### Users Table
- `id` - Primary key
- `clerkId` - Clerk user ID
- `username` - Unique username
- `displayName` - Display name
- `bio` - User bio
- `avatarUrl` - Profile picture
- `theme` - UI theme

### Links Table
- `id` - Primary key
- `userId` - Foreign key to users
- `title` - Link title
- `url` - Link URL
- `description` - Link description
- `icon` - Icon/emoji
- `position` - Display order
- `enabled` - Visibility toggle
- `clicks` - Click count

### Analytics Table
- `id` - Primary key
- `linkId` - Foreign key to links
- `userId` - Foreign key to users
- `clickedAt` - Timestamp
- `referrer` - HTTP referrer
- `userAgent` - User agent string
- `country` - Country code

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript checks
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run db:generate` - Generate migrations
- `npm run db:studio` - Open Drizzle Studio

## Deployment

### Deploy to Cloudflare Pages

1. Build the project:

```bash
npm run build
```

2. Deploy:

```bash
npm run deploy
```

3. Set environment variables in Cloudflare Dashboard:
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

4. Apply database migration to production:

```bash
npx wrangler d1 execute link-in-bio-db --remote --file=./drizzle/migrations/0000_*.sql
```

## Environment Variables

### Development (.dev.vars)
```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Production (Cloudflare Dashboard)
- Set in Cloudflare Pages settings
- Add the same variables as above

## Customization

### Tailwind Theme
Edit `app/app.css` to customize colors and design tokens:

```css
@theme {
  --color-primary: #6366f1;
  --color-secondary: #ec4899;
  /* ... */
}
```

### Database Schema
1. Edit `app/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration: `wrangler d1 execute...`

## Features to Add

- [ ] Link analytics dashboard
- [ ] Custom themes/templates
- [ ] Social media integrations
- [ ] Custom domains
- [ ] Link scheduling
- [ ] QR code generation
- [ ] Export analytics

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
