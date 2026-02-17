import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";
import { emailTrackingLogs } from "../drizzle/schema";
import { eq } from "drizzle-orm";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userOverrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-email-tracking",
    email: "emailtracking@example.com",
    name: "Email Tracking Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...userOverrides,
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("Email Tracking System", () => {
  beforeAll(async () => {
    // Clean up any existing test data
    const db = await getDb();
    if (db) {
      await db
        .delete(emailTrackingLogs)
        .where(eq(emailTrackingLogs.recipientEmail, "emailtracking@example.com"));
    }
  });

  it("should return empty email list for user with no emails", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const emails = await caller.emailTracking.getMyEmails();

    expect(emails).toBeDefined();
    expect(Array.isArray(emails)).toBe(true);
    expect(emails.length).toBe(0);
  });

  it("should return zero stats for user with no emails", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.emailTracking.getMyEmailStats();

    expect(stats).toEqual({
      totalEmails: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0,
    });
  });

  it("should insert email tracking log when email is sent", async () => {
    const db = await getDb();
    if (!db) {
      console.warn("[Test] Database unavailable, skipping test");
      return;
    }

    // Simulate email being sent
    await db.insert(emailTrackingLogs).values({
      resendEmailId: "test-email-123",
      recipientEmail: "emailtracking@example.com",
      subject: "Test Email",
      emailType: "timeline_pdf",
      status: "sent",
      sentAt: new Date(),
    });

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const emails = await caller.emailTracking.getMyEmails();

    expect(emails.length).toBe(1);
    expect(emails[0]?.resendEmailId).toBe("test-email-123");
    expect(emails[0]?.status).toBe("sent");
  });

  it("should calculate correct stats after email is sent", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.emailTracking.getMyEmailStats();

    expect(stats.totalEmails).toBe(1);
    expect(stats.deliveredCount).toBe(0); // Not delivered yet
    expect(stats.openedCount).toBe(0);
    expect(stats.clickedCount).toBe(0);
    expect(stats.bouncedCount).toBe(0);
  });

  it("should update email status when webhook is received", async () => {
    const db = await getDb();
    if (!db) {
      console.warn("[Test] Database unavailable, skipping test");
      return;
    }

    // Simulate webhook updating email status to "delivered"
    await db
      .update(emailTrackingLogs)
      .set({
        status: "delivered",
        deliveredAt: new Date(),
      })
      .where(eq(emailTrackingLogs.resendEmailId, "test-email-123"));

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const emails = await caller.emailTracking.getMyEmails();

    expect(emails[0]?.status).toBe("delivered");
    expect(emails[0]?.deliveredAt).toBeDefined();
  });

  it("should calculate correct delivery rate after email is delivered", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.emailTracking.getMyEmailStats();

    expect(stats.totalEmails).toBe(1);
    expect(stats.deliveredCount).toBe(1);
    expect(stats.deliveryRate).toBe(100);
  });

  it("should track email opens", async () => {
    const db = await getDb();
    if (!db) {
      console.warn("[Test] Database unavailable, skipping test");
      return;
    }

    // Simulate webhook updating email status to "opened"
    await db
      .update(emailTrackingLogs)
      .set({
        status: "opened",
        openedAt: new Date(),
      })
      .where(eq(emailTrackingLogs.resendEmailId, "test-email-123"));

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.emailTracking.getMyEmailStats();

    expect(stats.openedCount).toBe(1);
    expect(stats.openRate).toBe(100); // 1 opened / 1 delivered = 100%
  });

  it("should track email clicks", async () => {
    const db = await getDb();
    if (!db) {
      console.warn("[Test] Database unavailable, skipping test");
      return;
    }

    // Simulate webhook updating email status to "clicked"
    await db
      .update(emailTrackingLogs)
      .set({
        status: "clicked",
        clickedAt: new Date(),
        clickedUrl: "https://foreclosurehub.enteractdfw.com/timeline-calculator",
      })
      .where(eq(emailTrackingLogs.resendEmailId, "test-email-123"));

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const emails = await caller.emailTracking.getMyEmails();
    const stats = await caller.emailTracking.getMyEmailStats();

    expect(emails[0]?.status).toBe("clicked");
    expect(emails[0]?.clickedUrl).toBe("https://foreclosurehub.enteractdfw.com/timeline-calculator");
    expect(stats.clickedCount).toBe(1);
    expect(stats.clickRate).toBe(100); // 1 clicked / 1 opened = 100%
  });

  it("should filter emails by type", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const timelineEmails = await caller.emailTracking.getEmailsByType({
      emailType: "timeline_pdf",
    });

    expect(timelineEmails.length).toBe(1);
    expect(timelineEmails[0]?.emailType).toBe("timeline_pdf");
  });

  it("should deny admin access to non-admin users", async () => {
    const ctx = createAuthContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);

    await expect(caller.emailTracking.getAllEmails({ limit: 10, offset: 0 })).rejects.toThrow(
      "Admin access required"
    );
  });

  it("should allow admin access to admin users", async () => {
    const ctx = createAuthContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);

    const allEmails = await caller.emailTracking.getAllEmails({ limit: 10, offset: 0 });

    expect(Array.isArray(allEmails)).toBe(true);
    // Should include at least our test email
    expect(allEmails.length).toBeGreaterThanOrEqual(1);
  });

  it("should calculate overall stats for admin", async () => {
    const ctx = createAuthContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);

    const overallStats = await caller.emailTracking.getOverallStats();

    expect(overallStats.totalEmails).toBeGreaterThanOrEqual(1);
    expect(overallStats.deliveryRate).toBeGreaterThanOrEqual(0);
    expect(overallStats.deliveryRate).toBeLessThanOrEqual(100);
  });
});
