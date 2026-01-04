import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock fetch globally
global.fetch = vi.fn();

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("LeadConnector Webhook Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully send contact form data to LeadConnector webhook", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Mock successful webhook response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
    });

    const result = await caller.webhook.submitLeadConnector({
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      message: "I need help with foreclosure",
      website: "", // Empty honeypot field
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Message sent successfully");

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://services.leadconnectorhq.com/hooks/osAdvkBAK96qwKch9fZJ/webhook-trigger/06581439-5d02-42ee-9ef6-5de691fc7b99",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.stringContaining('"name":"John Doe"'),
      })
    );

    // Verify the body contains all required fields
    const callArgs = (global.fetch as any).mock.calls[0];
    const bodyData = JSON.parse(callArgs[1].body);
    expect(bodyData.name).toBe("John Doe");
    expect(bodyData.email).toBe("john@example.com");
    expect(bodyData.phone).toBe("(555) 123-4567");
    expect(bodyData.message).toBe("I need help with foreclosure");
    expect(bodyData.timestamp).toBeDefined();
  });

  it("should reject submission with filled honeypot field", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.webhook.submitLeadConnector({
        name: "John Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
        message: "I need help",
        website: "https://spam-site.com", // Filled honeypot = spam
      })
    ).rejects.toThrow("Invalid submission");

    // Fetch should not be called if honeypot is filled
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should accept submission with empty honeypot field", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const result = await caller.webhook.submitLeadConnector({
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      message: "I need help",
      website: "", // Empty honeypot = legitimate
    });

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should accept submission with undefined honeypot field", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const result = await caller.webhook.submitLeadConnector({
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      message: "I need help",
      // website field omitted
    });

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should reject submission with invalid email", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.webhook.submitLeadConnector({
        name: "John Doe",
        email: "invalid-email",
        phone: "(555) 123-4567",
        message: "I need help",
        website: "",
      })
    ).rejects.toThrow();

    // Fetch should not be called if validation fails
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should reject submission with missing name", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.webhook.submitLeadConnector({
        name: "",
        email: "john@example.com",
        phone: "(555) 123-4567",
        message: "I need help",
        website: "",
      })
    ).rejects.toThrow();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should reject submission with missing phone", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.webhook.submitLeadConnector({
        name: "John Doe",
        email: "john@example.com",
        phone: "",
        message: "I need help",
        website: "",
      })
    ).rejects.toThrow();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should reject submission with missing message", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.webhook.submitLeadConnector({
        name: "John Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
        message: "",
        website: "",
      })
    ).rejects.toThrow();

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should handle webhook failure gracefully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Mock failed webhook response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(
      caller.webhook.submitLeadConnector({
        name: "John Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
        message: "I need help",
        website: "",
      })
    ).rejects.toThrow("Failed to send message. Please try again later.");

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should handle network errors gracefully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Mock network error
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

    await expect(
      caller.webhook.submitLeadConnector({
        name: "John Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
        message: "I need help",
        website: "",
      })
    ).rejects.toThrow("Failed to send message. Please try again later.");

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should include timestamp in webhook payload", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const beforeTime = new Date().toISOString();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    await caller.webhook.submitLeadConnector({
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(555) 987-6543",
      message: "Question about options",
      website: "",
    });

    const afterTime = new Date().toISOString();

    const callArgs = (global.fetch as any).mock.calls[0];
    const bodyData = JSON.parse(callArgs[1].body);
    
    expect(bodyData.timestamp).toBeDefined();
    expect(bodyData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(bodyData.timestamp >= beforeTime).toBe(true);
    expect(bodyData.timestamp <= afterTime).toBe(true);
  });
});
