import { getDb } from "./db";
import { InsertResourceDownload, resourceDownloads } from "../drizzle/schema";

export async function createResourceDownload(download: InsertResourceDownload): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create resource download: database not available");
    return;
  }

  try {
    await db.insert(resourceDownloads).values(download);
  } catch (error) {
    console.error("[Database] Failed to create resource download:", error);
    throw error;
  }
}
