import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";
import * as notification from "./_core/notification";

// Mock the database and notification functions
vi.mock("./db", () => ({
  createLead: vi.fn(),
  getAllLeads: vi.fn(),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("leads.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully submits a valid lead", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const leadData = {
      firstName: "John",
      email: "john@example.com",
      phone: "5551234567",
      propertyZip: "75001",
    };

    vi.mocked(db.createLead).mockResolvedValue(undefined);
    vi.mocked(notification.notifyOwner).mockResolvedValue(true);

    const result = await caller.leads.submit(leadData);

    expect(result).toEqual({ success: true });
    expect(db.createLead).toHaveBeenCalledWith({
      firstName: "John",
      email: "john@example.com",
      phone: "5551234567",
      propertyZip: "75001",
      source: "landing_page",
      status: "new",
    });
    expect(notification.notifyOwner).toHaveBeenCalledWith({
      title: "New Foreclosure Lead",
      content: expect.stringContaining("John"),
    });
  });

  it("validates required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        firstName: "",
        email: "john@example.com",
        phone: "5551234567",
        propertyZip: "75001",
      })
    ).rejects.toThrow();

    await expect(
      caller.leads.submit({
        firstName: "John",
        email: "invalid-email",
        phone: "5551234567",
        propertyZip: "75001",
      })
    ).rejects.toThrow();

    await expect(
      caller.leads.submit({
        firstName: "John",
        email: "john@example.com",
        phone: "123",
        propertyZip: "75001",
      })
    ).rejects.toThrow();

    await expect(
      caller.leads.submit({
        firstName: "John",
        email: "john@example.com",
        phone: "5551234567",
        propertyZip: "123",
      })
    ).rejects.toThrow();
  });

  it("handles database errors gracefully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const leadData = {
      firstName: "John",
      email: "john@example.com",
      phone: "5551234567",
      propertyZip: "75001",
    };

    vi.mocked(db.createLead).mockRejectedValue(new Error("Database error"));

    await expect(caller.leads.submit(leadData)).rejects.toThrow(
      "Failed to submit lead. Please try again."
    );
  });
});
