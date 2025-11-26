import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

/**
 * Create an admin context for testing admin-only endpoints
 */
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

/**
 * Create a regular user context for testing access control
 */
function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
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

describe("Link Shortening", () => {
  describe("links.create", () => {
    it("should create a shortened link with valid URL", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.links.create({
        originalUrl: "https://example.com/long-url-path",
        title: "Test Link",
      });

      expect(result.success).toBe(true);
      expect(result.shortCode).toBeDefined();
      expect(result.shortCode).toHaveLength(6);
      expect(result.shortUrl).toContain("links.enteractai.com");
      expect(result.originalUrl).toBe("https://example.com/long-url-path");
    });

    it("should create a link with custom alias", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const customAlias = `test-${Date.now()}`;
      const result = await caller.links.create({
        originalUrl: "https://example.com/custom-alias-test",
        customAlias,
      });

      expect(result.success).toBe(true);
      expect(result.customAlias).toBe(customAlias);
      expect(result.shortUrl).toContain(customAlias);
    });

    it("should create a link with UTM parameters", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.links.create({
        originalUrl: "https://example.com/utm-test",
        utmSource: "facebook",
        utmMedium: "social",
        utmCampaign: "spring-2024",
      });

      expect(result.success).toBe(true);
      expect(result.shortCode).toBeDefined();
    });

    it("should normalize URLs without protocol", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.links.create({
        originalUrl: "example.com/no-protocol",
      });

      expect(result.success).toBe(true);
      expect(result.originalUrl).toBe("https://example.com/no-protocol");
    });

    it("should reject duplicate custom alias", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const customAlias = `duplicate-${Date.now()}`;

      // Create first link
      await caller.links.create({
        originalUrl: "https://example.com/first",
        customAlias,
      });

      // Try to create second link with same alias
      await expect(
        caller.links.create({
          originalUrl: "https://example.com/second",
          customAlias,
        })
      ).rejects.toThrow("Custom alias already taken");
    });

    it("should require admin role", async () => {
      const { ctx } = createUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.links.create({
          originalUrl: "https://example.com/test",
        })
      ).rejects.toThrow("Admin access required");
    });
  });

  describe("links.getAll", () => {
    it("should return all shortened links for admin", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a test link first
      await caller.links.create({
        originalUrl: "https://example.com/test-getall",
        title: "Test GetAll",
      });

      const links = await caller.links.getAll();

      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveProperty("shortCode");
      expect(links[0]).toHaveProperty("originalUrl");
      expect(links[0]).toHaveProperty("clicks");
      expect(links[0]).toHaveProperty("shortUrl");
    });

    it("should require admin role", async () => {
      const { ctx } = createUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.links.getAll()).rejects.toThrow("Admin access required");
    });
  });

  describe("links.getByCode", () => {
    it("should retrieve link by short code", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a link
      const created = await caller.links.create({
        originalUrl: "https://example.com/test-getbycode",
      });

      // Retrieve it
      const link = await caller.links.getByCode({ code: created.shortCode });

      expect(link).toBeDefined();
      expect(link.shortCode).toBe(created.shortCode);
      expect(link.originalUrl).toBe("https://example.com/test-getbycode");
    });

    it("should retrieve link by custom alias", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const customAlias = `alias-${Date.now()}`;

      // Create a link with custom alias
      await caller.links.create({
        originalUrl: "https://example.com/test-alias",
        customAlias,
      });

      // Retrieve by alias
      const link = await caller.links.getByCode({ code: customAlias });

      expect(link).toBeDefined();
      expect(link.customAlias).toBe(customAlias);
    });

    it("should throw error for non-existent code", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.links.getByCode({ code: "nonexistent" })
      ).rejects.toThrow("Shortened link not found");
    });
  });

  describe("links.delete", () => {
    it("should delete a shortened link", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a link
      const created = await caller.links.create({
        originalUrl: "https://example.com/test-delete",
      });

      // Delete it
      const result = await caller.links.delete({ shortCode: created.shortCode });

      expect(result.success).toBe(true);

      // Verify it's deleted
      await expect(
        caller.links.getByCode({ code: created.shortCode })
      ).rejects.toThrow("Shortened link not found");
    });

    it("should require admin role", async () => {
      const { ctx } = createUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.links.delete({ shortCode: "test123" })
      ).rejects.toThrow("Admin access required");
    });
  });

  describe("links.update", () => {
    it("should update link title", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a link
      const created = await caller.links.create({
        originalUrl: "https://example.com/test-update",
        title: "Original Title",
      });

      // Update title
      const result = await caller.links.update({
        shortCode: created.shortCode,
        title: "Updated Title",
      });

      expect(result.success).toBe(true);

      // Verify update
      const link = await caller.links.getByCode({ code: created.shortCode });
      expect(link.title).toBe("Updated Title");
    });

    it("should update original URL", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a link
      const created = await caller.links.create({
        originalUrl: "https://example.com/original",
      });

      // Update URL
      const result = await caller.links.update({
        shortCode: created.shortCode,
        originalUrl: "https://example.com/updated",
      });

      expect(result.success).toBe(true);

      // Verify update
      const link = await caller.links.getByCode({ code: created.shortCode });
      expect(link.originalUrl).toBe("https://example.com/updated");
    });

    it("should require admin role", async () => {
      const { ctx } = createUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.links.update({
          shortCode: "test123",
          title: "New Title",
        })
      ).rejects.toThrow("Admin access required");
    });
  });
});
