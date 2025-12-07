import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
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
      headers: {
        "x-forwarded-for": "192.168.1.1",
        "user-agent": "Test Agent",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("cashOffers.uploadPhoto", () => {
  it("successfully uploads a photo and returns S3 URL", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Create a small test image as base64
    // This is a 1x1 red pixel PNG
    const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

    const result = await caller.cashOffers.uploadPhoto({
      fileName: "test-photo.png",
      fileData: base64Data,
      contentType: "image/png",
    });

    expect(result.success).toBe(true);
    expect(result.url).toBeDefined();
    expect(result.url).toContain("cash-offers/photos/");
    expect(result.url).toContain("test-photo.png");
  });

  it("handles various base64 data formats", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Buffer.from() is forgiving with base64 - it processes what it can
    // This test verifies the upload succeeds even with unusual input
    const result = await caller.cashOffers.uploadPhoto({
      fileName: "test.png",
      fileData: "SGVsbG8gV29ybGQ=", // "Hello World" in base64
      contentType: "image/png",
    });

    expect(result.success).toBe(true);
    expect(result.url).toBeDefined();
  });
});

describe("cashOffers.submit with photos", () => {
  it("successfully submits cash offer request with photo URLs", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const photoUrls = [
      "https://storage.example.com/cash-offers/photos/photo1.jpg",
      "https://storage.example.com/cash-offers/photos/photo2.jpg",
      "https://storage.example.com/cash-offers/photos/photo3.jpg",
    ];

    const result = await caller.cashOffers.submit({
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "2145551234",
      street: "789 Elm Street",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      yearBuilt: 2005,
      condition: "good",
      additionalNotes: "Property has 3 photos attached",
      photoUrls: photoUrls,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("submitted successfully");
  });

  it("successfully submits cash offer request without photos", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.cashOffers.submit({
      fullName: "Bob Johnson",
      email: "bob.johnson@example.com",
      phone: "2145559999",
      street: "321 Pine Road",
      city: "Fort Worth",
      state: "TX",
      zipCode: "76102",
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2500,
      yearBuilt: 2010,
      condition: "excellent",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("submitted successfully");
  });
});
