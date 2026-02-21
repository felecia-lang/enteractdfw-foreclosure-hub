import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock dependencies
vi.mock("./db", () => ({
  createLead: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./ghl", () => ({
  syncContactToGHL: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("calculator.requestActionPlanPdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully process action plan request with valid data", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "homeowner@example.com",
      timelineData: {
        noticeDate: "2025-01-15",
        saleDate: "2025-05-20",
        daysUntilSale: 125,
        keyDates: [
          {
            date: "2025-01-15",
            event: "Notice of Default Received",
            description: "You received your first official notice",
          },
          {
            date: "2025-05-20",
            event: "Foreclosure Sale Date",
            description: "Property will be sold at auction",
          },
        ],
      },
    };

    const result = await caller.calculator.requestActionPlanPdf(input);

    expect(result).toEqual({
      success: true,
      message: "Action plan sent to your email",
    });
  });

  it("should reject invalid email addresses", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "invalid-email",
      timelineData: {
        noticeDate: "2025-01-15",
        saleDate: "2025-05-20",
        daysUntilSale: 125,
        keyDates: [],
      },
    };

    await expect(caller.calculator.requestActionPlanPdf(input)).rejects.toThrow();
  });

  it("should handle missing timeline data gracefully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "homeowner@example.com",
      timelineData: {
        noticeDate: "",
        saleDate: "",
        daysUntilSale: 0,
        keyDates: [],
      },
    };

    // Should still succeed even with minimal data
    const result = await caller.calculator.requestActionPlanPdf(input);

    expect(result).toEqual({
      success: true,
      message: "Action plan sent to your email",
    });
  });

  it("should create lead with correct source tracking", async () => {
    const { createLead } = await import("./db");
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "homeowner@example.com",
      timelineData: {
        noticeDate: "2025-01-15",
        saleDate: "2025-05-20",
        daysUntilSale: 125,
        keyDates: [],
      },
    };

    await caller.calculator.requestActionPlanPdf(input);

    expect(createLead).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "homeowner@example.com",
        source: "timeline_calculator_pdf",
        status: "new",
      })
    );
  });

  it("should sync contact to GHL with timeline data", async () => {
    const { syncContactToGHL } = await import("./ghl");
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "homeowner@example.com",
      timelineData: {
        noticeDate: "2025-01-15",
        saleDate: "2025-05-20",
        daysUntilSale: 125,
        keyDates: [],
      },
    };

    await caller.calculator.requestActionPlanPdf(input);

    expect(syncContactToGHL).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "homeowner@example.com",
        tags: ["Timeline Calculator", "Action Plan PDF Request"],
        customFields: expect.arrayContaining([
          { key: "notice_date", field_value: "2025-01-15" },
          { key: "sale_date", field_value: "2025-05-20" },
          { key: "days_until_sale", field_value: "125" },
        ]),
      })
    );
  });

  it("should notify owner of new calculator lead", async () => {
    const { notifyOwner } = await import("./_core/notification");
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      email: "homeowner@example.com",
      timelineData: {
        noticeDate: "2025-01-15",
        saleDate: "2025-05-20",
        daysUntilSale: 125,
        keyDates: [],
      },
    };

    await caller.calculator.requestActionPlanPdf(input);

    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New Calculator Lead: Action Plan PDF Request",
        content: expect.stringContaining("homeowner@example.com"),
      })
    );
  });
});
