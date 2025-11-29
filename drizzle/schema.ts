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
  propertyAddress: varchar("propertyAddress", { length: 255 }),
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
  utmSource: varchar("utmSource", { length: 255 }), // Marketing source attribution
  utmMedium: varchar("utmMedium", { length: 255 }), // Marketing medium attribution
  utmCampaign: varchar("utmCampaign", { length: 255 }), // Campaign attribution
  utmTerm: varchar("utmTerm", { length: 255 }), // Keyword attribution
  utmContent: varchar("utmContent", { length: 255 }), // Content variant attribution
  clickedAt: timestamp("clickedAt").defaultNow().notNull(),
});

export type PhoneCallTracking = typeof phoneCallTracking.$inferSelect;
export type InsertPhoneCallTracking = typeof phoneCallTracking.$inferInsert;

/**
 * Booking confirmations table - tracks completed GHL calendar bookings
 * Captures booking details from webhook for conversion tracking and analytics
 */
export const bookingConfirmations = mysqlTable("bookingConfirmations", {
  id: int("id").autoincrement().primaryKey(),
  // Contact information
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  
  // Booking details
  bookingDateTime: timestamp("bookingDateTime").notNull(), // When the consultation is scheduled
  calendarEventId: varchar("calendarEventId", { length: 100 }), // GHL event ID for reference
  calendarName: varchar("calendarName", { length: 200 }), // Which calendar was booked
  
  // Tracking
  sourcePage: varchar("sourcePage", { length: 255 }), // Page where booking button was clicked
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv4 or IPv6
  userAgent: text("userAgent"),
  
  // UTM Attribution
  utmSource: varchar("utmSource", { length: 255 }), // Marketing source attribution
  utmMedium: varchar("utmMedium", { length: 255 }), // Marketing medium attribution
  utmCampaign: varchar("utmCampaign", { length: 255 }), // Campaign attribution
  utmTerm: varchar("utmTerm", { length: 255 }), // Keyword attribution
  utmContent: varchar("utmContent", { length: 255 }), // Content variant attribution
  
  // Webhook metadata
  webhookPayload: text("webhookPayload"), // Store full GHL webhook payload as JSON for debugging
  
  createdAt: timestamp("createdAt").defaultNow().notNull(), // When booking was confirmed
});

export type BookingConfirmation = typeof bookingConfirmations.$inferSelect;
export type InsertBookingConfirmation = typeof bookingConfirmations.$inferInsert;

/**
 * Page views table - tracks unique visitors to each page for funnel analysis
 * Uses sessionId to deduplicate views within the same browsing session
 */
export const pageViews = mysqlTable("pageViews", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(), // Browser session identifier
  pagePath: varchar("pagePath", { length: 255 }).notNull(), // Page URL path
  pageTitle: varchar("pageTitle", { length: 255 }), // Page title
  userEmail: varchar("userEmail", { length: 320 }), // Email if user is logged in
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv4 or IPv6
  userAgent: text("userAgent"),
  referrer: varchar("referrer", { length: 500 }), // Where visitor came from
  utmSource: varchar("utmSource", { length: 255 }), // Marketing source (e.g., google, facebook)
  utmMedium: varchar("utmMedium", { length: 255 }), // Marketing medium (e.g., cpc, email, social)
  utmCampaign: varchar("utmCampaign", { length: 255 }), // Campaign name
  utmTerm: varchar("utmTerm", { length: 255 }), // Paid search keywords
  utmContent: varchar("utmContent", { length: 255 }), // Ad content variant
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;

/**
 * Chat engagement table - tracks GHL chat widget interactions
 * Event types: chat_opened, message_sent, conversation_completed
 */
export const chatEngagement = mysqlTable("chatEngagement", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(), // Browser session identifier
  eventType: mysqlEnum("eventType", ["chat_opened", "message_sent", "conversation_completed"]).notNull(),
  pagePath: varchar("pagePath", { length: 255 }).notNull(), // Page where event occurred
  pageTitle: varchar("pageTitle", { length: 255 }), // Page title
  userEmail: varchar("userEmail", { length: 320 }), // Email if user is logged in
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv4 or IPv6
  userAgent: text("userAgent"),
  
  // UTM Attribution (first-touch)
  utmSource: varchar("utmSource", { length: 255 }),
  utmMedium: varchar("utmMedium", { length: 255 }),
  utmCampaign: varchar("utmCampaign", { length: 255 }),
  utmTerm: varchar("utmTerm", { length: 255 }),
  utmContent: varchar("utmContent", { length: 255 }),
  
  eventAt: timestamp("eventAt").defaultNow().notNull(),
});

