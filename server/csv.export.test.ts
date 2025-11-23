import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { insertLead, leads } from "../drizzle/schema";
import { getDb } from "./db";
import { eq } from "drizzle-orm";

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
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("CSV Export", () => {
  it("exports leads to CSV format with correct headers and data", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Get existing leads from database to test export
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allLeads = await db.select().from(leads).limit(5);
    
    // If there are no leads, create one test lead
    let testLeadIds: number[] = [];
    if (allLeads.length === 0) {
      const testLead: insertLead = {
        firstName: "Test User",
        email: "test@example.com",
        phone: "123-456-7890",
        propertyZip: "75001",
        status: "new",
      };
      const result = await db.insert(leads).values(testLead);
      const insertId = result.insertId;
      // Handle BigInt conversion
      const id = typeof insertId === 'bigint' ? Number(insertId) : Number(insertId);
      testLeadIds = [id];
    } else {
      testLeadIds = allLeads.map(l => l.id);
    }

    try {
      // Export the leads
      const result = await caller.leads.exportCSV({ leadIds: testLeadIds });

      // Verify CSV structure
      expect(result).toHaveProperty("csv");
      expect(result).toHaveProperty("filename");
      expect(result).toHaveProperty("count");
      expect(result.count).toBe(testLeadIds.length);

      // Verify CSV content
      const csvLines = result.csv.split("\n");
      expect(csvLines.length).toBeGreaterThanOrEqual(2); // Header + at least 1 data row

      // Verify header
      const header = csvLines[0];
      expect(header).toContain("ID");
      expect(header).toContain("First Name");
      expect(header).toContain("Email");
      expect(header).toContain("Phone");
      expect(header).toContain("Property ZIP");
      expect(header).toContain("Status");
      expect(header).toContain("Submitted At");

      // Verify filename format
      expect(result.filename).toMatch(/leads_export_\d{4}-\d{2}-\d{2}\.csv/);
    } finally {
      // Clean up only if we created test data
      if (allLeads.length === 0 && testLeadIds.length > 0) {
        for (const id of testLeadIds) {
          await db.delete(leads).where(eq(leads.id, id));
        }
      }
    }
  });

  it("requires admin role to export leads", async () => {
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
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    await expect(caller.leads.exportCSV({ leadIds: [1, 2] })).rejects.toThrow();
  });

  it("exports empty CSV when no lead IDs provided", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.exportCSV({ leadIds: [] });

    expect(result.count).toBe(0);
    expect(result.csv).toContain("ID,First Name,Email"); // Header only
    const csvLines = result.csv.split("\n").filter(line => line.trim());
    expect(csvLines.length).toBe(1); // Only header
  });
});
