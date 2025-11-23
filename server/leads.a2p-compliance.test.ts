import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createLead: vi.fn().mockResolvedValue(undefined),
  getAllLeads: vi.fn().mockResolvedValue([]),
  getLeadById: vi.fn().mockResolvedValue(null),
  updateLeadStatus: vi.fn().mockResolvedValue(undefined),
  updateLeadNotes: vi.fn().mockResolvedValue(undefined),
  getLeadNotes: vi.fn().mockResolvedValue([]),
  createLeadNote: vi.fn().mockResolvedValue(undefined),
  createTestimonial: vi.fn().mockResolvedValue(undefined),
  getAllTestimonials: vi.fn().mockResolvedValue([]),
  getTestimonialsByStatus: vi.fn().mockResolvedValue([]),
  updateTestimonialStatus: vi.fn().mockResolvedValue(undefined),
  updateTestimonial: vi.fn().mockResolvedValue(undefined),
  deleteTestimonial: vi.fn().mockResolvedValue(undefined),
}));

// Mock the notification function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the GHL functions
vi.mock("./ghl", () => ({
  syncLeadToGHL: vi.fn().mockResolvedValue({ success: true, contactId: "test-contact-id" }),
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}));

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("A2P Compliance - Lead Submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should accept lead submission with SMS consent = true", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submit({
      firstName: "John",
      email: "john@example.com",
      phone: "(832) 555-1234",
      propertyZip: "75001",
      smsConsent: true,
    });

    expect(result).toEqual({ success: true });

    // Verify createLead was called with smsConsent = "yes"
    const { createLead } = await import("./db");
    expect(createLead).toHaveBeenCalledWith({
      firstName: "John",
      email: "john@example.com",
      phone: "(832) 555-1234",
      propertyZip: "75001",
      smsConsent: "yes",
      source: "landing_page",
      status: "new",
    });
  });

  it("should accept lead submission with SMS consent = false", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submit({
      firstName: "Jane",
      email: "jane@example.com",
      phone: "(832) 555-5678",
      propertyZip: "75002",
      smsConsent: false,
    });

    expect(result).toEqual({ success: true });

    // Verify createLead was called with smsConsent = "no"
    const { createLead } = await import("./db");
    expect(createLead).toHaveBeenCalledWith({
      firstName: "Jane",
      email: "jane@example.com",
      phone: "(832) 555-5678",
      propertyZip: "75002",
      smsConsent: "no",
      source: "landing_page",
      status: "new",
    });
  });

  it("should reject lead submission without smsConsent field", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        firstName: "Test",
        email: "test@example.com",
        phone: "(832) 555-9999",
        propertyZip: "75003",
        // @ts-expect-error - Testing missing required field
        // smsConsent field is intentionally omitted
      })
    ).rejects.toThrow();
  });

  it("should send owner notification with lead details", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.leads.submit({
      firstName: "Sarah",
      email: "sarah@example.com",
      phone: "(832) 555-1111",
      propertyZip: "75004",
      smsConsent: true,
    });

    const { notifyOwner } = await import("./_core/notification");
    expect(notifyOwner).toHaveBeenCalledWith({
      title: "New Foreclosure Lead",
      content: expect.stringContaining("Sarah"),
    });
  });

  it("should sync lead to GHL CRM after submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.leads.submit({
      firstName: "Michael",
      email: "michael@example.com",
      phone: "(832) 555-2222",
      propertyZip: "75005",
      smsConsent: true,
    });

    const { syncLeadToGHL } = await import("./ghl");
    expect(syncLeadToGHL).toHaveBeenCalledWith({
      firstName: "Michael",
      email: "michael@example.com",
      phone: "(832) 555-2222",
      propertyZip: "75005",
      source: "Website - Landing Page",
    });
  });

  it("should handle valid phone numbers with different formats", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const phoneFormats = [
      "(832) 555-1234",
      "832-555-1234",
      "8325551234",
      "+1 832 555 1234",
    ];

    for (const phone of phoneFormats) {
      const result = await caller.leads.submit({
        firstName: "Test",
        email: "test@example.com",
        phone,
        propertyZip: "75001",
        smsConsent: true,
      });

      expect(result).toEqual({ success: true });
    }
  });

  it("should reject invalid email addresses", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        firstName: "Test",
        email: "not-an-email",
        phone: "(832) 555-1234",
        propertyZip: "75001",
        smsConsent: true,
      })
    ).rejects.toThrow();
  });

  it("should reject empty first name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        firstName: "",
        email: "test@example.com",
        phone: "(832) 555-1234",
        propertyZip: "75001",
        smsConsent: true,
      })
    ).rejects.toThrow();
  });

  it("should reject invalid ZIP codes", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        firstName: "Test",
        email: "test@example.com",
        phone: "(832) 555-1234",
        propertyZip: "123", // Too short
        smsConsent: true,
      })
    ).rejects.toThrow();
  });
});
