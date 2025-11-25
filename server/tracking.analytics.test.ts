import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const adminUser: AuthenticatedUser = {
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
    user: adminUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createNonAdminContext(): { ctx: TrpcContext } {
  const regularUser: AuthenticatedUser = {
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

  const ctx: TrpcContext = {
    user: regularUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("tracking.getCallVolumeByDate", () => {
  it("returns call volume data for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tracking.getCallVolumeByDate({});

    expect(Array.isArray(result)).toBe(true);
    // Result can be empty if no data exists
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("date");
      expect(result[0]).toHaveProperty("callCount");
      expect(typeof result[0].callCount).toBe("number");
    }
  });

  it("filters by start date", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const startDate = new Date("2024-01-01");
    const result = await caller.tracking.getCallVolumeByDate({
      startDate,
    });

    expect(Array.isArray(result)).toBe(true);
    // All dates should be >= startDate
    result.forEach((item) => {
      const itemDate = new Date(item.date);
      expect(itemDate >= startDate).toBe(true);
    });
  });

  it("filters by end date", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const endDate = new Date("2025-12-31");
    const result = await caller.tracking.getCallVolumeByDate({
      endDate,
    });

    expect(Array.isArray(result)).toBe(true);
    // All dates should be <= endDate
    result.forEach((item) => {
      const itemDate = new Date(item.date);
      expect(itemDate <= endDate).toBe(true);
    });
  });

  it("filters by date range", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const startDate = new Date("2024-01-01");
    const endDate = new Date("2025-12-31");
    const result = await caller.tracking.getCallVolumeByDate({
      startDate,
      endDate,
    });

    expect(Array.isArray(result)).toBe(true);
    // All dates should be within range
    result.forEach((item) => {
      const itemDate = new Date(item.date);
      expect(itemDate >= startDate).toBe(true);
      expect(itemDate <= endDate).toBe(true);
    });
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.tracking.getCallVolumeByDate({})
    ).rejects.toThrow("Admin access required");
  });
});

describe("tracking.getRecentCalls with filters", () => {
  it("returns filtered calls for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tracking.getRecentCalls({
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it("filters by start date", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const startDate = new Date("2024-01-01");
    const result = await caller.tracking.getRecentCalls({
      limit: 50,
      startDate,
    });

    expect(Array.isArray(result)).toBe(true);
    // All calls should be >= startDate
    result.forEach((call) => {
      expect(new Date(call.clickedAt) >= startDate).toBe(true);
    });
  });

  it("filters by end date", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const endDate = new Date("2025-12-31");
    const result = await caller.tracking.getRecentCalls({
      limit: 50,
      endDate,
    });

    expect(Array.isArray(result)).toBe(true);
    // All calls should be <= endDate
    result.forEach((call) => {
      expect(new Date(call.clickedAt) <= endDate).toBe(true);
    });
  });

  it("filters by page path", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tracking.getRecentCalls({
      limit: 50,
      pagePath: "/property-value-estimator",
    });

    expect(Array.isArray(result)).toBe(true);
    // All calls should be from the specified page
    result.forEach((call) => {
      expect(call.pagePath).toBe("/property-value-estimator");
    });
  });

  it("combines multiple filters", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const startDate = new Date("2024-01-01");
    const endDate = new Date("2025-12-31");
    const result = await caller.tracking.getRecentCalls({
      limit: 20,
      startDate,
      endDate,
      pagePath: "/",
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(20);
    
    // Verify all filters are applied
    result.forEach((call) => {
      const callDate = new Date(call.clickedAt);
      expect(callDate >= startDate).toBe(true);
      expect(callDate <= endDate).toBe(true);
      expect(call.pagePath).toBe("/");
    });
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.tracking.getRecentCalls({ limit: 10 })
    ).rejects.toThrow("Admin access required");
  });
});

describe("Analytics data integrity", () => {
  it("call volume dates are in descending order", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tracking.getCallVolumeByDate({});

    if (result.length > 1) {
      for (let i = 0; i < result.length - 1; i++) {
        const currentDate = new Date(result[i].date);
        const nextDate = new Date(result[i + 1].date);
        expect(currentDate >= nextDate).toBe(true);
      }
    }
  });

  it("recent calls are in descending order by date", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tracking.getRecentCalls({ limit: 50 });

    if (result.length > 1) {
      for (let i = 0; i < result.length - 1; i++) {
        const currentDate = new Date(result[i].clickedAt);
        const nextDate = new Date(result[i + 1].clickedAt);
        expect(currentDate >= nextDate).toBe(true);
      }
    }
  });

  it("call counts are positive numbers", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const volumeData = await caller.tracking.getCallVolumeByDate({});
    const callStats = await caller.tracking.getCallStats();

    volumeData.forEach((item) => {
      expect(item.callCount).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(item.callCount)).toBe(true);
    });

    callStats.forEach((stat) => {
      expect(Number(stat.callCount)).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(Number(stat.callCount))).toBe(true);
    });
  });
});
