import { getDb } from "./db";
import { propertyValueLeads, InsertPropertyValueLead } from "../drizzle/schema";

/**
 * Create a new property value lead
 */
export async function createPropertyValueLead(lead: Omit<InsertPropertyValueLead, "id" | "accessGrantedAt" | "createdAt">) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(propertyValueLeads).values(lead);
  const insertId = Number(result[0].insertId);

  return { id: insertId, ...lead };
}
