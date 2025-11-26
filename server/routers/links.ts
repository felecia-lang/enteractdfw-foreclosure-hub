import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { parse } from "csv-parse/sync";
import {
  createShortenedLink,
  getShortenedLink,
  getAllShortenedLinks,
  getLinkClickStats,
  deleteShortenedLink,
  updateShortenedLink,
  getLinkAnalytics,
  getTopPerformingLinks,
  activateLink,
  deactivateLink,
  getExpiringLinks,
  getExpiredLinks,
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
   * Bulk import links from CSV
   * Admin-only endpoint
   */
  bulkImport: adminProcedure
    .input(
      z.object({
        csvContent: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Parse CSV content
        const records = parse(input.csvContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        }) as Array<{
          originalUrl: string;
          title?: string;
          customAlias?: string;
          utmSource?: string;
          utmMedium?: string;
          utmCampaign?: string;
        }>;

        const results: Array<{
          row: number;
          success: boolean;
          shortCode?: string;
          error?: string;
          originalUrl: string;
        }> = [];

        // Process each row
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          const rowNumber = i + 2; // +2 because row 1 is header and arrays are 0-indexed

          try {
            // Validate required field
            if (!record.originalUrl || record.originalUrl.trim() === "") {
              results.push({
                row: rowNumber,
                success: false,
                error: "Missing originalUrl",
                originalUrl: record.originalUrl || "",
              });
              continue;
            }

            // Validate and normalize URL
            const normalizedUrl = validateUrl(record.originalUrl.trim());

            // Generate short code
            let shortCode = generateShortCode();
            let attempts = 0;
            while (attempts < 10) {
              const existing = await getShortenedLink(shortCode);
              if (!existing) break;
              shortCode = generateShortCode();
              attempts++;
            }

            if (attempts >= 10) {
              results.push({
                row: rowNumber,
                success: false,
                error: "Failed to generate unique short code",
                originalUrl: record.originalUrl,
              });
              continue;
            }

            // Check if custom alias is already taken
            if (record.customAlias) {
              const existing = await getShortenedLink(record.customAlias);
              if (existing) {
                results.push({
                  row: rowNumber,
                  success: false,
                  error: `Custom alias '${record.customAlias}' already taken`,
                  originalUrl: record.originalUrl,
                });
                continue;
              }
            }

            // Create the link
            await createShortenedLink({
              originalUrl: normalizedUrl,
              shortCode,
              customAlias: record.customAlias?.trim() || undefined,
              title: record.title?.trim() || undefined,
              createdBy: ctx.user?.openId,
              utmSource: record.utmSource?.trim() || undefined,
              utmMedium: record.utmMedium?.trim() || undefined,
              utmCampaign: record.utmCampaign?.trim() || undefined,
            });

            results.push({
              row: rowNumber,
              success: true,
              shortCode: record.customAlias || shortCode,
              originalUrl: record.originalUrl,
            });
          } catch (error) {
            results.push({
              row: rowNumber,
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
              originalUrl: record.originalUrl || "",
            });
          }
        }

        const successCount = results.filter((r) => r.success).length;
        const errorCount = results.filter((r) => !r.success).length;

        return {
          total: records.length,
          successCount,
          errorCount,
          results,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Failed to parse CSV",
        });
      }
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

  /**
   * Get comprehensive analytics for all links or a specific link
   * Admin-only endpoint
   */
  getAnalytics: adminProcedure
    .input(
      z.object({
        shortCode: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const analytics = await getLinkAnalytics(input);

      if (!analytics) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve analytics data",
        });
      }

      return analytics;
    }),

  /**
   * Get top performing links
   * Admin-only endpoint
   */
  getTopLinks: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const { limit, startDate, endDate } = input;
      const topLinks = await getTopPerformingLinks(limit, { startDate, endDate });
      return topLinks;
    }),

  /**
   * Activate a shortened link
   * Admin-only endpoint
   */
  activate: adminProcedure
    .input(z.object({ shortCode: z.string() }))
    .mutation(async ({ input }) => {
      const success = await activateLink(input.shortCode);
      
      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to activate link",
        });
      }
      
      return { success: true };
    }),

  /**
   * Deactivate a shortened link
   * Admin-only endpoint
   */
  deactivate: adminProcedure
    .input(z.object({ shortCode: z.string() }))
    .mutation(async ({ input }) => {
      const success = await deactivateLink(input.shortCode);
      
      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to deactivate link",
        });
      }
      
      return { success: true };
    }),

  /**
   * Get links expiring soon
   * Admin-only endpoint
   */
  getExpiring: adminProcedure
    .input(z.object({ daysAhead: z.number().min(1).max(90).default(7) }))
    .query(async ({ input }) => {
      const expiringLinks = await getExpiringLinks(input.daysAhead);
      return expiringLinks;
    }),

  /**
   * Get expired links
   * Admin-only endpoint
   */
  getExpired: adminProcedure
    .query(async () => {
      const expiredLinks = await getExpiredLinks();
      return expiredLinks;
    }),
});
