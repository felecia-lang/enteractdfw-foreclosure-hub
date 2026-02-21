#!/usr/bin/env tsx
/**
 * runLinkExpirationJobScheduled.ts
 * 
 * Scheduled job runner for the EnterActDFW Foreclosure Hub Link Expiration Job.
 * Executes the checkLinkExpiration function which:
 *   1. Queries for expired links (expiresAt <= NOW() and isActive = 1)
 *   2. Deactivates each expired link by setting isActive = 0
 *   3. Queries for links expiring within 7 days
 *   4. Attempts to send owner notifications
 * 
 * Usage:
 *   npx tsx runLinkExpirationJobScheduled.ts
 * 
 * Requirements:
 *   - DATABASE_URL environment variable must be configured in .env
 */
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  const timestamp = new Date().toISOString();
  
  console.log("============================================================");
  console.log("Link Expiration Job - Starting");
  console.log(`Timestamp: ${timestamp}`);
  console.log("============================================================");
  
  // Validate required environment
  if (!process.env.DATABASE_URL) {
    console.error("[Job] ERROR: DATABASE_URL environment variable is not set");
    console.error("[Job] Please configure .env file with a valid DATABASE_URL");
    process.exit(1);
  }
  
  console.log("[Job] Environment validated - DATABASE_URL is configured");
  console.log(`[Job] Notification service configured: ${process.env.BUILT_IN_FORGE_API_URL ? 'YES' : 'NO'}`);
  console.log("");
  
  try {
    const { checkLinkExpiration } = await import('./server/jobs/linkExpiration');
    await checkLinkExpiration();
    
    const finishTime = new Date().toISOString();
    console.log("");
    console.log("============================================================");
    console.log("Link Expiration Job - Completed Successfully");
    console.log(`Finished: ${finishTime}`);
    console.log("============================================================");
    
    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("============================================================");
    console.error("Link Expiration Job - FAILED");
    console.error("Error:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack);
    }
    console.error("============================================================");
    process.exit(1);
  }
}

main();
