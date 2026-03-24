# Development Guide

## Common Development Tasks

### Starting Development

```bash
# Start the dev server
npm run dev

# Access at http://localhost:5173
```

### Database Tasks

```bash
# Create a new D1 database
npx wrangler d1 create link-in-bio-db

# Execute SQL locally
npx wrangler d1 execute link-in-bio-db --local --file=./schema.sql

# Execute SQL in production
npx wrangler d1 execute link-in-bio-db --remote --file=./schema.sql

# View database contents locally
npx wrangler d1 execute link-in-bio-db --local --command="SELECT * FROM users"

# List all tables
npx wrangler d1 execute link-in-bio-db --local --command="SELECT name FROM sqlite_master WHERE type='table'"

# Open Drizzle Studio
npm run db:studio
```

### Making Schema Changes

1. Edit `app/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration locally: `npx wrangler d1 execute link-in-bio-db --local --file=./drizzle/migrations/<file>.sql`
4. Test changes
5. Apply to production: `npx wrangler d1 execute link-in-bio-db --remote --file=./drizzle/migrations/<file>.sql`

### Deployment

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Or use Wrangler directly
npx wrangler pages deploy ./build/client
```

### Environment Variables

**Local Development (.dev.vars):**
```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Production (Cloudflare Dashboard):**
- Go to Workers & Pages > Your Project > Settings > Variables
- Add the same variables as above

### Debugging

```bash
# Check TypeScript errors
npm run typecheck

# View build output
npm run build

# Check Wrangler logs
npx wrangler pages deployment tail
```

### Testing Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/sign-in` | Sign in page |
| `/sign-up` | Sign up page |
| `/dashboard` | User dashboard |
| `/dashboard/settings` | Profile settings |
| `/dashboard/analytics` | Analytics dashboard |
| `/dashboard/links/new` | Create new link |
| `/dashboard/links/:id/edit` | Edit link |
| `/:username` | Public profile |

### Database Schema Reference

**Users:**
- Links to Clerk via `clerk_id`
- Has unique `username` for public URL
- Optional `display_name` and `bio`

**Links:**
- Belongs to a user
- Has `position` for ordering
- Has `enabled` flag for visibility
- Tracks `clicks` count

**Analytics:**
- Records each link click
- Captures `referrer`, `user_agent`, `country`
- Linked to both `link_id` and `user_id`

### Common Issues & Solutions

**Issue: Database not found**
```bash
# Make sure you created the database
npx wrangler d1 create link-in-bio-db

# Check if database ID is in wrangler.toml
cat wrangler.toml
```

**Issue: Clerk authentication not working**
```bash
# Check if keys are in .dev.vars
cat .dev.vars

# Make sure keys start with pk_test_ and sk_test_
```

**Issue: Type errors**
```bash
# Regenerate types
npm run typecheck

# Clean node_modules if needed
rm -rf node_modules package-lock.json
npm install
```

**Issue: Port already in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
PORT=3000 npm run dev
```

### Useful Wrangler Commands

```bash
# Login to Cloudflare
npx wrangler login

# List D1 databases
npx wrangler d1 list

# Get database info
npx wrangler d1 info link-in-bio-db

# View logs
npx wrangler pages deployment tail

# Deploy specific directory
npx wrangler pages deploy ./build/client --project-name=link-in-bio
```

### Adding New Features

1. **Add a new route:**
   - Create file in `app/routes/`
   - Add to `app/routes.ts`
   - Use loader/action pattern

2. **Add database table:**
   - Edit `app/db/schema.ts`
   - Run `npm run db:generate`
   - Apply migration

3. **Add UI components:**
   - Use Tailwind classes
   - Follow existing patterns
   - Keep responsive (mobile-first)

### Performance Tips

- Use indexes on frequently queried columns
- Limit analytics queries with `LIMIT`
- Cache public profiles (future enhancement)
- Optimize images (future enhancement)

### Security Checklist

- [x] Authentication with Clerk
- [x] User owns their own data
- [x] SQL injection protected (Drizzle ORM)
- [x] CORS handled by Cloudflare
- [ ] Rate limiting (consider adding)
- [ ] Input sanitization (consider adding)
