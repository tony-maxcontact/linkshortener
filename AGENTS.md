<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Agent Instructions — Link Shortener

This file is the entry point for LLM coding agents working in this repository. Read the linked docs files before writing or modifying any code.

## ⚠️ MANDATORY — READ DOCS BEFORE WRITING ANY CODE ⚠️

> **Do not rely on training data** for Next.js, Tailwind v4, or Clerk v7 — all have breaking changes not reflected in your training data. The docs are the source of truth.

## Non-Negotiable Rules

1. **Read docs first — no exceptions.** Before writing any code, use `read_file` to load every relevant doc. Do not skip this step, do not skim. Read the full file.
2. **Read before writing.** Read the relevant doc(s) above before generating any code. Do not rely on training data alone for Next.js, Tailwind v4, or Clerk v7 — all have breaking changes.
3. **App Router only.** No `pages/` directory. No `getServerSideProps`, `getStaticProps`, or API Routes.
4. **`params` is a Promise.** Always `await params` and `await searchParams` in page components.
5. **Auth on every mutation.** Every Server Action must call `auth()` and verify `userId` before touching the database.
6. **Ownership checks.** Always verify the authenticated user owns a resource before update or delete.
7. **No raw SQL.** Use the Drizzle query builder via `db` from `@/db`.
8. **No custom auth.** Never implement session handling, password storage, or JWT logic — Clerk owns this.
9. **Modal auth only.** Sign in and sign up must use `mode="modal"` on Clerk's buttons — no dedicated auth pages.
10. **⚠️ USE PROXY.TS, NOT MIDDLEWARE.TS.** `middleware.ts` is deprecated in this project. All routing logic, auth protection, and redirects must be implemented in `proxy.ts`. Never modify or reference `middleware.ts`.
11. **Protected routes.** `/dashboard` requires authentication; unauthenticated access must be blocked in proxy.
12. **Homepage redirect.** Authenticated users visiting `/` must be redirected to `/dashboard` in proxy.
13. **`cn()` for class merging.** Never concatenate Tailwind class strings — use `cn()` from `@/lib/utils`.
14. **shadcn components via CLI.** Add new UI components with `npx shadcn add <component>`, not by hand.
15. **No secrets in code.** All environment variables live in `.env.local`. Never hardcode credentials.
