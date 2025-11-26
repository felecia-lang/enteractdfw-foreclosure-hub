import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertLead, InsertLeadNote, InsertTestimonial, InsertUser, leadNotes, leads, testimonials, users, emailCampaigns, emailDeliveryLog, InsertEmailCampaign, InsertEmailDeliveryLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Lead management functions
export async function createLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create lead: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(leads).values(lead);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create lead:", error);
    throw error;
  }
}

export async function getAllLeads() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get leads: database not available");
    return [];
  }

  try {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get leads:", error);
    return [];
  }
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get lead: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get lead:", error);
    return undefined;
  }
}

export async function updateLeadStatus(id: number, status: "new" | "contacted" | "qualified" | "closed") {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update lead: database not available");
    return undefined;
  }

  try {
    await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update lead status:", error);
    throw error;
  }
}

export async function updateLeadNotes(id: number, notes: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update lead: database not available");
    return undefined;
  }

  try {
    await db.update(leads).set({ notes, updatedAt: new Date() }).where(eq(leads.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update lead notes:", error);
    throw error;
  }
}

// Lead notes functions
export async function createLeadNote(note: InsertLeadNote) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create note: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(leadNotes).values(note);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create note:", error);
    throw error;
  }
}

export async function getLeadNotes(leadId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get notes: database not available");
    return [];
  }

  try {
    return await db.select().from(leadNotes).where(eq(leadNotes.leadId, leadId)).orderBy(desc(leadNotes.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get notes:", error);
    return [];
  }
}

// Testimonial management functions
export async function createTestimonial(testimonial: InsertTestimonial) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create testimonial: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(testimonials).values(testimonial);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create testimonial:", error);
    throw error;
  }
}

export async function getAllTestimonials() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get testimonials: database not available");
    return [];
  }

  try {
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get testimonials:", error);
    return [];
  }
}

export async function getApprovedTestimonials() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get testimonials: database not available");
    return [];
  }

  try {
    return await db.select().from(testimonials).where(eq(testimonials.status, "approved")).orderBy(desc(testimonials.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get approved testimonials:", error);
    return [];
  }
}

export async function updateTestimonialStatus(id: number, status: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update testimonial: database not available");
    return undefined;
  }

  try {
    const updateData: any = { status, updatedAt: new Date() };
    if (status === "approved") {
      updateData.publishedAt = new Date();
    }
    await db.update(testimonials).set(updateData).where(eq(testimonials.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update testimonial status:", error);
    throw error;
  }
}

export async function updateTestimonial(id: number, data: Partial<InsertTestimonial>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update testimonial: database not available");
    return undefined;
  }

  try {
    await db.update(testimonials).set({ ...data, updatedAt: new Date() }).where(eq(testimonials.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update testimonial:", error);
    throw error;
  }
}

export async function deleteTestimonial(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete testimonial: database not available");
    return undefined;
  }

  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to delete testimonial:", error);
    throw error;
  }
}

export async function getTestimonialsByStatus(status?: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get testimonials: database not available");
    return [];
  }

  try {
    if (status) {
      return await db.select().from(testimonials).where(eq(testimonials.status, status)).orderBy(desc(testimonials.createdAt));
    }
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get testimonials:", error);
    return [];
  }
}

// ============================================
// Email Campaign Functions
// ============================================

/**
 * Create a new email campaign for a lead
 * Automatically schedules all 4 emails based on creation date
 */
export async function createEmailCampaign(leadId: number): Promise<number | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create email campaign: database not available");
    return null;
  }

  try {
    const now = new Date();
    const day1 = new Date(now.getTime()); // Immediate
    const day3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 days
    const day7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days
    const day14 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 days

    const campaign: InsertEmailCampaign = {
      leadId,
      campaignType: "chatbot_nurture",
      status: "active",
      currentEmailSequence: 0,
      email1ScheduledAt: day1,
      email2ScheduledAt: day3,
      email3ScheduledAt: day7,
      email4ScheduledAt: day14,
    };

    const result = await db.insert(emailCampaigns).values(campaign);
    return result[0]?.insertId || null;
  } catch (error) {
    console.error("[Database] Failed to create email campaign:", error);
    return null;
  }
}

/**
 * Get all email campaigns that have due emails to send
 * Returns campaigns where scheduledAt <= now and sentAt is null
 */
