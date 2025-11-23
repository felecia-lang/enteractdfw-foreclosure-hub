import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createLead, createLeadNote, createTestimonial, deleteTestimonial, getAllLeads, getAllTestimonials, getLeadById, getLeadNotes, getTestimonialsByStatus, updateLeadNotes, updateLeadStatus, updateTestimonial, updateTestimonialStatus } from "./db";
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
          smsConsent: z.boolean(),
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
            smsConsent: input.smsConsent ? "yes" : "no",
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

     // Get notes for a lead (admin only)
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

    // Export leads to CSV (admin only)
    exportCSV: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
      .input(z.object({
        leadIds: z.array(z.number()).optional(), // If not provided, export all leads
      }))
      .query(async ({ input }) => {
        // Get leads to export
        const allLeads = await getAllLeads();
        const leadsToExport = input.leadIds
          ? allLeads.filter(lead => input.leadIds!.includes(lead.id))
          : allLeads;

        // Build CSV header
        const headers = [
          "ID",
          "First Name",
          "Email",
          "Phone",
          "Property ZIP",
          "Status",
          "Source",
          "Submitted At",
          "Last Updated",
        ];

        // Build CSV rows
        const rows = leadsToExport.map(lead => [
          lead.id.toString(),
          lead.firstName,
          lead.email,
          lead.phone,
          lead.propertyZip,
          lead.status,
          lead.source || "",
          lead.createdAt.toISOString(),
          lead.updatedAt.toISOString(),
        ]);

        // Combine header and rows
        const csvLines = [headers, ...rows];

        // Convert to CSV format (handle commas and quotes in values)
        const csvContent = csvLines
          .map(row =>
            row
              .map(cell => {
                // Escape quotes and wrap in quotes if contains comma, quote, or newline
                const cellStr = String(cell);
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                  return `"${cellStr.replace(/"/g, '""')}"`;
                }
                return cellStr;
              })
              .join(',')
          )
          .join('\n');

        return {
          csv: csvContent,
          filename: `leads_export_${new Date().toISOString().split('T')[0]}.csv`,
          count: leadsToExport.length,
        };
      }),
  }),

  // Testimonial submission
  testimonials: router({  
    // Public procedure for submitting testimonials
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          location: z.string().min(1, "Location is required"),
          situation: z.string().min(1, "Situation is required"),
          story: z.string().min(50, "Please share at least 50 characters about your experience"),
          outcome: z.string().min(20, "Please describe the outcome"),
          permissionToPublish: z.enum(["yes", "no"]),
          email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
          phone: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Create testimonial in database
          await createTestimonial({
            name: input.name,
            location: input.location,
            situation: input.situation,
            story: input.story,
            outcome: input.outcome,
            permissionToPublish: input.permissionToPublish,
            email: input.email || null,
            phone: input.phone || null,
            status: "pending",
          });

          // Notify owner of new testimonial submission
          await notifyOwner({
            title: "New Testimonial Submission",
            content: `New testimonial from ${input.name} (${input.location})\n\nSituation: ${input.situation}\n\nPermission to publish: ${input.permissionToPublish}`,
          });

          return { success: true };
        } catch (error) {
          console.error("Failed to create testimonial:", error);
          throw new Error("Failed to submit testimonial. Please try again.");
        }
      }),

    // Admin-only procedure to list all testimonials
    list: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
      .input(z.object({ status: z.enum(["pending", "approved", "rejected"]).optional() }).optional())
      .query(async ({ input }) => {
        return await getTestimonialsByStatus(input?.status);
      }),

    // Admin-only procedure to approve/reject testimonials
    updateStatus: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      }))
      .mutation(async ({ input }) => {
        return await updateTestimonialStatus(input.id, input.status);
      }),

    // Admin-only procedure to edit testimonial content
    update: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        location: z.string().optional(),
        situation: z.string().optional(),
        story: z.string().optional(),
        outcome: z.string().optional(),
        theme: z.enum([
          "loan_modification",
          "foreclosure_prevention",
          "short_sale",
          "cash_offer",
          "deed_in_lieu",
          "bankruptcy_alternative",
          "job_loss",
          "medical_emergency",
          "divorce",
          "other"
        ]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateTestimonial(id, data);
      }),

    // Admin-only procedure to delete testimonials
    delete: protectedProcedure.use(({ ctx, next }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
      }
      return next({ ctx });
    })
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteTestimonial(input.id);
      }),
  }),

  // Timeline email functionality
  timeline: router({
    emailPDF: publicProcedure
      .input(z.object({
        email: z.string().email("Valid email is required"),
        noticeDate: z.string(),
        milestones: z.array(z.object({
          id: z.string(),
          title: z.string(),
          date: z.string(),
          daysFromNotice: z.number(),
          description: z.string(),
          actionItems: z.array(z.string()),
          urgency: z.enum(["critical", "warning", "safe"]),
          status: z.enum(["past", "current", "upcoming"]),
        })),
      }))
      .mutation(async ({ input }) => {
        try {
          const { email, noticeDate, milestones } = input;
          
          // Import PDF generator
          const { generatePersonalizedTimelinePDF } = await import("./pdfGenerator");
          
          // Convert date strings back to Date objects
          const milestonesWithDates = milestones.map((m) => ({
            ...m,
            date: new Date(m.date),
          }));
          
          // Generate PDF buffer
          const pdfBuffer = await generatePersonalizedTimelinePDF(noticeDate, milestonesWithDates);
          
          // Import GHL email function
          const { sendTimelineEmail } = await import("./ghl");
          
          // Send email with PDF attachment via GHL
          const result = await sendTimelineEmail({
            email,
            firstName: email.split('@')[0], // Extract name from email if not provided
            noticeDate,
            pdfBuffer,
          });
          
          if (result.success) {
            return {
              success: true,
              message: `Timeline sent to ${email}`,
            };
          } else {
            throw new Error(result.error || "Failed to send email");
          }
        } catch (error) {
          console.error("[Timeline] Failed to send email:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send timeline email. Please try again.",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
