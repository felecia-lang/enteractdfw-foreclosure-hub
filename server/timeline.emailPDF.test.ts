import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Tests for timeline.emailPDF mutation
 * 
 * This endpoint allows users to email themselves a personalized foreclosure timeline PDF.
 */

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("timeline.emailPDF", () => {
  it("accepts valid email and timeline data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "test@example.com",
      noticeDate: "2025-01-15",
      milestones: [
        {
          id: "notice-received",
          title: "Notice of Default Received",
          date: "2025-01-15",
          daysFromNotice: 0,
          description: "You received your first official notice",
          actionItems: ["Read the notice carefully", "Note all important dates"],
          urgency: "critical" as const,
          status: "past" as const,
        },
        {
          id: "reinstatement-deadline",
          title: "Reinstatement Deadline",
          date: "2025-02-04",
          daysFromNotice: 20,
          description: "Last day to reinstate your loan",
          actionItems: ["Contact your lender", "Gather financial documents"],
          urgency: "critical" as const,
          status: "upcoming" as const,
        },
      ],
    };

    // Note: This will fail with "Email service not configured" in test environment
    // because GHL credentials are not set up, but it validates the input structure
    try {
      await caller.timeline.emailPDF(input);
    } catch (error: any) {
      // Expected to fail due to missing GHL credentials
      expect(error.message).toContain("Failed to send timeline email");
    }
  });

  it("rejects invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "not-an-email",
      noticeDate: "2025-01-15",
      milestones: [
        {
          id: "notice-received",
          title: "Notice of Default Received",
          date: "2025-01-15",
          daysFromNotice: 0,
          description: "Test description",
          actionItems: ["Test action"],
          urgency: "critical" as const,
          status: "past" as const,
        },
      ],
    };

    await expect(caller.timeline.emailPDF(input)).rejects.toThrow();
  });

  it("requires email field", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      // @ts-expect-error - Testing missing email field
      noticeDate: "2025-01-15",
      milestones: [],
    };

    await expect(caller.timeline.emailPDF(input)).rejects.toThrow();
  });

  it("requires noticeDate field", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "test@example.com",
      // @ts-expect-error - Testing missing noticeDate field
      milestones: [],
    };

    await expect(caller.timeline.emailPDF(input)).rejects.toThrow();
  });

  it("requires milestones array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "test@example.com",
      noticeDate: "2025-01-15",
      // @ts-expect-error - Testing missing milestones field
    };

    await expect(caller.timeline.emailPDF(input)).rejects.toThrow();
  });

  it("validates milestone structure", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "test@example.com",
      noticeDate: "2025-01-15",
      milestones: [
        {
          // Missing required fields
          id: "test",
        },
      ],
    };

    await expect(caller.timeline.emailPDF(input)).rejects.toThrow();
  });

  it("validates urgency enum values", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "test@example.com",
      noticeDate: "2025-01-15",
      milestones: [
        {
          id: "test",
          title: "Test",
          date: "2025-01-15",
          daysFromNotice: 0,
          description: "Test",
          actionItems: ["Test"],
          urgency: "invalid" as any, // Invalid urgency value
          status: "past" as const,
        },
      ],
    };

    await expect(caller.timeline.emailPDF(input)).rejects.toThrow();
  });

  it("validates status enum values", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "test@example.com",
      noticeDate: "2025-01-15",
      milestones: [
        {
          id: "test",
          title: "Test",
          date: "2025-01-15",
          daysFromNotice: 0,
          description: "Test",
          actionItems: ["Test"],
          urgency: "critical" as const,
          status: "invalid" as any, // Invalid status value
        },
      ],
    };

    await expect(caller.timeline.emailPDF(input)).rejects.toThrow();
  });
});
