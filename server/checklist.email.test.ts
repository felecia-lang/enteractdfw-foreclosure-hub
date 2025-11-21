import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("checklist.emailToUser", () => {
  it("accepts valid email and checklist data", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.checklist.emailToUser({
      email: "test@example.com",
      checklistData: {
        checkedItems: [
          "Locate the date the notice was sent or posted",
          "Find the total amount needed to cure the default",
          "Note the deadline to cure the default",
        ],
        timestamp: new Date().toISOString(),
      },
    });

    expect(result).toEqual({
      success: true,
      message: "Checklist sent to test@example.com",
    });
  });

  it("handles empty checklist", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.checklist.emailToUser({
      email: "test@example.com",
      checklistData: {
        checkedItems: [],
        timestamp: new Date().toISOString(),
      },
    });

    expect(result).toEqual({
      success: true,
      message: "Checklist sent to test@example.com",
    });
  });

  it("rejects invalid email format", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.checklist.emailToUser({
        email: "invalid-email",
        checklistData: {
          checkedItems: ["Test item"],
          timestamp: new Date().toISOString(),
        },
      })
    ).rejects.toThrow();
  });

  it("handles large number of checked items", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const manyItems = Array.from({ length: 50 }, (_, i) => `Checklist item ${i + 1}`);

    const result = await caller.checklist.emailToUser({
      email: "test@example.com",
      checklistData: {
        checkedItems: manyItems,
        timestamp: new Date().toISOString(),
      },
    });

    expect(result.success).toBe(true);
  });
});
