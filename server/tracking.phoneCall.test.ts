import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {
        "x-forwarded-for": "192.168.1.100",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "john@example.com",
    name: "John Doe",
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
        "x-forwarded-for": "192.168.1.100",
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "admin-user-456",
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
        "x-forwarded-for": "10.0.0.1",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("tracking.trackPhoneCall", () => {
  it("should track phone call from unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tracking.trackPhoneCall({
      phoneNumber: "832-346-9569",
      pagePath: "/",
      pageTitle: "EnterActDFW - Home",
    });

    expect(result).toEqual({ success: true });
  });

  it("should track phone call from authenticated user with email", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tracking.trackPhoneCall({
      phoneNumber: "832-346-9569",
      pagePath: "/property-value-estimator",
      pageTitle: "Property Value Estimator",
    });

    expect(result).toEqual({ success: true });
  });

  it("should track phone call without page title", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tracking.trackPhoneCall({
      phoneNumber: "832-346-9569",
      pagePath: "/knowledge-base",
    });

    expect(result).toEqual({ success: true });
  });

  it("should track calls from different pages", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const pages = [
      { path: "/", title: "Home" },
      { path: "/property-value-estimator", title: "Property Value Estimator" },
      { path: "/timeline-calculator", title: "Timeline Calculator" },
      { path: "/knowledge-base", title: "Knowledge Base" },
      { path: "/thank-you", title: "Thank You" },
    ];

    for (const page of pages) {
      const result = await caller.tracking.trackPhoneCall({
        phoneNumber: "832-346-9569",
        pagePath: page.path,
        pageTitle: page.title,
      });

      expect(result).toEqual({ success: true });
    }
  });

  it("should handle different phone number formats", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const phoneFormats = [
      "832-346-9569",
      "(832) 932-7585",
      "8329327585",
      "+1-832-346-9569",
    ];

    for (const phone of phoneFormats) {
      const result = await caller.tracking.trackPhoneCall({
        phoneNumber: phone,
        pagePath: "/",
        pageTitle: "Home",
      });

      expect(result).toEqual({ success: true });
    }
  });
});

describe("tracking.getCallStats", () => {
  it("should return call statistics for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First, track some calls
    await caller.tracking.trackPhoneCall({
      phoneNumber: "832-346-9569",
      pagePath: "/",
      pageTitle: "Home",
    });

    await caller.tracking.trackPhoneCall({
      phoneNumber: "832-346-9569",
      pagePath: "/property-value-estimator",
      pageTitle: "Property Value Estimator",
    });

    // Get stats
    const stats = await caller.tracking.getCallStats();

    expect(Array.isArray(stats)).toBe(true);
    expect(stats.length).toBeGreaterThan(0);
    
    // Verify stats structure
    if (stats.length > 0) {
      expect(stats[0]).toHaveProperty("pagePath");
      expect(stats[0]).toHaveProperty("callCount");
    }
  });

  it("should reject non-admin users from viewing stats", async () => {
    const ctx = createAuthContext(); // Regular user, not admin
    const caller = appRouter.createCaller(ctx);

    await expect(caller.tracking.getCallStats()).rejects.toThrow("Admin access required");
  });

  it("should reject unauthenticated users from viewing stats", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.tracking.getCallStats()).rejects.toThrow();
  });
});

describe("tracking.getRecentCalls", () => {
  it("should return recent calls for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Track a call first
    await caller.tracking.trackPhoneCall({
      phoneNumber: "832-346-9569",
      pagePath: "/timeline-calculator",
      pageTitle: "Timeline Calculator",
    });

    // Get recent calls
    const calls = await caller.tracking.getRecentCalls({ limit: 10 });

    expect(Array.isArray(calls)).toBe(true);
    expect(calls.length).toBeGreaterThan(0);
    
    // Verify call structure
    if (calls.length > 0) {
      expect(calls[0]).toHaveProperty("phoneNumber");
      expect(calls[0]).toHaveProperty("pagePath");
      expect(calls[0]).toHaveProperty("clickedAt");
    }
  });

  it("should respect limit parameter", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const calls = await caller.tracking.getRecentCalls({ limit: 5 });

    expect(Array.isArray(calls)).toBe(true);
    expect(calls.length).toBeLessThanOrEqual(5);
  });

  it("should use default limit of 50", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const calls = await caller.tracking.getRecentCalls({});

    expect(Array.isArray(calls)).toBe(true);
    expect(calls.length).toBeLessThanOrEqual(50);
  });

  it("should reject non-admin users from viewing recent calls", async () => {
    const ctx = createAuthContext(); // Regular user
    const caller = appRouter.createCaller(ctx);

    await expect(caller.tracking.getRecentCalls({ limit: 10 })).rejects.toThrow("Admin access required");
  });

  it("should reject unauthenticated users from viewing recent calls", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.tracking.getRecentCalls({ limit: 10 })).rejects.toThrow();
  });
});
