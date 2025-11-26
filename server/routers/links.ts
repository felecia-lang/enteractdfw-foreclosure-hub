import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createShortenedLink,
  getShortenedLink,
  getAllShortenedLinks,
  getLinkClickStats,
  deleteShortenedLink,
  updateShortenedLink,
} from "../db";

/**
 * Generate a random short code for URLs
 * Uses alphanumeric characters (a-z, A-Z, 0-9) for 6-character codes
 */
function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate and normalize URL
 */
function validateUrl(url: string): string {
  try {
    // Add https:// if no protocol specified
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    
    const parsed = new URL(url);
    return parsed.toString();
  } catch (error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid URL format",
    });
  }
}

/**
 * Admin-only procedure for link management
 */
const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

export const linksRouter = router({
  /**
   * Create a new shortened link
   * Admin-only endpoint
   */
  create: adminProcedure
    .input(
      z.object({
        originalUrl: z.string().min(1, "URL is required"),
        customAlias: z.string().optional(),
        title: z.string().optional(),
        expiresAt: z.date().optional(),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
        utmTerm: z.string().optional(),
        utmContent: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Validate and normalize URL
      const normalizedUrl = validateUrl(input.originalUrl);

      // Generate short code (retry if collision)
      let shortCode = generateShortCode();
      let attempts = 0;
      while (attempts < 10) {
        const existing = await getShortenedLink(shortCode);
        if (!existing) break;
        shortCode = generateShortCode();
        attempts++;
      }

      if (attempts >= 10) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate unique short code",
        });
      }

      // Check if custom alias is already taken
      if (input.customAlias) {
        const existing = await getShortenedLink(input.customAlias);
        if (existing) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Custom alias already taken",
          });
        }
      }

      // Create the shortened link
      await createShortenedLink({
        originalUrl: normalizedUrl,
        shortCode,
        customAlias: input.customAlias,
        title: input.title,
        createdBy: ctx.user?.openId,
        expiresAt: input.expiresAt,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        utmTerm: input.utmTerm,
        utmContent: input.utmContent,
      });

      // Return the shortened URL
      const shortUrl = `https://links.enteractai.com/${input.customAlias || shortCode}`;

      return {
        success: true,
        shortCode,
        customAlias: input.customAlias,
        shortUrl,
        originalUrl: normalizedUrl,
      };
    }),

  /**
   * Get a shortened link by code or alias
   * Public endpoint for redirect handler
   */
  getByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const link = await getShortenedLink(input.code);

      if (!link) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shortened link not found",
        });
      }

      // Check if link has expired
      if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This link has expired",
        });
      }

      return link;
    }),

  /**
   * Get all shortened links
   * Admin-only endpoint
   */
  getAll: adminProcedure
    .input(
      z
        .object({
          includeExpired: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const links = await getAllShortenedLinks({
        includeExpired: input?.includeExpired || false,
      });

      return links.map((link) => ({
        ...link,
        shortUrl: `https://links.enteractai.com/${link.customAlias || link.shortCode}`,
        isExpired: link.expiresAt ? new Date(link.expiresAt) < new Date() : false,
      }));
    }),

  /**
   * Get click statistics for a shortened link
   * Admin-only endpoint
   */
  getStats: adminProcedure
    .input(
      z.object({
        shortCode: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const link = await getShortenedLink(input.shortCode);

      if (!link) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shortened link not found",
        });
      }

      const stats = await getLinkClickStats(input.shortCode, {
        startDate: input.startDate,
        endDate: input.endDate,
      });

      return {
        link,
        stats,
      };
    }),

  /**
   * Delete a shortened link
   * Admin-only endpoint
   */
  delete: adminProcedure
    .input(z.object({ shortCode: z.string() }))
    .mutation(async ({ input }) => {
      const success = await deleteShortenedLink(input.shortCode);

      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete shortened link",
        });
      }

      return { success: true };
    }),

  /**
   * Update a shortened link
   * Admin-only endpoint
   */
  update: adminProcedure
    .input(
      z.object({
        shortCode: z.string(),
        title: z.string().optional(),
        expiresAt: z.date().nullable().optional(),
        originalUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { shortCode, ...updates } = input;

      // Validate URL if provided
      if (updates.originalUrl) {
        updates.originalUrl = validateUrl(updates.originalUrl);
      }

      const success = await updateShortenedLink(shortCode, updates);

      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update shortened link",
        });
      }

      return { success: true };
    }),
});
