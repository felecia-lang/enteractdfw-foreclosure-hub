/**
 * Database helpers for saved calculations (Save & Resume feature)
 */

import { eq } from "drizzle-orm";
import { savedCalculations, type InsertSavedCalculation } from "../drizzle/schema";
import { getDb } from "./db";
import crypto from "crypto";

/**
 * Generate a unique secure token for saved calculation
 */
export function generateCalculationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Calculate expiration date (30 days from now)
 */
function getExpirationDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date;
}

/**
 * Save a calculation and return the unique token
 */
export async function saveCalculation(data: {
  email: string;
  zipCode: string;
  propertyType: string;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  condition: string;
  mortgageBalance: number;
  estimatedValue?: number;
}): Promise<string> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const token = generateCalculationToken();
  const expiresAt = getExpirationDate();

  const insertData: InsertSavedCalculation = {
    token,
    email: data.email,
    zipCode: data.zipCode,
    propertyType: data.propertyType,
    squareFeet: data.squareFeet,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    condition: data.condition,
    mortgageBalance: data.mortgageBalance,
    estimatedValue: data.estimatedValue,
    expiresAt,
  };

  await db.insert(savedCalculations).values(insertData);

  return token;
}

/**
 * Retrieve a saved calculation by token
 */
export async function getCalculationByToken(token: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(savedCalculations)
    .where(eq(savedCalculations.token, token))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const calculation = result[0];

  // Check if expired
  if (calculation && new Date() > new Date(calculation.expiresAt)) {
    return null; // Expired
  }

  // Update resume count and last resumed timestamp
  if (calculation) {
    await db
      .update(savedCalculations)
      .set({
        resumedCount: (calculation.resumedCount || 0) + 1,
        lastResumedAt: new Date(),
      })
      .where(eq(savedCalculations.id, calculation.id));
  }

  return calculation;
}

/**
 * Delete expired calculations (cleanup job)
 */
export async function deleteExpiredCalculations(): Promise<void> {
  const db = await getDb();
  if (!db) {
    return;
  }

  const now = new Date();
  await db
    .delete(savedCalculations)
    .where(eq(savedCalculations.expiresAt, now));
}
