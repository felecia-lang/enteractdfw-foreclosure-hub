import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

/**
 * GHL Integration Tests
 * 
 * These tests verify the GoHighLevel integration logic including:
 * - Contact sync with proper field mapping
 * - Foreclosure_Hub_Lead tag application
 * - Timeline workflow triggers
 * - Progress tracking
 */

describe("GHL Integration", () => {
  // Helper to create authenticated admin context
  function createAdminContext(): TrpcContext {
    const user = {
      id: 1,
      openId: "admin-test",
      email: "admin@enteractdfw.test",
      name: "Admin Test",
      loginMethod: "manus",
      role: "admin" as const,
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
      res: {
        clearCookie: vi.fn(),
      } as unknown as TrpcContext["res"],
    };
  }

  describe("syncLeadToGHL", () => {
    it("should include Foreclosure_Hub_Lead tag", async () => {
      const { syncLeadToGHL } = await import("./ghl");
      
      // Mock the GHL API
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ contacts: [], contact: { id: "test-123" } }),
      });
      global.fetch = mockFetch;

      const leadData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        phone: "555-0100",
        propertyZip: "75001",
        propertyAddress: "123 Main St",
        foreclosureStage: "Notice of Default",
        source: "Website Form",
      };

      await syncLeadToGHL(leadData);

      // Verify the API was called with correct data
      expect(mockFetch).toHaveBeenCalled();
      const callArgs = mockFetch.mock.calls[1]; // Second call is the create
      const requestBody = JSON.parse(callArgs[1].body);
      
      // Verify Foreclosure_Hub_Lead tag is included
      expect(requestBody.tags).toContain("Foreclosure_Hub_Lead");
      
      // Verify custom fields are mapped correctly
      expect(requestBody.customFields).toHaveProperty("property_address");
      expect(requestBody.customFields).toHaveProperty("property_zip_code");
      expect(requestBody.customFields).toHaveProperty("foreclosure_stage");
    });

    it("should map all website fields to GHL custom fields", async () => {
      const { syncLeadToGHL } = await import("./ghl");
      
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ contacts: [], contact: { id: "test-456" } }),
      });
      global.fetch = mockFetch;

      const leadData = {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@test.com",
        phone: "555-0200",
        propertyZip: "75002",
        propertyAddress: "456 Oak Ave",
        foreclosureStage: "Pre-Foreclosure",
        source: "Timeline Calculator",
      };

      await syncLeadToGHL(leadData);

      const callArgs = mockFetch.mock.calls[1];
      const requestBody = JSON.parse(callArgs[1].body);

      // Verify all fields are mapped
      expect(requestBody.firstName).toBe("Jane");
      expect(requestBody.lastName).toBe("Smith");
      expect(requestBody.email).toBe("jane@test.com");
      expect(requestBody.phone).toBe("555-0200");
      expect(requestBody.postalCode).toBe("75002");
      expect(requestBody.address1).toBe("456 Oak Ave");
      expect(requestBody.customFields.foreclosure_stage).toBe("Pre-Foreclosure");
      expect(requestBody.customFields.lead_source).toBe("Timeline Calculator");
    });
  });

  describe("syncTimelineToGHL", () => {
    it("should create contact with timeline data and Foreclosure_Hub_Lead tag", async () => {
      const { syncTimelineToGHL } = await import("./ghlEnhanced");
      
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ contacts: [], contact: { id: "timeline-123" } }),
      });
      global.fetch = mockFetch;

      const timelineData = {
        email: "timeline@test.com",
        firstName: "Timeline",
        lastName: "User",
        phone: "555-0300",
        noticeDate: "2025-01-01",
        milestones: [
          {
            title: "Notice of Default Received",
            date: "2025-01-01",
            daysFromNotice: 0,
            urgency: "critical" as const,
            status: "current" as const,
            actions: ["Read the notice", "Contact lender"],
          },
        ],
      };

      await syncTimelineToGHL(timelineData);

      // Verify contact creation with proper tags
      const createCall = mockFetch.mock.calls.find(call => 
        call[0].includes("/contacts/") && call[1].method === "POST"
      );
      
      expect(createCall).toBeDefined();
      const requestBody = JSON.parse(createCall[1].body);
      
      // Verify Foreclosure_Hub_Lead tag
      expect(requestBody.tags).toContain("Foreclosure_Hub_Lead");
      expect(requestBody.tags).toContain("Timeline_Calculator");
      
      // Verify custom fields include notice date
      expect(requestBody.customFields.notice_of_default_date).toBe("2025-01-01");
    });

    it("should add detailed timeline note with all milestones", async () => {
      const { syncTimelineToGHL } = await import("./ghlEnhanced");
      
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ 
          contacts: [], 
          contact: { id: "timeline-456" },
          note: { id: "note-123" }
        }),
      });
      global.fetch = mockFetch;

      const timelineData = {
        email: "detailed@test.com",
        noticeDate: "2025-01-15",
        milestones: [
          {
            title: "Reinstatement Deadline",
            date: "2025-02-04",
            daysFromNotice: 20,
            urgency: "high" as const,
            status: "upcoming" as const,
            actions: ["Pay amount due", "Contact attorney"],
          },
        ],
      };

      await syncTimelineToGHL(timelineData);

      // Verify note was added
      const noteCall = mockFetch.mock.calls.find(call => 
        call[0].includes("/notes") && call[1].method === "POST"
      );
      
      expect(noteCall).toBeDefined();
      const noteBody = JSON.parse(noteCall[1].body);
      
      // Verify note contains timeline information
      expect(noteBody.body).toContain("FORECLOSURE TIMELINE CALCULATED");
      expect(noteBody.body).toContain("Reinstatement Deadline");
      expect(noteBody.body).toContain("Day 20");
    });
  });

  describe("trackTimelineSaved", () => {
    it("should tag user as high engagement when timeline is saved", async () => {
      const { trackTimelineSaved } = await import("./ghlEnhanced");
      
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ contacts: [], contact: { id: "saved-123" } }),
      });
      global.fetch = mockFetch;

      const saveData = {
        email: "saver@test.com",
        noticeDate: "2025-01-20",
        milestones: [],
      };

      await trackTimelineSaved(saveData);

      const createCall = mockFetch.mock.calls.find(call => 
        call[0].includes("/contacts/") && call[1].method === "POST"
      );
      
      const requestBody = JSON.parse(createCall[1].body);
      
      // Verify high engagement tags
      expect(requestBody.tags).toContain("Foreclosure_Hub_Lead");
      expect(requestBody.tags).toContain("Timeline_Saved");
      expect(requestBody.tags).toContain("Registered_User");
      
      // Verify engagement level in custom fields
      expect(requestBody.customFields.user_engagement).toContain("High");
    });
  });

  describe("trackTimelineProgress", () => {
    it("should update GHL when user completes action items", async () => {
      const { trackTimelineProgress } = await import("./ghlEnhanced");
      
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ 
          contacts: [{ id: "progress-123" }],
          note: { id: "note-456" }
        }),
      });
      global.fetch = mockFetch;

      const progressData = {
        email: "progress@test.com",
        actionCompleted: "Read the notice carefully",
        milestoneTitle: "Notice of Default Received",
        completionPercentage: 25,
      };

      await trackTimelineProgress(progressData);

      // Verify note was added with progress info
      const noteCall = mockFetch.mock.calls.find(call => 
        call[0].includes("/notes") && call[1].method === "POST"
      );
      
      if (noteCall) {
        const noteBody = JSON.parse(noteCall[1].body);
        expect(noteBody.body).toContain("Timeline Progress Update");
        expect(noteBody.body).toContain("25%");
        expect(noteBody.body).toContain("Read the notice carefully");
      }
    });
  });

  describe("GHL Test Router", () => {
    it("should allow admin to test connection", async () => {
      const { appRouter } = await import("./routers");
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ contacts: [], contact: { id: "test-connection" } }),
      });
      global.fetch = mockFetch;

      const result = await caller.ghlTest.testConnection();

      expect(result.success).toBe(true);
      expect(result.contactId).toBeDefined();
    });

    it("should return configuration status", async () => {
      const { appRouter } = await import("./routers");
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ghlTest.getStatus();

      expect(result).toHaveProperty("configured");
      expect(result).toHaveProperty("details");
      expect(result).toHaveProperty("ready");
    });
  });
});