export async function getDueEmailCampaigns() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get due campaigns: database not available");
    return [];
  }

  try {
    const now = new Date();
    
    // Get all active campaigns
    const campaigns = await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.status, "active"));

    // Filter campaigns that have due emails
    const dueCampaigns = campaigns.filter((campaign) => {
      // Check each email sequence
      if (!campaign.email1SentAt && campaign.email1ScheduledAt && campaign.email1ScheduledAt <= now) {
        return true;
      }
      if (!campaign.email2SentAt && campaign.email2ScheduledAt && campaign.email2ScheduledAt <= now) {
        return true;
      }
      if (!campaign.email3SentAt && campaign.email3ScheduledAt && campaign.email3ScheduledAt <= now) {
        return true;
      }
      if (!campaign.email4SentAt && campaign.email4ScheduledAt && campaign.email4ScheduledAt <= now) {
        return true;
      }
      return false;
    });

    return dueCampaigns;
  } catch (error) {
    console.error("[Database] Failed to get due campaigns:", error);
    return [];
  }
}

/**
 * Mark an email as sent in the campaign
 */
export async function markEmailAsSent(campaignId: number, emailSequence: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot mark email as sent: database not available");
    return;
  }

  try {
    const now = new Date();
    const updateData: any = {
      currentEmailSequence: emailSequence,
      updatedAt: now,
    };

    // Set the appropriate sentAt field
    if (emailSequence === 1) {
      updateData.email1SentAt = now;
    } else if (emailSequence === 2) {
      updateData.email2SentAt = now;
    } else if (emailSequence === 3) {
      updateData.email3SentAt = now;
    } else if (emailSequence === 4) {
      updateData.email4SentAt = now;
      updateData.status = "completed"; // Mark campaign as completed after final email
    }

    await db
      .update(emailCampaigns)
      .set(updateData)
      .where(eq(emailCampaigns.id, campaignId));
  } catch (error) {
    console.error("[Database] Failed to mark email as sent:", error);
  }
}

/**
 * Log an email delivery attempt
 */
export async function logEmailDelivery(log: InsertEmailDeliveryLog) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot log email delivery: database not available");
    return;
  }

  try {
    await db.insert(emailDeliveryLog).values(log);
  } catch (error) {
    console.error("[Database] Failed to log email delivery:", error);
  }
}

/**
 * Get email campaign statistics for admin dashboard
 */
export async function getEmailCampaignStats() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get campaign stats: database not available");
    return null;
  }

  try {
    const allCampaigns = await db.select().from(emailCampaigns);
    
    const stats = {
      totalCampaigns: allCampaigns.length,
      activeCampaigns: allCampaigns.filter(c => c.status === "active").length,
      completedCampaigns: allCampaigns.filter(c => c.status === "completed").length,
      unsubscribed: allCampaigns.filter(c => c.status === "unsubscribed").length,
      totalEmailsSent: allCampaigns.reduce((sum, c) => {
        let count = 0;
        if (c.email1SentAt) count++;
        if (c.email2SentAt) count++;
        if (c.email3SentAt) count++;
        if (c.email4SentAt) count++;
        return sum + count;
      }, 0),
    };

    return stats;
  } catch (error) {
    console.error("[Database] Failed to get campaign stats:", error);
    return null;
  }
}

// Phone call tracking functions
export async function trackPhoneCall(data: {
  phoneNumber: string;
  pagePath: string;
  pageTitle?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot track phone call: database not available");
    return undefined;
  }

  try {
    const { phoneCallTracking } = await import("../drizzle/schema");
    const result = await db.insert(phoneCallTracking).values({
      phoneNumber: data.phoneNumber,
      pagePath: data.pagePath,
      pageTitle: data.pageTitle || null,
      userEmail: data.userEmail || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
    });

    console.log(`[PhoneCallTracking] Tracked call to ${data.phoneNumber} from ${data.pagePath}`);
    return result;
  } catch (error) {
    console.error("[Database] Failed to track phone call:", error);
    throw error;
  }
}

export async function getPhoneCallStats() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get phone call stats: database not available");
    return [];
  }

  try {
    const { phoneCallTracking } = await import("../drizzle/schema");
    const { sql } = await import("drizzle-orm");
    
    // Get call counts grouped by page
    const stats = await db
      .select({
        pagePath: phoneCallTracking.pagePath,
        pageTitle: phoneCallTracking.pageTitle,
        callCount: sql<number>`count(*)`,
      })
      .from(phoneCallTracking)
      .groupBy(phoneCallTracking.pagePath, phoneCallTracking.pageTitle)
      .orderBy(sql`count(*) DESC`);

    return stats;
  } catch (error) {
    console.error("[Database] Failed to get phone call stats:", error);
    throw error;
  }
}

export async function getRecentPhoneCalls(
  limit: number = 50,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    pagePath?: string;
  }
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get recent phone calls: database not available");
    return [];
  }

  try {
    const { phoneCallTracking } = await import("../drizzle/schema");
    const { desc, and, gte, lte, eq } = await import("drizzle-orm");
    
    // Build where conditions
    const conditions = [];
    if (filters?.startDate) {
      conditions.push(gte(phoneCallTracking.clickedAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(phoneCallTracking.clickedAt, filters.endDate));
    }
    if (filters?.pagePath) {
      conditions.push(eq(phoneCallTracking.pagePath, filters.pagePath));
    }

    let query = db
      .select()
      .from(phoneCallTracking)
      .orderBy(desc(phoneCallTracking.clickedAt))
      .limit(limit);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const calls = await query;
    return calls;
  } catch (error) {
    console.error("[Database] Failed to get recent phone calls:", error);
    throw error;
  }
}

