import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table for capturing homeowner information from the landing page.
 * Stores contact details and property information for follow-up.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  propertyZip: varchar("propertyZip", { length: 10 }).notNull(),
  smsConsent: mysqlEnum("smsConsent", ["yes", "no"]).default("no").notNull(),
  source: varchar("source", { length: 255 }).default("landing_page").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "closed"]).default("new").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Lead notes table for tracking all interactions and updates for each lead.
 * Allows multiple notes per lead with timestamps and author tracking.
 */
export const leadNotes = mysqlTable("leadNotes", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  note: text("note").notNull(),
  noteType: mysqlEnum("noteType", ["general", "status_change", "call", "email", "meeting"]).default("general").notNull(),
  createdBy: varchar("createdBy", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeadNote = typeof leadNotes.$inferSelect;
export type InsertLeadNote = typeof leadNotes.$inferInsert;

/**
 * Testimonials table for storing user-submitted success stories.
 * Captures homeowner experiences and outcomes for social proof.
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  situation: varchar("situation", { length: 200 }).notNull(),
  story: text("story").notNull(),
  outcome: text("outcome").notNull(),
  permissionToPublish: mysqlEnum("permissionToPublish", ["yes", "no"]).default("no").notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  theme: mysqlEnum("theme", [
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
  ]),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;
/**
 * Email campaigns table for tracking drip campaign enrollment and progress.
 * Each lead can have one active campaign with scheduled email send times.
 */
export const emailCampaigns = mysqlTable("emailCampaigns", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  campaignType: varchar("campaignType", { length: 50 }).default("chatbot_nurture").notNull(),
  status: mysqlEnum("status", ["active", "paused", "completed", "unsubscribed"]).default("active").notNull(),
  currentEmailSequence: int("currentEmailSequence").default(0).notNull(), // 0 = not started, 1-4 = email number
  email1ScheduledAt: timestamp("email1ScheduledAt"),
  email1SentAt: timestamp("email1SentAt"),
  email2ScheduledAt: timestamp("email2ScheduledAt"),
  email2SentAt: timestamp("email2SentAt"),
  email3ScheduledAt: timestamp("email3ScheduledAt"),
  email3SentAt: timestamp("email3SentAt"),
  email4ScheduledAt: timestamp("email4ScheduledAt"),
  email4SentAt: timestamp("email4SentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type InsertEmailCampaign = typeof emailCampaigns.$inferInsert;

/**
 * Email delivery log table for tracking individual email sends and engagement.
 * Records delivery status, opens, and clicks for analytics.
 */
export const emailDeliveryLog = mysqlTable("emailDeliveryLog", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  leadId: int("leadId").notNull(),
  emailSequence: int("emailSequence").notNull(), // 1, 2, 3, or 4
  emailType: varchar("emailType", { length: 100 }).notNull(), // "welcome_guide", "timeline_calculator", "success_story", "consultation_reminder"
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  deliveryStatus: mysqlEnum("deliveryStatus", ["pending", "sent", "failed", "bounced"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt"),
  openedAt: timestamp("openedAt"),
  clickedAt: timestamp("clickedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailDeliveryLog = typeof emailDeliveryLog.$inferSelect;
export type InsertEmailDeliveryLog = typeof emailDeliveryLog.$inferInsert;

/**
 * Saved calculations table for Save & Resume feature.
 * Stores property valuation form data with unique tokens for retrieval.
 */
export const savedCalculations = mysqlTable("savedCalculations", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 64 }).notNull().unique(), // Unique token for resume link
  email: varchar("email", { length: 320 }).notNull(),
  
  // Property details
  zipCode: varchar("zipCode", { length: 10 }).notNull(),
  propertyType: varchar("propertyType", { length: 50 }).notNull(),
  squareFeet: int("squareFeet").notNull(),
  bedrooms: int("bedrooms").notNull(),
  bathrooms: int("bathrooms").notNull(),
  condition: varchar("condition", { length: 50 }).notNull(),
  mortgageBalance: int("mortgageBalance").notNull(),
  
  // Calculation results (optional, stored if calculation was completed)
  estimatedValue: int("estimatedValue"),
  
  // Tracking
  resumedCount: int("resumedCount").default(0).notNull(), // How many times the link was used
  lastResumedAt: timestamp("lastResumedAt"),
  expiresAt: timestamp("expiresAt").notNull(), // 30 days from creation
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SavedCalculation = typeof savedCalculations.$inferSelect;
export type InsertSavedCalculation = typeof savedCalculations.$inferInsert;

/**
 * Resource downloads table for tracking PDF guide downloads with lead capture.
 * Records contact information and which resource was downloaded for follow-up.
 */
export const resourceDownloads = mysqlTable("resourceDownloads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  resourceName: varchar("resourceName", { length: 200 }).notNull(), // e.g., "Texas Foreclosure Survival Guide"
  resourceFile: varchar("resourceFile", { length: 200 }).notNull(), // e.g., "Texas_Foreclosure_Survival_Guide.pdf"
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv4 or IPv6
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ResourceDownload = typeof resourceDownloads.$inferSelect;
export type InsertResourceDownload = typeof resourceDownloads.$inferInsert;

/**
 * Phone call tracking table - tracks click-to-call events
 */
export const phoneCallTracking = mysqlTable("phoneCallTracking", {
  id: int("id").autoincrement().primaryKey(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(), // Phone number clicked
  pagePath: varchar("pagePath", { length: 255 }).notNull(), // Page where click occurred
  pageTitle: varchar("pageTitle", { length: 255 }), // Title of the page
  userEmail: varchar("userEmail", { length: 320 }), // Email if user is logged in
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv4 or IPv6
  userAgent: text("userAgent"),
  clickedAt: timestamp("clickedAt").defaultNow().notNull(),
});

export type PhoneCallTracking = typeof phoneCallTracking.$inferSelect;
export type InsertPhoneCallTracking = typeof phoneCallTracking.$inferInsert;
