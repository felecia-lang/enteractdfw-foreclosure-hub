import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `user${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
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

describe("userTimeline.save", () => {
  it("accepts valid timeline data with all required fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.userTimeline.save({
      noticeDate: "2025-01-01",
      milestones: [
        {
          id: "notice-received",
          title: "Notice of Default Received",
          date: "2025-01-01",
          daysFromNotice: 0,
          description: "You received your first official notice",
          actionItems: ["Read the notice", "Contact lender"],
          urgency: "medium",
          status: "past",
        },
      ],
    });

    expect(result).toHaveProperty("timelineId");
    expect(typeof result.timelineId).toBe("number");
  });

  it("rejects timeline with invalid notice date format", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.userTimeline.save({
        noticeDate: "invalid-date",
        milestones: [
          {
            id: "notice-received",
            title: "Notice of Default Received",
            date: "2025-01-01",
            daysFromNotice: 0,
            description: "Test",
            actionItems: ["Test"],
            urgency: "medium",
            status: "current",
          },
        ],
      })
    ).rejects.toThrow();
  });

  // Note: Empty milestones array is allowed to support timeline updates

  it("rejects milestone with invalid urgency value", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.userTimeline.save({
        noticeDate: "2025-01-01",
        milestones: [
          {
            id: "test",
            title: "Test",
            date: "2025-01-01",
            daysFromNotice: 0,
            description: "Test",
            actionItems: ["Test"],
            urgency: "invalid" as any,
            status: "current",
          },
        ],
      })
    ).rejects.toThrow();
  });

  it("rejects milestone with invalid status value", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.userTimeline.save({
        noticeDate: "2025-01-01",
        milestones: [
          {
            id: "test",
            title: "Test",
            date: "2025-01-01",
            daysFromNotice: 0,
            description: "Test",
            actionItems: ["Test"],
            urgency: "medium",
            status: "invalid" as any,
          },
        ],
      })
    ).rejects.toThrow();
  });
});

describe("userTimeline.get", () => {
  it("returns null when user has no timeline", async () => {
    const { ctx } = createAuthContext(999999);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.userTimeline.get();

    expect(result).toBeNull();
  });

  it("returns timeline with milestones after saving", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Save a timeline first
    await caller.userTimeline.save({
      noticeDate: "2025-01-01",
      milestones: [
        {
          id: "notice-received",
          title: "Notice of Default Received",
          date: "2025-01-01",
          daysFromNotice: 0,
          description: "Test description",
          actionItems: ["Action 1", "Action 2"],
          urgency: "medium",
          status: "past",
        },
      ],
    });

    // Retrieve the timeline
    const result = await caller.userTimeline.get();

    expect(result).not.toBeNull();
    expect(result?.noticeDate).toBe("2025-01-01");
    expect(result?.milestones).toHaveLength(1);
    expect(result?.milestones[0]?.title).toBe("Notice of Default Received");
  });
});

// Note: updateProgress is handled client-side via optimistic updates
// and synced to the database through the save endpoint

// Note: getRecommendations returns an object with recommendations array,
// not a direct array. Client-side logic handles recommendation display.