export async function getCallVolumeByDate(filters?: {
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get call volume by date: database not available");
    return [];
  }

  try {
    const { phoneCallTracking } = await import("../drizzle/schema");
    const { sql, and, gte, lte } = await import("drizzle-orm");
    
    // Build where conditions
    const conditions = [];
    if (filters?.startDate) {
      conditions.push(gte(phoneCallTracking.clickedAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(phoneCallTracking.clickedAt, filters.endDate));
    }

    // Use a subquery to properly group by date
    const dateColumn = sql<string>`DATE(${phoneCallTracking.clickedAt})`;
    
    let query = db
      .select({
        date: dateColumn,
        callCount: sql<number>`count(*)`,
      })
      .from(phoneCallTracking)
      .groupBy(dateColumn)
      .orderBy(sql`${dateColumn} DESC`);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const volumeData = await query;
    return volumeData;
  } catch (error) {
    console.error("[Database] Failed to get call volume by date:", error);
    throw error;
  }
}


// ============================================================================
// Booking Confirmations
// ============================================================================

export async function saveBookingConfirmation(data: {
  name: string;
  email: string;
  phone?: string;
  bookingDateTime: Date;
  calendarEventId?: string;
  calendarName?: string;
  sourcePage?: string;
  ipAddress?: string;
  userAgent?: string;
  webhookPayload?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save booking confirmation: database not available");
    return null;
  }

  try {
    const { bookingConfirmations } = await import("../drizzle/schema");
    
    const booking = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      bookingDateTime: data.bookingDateTime,
      calendarEventId: data.calendarEventId || null,
      calendarName: data.calendarName || null,
      sourcePage: data.sourcePage || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      webhookPayload: data.webhookPayload || null,
    };

    const result = await db.insert(bookingConfirmations).values(booking);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save booking confirmation:", error);
    throw error;
  }
}

