/**
 * Database helpers for comparison history
 */

import { desc, eq } from "drizzle-orm";
import { comparisonHistory, type InsertComparisonHistory } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Save a comparison to history
 */
export async function saveComparison(data: InsertComparisonHistory): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(comparisonHistory).values(data);
  return result[0].insertId;
}

/**
 * Get all comparisons for a user, ordered by most recent first
 */
export async function getUserComparisons(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(comparisonHistory)
    .where(eq(comparisonHistory.userId, userId))
    .orderBy(desc(comparisonHistory.createdAt));
}

/**
 * Get a specific comparison by ID
 */
export async function getComparisonById(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const results = await db
    .select()
    .from(comparisonHistory)
    .where(eq(comparisonHistory.id, id))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  const comparison = results[0];
  
  // Verify the comparison belongs to the user
  if (comparison.userId !== userId) {
    return null;
  }

  return comparison;
}

/**
 * Delete a comparison
 */
export async function deleteComparison(id: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // First verify ownership
  const comparison = await getComparisonById(id, userId);
  if (!comparison) {
    return false;
  }

  await db.delete(comparisonHistory).where(eq(comparisonHistory.id, id));
  return true;
}
