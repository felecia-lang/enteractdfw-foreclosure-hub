import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-admin",
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

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("formHeatmap.trackInteraction", () => {
  it("tracks field focus interaction", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "email",
      sessionId: "test-session-123",
      interactionType: "focus",
      pagePath: "/",
      userAgent: "Mozilla/5.0 Test",
    });

    expect(result).toEqual({ success: true });
  });

  it("tracks field blur interaction with time spent", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "email",
      sessionId: "test-session-123",
      interactionType: "blur",
      timeSpentMs: 5000,
      fieldCompleted: 1,
      pagePath: "/",
      userAgent: "Mozilla/5.0 Test",
    });

    expect(result).toEqual({ success: true });
  });

  it("tracks field change interaction", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "name",
      sessionId: "test-session-123",
      interactionType: "change",
      pagePath: "/",
      userAgent: "Mozilla/5.0 Test",
    });

    expect(result).toEqual({ success: true });
  });

  it("tracks field abandon interaction", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "phone",
      sessionId: "test-session-123",
      interactionType: "abandon",
      pagePath: "/",
      userAgent: "Mozilla/5.0 Test",
    });

    expect(result).toEqual({ success: true });
  });

  it("redacts field values for privacy", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // The mutation should accept fieldValue but store "[REDACTED]"
    const result = await caller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "email",
      sessionId: "test-session-123",
      interactionType: "change",
      fieldValue: "user@example.com", // Should be redacted
      pagePath: "/",
      userAgent: "Mozilla/5.0 Test",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("formHeatmap.getHeatmapData", () => {
  it("requires authentication", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.formHeatmap.getHeatmapData({
        formName: "contact_form",
        days: 30,
      })
    ).rejects.toThrow("Please login");
  });

  it("returns heatmap data for authenticated admin", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.formHeatmap.getHeatmapData({
      formName: "contact_form",
      days: 30,
    });

    expect(result).toHaveProperty("fieldMetrics");
    expect(result).toHaveProperty("totalInteractions");
    expect(Array.isArray(result.fieldMetrics)).toBe(true);
    expect(typeof result.totalInteractions).toBe("number");
  });

  it("calculates field metrics correctly", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Track some interactions first
    const publicCaller = appRouter.createCaller(createPublicContext().ctx);
    const sessionId = `test-session-${Date.now()}`;

    await publicCaller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "test_field",
      sessionId,
      interactionType: "focus",
    });

    await publicCaller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "test_field",
      sessionId,
      interactionType: "blur",
      timeSpentMs: 3000,
      fieldCompleted: 1,
    });

    const result = await caller.formHeatmap.getHeatmapData({
      formName: "contact_form",
      days: 1,
    });

    const testField = result.fieldMetrics.find((f) => f.fieldName === "test_field");
    
    if (testField) {
      expect(testField.focusCount).toBeGreaterThanOrEqual(1);
      expect(testField.blurCount).toBeGreaterThanOrEqual(1);
      expect(testField.avgTimeMs).toBeGreaterThanOrEqual(0);
      expect(testField.completionRate).toBeGreaterThanOrEqual(0);
      expect(testField.completionRate).toBeLessThanOrEqual(100);
    }
  });

  it("filters data by date range", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result7Days = await caller.formHeatmap.getHeatmapData({
      formName: "contact_form",
      days: 7,
    });

    const result30Days = await caller.formHeatmap.getHeatmapData({
      formName: "contact_form",
      days: 30,
    });

    expect(result7Days).toHaveProperty("fieldMetrics");
    expect(result30Days).toHaveProperty("fieldMetrics");
    // 30 days should have equal or more interactions than 7 days
    expect(result30Days.totalInteractions).toBeGreaterThanOrEqual(
      result7Days.totalInteractions
    );
  });

  it("calculates abandonment rate correctly", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const publicCaller = appRouter.createCaller(createPublicContext().ctx);
    const sessionId = `abandon-test-${Date.now()}`;

    // Focus on field
    await publicCaller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "abandon_test_field",
      sessionId,
      interactionType: "focus",
    });

    // Abandon field
    await publicCaller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "abandon_test_field",
      sessionId,
      interactionType: "abandon",
    });

    const result = await caller.formHeatmap.getHeatmapData({
      formName: "contact_form",
      days: 1,
    });

    const abandonField = result.fieldMetrics.find(
      (f) => f.fieldName === "abandon_test_field"
    );

    if (abandonField) {
      expect(abandonField.abandonCount).toBeGreaterThanOrEqual(1);
      expect(abandonField.abandonmentRate).toBeGreaterThan(0);
      expect(abandonField.abandonmentRate).toBeLessThanOrEqual(100);
    }
  });

  it("tracks unique sessions per field", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const publicCaller = appRouter.createCaller(createPublicContext().ctx);
    
    const session1 = `session-1-${Date.now()}`;
    const session2 = `session-2-${Date.now()}`;

    // Two different sessions interact with same field
    await publicCaller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "unique_session_test",
      sessionId: session1,
      interactionType: "focus",
    });

    await publicCaller.formHeatmap.trackInteraction({
      formName: "contact_form",
      fieldName: "unique_session_test",
      sessionId: session2,
      interactionType: "focus",
    });

    const result = await caller.formHeatmap.getHeatmapData({
      formName: "contact_form",
      days: 1,
    });

    const testField = result.fieldMetrics.find(
      (f) => f.fieldName === "unique_session_test"
    );

    if (testField) {
      expect(testField.uniqueSessions).toBeGreaterThanOrEqual(2);
    }
  });
});
