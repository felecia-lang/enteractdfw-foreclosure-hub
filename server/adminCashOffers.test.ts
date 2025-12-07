import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const adminUser: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: adminUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createNonAdminContext(): TrpcContext {
  const regularUser: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: regularUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Admin Cash Offers", () => {
  it("allows admin to list all cash offers", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.cashOffers.list();

    expect(Array.isArray(result)).toBe(true);
    // Should return all requests without filtering
    expect(result.length).toBeGreaterThan(0);
  });

  it("allows admin to filter cash offers by status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.cashOffers.list({ status: "new" });

    expect(Array.isArray(result)).toBe(true);
    // All returned items should have status "new"
    result.forEach((request) => {
      expect(request.status).toBe("new");
    });
  });

  it("allows admin to update cash offer status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First, get a request to update
    const requests = await caller.cashOffers.list({ status: "new" });
    expect(requests.length).toBeGreaterThan(0);

    const requestId = requests[0]!.id;

    // Update the status
    const result = await caller.cashOffers.updateStatus({
      id: requestId,
      status: "reviewing",
    });

    expect(result.success).toBe(true);
    // Message field is optional, just verify success

    // Verify the status was updated
    const updatedRequests = await caller.cashOffers.list({ status: "reviewing" });
    const updatedRequest = updatedRequests.find((r) => r.id === requestId);
    expect(updatedRequest).toBeDefined();
    expect(updatedRequest?.status).toBe("reviewing");
  });

  it("allows admin to add internal notes", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Get a request to add notes to
    const requests = await caller.cashOffers.list();
    expect(requests.length).toBeGreaterThan(0);

    const requestId = requests[0]!.id;
    const testNotes = "This is a test note from the admin.";

    // Add internal notes
    const result = await caller.cashOffers.updateNotes({
      id: requestId,
      notes: testNotes,
    });

    expect(result.success).toBe(true);
    // Message field is optional, just verify success

    // Verify the notes were saved
    const allRequests = await caller.cashOffers.list();
    const updatedRequest = allRequests.find((r) => r.id === requestId);
    expect(updatedRequest?.internalNotes).toBe(testNotes);
  });

  it("prevents non-admin users from accessing admin endpoints", async () => {
    const ctx = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Attempt to list cash offers as non-admin
    await expect(caller.cashOffers.list()).rejects.toThrow("Admin access required");

    // Attempt to update status as non-admin
    await expect(
      caller.cashOffers.updateStatus({ id: 1, status: "reviewing" })
    ).rejects.toThrow("Admin access required");

    // Attempt to update notes as non-admin
    await expect(
      caller.cashOffers.updateNotes({ id: 1, notes: "Test" })
    ).rejects.toThrow("Admin access required");
  });

  it("returns cash offers with photo URLs when available", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.cashOffers.list();

    // Find a request with photos
    const requestWithPhotos = result.find(
      (r) => r.photoUrls && r.photoUrls.length > 0
    );

    if (requestWithPhotos) {
      expect(Array.isArray(requestWithPhotos.photoUrls)).toBe(true);
      expect(requestWithPhotos.photoUrls!.length).toBeGreaterThan(0);
      // Verify photo URLs are valid strings
      requestWithPhotos.photoUrls!.forEach((url) => {
        expect(typeof url).toBe("string");
        expect(url.length).toBeGreaterThan(0);
      });
    }
  });
});
