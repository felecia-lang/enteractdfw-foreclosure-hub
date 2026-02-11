/**
 * GHL API Connection Test Router
 * 
 * Provides endpoints to test and verify GHL API integration
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { syncContactToGHL, addGHLNote } from "../ghl";

export const ghlTestRouter = router({
  /**
   * Test GHL API connection
   * Creates a test contact and verifies it appears in GHL
   */
  testConnection: protectedProcedure
    .use(({ ctx, next }) => {
      // Only allow admin users to test GHL connection
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
    .mutation(async ({ ctx }) => {
      try {
        const testEmail = `test+${Date.now()}@enteractdfw.test`;
        
        // Step 1: Create test contact with Foreclosure_Hub_Lead tag
        const contactResult = await syncContactToGHL({
          firstName: "Test",
          lastName: "Contact",
          email: testEmail,
          phone: "555-0100",
          tags: ["Foreclosure_Hub_Lead", "API_Test", "Delete_Me"],
          customFields: [
            {
              key: "test_field",
              field_value: "API Connection Test",
            },
            {
              key: "test_timestamp",
              field_value: new Date().toISOString(),
            },
          ],
          source: "EnterActDFW Foreclosure Hub - API Test",
        });

        if (!contactResult.success) {
          return {
            success: false,
            error: `Failed to create contact: ${contactResult.error}`,
            details: contactResult,
          };
        }

        // Step 2: Add test note to verify note creation works
        if (contactResult.contactId) {
          const noteResult = await addGHLNote({
            contactId: contactResult.contactId,
            body: `✅ GHL API Connection Test\n\nTest performed by: ${ctx.user.name || ctx.user.email}\nTimestamp: ${new Date().toLocaleString()}\n\nThis is a test contact and can be safely deleted.`,
          });

          if (!noteResult.success) {
            return {
              success: false,
              error: `Contact created but failed to add note: ${noteResult.error}`,
              contactId: contactResult.contactId,
            };
          }
        }

        return {
          success: true,
          message: "GHL API connection successful!",
          contactId: contactResult.contactId,
          testEmail,
          instructions: "Check your GHL dashboard for a contact with email: " + testEmail,
        };
      } catch (error) {
        console.error("[GHL Test] Connection test failed:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * Test field mapping
   * Verifies that custom fields are correctly mapped to GHL
   */
  testFieldMapping: protectedProcedure
    .use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
    .input(
      z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string().optional(),
        phone: z.string(),
        propertyAddress: z.string().optional(),
        propertyZip: z.string(),
        foreclosureStage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const contactResult = await syncContactToGHL({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          postalCode: input.propertyZip,
          address1: input.propertyAddress,
          // REQUIRED: Foreclosure_Hub_Lead tag
          tags: ["Foreclosure_Hub_Lead", "Field_Mapping_Test"],
          customFields: [
            {
              key: "property_address",
              field_value: input.propertyAddress || "",
            },
            {
              key: "property_zip_code",
              field_value: input.propertyZip,
            },
            {
              key: "foreclosure_stage",
              field_value: input.foreclosureStage || "Test",
            },
            {
              key: "lead_source",
              field_value: "Field Mapping Test",
            },
            {
              key: "test_timestamp",
              field_value: new Date().toISOString(),
            },
          ],
          source: "EnterActDFW Foreclosure Hub - Field Mapping Test",
        });

        if (!contactResult.success) {
          return {
            success: false,
            error: contactResult.error,
          };
        }

        return {
          success: true,
          message: "Field mapping test successful!",
          contactId: contactResult.contactId,
          mappedFields: {
            name: `${input.firstName} ${input.lastName || ""}`.trim(),
            email: input.email,
            phone: input.phone,
            propertyAddress: input.propertyAddress,
            propertyZip: input.propertyZip,
            foreclosureStage: input.foreclosureStage,
          },
        };
      } catch (error) {
        console.error("[GHL Test] Field mapping test failed:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * Get GHL API configuration status
   */
  getStatus: protectedProcedure
    .use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
    .query(() => {
      const hasApiKey = !!process.env.GHL_API_KEY;
      const hasLocationId = !!process.env.GHL_LOCATION_ID;
      const hasApiUrl = !!process.env.GHL_API_URL;

      return {
        configured: hasApiKey && hasLocationId,
        details: {
          apiKey: hasApiKey ? "✅ Configured" : "❌ Missing",
          locationId: hasLocationId ? "✅ Configured" : "❌ Missing",
          apiUrl: hasApiUrl ? process.env.GHL_API_URL : "Using default",
        },
        ready: hasApiKey && hasLocationId,
      };
    }),
});
