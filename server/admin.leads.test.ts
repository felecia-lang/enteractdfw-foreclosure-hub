import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@enteractdfw.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("admin.leads", () => {
  it("allows admin to list all leads", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const leads = await caller.leads.list();

    expect(Array.isArray(leads)).toBe(true);
    // Leads array may be empty if no leads have been submitted yet
    console.log(`Found ${leads.length} leads in database`);
  });

  it("allows admin to update lead status", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First, get all leads
    const leads = await caller.leads.list();

    if (leads.length > 0) {
      const leadId = leads[0]!.id;
      
      // Update status
      const result = await caller.leads.updateStatus({
        id: leadId,
        status: "contacted",
      });

      expect(result).toEqual({ success: true });
      console.log(`Successfully updated lead ${leadId} status to contacted`);
    } else {
      console.log("No leads available to test status update");
    }
  });

  it("allows admin to add notes to leads", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First, get all leads
    const leads = await caller.leads.list();

    if (leads.length > 0) {
      const leadId = leads[0]!.id;
      
      // Add a note
      await caller.leads.addNote({
        leadId,
        note: "Test note from automated test",
        noteType: "general",
      });

      // Verify note was added
      const notes = await caller.leads.getNotes({ leadId });
      
      expect(notes.length).toBeGreaterThan(0);
      // Find our test note (not the status change note)
      const testNote = notes.find(n => n.note === "Test note from automated test");
      expect(testNote).toBeDefined();
      expect(testNote?.noteType).toBe("general");
      console.log(`Successfully added note to lead ${leadId}`);
    } else {
      console.log("No leads available to test note addition");
    }
  });

  it("prevents non-admin users from accessing lead management", async () => {
    const user: AuthenticatedUser = {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user", // Not admin
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
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.leads.list();
      // If we reach here, the test should fail because non-admin should not have access
      throw new Error("Expected UNAUTHORIZED error but none was thrown");
    } catch (error: any) {
      // We expect an error for non-admin users
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Admin access required");
      console.log("Correctly prevented non-admin access to lead management");
    }
  });
});
