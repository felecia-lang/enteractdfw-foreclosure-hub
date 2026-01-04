import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
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

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("formAnalytics.trackEvent", () => {
  it("should track form view event", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.formAnalytics.trackEvent({
      eventType: "view",
      formName: "contact_form",
      sessionId: "test-session-123",
      pagePath: "/",
      userAgent: "Mozilla/5.0 Test Browser",
    });

    expect(result).toEqual({ success: true });
  });

  it("should track form start event", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.formAnalytics.trackEvent({
      eventType: "start",
      formName: "contact_form",
      sessionId: "test-session-123",
      pagePath: "/",
      userAgent: "Mozilla/5.0 Test Browser",
    });

    expect(result).toEqual({ success: true });
  });

  it("should track form completion event with user email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.formAnalytics.trackEvent({
      eventType: "complete",
      formName: "contact_form",
      sessionId: "test-session-123",
      userEmail: "test@example.com",
      pagePath: "/",
      userAgent: "Mozilla/5.0 Test Browser",
    });

    expect(result).toEqual({ success: true });
  });

  it("should track form error event with error details", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.formAnalytics.trackEvent({
      eventType: "error",
      formName: "contact_form",
      sessionId: "test-session-123",
      userEmail: "test@example.com",
      errorType: "validation",
      errorMessage: "Invalid email format",
      pagePath: "/",
      userAgent: "Mozilla/5.0 Test Browser",
    });

    expect(result).toEqual({ success: true });
  });

  it("should track event with UTM parameters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.formAnalytics.trackEvent({
      eventType: "view",
      formName: "contact_form",
      sessionId: "test-session-123",
      pagePath: "/",
      userAgent: "Mozilla/5.0 Test Browser",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "foreclosure-help",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("formAnalytics.getMetrics", () => {
  let testSessionId: string;

  beforeEach(async () => {
    // Generate unique session ID for this test
    testSessionId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create test events
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Track 3 views
    await caller.formAnalytics.trackEvent({
      eventType: "view",
      formName: "contact_form",
      sessionId: `${testSessionId}-1`,
      pagePath: "/",
    });
    await caller.formAnalytics.trackEvent({
      eventType: "view",
      formName: "contact_form",
      sessionId: `${testSessionId}-2`,
      pagePath: "/",
    });
    await caller.formAnalytics.trackEvent({
      eventType: "view",
      formName: "contact_form",
      sessionId: `${testSessionId}-3`,
      pagePath: "/",
    });

    // Track 2 starts
    await caller.formAnalytics.trackEvent({
      eventType: "start",
      formName: "contact_form",
      sessionId: `${testSessionId}-1`,
      pagePath: "/",
    });
    await caller.formAnalytics.trackEvent({
      eventType: "start",
      formName: "contact_form",
      sessionId: `${testSessionId}-2`,
      pagePath: "/",
    });

    // Track 1 completion
    await caller.formAnalytics.trackEvent({
      eventType: "complete",
      formName: "contact_form",
      sessionId: `${testSessionId}-1`,
      userEmail: "test@example.com",
      pagePath: "/",
    });

    // Track 1 error
    await caller.formAnalytics.trackEvent({
      eventType: "error",
      formName: "contact_form",
      sessionId: `${testSessionId}-3`,
      errorType: "network",
      errorMessage: "Connection timeout",
      pagePath: "/",
    });
  });

  it("should return metrics for last 30 days", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const metrics = await caller.formAnalytics.getMetrics({
      formName: "contact_form",
      days: 30,
    });

    // Verify metrics structure
    expect(metrics).toHaveProperty("views");
    expect(metrics).toHaveProperty("starts");
    expect(metrics).toHaveProperty("completions");
    expect(metrics).toHaveProperty("errors");
    expect(metrics).toHaveProperty("startRate");
    expect(metrics).toHaveProperty("completionRate");
    expect(metrics).toHaveProperty("overallConversionRate");
    expect(metrics).toHaveProperty("events");

    // Verify metrics are numbers
    expect(typeof metrics.views).toBe("number");
    expect(typeof metrics.starts).toBe("number");
    expect(typeof metrics.completions).toBe("number");
    expect(typeof metrics.errors).toBe("number");

    // Verify our test events are included
    expect(metrics.views).toBeGreaterThanOrEqual(3);
    expect(metrics.starts).toBeGreaterThanOrEqual(2);
    expect(metrics.completions).toBeGreaterThanOrEqual(1);
    expect(metrics.errors).toBeGreaterThanOrEqual(1);
  });

  it("should calculate correct conversion rates", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const metrics = await caller.formAnalytics.getMetrics({
      formName: "contact_form",
      days: 30,
    });

    // Rates should be between 0 and 100
    expect(metrics.startRate).toBeGreaterThanOrEqual(0);
    expect(metrics.startRate).toBeLessThanOrEqual(100);
    expect(metrics.completionRate).toBeGreaterThanOrEqual(0);
    expect(metrics.completionRate).toBeLessThanOrEqual(100);
    expect(metrics.overallConversionRate).toBeGreaterThanOrEqual(0);
    expect(metrics.overallConversionRate).toBeLessThanOrEqual(100);

    // Overall conversion rate should be <= start rate
    expect(metrics.overallConversionRate).toBeLessThanOrEqual(metrics.startRate);
  });

  it("should return events array", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const metrics = await caller.formAnalytics.getMetrics({
      formName: "contact_form",
      days: 30,
    });

    expect(Array.isArray(metrics.events)).toBe(true);
    expect(metrics.events.length).toBeGreaterThan(0);

    // Verify event structure
    const event = metrics.events[0];
    expect(event).toHaveProperty("eventType");
    expect(event).toHaveProperty("formName");
    expect(event).toHaveProperty("createdAt");
  });

  it("should require authentication for getMetrics", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.formAnalytics.getMetrics({
        formName: "contact_form",
        days: 30,
      })
    ).rejects.toThrow();
  });

  it("should filter by time range", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Get metrics for last 7 days
    const metrics7Days = await caller.formAnalytics.getMetrics({
      formName: "contact_form",
      days: 7,
    });

    // Get metrics for last 30 days
    const metrics30Days = await caller.formAnalytics.getMetrics({
      formName: "contact_form",
      days: 30,
    });

    // 30 days should have >= events than 7 days
    expect(metrics30Days.views).toBeGreaterThanOrEqual(metrics7Days.views);
    expect(metrics30Days.starts).toBeGreaterThanOrEqual(metrics7Days.starts);
    expect(metrics30Days.completions).toBeGreaterThanOrEqual(metrics7Days.completions);
  });
});

describe("formAnalytics conversion funnel", () => {
  it("should track complete user journey", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const sessionId = `journey-${Date.now()}`;

    // 1. User views form
    await caller.formAnalytics.trackEvent({
      eventType: "view",
      formName: "contact_form",
      sessionId,
      pagePath: "/",
    });

    // 2. User starts filling form
    await caller.formAnalytics.trackEvent({
      eventType: "start",
      formName: "contact_form",
      sessionId,
      pagePath: "/",
    });

    // 3. User completes form
    await caller.formAnalytics.trackEvent({
      eventType: "complete",
      formName: "contact_form",
      sessionId,
      userEmail: "journey@example.com",
      pagePath: "/",
    });

    // Verify all events were tracked
    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);
    const metrics = await adminCaller.formAnalytics.getMetrics({
      formName: "contact_form",
      days: 1,
    });

    // Find our session events
    const sessionEvents = metrics.events.filter((e) => e.sessionId === sessionId);
    expect(sessionEvents.length).toBe(3);
    expect(sessionEvents.some((e) => e.eventType === "view")).toBe(true);
    expect(sessionEvents.some((e) => e.eventType === "start")).toBe(true);
    expect(sessionEvents.some((e) => e.eventType === "complete")).toBe(true);
  });
});
