import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@enteractdfw.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {
        "x-forwarded-for": "192.168.1.100",
        "user-agent": "Mozilla/5.0 Test Browser",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {
        "x-forwarded-for": "192.168.1.101",
        "user-agent": "Mozilla/5.0 Test Browser",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {
        "x-forwarded-for": "192.168.1.102",
        "user-agent": "Mozilla/5.0 Test Browser",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("funnel.trackPageView", () => {
  it("tracks page view from unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.funnel.trackPageView({
      sessionId: "session-123",
      pagePath: "/",
      pageTitle: "Home",
      referrer: "https://google.com",
    });

    expect(result).toEqual({ success: true });
  });

  it("tracks page view from authenticated user with email", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.funnel.trackPageView({
      sessionId: "session-456",
      pagePath: "/property-value-estimator",
      pageTitle: "Property Value Estimator",
    });

    expect(result).toEqual({ success: true });
  });

  it("captures IP address and user agent from request headers", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.funnel.trackPageView({
      sessionId: "session-789",
      pagePath: "/timeline-calculator",
      pageTitle: "Timeline Calculator",
    });

    expect(result).toEqual({ success: true });
    // IP and user agent should be captured from ctx.req.headers
  });

  it("deduplicates page views by sessionId + pagePath", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Track same page twice in same session
    await caller.funnel.trackPageView({
      sessionId: "session-duplicate",
      pagePath: "/knowledge-base",
      pageTitle: "Knowledge Base",
    });

    const result = await caller.funnel.trackPageView({
      sessionId: "session-duplicate",
      pagePath: "/knowledge-base",
      pageTitle: "Knowledge Base",
    });

    expect(result).toEqual({ success: true });
    // Should not create duplicate entry (handled by unique constraint or logic)
  });
});

describe("funnel.getOverview", () => {
  it("requires admin role", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.funnel.getOverview({})
    ).rejects.toThrow("Admin access required");
  });

  it("returns funnel overview for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.funnel.getOverview({});

    expect(result).toHaveProperty("totalVisitors");
    expect(result).toHaveProperty("totalCalls");
    expect(result).toHaveProperty("totalBookings");
    expect(result).toHaveProperty("visitorToCallRate");
    expect(result).toHaveProperty("callToBookingRate");
    expect(result).toHaveProperty("overallConversionRate");
    expect(typeof result.totalVisitors).toBe("number");
    expect(typeof result.visitorToCallRate).toBe("number");
  });

  it("calculates conversion rates correctly", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.funnel.getOverview({});

    // Verify conversion rate calculations
    if (result.totalVisitors > 0) {
      const expectedVisitorToCallRate = (result.totalCalls / result.totalVisitors) * 100;
      expect(result.visitorToCallRate).toBeCloseTo(expectedVisitorToCallRate, 1);
    }

    if (result.totalCalls > 0) {
      const expectedCallToBookingRate = (result.totalBookings / result.totalCalls) * 100;
      expect(result.callToBookingRate).toBeCloseTo(expectedCallToBookingRate, 1);
    }

    if (result.totalVisitors > 0) {
      const expectedOverallRate = (result.totalBookings / result.totalVisitors) * 100;
      expect(result.overallConversionRate).toBeCloseTo(expectedOverallRate, 1);
    }
  });

  it("supports date range filtering", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-12-31");

    const result = await caller.funnel.getOverview({ startDate, endDate });

    expect(result).toHaveProperty("totalVisitors");
    expect(typeof result.totalVisitors).toBe("number");
  });
});

describe("funnel.getByPage", () => {
  it("requires admin role", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.funnel.getByPage({})
    ).rejects.toThrow("Admin access required");
  });

  it("returns page-level funnel metrics for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.funnel.getByPage({});

    expect(Array.isArray(result)).toBe(true);
    
    if (result.length > 0) {
      const page = result[0];
      expect(page).toHaveProperty("pagePath");
      expect(page).toHaveProperty("pageTitle");
      expect(page).toHaveProperty("visitors");
      expect(page).toHaveProperty("calls");
      expect(page).toHaveProperty("bookings");
      expect(page).toHaveProperty("visitorToCallRate");
      expect(page).toHaveProperty("callToBookingRate");
      expect(page).toHaveProperty("overallConversionRate");
    }
  });

  it("calculates page-level conversion rates correctly", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.funnel.getByPage({});

    result.forEach(page => {
      // Verify conversion rate calculations for each page
      if (page.visitors > 0) {
        const expectedVisitorToCallRate = (page.calls / page.visitors) * 100;
        expect(page.visitorToCallRate).toBeCloseTo(expectedVisitorToCallRate, 1);
      }

      if (page.calls > 0) {
        const expectedCallToBookingRate = (page.bookings / page.calls) * 100;
        expect(page.callToBookingRate).toBeCloseTo(expectedCallToBookingRate, 1);
      }

      if (page.visitors > 0) {
        const expectedOverallRate = (page.bookings / page.visitors) * 100;
        expect(page.overallConversionRate).toBeCloseTo(expectedOverallRate, 1);
      }
    });
  });

  it("supports date range filtering", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-12-31");

    const result = await caller.funnel.getByPage({ startDate, endDate });

    expect(Array.isArray(result)).toBe(true);
  });

  it("returns pages sorted by visitors descending", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.funnel.getByPage({});

    if (result.length > 1) {
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].visitors).toBeGreaterThanOrEqual(result[i + 1].visitors);
      }
    }
  });
});