export async function getBookingStats(filters?: {
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get booking stats: database not available");
    return [];
  }

  try {
    const { bookingConfirmations } = await import("../drizzle/schema");
    const { sql, and, gte, lte, count } = await import("drizzle-orm");
    
    // Build where conditions
    const conditions = [];
    if (filters?.startDate) {
      conditions.push(gte(bookingConfirmations.createdAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(bookingConfirmations.createdAt, filters.endDate));
    }

    let query = db
      .select({
        sourcePage: bookingConfirmations.sourcePage,
        bookingCount: count(),
      })
      .from(bookingConfirmations)
      .groupBy(bookingConfirmations.sourcePage)
      .orderBy(sql`count(*) DESC`);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const stats = await query;
    return stats;
  } catch (error) {
    console.error("[Database] Failed to get booking stats:", error);
    throw error;
  }
}

export async function getRecentBookings(limit: number = 100, filters?: {
  startDate?: Date;
  endDate?: Date;
  sourcePage?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get recent bookings: database not available");
    return [];
  }

  try {
    const { bookingConfirmations } = await import("../drizzle/schema");
    const { and, gte, lte, eq, desc } = await import("drizzle-orm");
    
    // Build where conditions
    const conditions = [];
    if (filters?.startDate) {
      conditions.push(gte(bookingConfirmations.createdAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(bookingConfirmations.createdAt, filters.endDate));
    }
    if (filters?.sourcePage) {
      conditions.push(eq(bookingConfirmations.sourcePage, filters.sourcePage));
    }

    let query = db
      .select()
      .from(bookingConfirmations)
      .orderBy(desc(bookingConfirmations.createdAt))
      .limit(limit);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const bookings = await query;
    return bookings;
  } catch (error) {
    console.error("[Database] Failed to get recent bookings:", error);
    throw error;
  }
}


// ============================================================================
// Funnel Analytics Functions
// ============================================================================

/**
 * Track a page view for funnel analysis
 * Deduplicates by sessionId + pagePath to count unique visitors per page
 */
export async function trackPageView(data: {
  sessionId: string;
  pagePath: string;
  pageTitle?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot track page view: database not available");
    return;
  }

  try {
    const { pageViews } = await import("../drizzle/schema");
    const { and, eq } = await import("drizzle-orm");

    // Check if this session already viewed this page
    const existing = await db
      .select()
      .from(pageViews)
      .where(
        and(
          eq(pageViews.sessionId, data.sessionId),
          eq(pageViews.pagePath, data.pagePath)
        )
      )
      .limit(1);

    // Only insert if this is a new unique view
    if (existing.length === 0) {
      await db.insert(pageViews).values({
        sessionId: data.sessionId,
        pagePath: data.pagePath,
        pageTitle: data.pageTitle || null,
        userEmail: data.userEmail || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        referrer: data.referrer || null,
      });
    }
  } catch (error) {
    console.error("[Database] Failed to track page view:", error);
    // Don't throw - tracking failures shouldn't break the app
  }
}

/**
 * Get funnel overview metrics
 * Returns: total visitors, calls, bookings, and conversion rates
 */
export async function getFunnelOverview(filters?: {
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get funnel overview: database not available");
    return {
      totalVisitors: 0,
      totalCalls: 0,
      totalBookings: 0,
      visitorToCallRate: 0,
      callToBookingRate: 0,
      overallConversionRate: 0,
    };
  }

  try {
    const { pageViews, phoneCallTracking, bookingConfirmations } = await import("../drizzle/schema");
    const { and, gte, lte, count, countDistinct } = await import("drizzle-orm");

    // Build date filters
    const pageViewConditions = [];
    const callConditions = [];
    const bookingConditions = [];

    if (filters?.startDate) {
      pageViewConditions.push(gte(pageViews.viewedAt, filters.startDate));
      callConditions.push(gte(phoneCallTracking.clickedAt, filters.startDate));
      bookingConditions.push(gte(bookingConfirmations.createdAt, filters.startDate));
    }
    if (filters?.endDate) {
      pageViewConditions.push(lte(pageViews.viewedAt, filters.endDate));
      callConditions.push(lte(phoneCallTracking.clickedAt, filters.endDate));
      bookingConditions.push(lte(bookingConfirmations.createdAt, filters.endDate));
    }

    // Count unique visitors (distinct sessionIds)
    let visitorQuery = db
      .select({ count: countDistinct(pageViews.sessionId) })
      .from(pageViews);
    if (pageViewConditions.length > 0) {
      visitorQuery = visitorQuery.where(and(...pageViewConditions)) as typeof visitorQuery;
    }
    const visitorResult = await visitorQuery;
    const totalVisitors = visitorResult[0]?.count || 0;

    // Count total calls
    let callQuery = db
      .select({ count: count() })
      .from(phoneCallTracking);
    if (callConditions.length > 0) {
      callQuery = callQuery.where(and(...callConditions)) as typeof callQuery;
    }
    const callResult = await callQuery;
    const totalCalls = callResult[0]?.count || 0;

    // Count total bookings
    let bookingQuery = db
      .select({ count: count() })
      .from(bookingConfirmations);
    if (bookingConditions.length > 0) {
      bookingQuery = bookingQuery.where(and(...bookingConditions)) as typeof bookingQuery;
    }
    const bookingResult = await bookingQuery;
    const totalBookings = bookingResult[0]?.count || 0;

    // Calculate conversion rates
    const visitorToCallRate = totalVisitors > 0 ? (totalCalls / totalVisitors) * 100 : 0;
    const callToBookingRate = totalCalls > 0 ? (totalBookings / totalCalls) * 100 : 0;
    const overallConversionRate = totalVisitors > 0 ? (totalBookings / totalVisitors) * 100 : 0;

    return {
      totalVisitors,
      totalCalls,
      totalBookings,
      visitorToCallRate: Math.round(visitorToCallRate * 10) / 10,
      callToBookingRate: Math.round(callToBookingRate * 10) / 10,
      overallConversionRate: Math.round(overallConversionRate * 10) / 10,
    };
  } catch (error) {
    console.error("[Database] Failed to get funnel overview:", error);
    throw error;
  }
}

/**
 * Get funnel metrics grouped by page
 * Shows which pages have the best/worst conversion rates
 */
export async function getFunnelByPage(filters?: {
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get funnel by page: database not available");
    return [];
  }

  try {
    const { pageViews, phoneCallTracking, bookingConfirmations } = await import("../drizzle/schema");
    const { and, gte, lte, count, countDistinct, eq } = await import("drizzle-orm");

    // Build date filter conditions for page views
    const pageViewConditions = [];
    if (filters?.startDate) {
      pageViewConditions.push(gte(pageViews.viewedAt, filters.startDate));
    }
    if (filters?.endDate) {
      pageViewConditions.push(lte(pageViews.viewedAt, filters.endDate));
    }

    // Get all unique pages from page views
    let pageQuery = db
      .select({
        pagePath: pageViews.pagePath,
        pageTitle: pageViews.pageTitle,
        visitors: countDistinct(pageViews.sessionId),
      })
      .from(pageViews)
      .groupBy(pageViews.pagePath, pageViews.pageTitle);

    if (pageViewConditions.length > 0) {
      pageQuery = pageQuery.where(and(...pageViewConditions)) as typeof pageQuery;
    }

    const pages = await pageQuery;

    // For each page, get call and booking counts
    const result = await Promise.all(
      pages.map(async (page) => {
        // Count calls from this page
        const callConditions = [eq(phoneCallTracking.pagePath, page.pagePath)];
        if (filters?.startDate) {
          callConditions.push(gte(phoneCallTracking.clickedAt, filters.startDate));
        }
        if (filters?.endDate) {
          callConditions.push(lte(phoneCallTracking.clickedAt, filters.endDate));
        }
        const callResult = await db
          .select({ count: count() })
          .from(phoneCallTracking)
          .where(and(...callConditions));
        const calls = callResult[0]?.count || 0;

        // Count bookings from this page
        const bookingConditions = [eq(bookingConfirmations.sourcePage, page.pagePath)];
        if (filters?.startDate) {
          bookingConditions.push(gte(bookingConfirmations.createdAt, filters.startDate));
        }
        if (filters?.endDate) {
          bookingConditions.push(lte(bookingConfirmations.createdAt, filters.endDate));
        }
        const bookingResult = await db
          .select({ count: count() })
          .from(bookingConfirmations)
          .where(and(...bookingConditions));
        const bookings = bookingResult[0]?.count || 0;

        // Calculate conversion rates
        const visitorToCallRate = page.visitors > 0 ? (calls / page.visitors) * 100 : 0;
        const callToBookingRate = calls > 0 ? (bookings / calls) * 100 : 0;
        const overallConversionRate = page.visitors > 0 ? (bookings / page.visitors) * 100 : 0;

        return {
          pagePath: page.pagePath,
          pageTitle: page.pageTitle || page.pagePath,
          visitors: page.visitors,
          calls,
          bookings,
          visitorToCallRate: Math.round(visitorToCallRate * 10) / 10,
          callToBookingRate: Math.round(callToBookingRate * 10) / 10,
          overallConversionRate: Math.round(overallConversionRate * 10) / 10,
        };
      })
    );

    // Sort by visitors descending
    return result.sort((a, b) => b.visitors - a.visitors);
  } catch (error) {
    console.error("[Database] Failed to get funnel by page:", error);
    throw error;
  }
}


// ==================== Chat Engagement Tracking ====================

export async function trackChatEvent(data: {
  sessionId: string;
  eventType: "chat_opened" | "message_sent" | "conversation_completed";
  pagePath: string;
  pageTitle?: string;
  userEmail?: string | null;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot track chat event: database not available");
    return;
  }

  try {
    const { chatEngagement } = await import("../drizzle/schema");
    await db.insert(chatEngagement).values({
      ...data,
      ipAddress: null, // Will be set by server
      userAgent: null, // Will be set by server
    });
  } catch (error) {
    console.error("[Database] Failed to track chat event:", error);
  }
}

export async function getChatStats(filters?: {
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get chat stats: database not available");
    return { totalOpens: 0, totalMessages: 0, totalCompletions: 0 };
  }

  try {
    const { chatEngagement } = await import("../drizzle/schema");
    const { sql } = await import("drizzle-orm");

    const conditions = [];
    if (filters?.startDate) {
      conditions.push(sql`${chatEngagement.eventAt} >= ${filters.startDate}`);
    }
    if (filters?.endDate) {
      conditions.push(sql`${chatEngagement.eventAt} <= ${filters.endDate}`);
    }

    const whereClause = conditions.length > 0 ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``;

    const result = await db.execute(sql`
      SELECT 
        SUM(CASE WHEN eventType = 'chat_opened' THEN 1 ELSE 0 END) as totalOpens,
        SUM(CASE WHEN eventType = 'message_sent' THEN 1 ELSE 0 END) as totalMessages,
        SUM(CASE WHEN eventType = 'conversation_completed' THEN 1 ELSE 0 END) as totalCompletions
      FROM chatEngagement
      ${whereClause}
    `);

    const row = result[0] as any;
    return {
      totalOpens: Number(row?.totalOpens || 0),
      totalMessages: Number(row?.totalMessages || 0),
      totalCompletions: Number(row?.totalCompletions || 0),
    };
  } catch (error) {
    console.error("[Database] Failed to get chat stats:", error);
    return { totalOpens: 0, totalMessages: 0, totalCompletions: 0 };
  }
}

export async function getChatEngagementByPage(filters?: {
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get chat engagement by page: database not available");
    return [];
  }

  try {
    const { chatEngagement } = await import("../drizzle/schema");
    const { sql } = await import("drizzle-orm");

    const conditions = [];
    if (filters?.startDate) {
      conditions.push(sql`${chatEngagement.eventAt} >= ${filters.startDate}`);
    }
    if (filters?.endDate) {
      conditions.push(sql`${chatEngagement.eventAt} <= ${filters.endDate}`);
    }

    const whereClause = conditions.length > 0 ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``;

    const result = await db.execute(sql`
      SELECT 
        pagePath,
        pageTitle,
        SUM(CASE WHEN eventType = 'chat_opened' THEN 1 ELSE 0 END) as opens,
        SUM(CASE WHEN eventType = 'message_sent' THEN 1 ELSE 0 END) as messages,
        SUM(CASE WHEN eventType = 'conversation_completed' THEN 1 ELSE 0 END) as completions
      FROM chatEngagement
      ${whereClause}
      GROUP BY pagePath, pageTitle
      ORDER BY opens DESC
    `);

    return result.map((row: any) => ({
      pagePath: row.pagePath,
      pageTitle: row.pageTitle || row.pagePath,
      opens: Number(row.opens || 0),
      messages: Number(row.messages || 0),
      completions: Number(row.completions || 0),
    }));
  } catch (error) {
    console.error("[Database] Failed to get chat engagement by page:", error);
    return [];
  }
}


// ============================================================================
// Link Shortening Functions
// ============================================================================

/**
 * Create a new shortened link
 */
export async function createShortenedLink(data: {
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  createdBy?: string;
  expiresAt?: Date;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create shortened link: database not available");
    return null;
  }

  try {
    const { shortenedLinks } = await import("../drizzle/schema");
    
    const link = {
      originalUrl: data.originalUrl,
      shortCode: data.shortCode,
      customAlias: data.customAlias || null,
      title: data.title || null,
      createdBy: data.createdBy || null,
      expiresAt: data.expiresAt || null,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmTerm: data.utmTerm || null,
      utmContent: data.utmContent || null,
      clicks: 0,
    };

    const result = await db.insert(shortenedLinks).values(link);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create shortened link:", error);
    throw error;
  }
}

/**
 * Get a shortened link by short code or custom alias
 */
export async function getShortenedLink(codeOrAlias: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get shortened link: database not available");
    return null;
  }

  try {
    const { shortenedLinks } = await import("../drizzle/schema");
    const { eq, or } = await import("drizzle-orm");
    
    const results = await db
      .select()
      .from(shortenedLinks)
      .where(
        or(
          eq(shortenedLinks.shortCode, codeOrAlias),
          eq(shortenedLinks.customAlias, codeOrAlias)
        )
      )
      .limit(1);

    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get shortened link:", error);
    throw error;
  }
}

/**
 * Increment click count for a shortened link
 */
export async function incrementLinkClicks(shortCode: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot increment link clicks: database not available");
    return;
  }

  try {
    const { shortenedLinks } = await import("../drizzle/schema");
    const { eq, sql } = await import("drizzle-orm");
    
    await db
      .update(shortenedLinks)
      .set({ clicks: sql`${shortenedLinks.clicks} + 1` })
      .where(eq(shortenedLinks.shortCode, shortCode));
  } catch (error) {
    console.error("[Database] Failed to increment link clicks:", error);
    // Don't throw - tracking failures shouldn't break redirects
  }
}