export type ChatEngagement = typeof chatEngagement.$inferSelect;
export type InsertChatEngagement = typeof chatEngagement.$inferInsert;

/**
 * Campaigns table for organizing shortened links into groups.
 * Enables bulk management and performance comparison.
 */
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  /** Campaign name (e.g., "Winter 2024 Email", "Facebook Ads Q1") */
  name: varchar("name", { length: 255 }).notNull(),
  /** Optional description of the campaign */
  description: text("description"),
  /** Campaign color for visual identification (hex code) */
  color: varchar("color", { length: 7 }).default("#3b82f6"),
  /** User who created this campaign */
  createdBy: varchar("createdBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

/**
 * Shortened links table for branded URL shortening and click tracking.
 * Stores original URLs, generated short codes, and click analytics.
 */
export const shortenedLinks = mysqlTable("shortenedLinks", {
  id: int("id").autoincrement().primaryKey(),
  /** Original long URL to redirect to */
  originalUrl: text("originalUrl").notNull(),
  /** Short code used in the branded URL (e.g., "abc123" for links.enteractai.com/abc123) */
  shortCode: varchar("shortCode", { length: 20 }).notNull().unique(),
  /** Optional custom alias for the short code */
  customAlias: varchar("customAlias", { length: 100 }),
  /** Total number of clicks on this shortened link */
  clicks: int("clicks").default(0).notNull(),
  /** User who created this shortened link (null for system-generated) */
  createdBy: varchar("createdBy", { length: 64 }),
  /** Optional title/description for the link */
  title: varchar("title", { length: 255 }),
  /** Link expiration date (null = never expires) */
  expiresAt: timestamp("expiresAt"),
  /** Whether the link is currently active (false = deactivated) */
  isActive: int("isActive").default(1).notNull(),
  /** Campaign ID for grouping links (null = no campaign) */
  campaignId: int("campaignId"),
  /** UTM parameters to append to the original URL */
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  utmTerm: varchar("utmTerm", { length: 100 }),
  utmContent: varchar("utmContent", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShortenedLink = typeof shortenedLinks.$inferSelect;
export type InsertShortenedLink = typeof shortenedLinks.$inferInsert;

/**
 * Link clicks table for detailed click tracking and analytics.
 * Records each click on a shortened link with metadata.
 */
export const linkClicks = mysqlTable("linkClicks", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to the shortened link */
  shortCode: varchar("shortCode", { length: 20 }).notNull(),
  /** IP address of the visitor */
  ipAddress: varchar("ipAddress", { length: 45 }),
  /** User agent string */
  userAgent: text("userAgent"),
  /** HTTP referer */
  referer: text("referer"),
  /** User email if authenticated */
  userEmail: varchar("userEmail", { length: 320 }),
  /** Session ID for tracking unique visitors */
  sessionId: varchar("sessionId", { length: 255 }),
  /** Geographic data */
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  /** Device and browser information */
  deviceType: varchar("deviceType", { length: 50 }), // mobile, desktop, tablet
  browser: varchar("browser", { length: 50 }), // chrome, firefox, safari, etc.
  os: varchar("os", { length: 50 }), // windows, macos, ios, android, etc.
  clickedAt: timestamp("clickedAt").defaultNow().notNull(),
});

export type LinkClick = typeof linkClicks.$inferSelect;
export type InsertLinkClick = typeof linkClicks.$inferInsert;

/**
 * Comparison history table for storing property valuation calculations.
 * Allows users to view their past property valuations and comparisons.
 */
export const comparisonHistory = mysqlTable("comparisonHistory", {
  id: int("id").autoincrement().primaryKey(),
  /** User ID (references users table) */
  userId: int("userId").notNull(),
  /** Property details */
  propertyAddress: varchar("propertyAddress", { length: 255 }),
  zipCode: varchar("zipCode", { length: 10 }).notNull(),
  propertyType: varchar("propertyType", { length: 50 }).notNull(),
  squareFeet: int("squareFeet").notNull(),
  bedrooms: int("bedrooms").notNull(),
  bathrooms: int("bathrooms").notNull(),
  condition: varchar("condition", { length: 50 }).notNull(),
  /** Calculation results */
  estimatedValue: int("estimatedValue").notNull(),
  mortgageBalance: int("mortgageBalance").notNull(),
  equity: int("equity").notNull(),
  /** Timestamps */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ComparisonHistory = typeof comparisonHistory.$inferSelect;
export type InsertComparisonHistory = typeof comparisonHistory.$inferInsert;
