<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Instructions — Link Shortener

This file is the entry point for LLM coding agents working in this repository. Read the linked docs files before writing or modifying any code.

## ⚠️ MANDATORY — READ DOCS BEFORE WRITING ANY CODE ⚠️

> **BLOCKING REQUIREMENT:** You MUST read every relevant file from the `/docs` directory BEFORE generating, modifying, or suggesting any code. This is not optional. Failure to read the docs first will result in incorrect implementations that violate project conventions.
>
> **Do not rely on training data** for Next.js, Tailwind v4, or Clerk v7 — all have breaking changes not reflected in your training data. The docs are the source of truth.

For detailed guidelines on specific topics, refer to the modular documentation in the `/docs` directory.
Identify ALL topics relevant to the task, then read EVERY corresponding doc file before writing a single line of code.

| Topic | File | Read Before... |
|-------|------|----------------|
| Authentication, route protection, auth UI | [docs/05-authentication.md](docs/05-authentication.md) | Any auth, middleware, or protected route code |
| UI components, shadcn/ui usage | [docs/06-ui-components.md](docs/06-ui-components.md) | Any component, layout, or styling code |

## Non-Negotiable Rules

1. **Read docs first — no exceptions.** Before writing any code, use `read_file` to load every relevant doc from `/docs`. Do not skip this step, do not skim. Read the full file.
2. **Read before writing.** Read the relevant doc(s) above before generating any code. Do not rely on training data alone for Next.js, Tailwind v4, or Clerk v7 — all have breaking changes.
2. **App Router only.** No `pages/` directory. No `getServerSideProps`, `getStaticProps`, or API Routes.
3. **`params` is a Promise.** Always `await params` and `await searchParams` in page components.
4. **Auth on every mutation.** Every Server Action must call `auth()` and verify `userId` before touching the database.
5. **Ownership checks.** Always verify the authenticated user owns a resource before update or delete.
6. **No raw SQL.** Use the Drizzle query builder via `db` from `@/db`.
7. **No custom auth.** Never implement session handling, password storage, or JWT logic — Clerk owns this.
8. **Modal auth only.** Sign in and sign up must use `mode="modal"` on Clerk's buttons — no dedicated auth pages.
9. **⚠️ USE PROXY.TS, NOT MIDDLEWARE.TS.** `middleware.ts` is deprecated in this project. All routing logic, auth protection, and redirects must be implemented in `proxy.ts`. Never modify or reference `middleware.ts`.
10. **Protected routes.** `/dashboard` requires authentication; unauthenticated access must be blocked in proxy.
11. **Homepage redirect.** Authenticated users visiting `/` must be redirected to `/dashboard` in proxy.
12. **`cn()` for class merging.** Never concatenate Tailwind class strings — use `cn()` from `@/lib/utils`.
13. **shadcn components via CLI.** Add new UI components with `npx shadcn add <component>`, not by hand.
14. **No secrets in code.** All environment variables live in `.env.local`. Never hardcode credentials.