/**
 * Track a link click with detailed metadata
 */
export async function trackLinkClick(data: {
  shortCode: string;
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
  userEmail?: string;
  sessionId?: string;
  country?: string;
  city?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot track link click: database not available");
    return;
  }

  try {
    const { linkClicks } = await import("../drizzle/schema");
    
    await db.insert(linkClicks).values({
      shortCode: data.shortCode,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      referer: data.referer || null,
      userEmail: data.userEmail || null,
      sessionId: data.sessionId || null,
      country: data.country || null,
      city: data.city || null,
      deviceType: data.deviceType || null,
      browser: data.browser || null,
      os: data.os || null,
    });
  } catch (error) {
    console.error("[Database] Failed to track link click:", error);
    // Don't throw - tracking failures shouldn't break redirects
  }
}

/**
 * Get all shortened links (admin only)
 */
export async function getAllShortenedLinks(filters?: {
  createdBy?: string;
  includeExpired?: boolean;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get all shortened links: database not available");
    return [];
  }

  try {
    const { shortenedLinks } = await import("../drizzle/schema");
    const { eq, and, or, gt, isNull, desc } = await import("drizzle-orm");
    
    const conditions = [];
    
    if (filters?.createdBy) {
      conditions.push(eq(shortenedLinks.createdBy, filters.createdBy));
    }
    
    if (!filters?.includeExpired) {
      // Only include links that haven't expired
      conditions.push(
        or(
          isNull(shortenedLinks.expiresAt),
          gt(shortenedLinks.expiresAt, new Date())
        )
      );
    }

    let query = db
      .select()
      .from(shortenedLinks)
      .orderBy(desc(shortenedLinks.createdAt));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const links = await query;
    return links;
  } catch (error) {
    console.error("[Database] Failed to get all shortened links:", error);
    throw error;
  }
}

