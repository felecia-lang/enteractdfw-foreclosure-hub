import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { 
  userTimelines, 
  timelineActionProgress,
  type InsertUserTimeline,
  type InsertTimelineActionProgress,
  type UserTimeline,
  type TimelineActionProgress
} from "../drizzle/schema";

/**
 * Database helper functions for user timeline management
 */

/**
 * Create or update a user's timeline
 */
export async function upsertUserTimeline(data: {
  userId: number;
  noticeDate: string;
  milestones: any[];
}): Promise<UserTimeline | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[TimelineDB] Cannot upsert timeline: database not available");
    return null;
  }

  try {
    // Check if user already has a timeline
    const existing = await db
      .select()
      .from(userTimelines)
      .where(eq(userTimelines.userId, data.userId))
      .limit(1);

    const milestonesJson = JSON.stringify(data.milestones);

    if (existing.length > 0) {
      // Update existing timeline
      await db
        .update(userTimelines)
        .set({
          noticeDate: data.noticeDate,
          milestones: milestonesJson,
          updatedAt: new Date(),
        })
        .where(eq(userTimelines.id, existing[0]!.id));

      return {
        ...existing[0]!,
        noticeDate: data.noticeDate,
        milestones: milestonesJson,
        updatedAt: new Date(),
      };
    } else {
      // Insert new timeline
      const insertData: InsertUserTimeline = {
        userId: data.userId,
        noticeDate: data.noticeDate,
        milestones: milestonesJson,
      };

      await db.insert(userTimelines).values(insertData);
      
      // Fetch the newly created timeline
      const newTimeline = await db
        .select()
        .from(userTimelines)
        .where(eq(userTimelines.userId, data.userId))
        .limit(1);

      return newTimeline[0] || null;
    }
  } catch (error) {
    console.error("[TimelineDB] Failed to upsert timeline:", error);
    throw error;
  }
}

/**
 * Get a user's timeline by user ID
 */
export async function getUserTimeline(userId: number): Promise<UserTimeline | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[TimelineDB] Cannot get timeline: database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(userTimelines)
      .where(eq(userTimelines.userId, userId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("[TimelineDB] Failed to get timeline:", error);
    throw error;
  }
}

/**
 * Get all action progress for a timeline
 */
export async function getTimelineActionProgress(timelineId: number): Promise<TimelineActionProgress[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[TimelineDB] Cannot get action progress: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(timelineActionProgress)
      .where(eq(timelineActionProgress.timelineId, timelineId));

    return result;
  } catch (error) {
    console.error("[TimelineDB] Failed to get action progress:", error);
    throw error;
  }
}

/**
 * Update action completion status
 */
export async function updateActionProgress(data: {
  timelineId: number;
  milestoneId: string;
  actionIndex: number;
  completed: boolean;
}): Promise<TimelineActionProgress | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[TimelineDB] Cannot update action progress: database not available");
    return null;
  }

  try {
    // Check if progress record exists
    const existing = await db
      .select()
      .from(timelineActionProgress)
      .where(
        and(
          eq(timelineActionProgress.timelineId, data.timelineId),
          eq(timelineActionProgress.milestoneId, data.milestoneId),
          eq(timelineActionProgress.actionIndex, data.actionIndex)
        )
      )
      .limit(1);

    const completedValue = data.completed ? "yes" : "no";
    const completedAt = data.completed ? new Date() : null;

    if (existing.length > 0) {
      // Update existing record
      await db
        .update(timelineActionProgress)
        .set({
          completed: completedValue,
          completedAt: completedAt,
          updatedAt: new Date(),
        })
        .where(eq(timelineActionProgress.id, existing[0]!.id));

      return {
        ...existing[0]!,
        completed: completedValue,
        completedAt: completedAt,
        updatedAt: new Date(),
      };
    } else {
      // Insert new record
      const insertData: InsertTimelineActionProgress = {
        timelineId: data.timelineId,
        milestoneId: data.milestoneId,
        actionIndex: data.actionIndex,
        completed: completedValue,
        completedAt: completedAt,
      };

      await db.insert(timelineActionProgress).values(insertData);
      
      // Fetch the newly created record
      const newProgress = await db
        .select()
        .from(timelineActionProgress)
        .where(
          and(
            eq(timelineActionProgress.timelineId, data.timelineId),
            eq(timelineActionProgress.milestoneId, data.milestoneId),
            eq(timelineActionProgress.actionIndex, data.actionIndex)
          )
        )
        .limit(1);

      return newProgress[0] || null;
    }
  } catch (error) {
    console.error("[TimelineDB] Failed to update action progress:", error);
    throw error;
  }
}

/**
 * Delete a user's timeline and all associated progress
 */
export async function deleteUserTimeline(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[TimelineDB] Cannot delete timeline: database not available");
    return false;
  }

  try {
    // Get the timeline first
    const timeline = await getUserTimeline(userId);
    if (!timeline) {
      return true; // Already deleted or doesn't exist
    }

    // Delete all progress records
    await db
      .delete(timelineActionProgress)
      .where(eq(timelineActionProgress.timelineId, timeline.id));

    // Delete the timeline
    await db
      .delete(userTimelines)
      .where(eq(userTimelines.id, timeline.id));

    return true;
  } catch (error) {
    console.error("[TimelineDB] Failed to delete timeline:", error);
    throw error;
  }
}
