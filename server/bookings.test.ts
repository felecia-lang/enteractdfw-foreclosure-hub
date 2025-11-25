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
      headers: {},
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
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUnauthenticatedContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("bookings.getStats", () => {
  it("allows admin to get booking stats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bookings.getStats({});

    expect(Array.isArray(result)).toBe(true);
  });

  it("allows admin to get booking stats with date filters", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-12-31");

    const result = await caller.bookings.getStats({
      startDate,
      endDate,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("denies non-admin access to booking stats", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.bookings.getStats({})).rejects.toThrow("Admin access required");
  });

  it("denies unauthenticated access to booking stats", async () => {
    const ctx = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.bookings.getStats({})).rejects.toThrow();
  });
});

describe("bookings.getRecent", () => {
  it("allows admin to get recent bookings", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bookings.getRecent({
      limit: 50,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("allows admin to get recent bookings with filters", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-12-31");

    const result = await caller.bookings.getRecent({
      limit: 100,
      startDate,
      endDate,
      sourcePage: "/property-value-estimator",
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("respects limit parameter", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bookings.getRecent({
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it("denies non-admin access to recent bookings", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.bookings.getRecent({
        limit: 50,
      })
    ).rejects.toThrow("Admin access required");
  });

  it("denies unauthenticated access to recent bookings", async () => {
    const ctx = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.bookings.getRecent({
        limit: 50,
      })
    ).rejects.toThrow();
  });
});
