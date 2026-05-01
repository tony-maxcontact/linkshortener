---
description: Read this file before implementing or modifying any authentication-related code in the project.
---

# Authentication

All authentication is handled exclusively by **Clerk** (`@clerk/nextjs` v7). No other auth method, custom session logic, or JWT handling is permitted.

---

## Route Protection Rules

| Route          | Behaviour                                            |
| -------------- | ---------------------------------------------------- |
| `/dashboard`   | Protected — redirect to sign-in if not authenticated |
| `/` (homepage) | If authenticated, redirect to `/dashboard`           |

### Middleware

Enforce these rules in `middleware.ts` at the project root using Clerk's `clerkMiddleware`:

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect authenticated users away from the homepage
  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protect the dashboard
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

---

## Sign In / Sign Up — Modal Mode

Sign in and sign up must always open as a **modal overlay**, never navigate to a separate page. Use Clerk's `mode="modal"` prop:

```tsx
import { SignInButton, SignUpButton } from '@clerk/nextjs'

<SignInButton mode="modal">
  <button>Sign In</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>Sign Up</button>
</SignUpButton>
```

Do **not** create dedicated `/sign-in` or `/sign-up` pages. Do **not** set `NEXT_PUBLIC_CLERK_SIGN_IN_URL` or `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars as page routes.

---

## Server-Side Auth

Use `auth()` from `@clerk/nextjs/server` to access the current user in Server Components and Server Actions:

```ts
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
if (!userId) throw new Error('Unauthorized');
```

Every Server Action that reads or mutates user data must check `userId` before proceeding.

---

## Rules

- **Clerk only.** No custom sessions, no JWT logic, no NextAuth or similar libraries.
- **Modal only.** Sign in/up always use `mode="modal"` — never dedicated auth pages.
- **Dashboard is protected.** Access without a valid session must be blocked at the middleware level.
- **Homepage redirects.** Authenticated users visiting `/` must be redirected to `/dashboard`.
- **Ownership checks.** Always verify `userId` matches the resource owner before any update or delete.
