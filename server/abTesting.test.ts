import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import {
  getActiveTestsForForm,
  getTestVariants,
  getOrCreateAssignment,
  trackTestEvent,
} from "./abTestingDb";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
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
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("A/B Testing System", () => {
  describe("createTest", () => {
    it("should allow admin to create an A/B test with variants", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.abTesting.createTest({
        name: "Phone Field Label Test",
        description: "Testing 'Phone' vs 'Mobile Number' label",
        formName: "contact_form",
        fieldName: "phone",
        trafficAllocation: 100,
        variants: [
          {
            name: "Control",
            isControl: true,
            trafficWeight: 50,
            fieldLabel: "Phone",
            fieldPlaceholder: "(555) 555-5555",
            fieldRequired: true,
          },
          {
            name: "Variant A",
            isControl: false,
            trafficWeight: 50,
            fieldLabel: "Mobile Number",
            fieldPlaceholder: "Enter your mobile",
            fieldRequired: true,
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.testId).toBeDefined();
    });

    it("should reject test creation with invalid traffic weights", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.abTesting.createTest({
          name: "Invalid Test",
          formName: "contact_form",
          fieldName: "phone",
          trafficAllocation: 100,
          variants: [
            {
              name: "Control",
              isControl: true,
              trafficWeight: 60,
              fieldRequired: true,
            },
            {
              name: "Variant A",
              isControl: false,
              trafficWeight: 60, // Total is 120, should be 100
              fieldRequired: true,
            },
          ],
        })
      ).rejects.toThrow("Variant traffic weights must sum to 100");
    });

    it("should reject test creation without exactly one control", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.abTesting.createTest({
          name: "Invalid Test",
          formName: "contact_form",
          fieldName: "phone",
          trafficAllocation: 100,
          variants: [
            {
              name: "Variant A",
              isControl: false,
              trafficWeight: 50,
              fieldRequired: true,
            },
            {
              name: "Variant B",
              isControl: false,
              trafficWeight: 50,
              fieldRequired: true,
            },
          ],
        })
      ).rejects.toThrow("Must have exactly one control variant");
    });

    it("should reject test creation for non-admin users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.abTesting.createTest({
          name: "Test",
          formName: "contact_form",
          fieldName: "phone",
          trafficAllocation: 100,
          variants: [
            {
              name: "Control",
              isControl: true,
              trafficWeight: 50,
              fieldRequired: true,
            },
            {
              name: "Variant A",
              isControl: false,
              trafficWeight: 50,
              fieldRequired: true,
            },
          ],
        })
      ).rejects.toThrow();
    });
  });

  describe("getVariantAssignment", () => {
    it("should return no test when no active tests exist", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.abTesting.getVariantAssignment({
        formName: "nonexistent_form",
        fieldName: "nonexistent_field",
        sessionId: "test-session-123",
      });

      expect(result.hasTest).toBe(false);
      expect(result.variant).toBeNull();
    });

    it("should assign consistent variant for same session", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const sessionId = "test-session-456";

      // First assignment
      const result1 = await caller.abTesting.getVariantAssignment({
        formName: "contact_form",
        fieldName: "phone",
        sessionId,
      });

      // Second assignment (should be same)
      const result2 = await caller.abTesting.getVariantAssignment({
        formName: "contact_form",
        fieldName: "phone",
        sessionId,
      });

      if (result1.hasTest && result2.hasTest) {
        expect(result1.variant?.id).toBe(result2.variant?.id);
      }
    });
  });

  describe("trackEvent", () => {
    it("should track A/B test events", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.abTesting.trackEvent({
        testId: 1,
        variantId: 1,
        sessionId: "test-session-789",
        eventType: "impression",
      });

      expect(result.success).toBe(true);
    });

    it("should track validation errors with event data", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.abTesting.trackEvent({
        testId: 1,
        variantId: 1,
        sessionId: "test-session-789",
        eventType: "validation_error",
        eventData: "Phone number is required",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("updateTestStatus", () => {
    it("should allow admin to update test status", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // First create a test
      const createResult = await caller.abTesting.createTest({
        name: "Status Test",
        formName: "contact_form",
        fieldName: "email",
        trafficAllocation: 100,
        variants: [
          {
            name: "Control",
            isControl: true,
            trafficWeight: 50,
            fieldRequired: true,
          },
          {
            name: "Variant A",
            isControl: false,
            trafficWeight: 50,
            fieldRequired: false,
          },
        ],
      });

      // Update status to active
      const updateResult = await caller.abTesting.updateTestStatus({
        testId: createResult.testId,
        status: "active",
      });

      expect(updateResult.success).toBe(true);
    });

    it("should reject status update for non-admin users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.abTesting.updateTestStatus({
          testId: 1,
          status: "active",
        })
      ).rejects.toThrow();
    });
  });

  describe("getTestStats", () => {
    it("should return test statistics for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a test first
      const createResult = await caller.abTesting.createTest({
        name: "Stats Test",
        formName: "contact_form",
        fieldName: "propertyZip",
        trafficAllocation: 100,
        variants: [
          {
            name: "Control",
            isControl: true,
            trafficWeight: 50,
            fieldLabel: "Property ZIP Code",
            fieldRequired: true,
          },
          {
            name: "Variant A",
            isControl: false,
            trafficWeight: 50,
            fieldLabel: "ZIP Code",
            fieldRequired: true,
          },
        ],
      });

      // Get stats
      const stats = await caller.abTesting.getTestStats({
        testId: createResult.testId,
      });

      expect(stats).toBeDefined();
      expect(stats.test).toBeDefined();
      expect(stats.variants).toBeInstanceOf(Array);
      expect(stats.comparisons).toBeInstanceOf(Array);
    });

    it("should reject stats access for non-admin users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.abTesting.getTestStats({ testId: 1 })
      ).rejects.toThrow();
    });
  });

  describe("getAllTests", () => {
    it("should return all tests for admin", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const tests = await caller.abTesting.getAllTests();

      expect(tests).toBeInstanceOf(Array);
    });

    it("should reject access for non-admin users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.abTesting.getAllTests()).rejects.toThrow();
    });
  });

  describe("Database Functions", () => {
    it("should get active tests for a form", async () => {
      const tests = await getActiveTestsForForm("contact_form");
      expect(tests).toBeInstanceOf(Array);
    });

    it("should get test variants", async () => {
      const variants = await getTestVariants(1);
      expect(variants).toBeInstanceOf(Array);
    });

    it("should create consistent assignments", async () => {
      const sessionId = `test-${Date.now()}`;
      const variants = [
        { id: 1, trafficWeight: 50 },
        { id: 2, trafficWeight: 50 },
      ];

      const assignment1 = await getOrCreateAssignment(1, sessionId, variants);
      const assignment2 = await getOrCreateAssignment(1, sessionId, variants);

      expect(assignment1?.variantId).toBe(assignment2?.variantId);
    });

    it("should track events", async () => {
      await expect(
        trackTestEvent({
          testId: 1,
          variantId: 1,
          sessionId: "test-session",
          eventType: "impression",
        })
      ).resolves.not.toThrow();
    });
  });
});
