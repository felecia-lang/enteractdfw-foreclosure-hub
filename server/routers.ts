import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createLead, createLeadNote, getAllLeads, getLeadById, getLeadNotes, updateLeadNotes, updateLeadStatus } from "./db";
import { notifyOwner } from "./_core/notification";
import { syncLeadToGHL, sendWelcomeEmail } from "./ghl";
import { getOwnerNotificationEmail } from "./emailTemplates";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Checklist email functionality
  checklist: router({
    emailToUser: publicProcedure
      .input(z.object({
        email: z.string().email(),
        checklistData: z.object({
          checkedItems: z.array(z.string()),
          timestamp: z.string(),
        }),
      }))
      .mutation(async ({ input }) => {
        // Send email with checklist summary
        const { email, checklistData } = input;
        const checkedCount = checklistData.checkedItems.length;
        
        // Create email content
        const emailContent = `
Your Notice of Default Action Checklist

You completed ${checkedCount} action items on ${new Date(checklistData.timestamp).toLocaleDateString()}.

Completed Items:
${checklistData.checkedItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

Next Steps:
- Continue working through your checklist
- Contact EnterActDFW for personalized assistance: (832) 932-7585
- Visit our knowledge base for more resources

Remember: Time is critical. You typically have 20-30 days from receiving a Notice of Default to take action.

---
EnterActDFW Real Estate Brokerage
4400 State Hwy 121, Suite 300
Lewisville, Texas 75056
Phone: (832) 932-7585
Email: info@enteractdfw.com
        `;

        // In a real implementation, you would send this via an email service
        // For now, we'll just return success
        // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
        
        console.log(`Email would be sent to: ${email}`);
        console.log(`Content: ${emailContent}`);
        
        return {
          success: true,
          message: `Checklist sent to ${email}`,
        };
      }),
  }),

  // Lead capture and management
  leads: router({
    // Public procedure for submitting leads from the landing page
    submit: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(1, "First name is required"),
          email: z.string().email("Valid email is required"),
          phone: z.string().min(10, "Valid phone number is required"),
          propertyZip: z.string().min(5, "Valid ZIP code is required"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Create lead in database
          await createLead({
            firstName: input.firstName,
            email: input.email,
            phone: input.phone,
            propertyZip: input.propertyZip,
            source: "landing_page",
            status: "new",
          });

          // Notify owner of new lead
          await notifyOwner({
            title: "New Foreclosure Lead",
            content: `New lead from ${input.firstName}\nEmail: ${input.email}\nPhone: ${input.phone}\nZIP: ${input.propertyZip}`,
          });

          // Sync lead to Go HighLevel CRM
          const ghlResult = await syncLeadToGHL({
            firstName: input.firstName,
            email: input.email,
            phone: input.phone,
            propertyZip: input.propertyZip,
            source: "Website - Landing Page",
          });

          if (ghlResult.success && ghlResult.contactId) {
            console.log("[Leads] Successfully synced to GHL:", ghlResult.contactId);
            
            // Send welcome email to lead via GHL
            try {
              await sendWelcomeEmail(ghlResult.contactId, input.firstName);
              console.log("[Leads] Welcome email sent to:", input.email);
            } catch (emailError) {
              console.warn("[Leads] Failed to send welcome email:", emailError);
              // Don't fail the request if email fails
            }
          } else {
            console.warn("[Leads] Failed to sync to GHL:", ghlResult.error);
            // Don't fail the request if GHL sync fails - lead is still captured in our DB
          }

          return { success: true };
        } catch (error) {
          console.error("Failed to create lead:", error);
          throw new Error("Failed to submit lead. Please try again.");
        }
      }),

    // Admin-only procedure
    list: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    }).query(async () => {
      return await getAllLeads();
    }),

    // Get single lead with details (admin only)
    getById: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getLeadById(input.id);
      }),

    // Update lead status (admin only)
    updateStatus: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "qualified", "closed"]),
      }))
      .mutation(async ({ input, ctx }) => {
        // Update status
        await updateLeadStatus(input.id, input.status);

        // Create a note for the status change
        await createLeadNote({
          leadId: input.id,
          note: `Status changed to: ${input.status}`,
          noteType: "status_change",
          createdBy: ctx.user?.name || "Admin",
        });

        return { success: true };
      }),

    // Update lead notes (admin only)
    updateNotes: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
      .input(z.object({
        id: z.number(),
        notes: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await updateLeadNotes(input.id, input.notes);
      }),

    // Add a new note to a lead (admin only)
    addNote: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
      .input(z.object({
        leadId: z.number(),
        note: z.string(),
        noteType: z.enum(["general", "status_change", "call", "email", "meeting"]).default("general"),
      }))
      .mutation(async ({ input, ctx }) => {
        return await createLeadNote({
          leadId: input.leadId,
          note: input.note,
          noteType: input.noteType,
          createdBy: ctx.user?.name || "Admin",
        });
      }),

    // Get all notes for a lead (admin only)
    getNotes: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        return await getLeadNotes(input.leadId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
