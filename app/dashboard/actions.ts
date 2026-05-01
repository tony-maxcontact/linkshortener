'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import {
  getLinkById,
  updateLink as updateLinkInDb,
  deleteLink as deleteLinkFromDb,
} from '@/data/links';

/**
 * Generates a random short code for the link
 * @param length - Length of the short code (default: 6)
 * @returns A random alphanumeric string
 */
function generateShortCode(length: number = 6): string {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Creates a new short link for the authenticated user
 * @param originalUrl - The original URL to shorten
 * @param customShortCode - Optional custom short code (if not provided, generates a random one)
 * @returns Object with success status and data/error
 */
export async function createLink(
  originalUrl: string,
  customShortCode?: string,
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validate URL
  try {
    new URL(originalUrl);
  } catch {
    return { success: false, error: 'Invalid URL' };
  }

  // Generate or use custom short code
  let shortCode = customShortCode?.trim() || '';

  if (shortCode) {
    // Validate custom short code (alphanumeric, hyphens, underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
      return {
        success: false,
        error:
          'Short code can only contain letters, numbers, hyphens, and underscores',
      };
    }

    if (shortCode.length < 3 || shortCode.length > 20) {
      return {
        success: false,
        error: 'Short code must be between 3 and 20 characters',
      };
    }

    // Check if custom short code already exists
    const existing = await db
      .select()
      .from(links)
      .where(eq(links.shortCode, shortCode))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: 'This short code is already taken' };
    }
  } else {
    // Generate unique random short code
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      shortCode = generateShortCode();

      const existing = await db
        .select()
        .from(links)
        .where(eq(links.shortCode, shortCode))
        .limit(1);

      if (existing.length === 0) {
        break;
      }

      attempts++;
    }

    if (attempts === maxAttempts) {
      return { success: false, error: 'Failed to generate unique short code' };
    }
  }

  // Create the link
  try {
    const [newLink] = await db
      .insert(links)
      .values({
        shortCode,
        originalUrl,
        userId,
      })
      .returning();

    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        id: newLink.id,
        shortCode: newLink.shortCode,
        originalUrl: newLink.originalUrl,
      },
    };
  } catch (error) {
    console.error('Error creating link:', error);
    return { success: false, error: 'Failed to create link' };
  }
}

// Validation schema for updating a link
const updateLinkSchema = z.object({
  linkId: z.number(),
  originalUrl: z.string().url('Invalid URL'),
  shortCode: z
    .string()
    .min(3, 'Short code must be at least 3 characters')
    .max(20, 'Short code must be at most 20 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Short code can only contain letters, numbers, hyphens, and underscores',
    ),
});

/**
 * Updates an existing link for the authenticated user
 * @param params - Object containing linkId, originalUrl, and shortCode
 * @returns Object with success status and data/error
 */
export async function updateLink(params: unknown) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validate input
  const validation = updateLinkSchema.safeParse(params);

  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const { linkId, originalUrl, shortCode } = validation.data;

  try {
    // Verify the link belongs to the user
    const existingLink = await getLinkById(linkId);

    if (!existingLink) {
      return { success: false, error: 'Link not found' };
    }

    if (existingLink.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // If short code is changing, check if the new one is available
    if (shortCode !== existingLink.shortCode) {
      const existingShortCode = await db
        .select()
        .from(links)
        .where(and(eq(links.shortCode, shortCode), eq(links.userId, userId)))
        .limit(1);

      if (existingShortCode.length > 0 && existingShortCode[0].id !== linkId) {
        return { success: false, error: 'This short code is already taken' };
      }
    }

    // Update the link
    const updated = await updateLinkInDb(linkId, {
      originalUrl,
      shortCode,
    });

    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        id: updated.id,
        shortCode: updated.shortCode,
        originalUrl: updated.originalUrl,
      },
    };
  } catch (error) {
    console.error('Error updating link:', error);
    return { success: false, error: 'Failed to update link' };
  }
}

// Validation schema for deleting a link
const deleteLinkSchema = z.object({
  linkId: z.number(),
});

/**
 * Deletes a link for the authenticated user
 * @param params - Object containing linkId
 * @returns Object with success status and error if any
 */
export async function deleteLink(params: unknown) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validate input
  const validation = deleteLinkSchema.safeParse(params);

  if (!validation.success) {
    return { success: false, error: 'Invalid link ID' };
  }

  const { linkId } = validation.data;

  try {
    // Verify the link belongs to the user
    const existingLink = await getLinkById(linkId);

    if (!existingLink) {
      return { success: false, error: 'Link not found' };
    }

    if (existingLink.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Delete the link
    await deleteLinkFromDb(linkId);

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Error deleting link:', error);
    return { success: false, error: 'Failed to delete link' };
  }
}