/**
 * Get click statistics for a shortened link
 */
export async function getLinkClickStats(shortCode: string, filters?: {
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get link click stats: database not available");
    return {
      totalClicks: 0,
      uniqueVisitors: 0,
      clicksByDate: [],
    };
  }

  try {
    const { linkClicks } = await import("../drizzle/schema");
    const { eq, and, gte, lte, count, countDistinct, sql } = await import("drizzle-orm");
    
    const conditions = [eq(linkClicks.shortCode, shortCode)];
    
    if (filters?.startDate) {
      conditions.push(gte(linkClicks.clickedAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(linkClicks.clickedAt, filters.endDate));
    }

    // Get total clicks
    const totalResult = await db
      .select({ count: count() })
      .from(linkClicks)
      .where(and(...conditions));
    const totalClicks = totalResult[0]?.count || 0;

    // Get unique visitors (by session ID)
    const uniqueResult = await db
      .select({ count: countDistinct(linkClicks.sessionId) })
      .from(linkClicks)
      .where(and(...conditions));
    const uniqueVisitors = uniqueResult[0]?.count || 0;

    // Get clicks by date
    const clicksByDate = await db
      .select({
        date: sql.raw('DATE(clickedAt)'),
        clicks: count(),
      })
      .from(linkClicks)
      .where(and(...conditions))
      .groupBy(sql.raw('DATE(clickedAt)'))
      .orderBy(sql.raw('DATE(clickedAt) DESC'));

    return {
      totalClicks,
      uniqueVisitors,
      clicksByDate,
    };
  } catch (error) {
    console.error("[Database] Failed to get link click stats:", error);
    throw error;
  }
}

/**
 * Delete a shortened link
 */
export async function deleteShortenedLink(shortCode: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete shortened link: database not available");
    return false;
  }

  try {
    const { shortenedLinks } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    
    await db
      .delete(shortenedLinks)
      .where(eq(shortenedLinks.shortCode, shortCode));
    
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete shortened link:", error);
    throw error;
  }
}

