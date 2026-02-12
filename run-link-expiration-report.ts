#!/usr/bin/env tsx

/**
 * Standalone runner script for the Link Expiration Job with Reporting
 * 
 * This script executes the link expiration check job independently,
 * allowing for manual execution or scheduled runs via cron.
 * 
 * Usage:
 *   npx tsx run-link-expiration-report.ts
 * 
 * Requirements:
 *   - DATABASE_URL environment variable must be configured
 *   - All dependencies must be installed (pnpm install)
 * 
 * The job will:
 *   1. Query the database for expired links and deactivate them
 *   2. Query for links expiring within 7 days and send notifications
 *   3. Generate a detailed summary report
 *   4. Save the report to the reports/ directory with timestamp
 *   5. Display the report in console output
 */

import { checkLinkExpirationWithReport } from "./server/jobs/linkExpirationWithReport";

async function main() {
  console.log("╔════════════════════════════════════════════════════════════════════════════╗");
  console.log("║         EnterActDFW Foreclosure Hub - Link Expiration Report Job          ║");
  console.log("╚════════════════════════════════════════════════════════════════════════════╝");
  console.log("");
  
  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL environment variable is not set");
    console.error("   Please configure your database connection before running this job.");
    process.exit(1);
  }
  
  try {
    const report = await checkLinkExpirationWithReport();
    
    console.log("");
    console.log("╔════════════════════════════════════════════════════════════════════════════╗");
    console.log("║                          JOB COMPLETED SUCCESSFULLY                        ║");
    console.log("╚════════════════════════════════════════════════════════════════════════════╝");
    console.log("");
    console.log(`📊 Summary:`);
    console.log(`   - Expired Links Processed: ${report.expiredLinks.count}`);
    console.log(`   - Successfully Deactivated: ${report.expiredLinks.deactivated}`);
    console.log(`   - Failed Deactivations: ${report.expiredLinks.failed}`);
    console.log(`   - Links Expiring Soon: ${report.expiringLinks.count}`);
    console.log(`   - Notifications Sent: ${(report.notifications.expiredSent ? 1 : 0) + (report.notifications.expiringSent ? 1 : 0)}`);
    console.log("");
    console.log(`📁 Reports saved to: ./reports/`);
    console.log("");
    
    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("╔════════════════════════════════════════════════════════════════════════════╗");
    console.error("║                             JOB FAILED                                     ║");
    console.error("╚════════════════════════════════════════════════════════════════════════════╝");
    console.error("");
    console.error("❌ Error:", error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && error.stack) {
      console.error("");
      console.error("Stack trace:");
      console.error(error.stack);
    }
    
    console.error("");
    console.error("Please check the error message above and ensure:");
    console.error("  1. DATABASE_URL is correctly configured");
    console.error("  2. Database is accessible and running");
    console.error("  3. All required tables exist in the database");
    console.error("  4. Network connectivity is available");
    console.error("");
    
    process.exit(1);
  }
}

// Execute the main function
main();
