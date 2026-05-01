# Copilot Instructions — Link Shortener

## Commands

```bash
npm run dev      # Start dev server (uses Webpack explicitly)
npm run build    # Production build
npm run lint     # Run ESLint
```

Database migrations are managed with Drizzle Kit — schema lives in `db/schema.ts`, run `npx drizzle-kit push` to apply changes.

---

## Architecture

This is a **Next.js 16 App Router** application. The stack is:

- **Auth:** Clerk v7 (`@clerk/nextjs`) — do not rely on training data; the API has breaking changes
- **Database:** NeonDB (serverless Postgres) via Drizzle ORM
- **UI:** shadcn/ui + Tailwind CSS v4 — both have breaking changes from prior versions
- **Validation:** Zod v4

### Layer structure

```
db/schema.ts          →  Drizzle table definitions (single `links` table)
db/index.ts           →  Drizzle client (exports `db`)
data/links.ts         →  Data access functions (server-only, call auth() internally)
app/dashboard/
  actions.ts          →  Server Actions (mutations only)
  page.tsx            →  Server Component (fetches via data/ helpers)
components/           →  Client Components (modals, dialogs, interactive UI)
proxy.ts              →  Clerk middleware (route protection & redirects)
app/l/[shortcode]/    →  Route handler for short link redirects (GET → 301)
```

### Request flow

1. Short link visit: `GET /l/abc123` → `app/l/[shortcode]/route.ts` → `getLinkByShortCode()` → 301 redirect
2. Dashboard load: Server Component calls `getUserLinks()` from `data/links.ts` → renders with Client Component modals
3. Mutations: Client Component calls Server Action in `app/dashboard/actions.ts` → action calls `data/` helper → `revalidatePath("/dashboard")`

---

## Key Conventions

### `proxy.ts` is the middleware — never `middleware.ts`

`proxy.ts` at the project root is the Clerk middleware file. `middleware.ts` is deprecated in this project. All route protection and redirects go in `proxy.ts`.

### Server Actions always return `{ success, error }` — never throw

```ts
// ✅ Correct
return { success: false, error: 'Unauthorized' };
return { success: true, data: newLink };

// ❌ Wrong
throw new Error('Unauthorized');
```

### Server Actions must use `data/` helpers for DB access

Actions in `actions.ts` call functions from `data/links.ts` — they do not write Drizzle queries directly. (Exception: uniqueness checks before insert currently live in the action.)

### Every action: auth → validate → ownership check → mutate

```ts
const { userId } = await auth();
if (!userId) return { success: false, error: 'Unauthorized' };

const validation = schema.safeParse(params);
if (!validation.success) return { success: false, error: '...' };

const existing = await getLinkById(id);
if (existing.userId !== userId)
  return { success: false, error: 'Unauthorized' };
```

### `revalidatePath("/dashboard")` after every mutation

All create/update/delete actions call `revalidatePath("/dashboard")` to refresh the Server Component.

### `cn()` for all Tailwind class merging

Import from `@/lib/utils`. Never concatenate class strings with `+` or template literals.

### shadcn components via CLI only

```bash
npx shadcn add <component>
```

Do not hand-write files in `components/ui/`. Currently installed: `button`, `input`, `label`, `dialog`, `alert-dialog`.

### Auth is modal-only

Sign in/up always uses `mode="modal"` on Clerk buttons. No dedicated `/sign-in` or `/sign-up` pages.

### Short code rules

- Characters: `[a-zA-Z0-9_-]`
- Length: 3–20 characters
- Auto-generated: 6-character random alphanumeric
- Stored in `links.shortCode` (varchar 20)

### Clerk UI theming

`ClerkProvider` uses the dark theme from `@clerk/ui/themes` — always pass `appearance={{ theme: dark }}`.

### `params` is a Promise

In all page and route handler components:

```ts
const { id } = await params; // ✅
const { id } = params; // ❌
```
