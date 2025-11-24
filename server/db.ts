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
