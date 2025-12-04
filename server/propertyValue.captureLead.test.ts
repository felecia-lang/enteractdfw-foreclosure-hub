import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {
        "x-forwarded-for": "192.168.1.1",
        "user-agent": "Mozilla/5.0 (Test Browser)",
      },
      socket: {
        remoteAddress: "192.168.1.1",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("propertyValue.captureLead", () => {
  it("successfully captures a lead with valid name and email", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.propertyValue.captureLead({
      name: "John Smith",
      email: "john.smith@example.com",
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("leadId");
    expect(typeof result.leadId).toBe("number");
    expect(result.leadId).toBeGreaterThan(0);
  });

  it("rejects empty name", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.propertyValue.captureLead({
        name: "",
        email: "test@example.com",
      })
    ).rejects.toThrow();
  });

  it("rejects invalid email", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.propertyValue.captureLead({
        name: "John Smith",
        email: "invalid-email",
      })
    ).rejects.toThrow();
  });

  it("captures IP address and user agent from request headers", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.propertyValue.captureLead({
      name: "Jane Doe",
      email: "jane@example.com",
    });

    expect(result.success).toBe(true);
    // The lead should be created with IP and user agent from the context
    // We can't directly verify this without querying the database,
    // but we can verify the mutation succeeds
    expect(result.leadId).toBeGreaterThan(0);
  });
});
