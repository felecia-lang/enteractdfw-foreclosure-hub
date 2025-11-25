import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createLead, createLeadNote, createTestimonial, deleteTestimonial, getAllLeads, getAllTestimonials, getLeadById, getLeadNotes, getTestimonialsByStatus, updateLeadNotes, updateLeadStatus, updateTestimonial, updateTestimonialStatus, createEmailCampaign, getEmailCampaignStats, trackPhoneCall, getPhoneCallStats, getRecentPhoneCalls, getCallVolumeByDate, getBookingStats, getRecentBookings } from "./db";
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
          source: z.string().optional(), // "landing_page" or "chatbot"
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Create lead in database
          const leadResult = await createLead({
            firstName: input.firstName,
            email: input.email,
            phone: input.phone,
            propertyZip: input.propertyZip,
            smsConsent: input.smsConsent ? "yes" : "no",
            source: input.source || "landing_page",
            status: "new",
          });

          const leadId = leadResult?.[0]?.insertId;

          // If lead is from chatbot, enroll in email drip campaign
          if (input.source === "chatbot" && leadId) {
            try {
              await createEmailCampaign(leadId);
              console.log(`[Leads] Enrolled lead ${leadId} in email drip campaign`);
            } catch (campaignError) {
              console.warn("[Leads] Failed to enroll in email campaign:", campaignError);
              // Don't fail the request if campaign enrollment fails
            }
          }

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

  // Email Campaign Management (Admin only)
  emailCampaign: router({    sendDueEmails: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
        }
        return next({ ctx });
      })
      .mutation(async () => {
        try {
          const { processDueEmails } = await import("./emailCampaignService");
          const result = await processDueEmails();
          
          return {
            success: result.success,
            emailsSent: result.emailsSent,
            errors: result.errors,
          };
        } catch (error) {
          console.error("[EmailCampaign] Failed to process due emails:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send due emails. Please try again.",
          });
        }
      }),

    getStats: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin access required" });
        }
        return next({ ctx });
      })
      .query(async () => {
        try {
          const stats = await getEmailCampaignStats();
          return stats || {
            totalCampaigns: 0,
            activeCampaigns: 0,
            completedCampaigns: 0,
            unsubscribed: 0,
            totalEmailsSent: 0,
          };
        } catch (error) {
          console.error("[EmailCampaign] Failed to get stats:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve campaign statistics.",
          });
        }
      }),
  }),

  // Property Valuation Calculator
  propertyValuation: router({
    calculate: publicProcedure
      .input(z.object({
        zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
        propertyType: z.enum(["single_family", "condo", "townhouse", "multi_family"]),
        squareFeet: z.number().min(300).max(10000),
        bedrooms: z.number().min(1).max(10),
        bathrooms: z.number().min(1).max(10),
        condition: z.enum(["excellent", "good", "fair", "poor"]),
        mortgageBalance: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { calculatePropertyValue } = await import("./propertyValuation");
          const result = calculatePropertyValue(input);
          
          return result;
        } catch (error) {
          console.error("[PropertyValuation] Failed to calculate value:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to calculate property value. Please try again.",
          });
        }
      }),

    compareOptions: publicProcedure
      .input(z.object({
        propertyValue: z.number().min(10000),
        mortgageBalance: z.number().min(0),
      }))
      .mutation(async ({ input }) => {
        try {
          const { calculateSaleOptions } = await import("./saleOptionsComparison");
          const result = calculateSaleOptions(input.propertyValue, input.mortgageBalance);
          
          return result;
        } catch (error) {
          console.error("[PropertyValuation] Failed to compare options:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to compare sale options. Please try again.",
          });
        }
      }),

    downloadComparisonPDF: publicProcedure
      .input(z.object({
        propertyValue: z.number().min(10000),
        mortgageBalance: z.number().min(0),
        propertyDetails: z.object({
          zipCode: z.string(),
          propertyType: z.string(),
          squareFeet: z.number(),
          bedrooms: z.number(),
          bathrooms: z.number(),
          condition: z.string(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const { calculateSaleOptions } = await import("./saleOptionsComparison");
          const { generateComparisonPDF } = await import("./comparisonPdfGenerator");
          
          const comparison = calculateSaleOptions(input.propertyValue, input.mortgageBalance);
          
          const pdfBuffer = await generateComparisonPDF({
            propertyValue: input.propertyValue,
            propertyDetails: input.propertyDetails,
            comparison,
            generatedAt: new Date(),
          });

          // Set response headers for PDF download
          ctx.res.setHeader("Content-Type", "application/pdf");
          ctx.res.setHeader(
            "Content-Disposition",
            `attachment; filename="sale-options-comparison-${Date.now()}.pdf"`
          );
          ctx.res.setHeader("Content-Length", pdfBuffer.length);

          // Send PDF buffer
          ctx.res.end(pdfBuffer);

          return { success: true };
        } catch (error) {
          console.error("[PropertyValuation] Failed to generate PDF:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate PDF. Please try again.",
          });
        }
      }),

    emailComparison: publicProcedure
      .input(z.object({
        email: z.string().email(),
        propertyValue: z.number().min(10000),
        mortgageBalance: z.number().min(0),
        propertyDetails: z.object({
          zipCode: z.string(),
          propertyType: z.string(),
          squareFeet: z.number(),
          bedrooms: z.number(),
          bathrooms: z.number(),
          condition: z.string(),
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          const { calculateSaleOptions } = await import("./saleOptionsComparison");
          const { generateComparisonPDF } = await import("./comparisonPdfGenerator");
          const { sendComparisonEmail } = await import("./comparisonEmailService");
          
          const comparison = calculateSaleOptions(input.propertyValue, input.mortgageBalance);
          
          const pdfBuffer = await generateComparisonPDF({
            propertyValue: input.propertyValue,
            propertyDetails: input.propertyDetails,
            comparison,
            generatedAt: new Date(),
          });

          // Send email with PDF attachment
          await sendComparisonEmail({
            to: input.email,
            propertyValue: input.propertyValue,
            comparison,
            pdfBuffer,
          });

          // Track this as a lead in the database
          await createLead({
            firstName: "",
            email: input.email,
            phone: "",
            propertyZip: input.propertyDetails.zipCode,
            source: "comparison_email",
          });

          // Notify owner
          await notifyOwner({
            title: "New Comparison Report Request",
            content: `Email: ${input.email}\nProperty: ${input.propertyDetails.squareFeet}sqft ${input.propertyDetails.propertyType} in ${input.propertyDetails.zipCode}\nValue: $${input.propertyValue.toLocaleString()}`,
          });

          return { success: true };
        } catch (error) {
          console.error("[PropertyValuation] Failed to email comparison:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send email. Please try again.",
          });
        }
      }),

    smsComparison: publicProcedure
      .input(z.object({
        phone: z.string().min(10, "Phone number is required"),
        propertyValue: z.number().min(10000),
        mortgageBalance: z.number().min(0),
        propertyDetails: z.object({
          zipCode: z.string(),
          propertyType: z.string(),
          squareFeet: z.number(),
          bedrooms: z.number(),
          bathrooms: z.number(),
          condition: z.string(),
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          const { calculateSaleOptions } = await import("./saleOptionsComparison");
          const { sendComparisonSms, isValidPhoneNumber } = await import("./comparisonSmsService");
          
          // Validate phone number
          if (!isValidPhoneNumber(input.phone)) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid phone number. Please enter a valid US phone number.",
            });
          }

          const comparison = calculateSaleOptions(input.propertyValue, input.mortgageBalance);
          
          // Send SMS with comparison summary
          await sendComparisonSms({
            phone: input.phone,
            propertyValue: input.propertyValue,
            comparison,
          });

          // Track this as a lead in the database
          await createLead({
            firstName: "",
            email: "",
            phone: input.phone,
            propertyZip: input.propertyDetails.zipCode,
            source: "comparison_sms",
          });

          // Notify owner
          await notifyOwner({
            title: "New SMS Comparison Request",
            content: `Phone: ${input.phone}\nProperty: ${input.propertyDetails.squareFeet}sqft ${input.propertyDetails.propertyType} in ${input.propertyDetails.zipCode}\nValue: $${input.propertyValue.toLocaleString()}`,
          });

          return { success: true };
        } catch (error) {
          console.error("[PropertyValuation] Failed to send SMS comparison:", error);
          if (error instanceof TRPCError) {
            throw error;
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send SMS. Please try again.",
          });
        }
      }),

    saveCalculation: publicProcedure
      .input(z.object({
        email: z.string().email(),
        zipCode: z.string(),
        propertyType: z.string(),
        squareFeet: z.number(),
        bedrooms: z.number(),
        bathrooms: z.number(),
        condition: z.string(),
        mortgageBalance: z.number(),
        estimatedValue: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { saveCalculation } = await import("./savedCalculationsDb");
          const { sendResumeEmail } = await import("./saveResumeEmailService");
          const { createLead } = await import("./db");
          const { notifyOwner } = await import("./_core/notification");

          // Save calculation and get token
          const token = await saveCalculation({
            email: input.email,
            zipCode: input.zipCode,
            propertyType: input.propertyType,
            squareFeet: input.squareFeet,
            bedrooms: input.bedrooms,
            bathrooms: input.bathrooms,
            condition: input.condition,
            mortgageBalance: input.mortgageBalance,
            estimatedValue: input.estimatedValue,
          });

          // Send resume email
          await sendResumeEmail({
            to: input.email,
            token,
            propertyDetails: {
              zipCode: input.zipCode,
              propertyType: input.propertyType,
              squareFeet: input.squareFeet,
            },
          });

          // Track as lead
          await createLead({
            firstName: "",
            email: input.email,
            phone: "",
            propertyZip: input.zipCode,
            source: "save_resume",
          });

          // Notify owner
          await notifyOwner({
            title: "New Save & Resume Request",
            content: `Email: ${input.email}\nProperty: ${input.squareFeet}sqft ${input.propertyType} in ${input.zipCode}`,
          });

          return { success: true, token };
        } catch (error) {
          console.error("[PropertyValuation] Failed to save calculation:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save calculation. Please try again.",
          });
        }
      }),

    getCalculation: publicProcedure
      .input(z.object({
        token: z.string(),
      }))
      .query(async ({ input }) => {
        try {
          const { getCalculationByToken } = await import("./savedCalculationsDb");
          
          const calculation = await getCalculationByToken(input.token);
          
          if (!calculation) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Calculation not found or expired.",
            });
          }

          return calculation;
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          console.error("[PropertyValuation] Failed to retrieve calculation:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve calculation.",
          });
        }
      }),
  }),

  // AI Chatbot functionality
  chatbot: router({
    sendMessage: publicProcedure
      .input(z.object({
        message: z.string().min(1, "Message is required"),
        conversationHistory: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { message, conversationHistory = [] } = input;
          
          // Import LLM and knowledge base
          const { invokeLLM } = await import("./_core/llm");
          const { FORECLOSURE_KNOWLEDGE_BASE, CHATBOT_SYSTEM_PROMPT } = await import("./foreclosureKnowledgeBase");
          
          // Build messages array with system prompt and conversation history
          const messages = [
            {
              role: "system" as const,
              content: `${CHATBOT_SYSTEM_PROMPT}\n\n---\n\nKNOWLEDGE BASE:\n${FORECLOSURE_KNOWLEDGE_BASE}`,
            },
            ...conversationHistory.map(msg => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })),
            {
              role: "user" as const,
              content: message,
            },
          ];
          
          // Call LLM API
          const response = await invokeLLM({ messages });
          
          const assistantMessage = response.choices[0]?.message?.content || "I apologize, but I'm having trouble responding right now. Please call us at (832) 932-7585 for immediate assistance.";
          
          return {
            success: true,
            message: assistantMessage,
          };
        } catch (error) {
          console.error("[Chatbot] Failed to process message:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to process your message. Please try again or call us at (832) 932-7585.",
          });
        }
      }),
  }),

  // Resources download with lead capture
  resources: router({
    downloadWithCapture: publicProcedure
      .input(z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        resourceName: z.string(),
        resourceFile: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { name, email, resourceName, resourceFile } = input;

        try {
          // Import dependencies
          const { createResourceDownload } = await import("./resourceDownloadsDb");
          const { sendResourceEmail } = await import("./resourceEmailService");
          const { createLead } = await import("./db");

          // Get IP address from request
          const ipAddress = ctx.req.headers["x-forwarded-for"] as string || ctx.req.socket.remoteAddress || "";
          const userAgent = ctx.req.headers["user-agent"] || "";

          // Track download in database
          await createResourceDownload({
            name,
            email,
            resourceName,
            resourceFile,
            ipAddress,
            userAgent,
          });

          // Create lead in database (extract first name if full name provided)
          const firstName = name.split(" ")[0] || name;
          try {
            await createLead({
              firstName,
              email,
              phone: "(000) 000-0000", // Placeholder since we only capture name/email
              propertyZip: "00000", // Placeholder
              smsConsent: "no",
              source: `resource_download_${resourceFile}`,
              status: "new",
              notes: `Downloaded resource: ${resourceName}`,
            });
          } catch (leadError) {
            // Lead creation might fail if email already exists, that's okay
            console.log("[Resources] Lead creation skipped (may already exist):", leadError);
          }

          // Send email with PDF attachment
          const emailSent = await sendResourceEmail({
            recipientName: name,
            recipientEmail: email,
            resourceName,
            resourceFile,
          });

          // Notify owner
          await notifyOwner({
            title: `New Resource Download: ${resourceName}`,
            content: `${name} (${email}) downloaded ${resourceName}`,
          });

          return {
            success: true,
            emailSent,
            message: emailSent 
              ? "Check your email! We've sent you the PDF guide."
              : "Download captured! We'll send you the guide shortly.",
          };
        } catch (error) {
          console.error("[Resources] Failed to process download:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to process your request. Please try again.",
          });
        }
      }),
  }),

  // Phone call tracking
  tracking: router({
    trackPhoneCall: publicProcedure
      .input(z.object({
        phoneNumber: z.string(),
        pagePath: z.string(),
        pageTitle: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Extract IP address and user agent from request
          const ipAddress = ctx.req.headers['x-forwarded-for'] as string || 
                           ctx.req.headers['x-real-ip'] as string || 
                           ctx.req.socket?.remoteAddress || 
                           undefined;
          const userAgent = ctx.req.headers['user-agent'] || undefined;
          
          // Get user email if authenticated
          const userEmail = ctx.user?.email || undefined;

          await trackPhoneCall({
            phoneNumber: input.phoneNumber,
            pagePath: input.pagePath,
            pageTitle: input.pageTitle,
            userEmail,
            ipAddress,
            userAgent,
          });

          return { success: true };
        } catch (error) {
          console.error("[Tracking] Failed to track phone call:", error);
          // Don't throw error - we don't want to block the user's call
          return { success: false };
        }
      }),

    getCallStats: protectedProcedure
      .query(async ({ ctx }) => {
        // Admin-only endpoint
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          const stats = await getPhoneCallStats();
          return stats;
        } catch (error) {
          console.error("[Tracking] Failed to get call stats:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve call statistics",
          });
        }
      }),

    getRecentCalls: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(200).optional().default(50),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        pagePath: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        // Admin-only endpoint
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          const calls = await getRecentPhoneCalls(input.limit, {
            startDate: input.startDate,
            endDate: input.endDate,
            pagePath: input.pagePath,
          });
          return calls;
        } catch (error) {
          console.error("[Tracking] Failed to get recent calls:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve recent calls",
          });
        }
      }),

    getCallVolumeByDate: protectedProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .query(async ({ input, ctx }) => {
        // Admin-only endpoint
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          const volumeData = await getCallVolumeByDate({
            startDate: input.startDate,
            endDate: input.endDate,
          });
          return volumeData;
        } catch (error) {
          console.error("[Tracking] Failed to get call volume by date:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve call volume data",
          });
        }
      }),
  }),

  bookings: router({
    getStats: protectedProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .query(async ({ input, ctx }) => {
        // Admin-only endpoint
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          const stats = await getBookingStats({
            startDate: input.startDate,
            endDate: input.endDate,
          });
          return stats;
        } catch (error) {
          console.error("[Bookings] Failed to get booking stats:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve booking statistics",
          });
        }
      }),

    getRecent: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(200).optional().default(50),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        sourcePage: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        // Admin-only endpoint
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          const bookings = await getRecentBookings(input.limit, {
            startDate: input.startDate,
            endDate: input.endDate,
            sourcePage: input.sourcePage,
          });
          return bookings;
        } catch (error) {
          console.error("[Bookings] Failed to get recent bookings:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve recent bookings",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
