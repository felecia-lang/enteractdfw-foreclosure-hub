import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
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

describe("cashOffers.submit", () => {
  it("successfully submits a cash offer request with all required fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const testData = {
      fullName: "John Smith",
      email: "john.smith@example.com",
      phone: "214-555-1234",
      street: "456 Oak Avenue",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      yearBuilt: 1995,
      condition: "good" as const,
      additionalNotes: "Recently updated kitchen",
    };

    const result = await caller.cashOffers.submit(testData);

    expect(result).toEqual({ 
      success: true,
      message: "Your cash offer request has been submitted successfully!"
    });
  });

  it("successfully submits a cash offer request without optional notes", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const testData = {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "972-555-5678",
      street: "123 Main Street",
      city: "Fort Worth",
      state: "TX",
      zipCode: "76102",
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2200,
      yearBuilt: 2005,
      condition: "excellent" as const,
    };

    const result = await caller.cashOffers.submit(testData);

    expect(result).toEqual({ 
      success: true,
      message: "Your cash offer request has been submitted successfully!"
    });
  });

  it("validates required fields are present", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Missing required fields should throw validation error
    const invalidData = {
      fullName: "Test User",
      // Missing other required fields
    } as any;

    await expect(caller.cashOffers.submit(invalidData)).rejects.toThrow();
  });
});
