import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { emailTrackingLogs } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Email Tracking Router
 * 
 * Provides tRPC procedures for querying email delivery status and analytics.
 * Used by dashboard components to display email tracking data to users.
 */

export const emailTrackingRouter = router({
  /**
   * Get all email tracking logs for the current user
   */
  getMyEmails: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    const userEmail = ctx.user.email;
    if (!userEmail) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User email not found",
      });
    }

    const emails = await db
      .select()
      .from(emailTrackingLogs)
      .where(eq(emailTrackingLogs.recipientEmail, userEmail))
      .orderBy(desc(emailTrackingLogs.sentAt))
      .limit(50); // Limit to most recent 50 emails

    return emails;
  }),

  /**
   * Get email delivery statistics for the current user
   */
  getMyEmailStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    const userEmail = ctx.user.email;
    if (!userEmail) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User email not found",
      });
    }

    // Get all emails for this user
    const emails = await db
      .select()
      .from(emailTrackingLogs)
      .where(eq(emailTrackingLogs.recipientEmail, userEmail));

    if (emails.length === 0) {
      return {
        totalEmails: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        bouncedCount: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
      };
    }

    const totalEmails = emails.length;
    const deliveredCount = emails.filter((e) => 
      e.status === "delivered" || e.status === "opened" || e.status === "clicked"
    ).length;
    const openedCount = emails.filter((e) => 
      e.status === "opened" || e.status === "clicked"
    ).length;
    const clickedCount = emails.filter((e) => e.status === "clicked").length;
    const bouncedCount = emails.filter((e) => e.status === "bounced").length;

    return {
      totalEmails,
      deliveredCount,
      openedCount,
      clickedCount,
      bouncedCount,
      deliveryRate: totalEmails > 0 ? (deliveredCount / totalEmails) * 100 : 0,
      openRate: deliveredCount > 0 ? (openedCount / deliveredCount) * 100 : 0,
      clickRate: openedCount > 0 ? (clickedCount / openedCount) * 100 : 0,
      bounceRate: totalEmails > 0 ? (bouncedCount / totalEmails) * 100 : 0,
    };
  }),

  /**
   * Get a specific email by Resend email ID
   */
  getEmailById: publicProcedure
    .input(
      z.object({
        emailId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      const email = await db
        .select()
        .from(emailTrackingLogs)
        .where(eq(emailTrackingLogs.resendEmailId, input.emailId))
        .limit(1);

      if (email.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email not found",
        });
      }

      return email[0];
    }),

  /**
   * Get email tracking logs by email type
   */
  getEmailsByType: protectedProcedure
    .input(
      z.object({
        emailType: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      const userEmail = ctx.user.email;
      if (!userEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User email not found",
        });
      }

      const emails = await db
        .select()
        .from(emailTrackingLogs)
        .where(
          and(
            eq(emailTrackingLogs.recipientEmail, userEmail),
            eq(emailTrackingLogs.emailType, input.emailType)
          )
        )
        .orderBy(desc(emailTrackingLogs.sentAt));

      return emails;
    }),

  /**
   * Admin: Get all email tracking logs (for admin dashboard)
   */
  getAllEmails: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(100),
        offset: z.number().optional().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      const emails = await db
        .select()
        .from(emailTrackingLogs)
        .orderBy(desc(emailTrackingLogs.sentAt))
        .limit(input.limit)
        .offset(input.offset);

      return emails;
    }),

  /**
   * Admin: Get overall email delivery statistics
   */
  getOverallStats: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    const emails = await db.select().from(emailTrackingLogs);

    if (emails.length === 0) {
      return {
        totalEmails: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        bouncedCount: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
      };
    }

    const totalEmails = emails.length;
    const deliveredCount = emails.filter((e) => 
      e.status === "delivered" || e.status === "opened" || e.status === "clicked"
    ).length;
    const openedCount = emails.filter((e) => 
      e.status === "opened" || e.status === "clicked"
    ).length;
    const clickedCount = emails.filter((e) => e.status === "clicked").length;
    const bouncedCount = emails.filter((e) => e.status === "bounced").length;

    return {
      totalEmails,
      deliveredCount,
      openedCount,
      clickedCount,
      bouncedCount,
      deliveryRate: totalEmails > 0 ? (deliveredCount / totalEmails) * 100 : 0,
      openRate: deliveredCount > 0 ? (openedCount / deliveredCount) * 100 : 0,
      clickRate: openedCount > 0 ? (clickedCount / openedCount) * 100 : 0,
      bounceRate: totalEmails > 0 ? (bouncedCount / totalEmails) * 100 : 0,
    };
  }),
});
