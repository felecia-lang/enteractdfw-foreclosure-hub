import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertLead, InsertLeadNote, InsertTestimonial, InsertUser, leadNotes, leads, testimonials, users } from "../drizzle/schema";
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
