import { getExpiredLinks, getExpiringLinks, deactivateLink } from "../db";
import { notifyOwner } from "../_core/notification";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

interface JobReport {
  executionTime: string;
  timestamp: number;
  expiredLinks: {
    count: number;
    deactivated: number;
    failed: number;
    details: Array<{
      shortCode: string;
      title: string | null;
      expiresAt: Date | null;
      status: "success" | "failed";
      error?: string;
    }>;
  };
  expiringLinks: {
    count: number;
    details: Array<{
      shortCode: string;
      title: string | null;
      expiresAt: Date | null;
      daysUntilExpiration: number;
    }>;
  };
  notifications: {
    expiredSent: boolean;
    expiringSent: boolean;
    errors: string[];
  };
  summary: string;
}

/**
 * Enhanced scheduled job to check for expired and expiring links with detailed reporting
 * Runs daily to:
 * 1. Deactivate expired links
 * 2. Send notifications for links expiring within 7 days
 * 3. Generate and save a detailed execution report
 */
export async function checkLinkExpirationWithReport(): Promise<JobReport> {
  const startTime = Date.now();
  const executionTime = new Date().toISOString();
  
  console.log("[LinkExpirationReport] Starting daily expiration check with reporting...");
  console.log(`[LinkExpirationReport] Execution time: ${executionTime}`);
  
  const report: JobReport = {
    executionTime,
    timestamp: startTime,
    expiredLinks: {
      count: 0,
      deactivated: 0,
      failed: 0,
      details: []
    },
    expiringLinks: {
      count: 0,
      details: []
    },
    notifications: {
      expiredSent: false,
      expiringSent: false,
      errors: []
    },
    summary: ""
  };
  
  try {
    // ========== PHASE 1: Process Expired Links ==========
    console.log("\n[LinkExpirationReport] PHASE 1: Checking for expired links...");
    const expiredLinks = await getExpiredLinks();
    report.expiredLinks.count = expiredLinks.length;
    
    if (expiredLinks.length > 0) {
      console.log(`[LinkExpirationReport] Found ${expiredLinks.length} expired link(s)`);
      
      for (const link of expiredLinks) {
        console.log(`[LinkExpirationReport] Processing: ${link.shortCode} (${link.title || "Untitled"})`);
        
        try {
          const success = await deactivateLink(link.shortCode);
          
          if (success) {
            report.expiredLinks.deactivated++;
            report.expiredLinks.details.push({
              shortCode: link.shortCode,
              title: link.title,
              expiresAt: link.expiresAt,
              status: "success"
            });
            console.log(`[LinkExpirationReport] ✓ Successfully deactivated: ${link.shortCode}`);
          } else {
            report.expiredLinks.failed++;
            report.expiredLinks.details.push({
              shortCode: link.shortCode,
              title: link.title,
              expiresAt: link.expiresAt,
              status: "failed",
              error: "Deactivation returned false"
            });
            console.error(`[LinkExpirationReport] ✗ Failed to deactivate: ${link.shortCode}`);
          }
        } catch (error) {
          report.expiredLinks.failed++;
          const errorMessage = error instanceof Error ? error.message : String(error);
          report.expiredLinks.details.push({
            shortCode: link.shortCode,
            title: link.title,
            expiresAt: link.expiresAt,
            status: "failed",
            error: errorMessage
          });
          console.error(`[LinkExpirationReport] ✗ Error deactivating ${link.shortCode}:`, errorMessage);
        }
      }
      
      // Send notification about expired links
      try {
        const linkList = report.expiredLinks.details
          .map(l => {
            const statusIcon = l.status === "success" ? "✓" : "✗";
            const dateStr = l.expiresAt?.toLocaleDateString() || "Unknown";
            return `${statusIcon} ${l.title || l.shortCode} (${l.shortCode}) - expired on ${dateStr}`;
          })
          .join('\n');
        
        await notifyOwner({
          title: `${expiredLinks.length} Shortened Link${expiredLinks.length > 1 ? 's' : ''} Expired`,
          content: `The following shortened links have been processed:\n\n${linkList}\n\nSuccessfully deactivated: ${report.expiredLinks.deactivated}\nFailed: ${report.expiredLinks.failed}\n\nYou can reactivate these links from the admin dashboard if needed.`
        });
        
        report.notifications.expiredSent = true;
        console.log("[LinkExpirationReport] ✓ Notification sent for expired links");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        report.notifications.errors.push(`Failed to send expired links notification: ${errorMessage}`);
        console.error("[LinkExpirationReport] ✗ Failed to send expired links notification:", errorMessage);
      }
    } else {
      console.log("[LinkExpirationReport] No expired links found");
    }
    
    // ========== PHASE 2: Check for Expiring Links ==========
    console.log("\n[LinkExpirationReport] PHASE 2: Checking for links expiring within 7 days...");
    const expiringLinks = await getExpiringLinks(7);
    report.expiringLinks.count = expiringLinks.length;
    
    if (expiringLinks.length > 0) {
      console.log(`[LinkExpirationReport] Found ${expiringLinks.length} link(s) expiring within 7 days`);
      
      for (const link of expiringLinks) {
        const daysUntil = Math.ceil((link.expiresAt!.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        report.expiringLinks.details.push({
          shortCode: link.shortCode,
          title: link.title,
          expiresAt: link.expiresAt,
          daysUntilExpiration: daysUntil
        });
        
        console.log(`[LinkExpirationReport] - ${link.shortCode} (${link.title || "Untitled"}) expires in ${daysUntil} day(s)`);
      }
      
      // Send notification about expiring links
      try {
        const linkList = report.expiringLinks.details
          .map(l => {
            const daysText = l.daysUntilExpiration === 1 ? "1 day" : `${l.daysUntilExpiration} days`;
            const dateStr = l.expiresAt?.toLocaleDateString() || "Unknown";
            return `- ${l.title || l.shortCode} (${l.shortCode}) - expires in ${daysText} (${dateStr})`;
          })
          .join('\n');
        
        await notifyOwner({
          title: `${expiringLinks.length} Shortened Link${expiringLinks.length > 1 ? 's' : ''} Expiring Soon`,
          content: `The following shortened links will expire within the next 7 days:\n\n${linkList}\n\nPlease review and extend expiration dates if needed from the admin dashboard.`
        });
        
        report.notifications.expiringSent = true;
        console.log("[LinkExpirationReport] ✓ Notification sent for expiring links");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        report.notifications.errors.push(`Failed to send expiring links notification: ${errorMessage}`);
        console.error("[LinkExpirationReport] ✗ Failed to send expiring links notification:", errorMessage);
      }
    } else {
      console.log("[LinkExpirationReport] No links expiring within 7 days");
    }
    
    // ========== PHASE 3: Generate Summary ==========
    const duration = Date.now() - startTime;
    report.summary = generateSummary(report, duration);
    
    console.log("\n" + "=".repeat(80));
    console.log(report.summary);
    console.log("=".repeat(80));
    
    // ========== PHASE 4: Save Report to File ==========
    saveReport(report);
    
    console.log("\n[LinkExpirationReport] Job completed successfully");
    return report;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[LinkExpirationReport] Critical error during expiration check:", errorMessage);
    
    report.summary = `CRITICAL ERROR: ${errorMessage}`;
    saveReport(report);
    
    throw error;
  }
}

function generateSummary(report: JobReport, duration: number): string {
  const lines: string[] = [];
  
  lines.push("LINK EXPIRATION JOB - EXECUTION REPORT");
  lines.push("=" .repeat(80));
  lines.push(`Execution Time: ${report.executionTime}`);
  lines.push(`Duration: ${duration}ms`);
  lines.push("");
  
  lines.push("EXPIRED LINKS:");
  lines.push(`  Total Found: ${report.expiredLinks.count}`);
  lines.push(`  Successfully Deactivated: ${report.expiredLinks.deactivated}`);
  lines.push(`  Failed: ${report.expiredLinks.failed}`);
  
  if (report.expiredLinks.details.length > 0) {
    lines.push("\n  Details:");
    report.expiredLinks.details.forEach(link => {
      const status = link.status === "success" ? "✓ SUCCESS" : "✗ FAILED";
      const dateStr = link.expiresAt?.toLocaleDateString() || "Unknown";
      lines.push(`    [${status}] ${link.shortCode} - ${link.title || "Untitled"} (expired: ${dateStr})`);
      if (link.error) {
        lines.push(`              Error: ${link.error}`);
      }
    });
  }
  
  lines.push("");
  lines.push("EXPIRING LINKS (Next 7 Days):");
  lines.push(`  Total Found: ${report.expiringLinks.count}`);
  
  if (report.expiringLinks.details.length > 0) {
    lines.push("\n  Details:");
    report.expiringLinks.details.forEach(link => {
      const daysText = link.daysUntilExpiration === 1 ? "1 day" : `${link.daysUntilExpiration} days`;
      const dateStr = link.expiresAt?.toLocaleDateString() || "Unknown";
      lines.push(`    ${link.shortCode} - ${link.title || "Untitled"} (${daysText} until ${dateStr})`);
    });
  }
  
  lines.push("");
  lines.push("NOTIFICATIONS:");
  lines.push(`  Expired Links Notification: ${report.notifications.expiredSent ? "✓ Sent" : "✗ Not Sent"}`);
  lines.push(`  Expiring Links Notification: ${report.notifications.expiringSent ? "✓ Sent" : "✗ Not Sent"}`);
  
  if (report.notifications.errors.length > 0) {
    lines.push("\n  Notification Errors:");
    report.notifications.errors.forEach(error => {
      lines.push(`    - ${error}`);
    });
  }
  
  lines.push("");
  lines.push("=" .repeat(80));
  
  return lines.join("\n");
}

function saveReport(report: JobReport): void {
  try {
    // Create reports directory if it doesn't exist
    const reportsDir = join(process.cwd(), "reports");
    mkdirSync(reportsDir, { recursive: true });
    
    // Generate filename with timestamp
    const date = new Date(report.timestamp);
    const filename = `link-expiration-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}-${String(date.getSeconds()).padStart(2, '0')}.json`;
    const filepath = join(reportsDir, filename);
    
    // Save JSON report
    writeFileSync(filepath, JSON.stringify(report, null, 2), "utf-8");
    console.log(`[LinkExpirationReport] Report saved to: ${filepath}`);
    
    // Also save a human-readable text version
    const textFilename = filename.replace('.json', '.txt');
    const textFilepath = join(reportsDir, textFilename);
    writeFileSync(textFilepath, report.summary, "utf-8");
    console.log(`[LinkExpirationReport] Summary saved to: ${textFilepath}`);
    
  } catch (error) {
    console.error("[LinkExpirationReport] Failed to save report:", error);
  }
}
