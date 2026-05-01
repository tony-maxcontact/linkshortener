import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * Fetches all links for the currently authenticated user
 * @returns Array of links owned by the user, ordered by updated date (newest first)
 * @throws Error if user is not authenticated
 */
export async function getUserLinks() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));

  return userLinks;
}

/**
 * Fetches a single link by ID for the authenticated user
 * @param linkId - The ID of the link to fetch
 * @returns The link object or null if not found
 * @throws Error if user is not authenticated
 */
export async function getLinkById(linkId: number) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.id, linkId))
    .limit(1);

  return link;
}

/**
 * Updates a link for the authenticated user
 * @param linkId - The ID of the link to update
 * @param data - The data to update (originalUrl and/or shortCode)
 * @returns The updated link object
 * @throws Error if user is not authenticated or doesn't own the link
 */
export async function updateLink(
  linkId: number,
  data: { originalUrl?: string; shortCode?: string },
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const [updated] = await db
    .update(links)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(links.id, linkId))
    .returning();

  return updated;
}

/**
 * Deletes a link for the authenticated user
 * @param linkId - The ID of the link to delete
 * @throws Error if user is not authenticated
 */
export async function deleteLink(linkId: number) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  await db.delete(links).where(eq(links.id, linkId));
}

/**
 * Fetches a link by its short code (public access, no auth required)
 * @param shortCode - The short code to look up
 * @returns The link object or null if not found
 */
export async function getLinkByShortCode(shortCode: string) {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return link || null;
}