/**
 * Update a shortened link
 */
export async function updateShortenedLink(
  shortCode: string,
  updates: {
    title?: string;
    expiresAt?: Date | null;
    originalUrl?: string;
  }
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update shortened link: database not available");
    return false;
  }

  try {
    const { shortenedLinks } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    
    await db
      .update(shortenedLinks)
      .set(updates)
      .where(eq(shortenedLinks.shortCode, shortCode));
    
    return true;
  } catch (error) {
    console.error("[Database] Failed to update shortened link:", error);
    throw error;
  }
}

/**
 * Get comprehensive analytics data for all links or a specific link
 */
export async function getLinkAnalytics(filters?: {
  shortCode?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get link analytics: database not available");
    return null;
  }

  try {
    const { linkClicks } = await import("../drizzle/schema");
    const { eq, and, gte, lte, count, countDistinct, sql } = await import("drizzle-orm");
    
    const conditions = [];
    
    if (filters?.shortCode) {
      conditions.push(eq(linkClicks.shortCode, filters.shortCode));
    }
    if (filters?.startDate) {
      conditions.push(gte(linkClicks.clickedAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(linkClicks.clickedAt, filters.endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Total clicks and unique visitors
    const totalResult = await db
      .select({ count: count() })
      .from(linkClicks)
      .where(whereClause);
    const totalClicks = totalResult[0]?.count || 0;

    const uniqueResult = await db
      .select({ count: countDistinct(linkClicks.sessionId) })
      .from(linkClicks)
      .where(whereClause);
    const uniqueVisitors = uniqueResult[0]?.count || 0;

    // Clicks over time (daily)
    const clicksByDate = await db
      .select({
        date: sql.raw(`DATE(clickedAt)`),
        clicks: count(),
      })
      .from(linkClicks)
      .where(whereClause)
      .groupBy(sql.raw('DATE(clickedAt)'))
      .orderBy(sql.raw('DATE(clickedAt) DESC'))
      .limit(30);

    // Geographic distribution
    const clicksByCountry = await db
      .select({
        country: linkClicks.country,
        clicks: count(),
      })
      .from(linkClicks)
      .where(whereClause)
      .groupBy(linkClicks.country)
      .orderBy(sql`${count()} DESC`)
      .limit(10);

    const clicksByCity = await db
      .select({
        city: linkClicks.city,
        country: linkClicks.country,
        clicks: count(),
      })
      .from(linkClicks)
      .where(whereClause)
      .groupBy(linkClicks.city, linkClicks.country)
      .orderBy(sql`${count()} DESC`)
      .limit(10);

    // Device breakdown
    const clicksByDevice = await db
      .select({
        deviceType: linkClicks.deviceType,
        clicks: count(),
      })
      .from(linkClicks)
      .where(whereClause)
      .groupBy(linkClicks.deviceType)
      .orderBy(sql`${count()} DESC`);

    // Browser breakdown
    const clicksByBrowser = await db
      .select({
        browser: linkClicks.browser,
        clicks: count(),
      })
      .from(linkClicks)
      .where(whereClause)
      .groupBy(linkClicks.browser)
      .orderBy(sql`${count()} DESC`)
      .limit(10);

    // OS breakdown
    const clicksByOS = await db
      .select({
        os: linkClicks.os,
        clicks: count(),
      })
      .from(linkClicks)
      .where(whereClause)
      .groupBy(linkClicks.os)
      .orderBy(sql`${count()} DESC`)
      .limit(10);

    // Referrer breakdown
    const clicksByReferrer = await db
      .select({
        referer: linkClicks.referer,
        clicks: count(),
      })
      .from(linkClicks)
      .where(whereClause)
      .groupBy(linkClicks.referer)
      .orderBy(sql`${count()} DESC`)
      .limit(10);

    return {
      totalClicks,
      uniqueVisitors,
      clicksByDate,
      clicksByCountry,
      clicksByCity,
      clicksByDevice,
      clicksByBrowser,
      clicksByOS,
      clicksByReferrer,
    };
  } catch (error) {
    console.error("[Database] Failed to get link analytics:", error);
    throw error;
  }
}

/**
 * Get top performing links
 */
export async function getTopPerformingLinks(limit: number = 10, filters?: {
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get top performing links: database not available");
    return [];
  }

  try {
    const { linkClicks, shortenedLinks } = await import("../drizzle/schema");
    const { eq, and, gte, lte, count, sql } = await import("drizzle-orm");
    
    const conditions = [];
    
    if (filters?.startDate) {
      conditions.push(gte(linkClicks.clickedAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(linkClicks.clickedAt, filters.endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const topLinks = await db
      .select({
        shortCode: linkClicks.shortCode,
        clicks: count(),
      })
      .from(linkClicks)
      .where(whereClause)
      .groupBy(linkClicks.shortCode)
      .orderBy(sql`${count()} DESC`)
      .limit(limit);

    // Enrich with link details
    const enrichedLinks = await Promise.all(
      topLinks.map(async (link) => {
        const linkDetails = await db
          .select()
          .from(shortenedLinks)
          .where(eq(shortenedLinks.shortCode, link.shortCode))
          .limit(1);
        
        return {
          ...link,
          title: linkDetails[0]?.title,
          originalUrl: linkDetails[0]?.originalUrl,
        };
      })
    );

    return enrichedLinks;
  } catch (error) {
    console.error("[Database] Failed to get top performing links:", error);
    throw error;
  }
}

/**
 * Get all expired links that are still active
 */
export async function getExpiredLinks() {
  const db = await getDb();
  if (!db) return [];

  try {
    const { shortenedLinks } = await import("../drizzle/schema");
    const { and, lte, eq } = await import("drizzle-orm");
    
    const now = new Date();
    const expired = await db
      .select()
      .from(shortenedLinks)
      .where(
        and(
          lte(shortenedLinks.expiresAt, now),
          eq(shortenedLinks.isActive, 1)
        )
      );
    
    return expired;
  } catch (error) {
    console.error("[Database] Failed to get expired links:", error);
    return [];
  }
}

/**
 * Get links expiring within the specified number of days
 */
export async function getExpiringLinks(daysAhead: number = 7) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { shortenedLinks } = await import("../drizzle/schema");
    const { and, gte, lte, eq } = await import("drizzle-orm");
    
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    const expiring = await db
      .select()
      .from(shortenedLinks)
      .where(
        and(
          gte(shortenedLinks.expiresAt, now),
          lte(shortenedLinks.expiresAt, futureDate),
          eq(shortenedLinks.isActive, 1)
        )
      );
    
    return expiring;
  } catch (error) {
    console.error("[Database] Failed to get expiring links:", error);
    return [];
  }
}

/**
 * Deactivate a shortened link
 */
export async function deactivateLink(shortCode: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot deactivate link: database not available");
    return false;
  }

  try {
    const { shortenedLinks } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    
    await db
      .update(shortenedLinks)
      .set({ isActive: 0 })
      .where(eq(shortenedLinks.shortCode, shortCode));
    
    return true;
  } catch (error) {
    console.error("[Database] Failed to deactivate link:", error);
    return false;
  }
}

/**
 * Activate a shortened link
 */
export async function activateLink(shortCode: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot activate link: database not available");
    return false;
  }

  try {
    const { shortenedLinks } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    
    await db
      .update(shortenedLinks)
      .set({ isActive: 1 })
      .where(eq(shortenedLinks.shortCode, shortCode));
    
    return true;
  } catch (error) {
    console.error("[Database] Failed to activate link:", error);
    return false;
  }
}
