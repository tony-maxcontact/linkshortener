---
description: Read this file when implementing data mutations, server actions, or any database write operations
---

# Server Actions Guidelines

This document outlines the mandatory practices for implementing server actions and data mutations in the application.

## 1. Server Actions for All Mutations

ALL data mutations (create, update, delete operations) MUST be done via Server Actions. NEVER perform mutations directly in Server Components or use API routes for mutations.

## 2. File Naming and Location

Server action files MUST:

- Be named `actions.ts`
- Be colocated in the same directory as the component that calls them

Example structure:

```
app/
  dashboard/
    links/
      page.tsx          // Client Component that calls actions
      actions.ts        // Server Actions for links
```

## 3. Client Component Requirement

Server Actions MUST be called from Client Components, not Server Components.

## 4. TypeScript Types

ALL data passed to Server Actions MUST:

- Have appropriate TypeScript types defined
- NEVER use the `FormData` TypeScript type
- Use proper interfaces or types for action parameters

Example:

```typescript
// ✅ Correct
interface CreateLinkParams {
  url: string;
  slug: string;
}

export async function createLink(params: CreateLinkParams) { ... }

// ❌ Wrong
export async function createLink(formData: FormData) { ... }
```

## 5. Error Handling Pattern

Server Actions MUST NOT throw errors. Instead, they MUST return an object with either:

- A `success` property containing the result data, OR
- An `error` property containing the error message

This pattern allows client components to handle errors gracefully without try-catch blocks.

Example:

```typescript
type ActionResult<T> =
  | { success: T; error?: never }
  | { error: string; success?: never };

export async function createLink(
  params: CreateLinkParams,
): Promise<ActionResult<Link>> {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // ... perform mutation

  return { success: newLink };
}
```

## 6. Data Validation with Zod

ALL Server Actions MUST validate input data using Zod schemas before processing.

Example:

```typescript
import { z } from 'zod';

const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1),
});

export async function createLink(params: unknown) {
  const validation = createLinkSchema.safeParse(params);

  if (!validation.success) {
    return { error: 'Invalid input data' };
  }

  // ... continue with validation.data
}
```

## 7. Authentication Check

ALL Server Actions MUST:

- Call `auth()` from Clerk at the beginning
- Verify `userId` exists before proceeding
- Return an error object if user is not authenticated

Example:

```typescript
import { auth } from '@clerk/nextjs/server';

export async function createLink(params: CreateLinkParams) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // ... continue with mutation
}
```

## 8. Database Operations via Helper Functions

Server Actions MUST:

- Use helper functions from the `/data` directory for database operations
- NEVER directly use Drizzle queries within the action

Example:

```typescript
// ✅ Correct
import { createLinkInDb } from "@/data/links";

export async function createLink(params: CreateLinkParams): Promise<ActionResult<Link>> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const validation = createLinkSchema.safeParse(params);
  if (!validation.success) return { error: "Invalid input" };

  const newLink = await createLinkInDb(userId, validation.data);
  return { success: newLink };
}

// ❌ Wrong - direct Drizzle query in action
export async function createLink(params: CreateLinkParams) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  return await db.insert(links).values({ ... }); // Don't do this!
}
```

## Summary Checklist

For every Server Action, ensure:

- [ ] File is named `actions.ts` and colocated with the calling component
- [ ] Called from a Client Component
- [ ] Parameters have proper TypeScript types (not FormData)
- [ ] Returns object with `success` or `error` property (never throws)
- [ ] Input validated with Zod using `safeParse()`
- [ ] Authentication checked via `auth()`
- [ ] Database operations delegated to `/data` helper functions
