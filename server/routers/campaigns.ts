import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const campaignsRouter = router({
  /**
   * Create a new campaign
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await db.createCampaign({
        ...input,
        createdBy: ctx.user.openId,
      });

      if (!result) {
        throw new Error("Failed to create campaign");
      }

      return { success: true };
    }),

  /**
   * Get all campaigns
   */
  getAll: protectedProcedure.query(async () => {
    const campaigns = await db.getAllCampaigns();
    return campaigns;
  }),

  /**
   * Get campaign by ID with stats
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const campaign = await db.getCampaignById(input.id);
      if (!campaign) {
        throw new Error("Campaign not found");
      }

      const stats = await db.getCampaignStats(input.id);
      
      return {
        ...campaign,
        stats,
      };
    }),

  /**
   * Update a campaign
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const success = await db.updateCampaign(id, updates);

      if (!success) {
        throw new Error("Failed to update campaign");
      }

      return { success: true };
    }),

  /**
   * Delete a campaign
   */
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const success = await db.deleteCampaign(input.id);

      if (!success) {
        throw new Error("Failed to delete campaign");
      }

      return { success: true };
    }),

  /**
   * Assign link to campaign
   */
  assignLink: adminProcedure
    .input(
      z.object({
        shortCode: z.string(),
        campaignId: z.number().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const success = await db.assignLinkToCampaign(input.shortCode, input.campaignId);

      if (!success) {
        throw new Error("Failed to assign link to campaign");
      }

      return { success: true };
    }),

  /**
   * Get links by campaign
   */
  getLinks: protectedProcedure
    .input(z.object({ campaignId: z.number().nullable() }))
    .query(async ({ input }) => {
      const links = await db.getLinksByCampaign(input.campaignId);
      return links;
    }),
});
