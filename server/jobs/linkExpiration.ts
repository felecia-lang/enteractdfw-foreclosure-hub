import { getExpiredLinks, getExpiringLinks, deactivateLink } from "../db";
import { notifyOwner } from "../_core/notification";

/**
 * Scheduled job to check for expired and expiring links
 * Runs daily to:
 * 1. Deactivate expired links
 * 2. Send notifications for links expiring within 7 days
 */
export async function checkLinkExpiration() {
  console.log("[LinkExpiration] Starting daily expiration check...");
  
  try {
    // Get and deactivate expired links
    const expiredLinks = await getExpiredLinks();
    
    if (expiredLinks.length > 0) {
      console.log(`[LinkExpiration] Found ${expiredLinks.length} expired links`);
      
      for (const link of expiredLinks) {
        const success = await deactivateLink(link.shortCode);
        if (success) {
          console.log(`[LinkExpiration] Deactivated expired link: ${link.shortCode}`);
        }
      }
      
      // Notify owner about deactivated links (non-critical — job continues if notification fails)
      try {
        const linkList = expiredLinks
          .map(l => `- ${l.title || l.shortCode} (${l.shortCode}) - expired on ${l.expiresAt?.toLocaleDateString()}`)
          .join('\n');
        
        await notifyOwner({
          title: `${expiredLinks.length} Shortened Link${expiredLinks.length > 1 ? 's' : ''} Expired`,
          content: `The following shortened links have been automatically deactivated due to expiration:\n\n${linkList}\n\nYou can reactivate these links from the admin dashboard if needed.`
        });
      } catch (notifyError) {
        console.warn("[LinkExpiration] Notification failed (non-critical):", notifyError instanceof Error ? notifyError.message : String(notifyError));
      }
    } else {
      console.log("[LinkExpiration] No expired links found");
    }
    
    // Check for links expiring within 7 days
    const expiringLinks = await getExpiringLinks(7);
    
    if (expiringLinks.length > 0) {
      console.log(`[LinkExpiration] Found ${expiringLinks.length} links expiring within 7 days`);
      
      // Notify owner about expiring links (non-critical — job continues if notification fails)
      try {
        const linkList = expiringLinks
          .map(l => {
            const daysUntil = Math.ceil((l.expiresAt!.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return `- ${l.title || l.shortCode} (${l.shortCode}) - expires in ${daysUntil} day${daysUntil > 1 ? 's' : ''} (${l.expiresAt?.toLocaleDateString()})`;
          })
          .join('\n');
        
        await notifyOwner({
          title: `${expiringLinks.length} Shortened Link${expiringLinks.length > 1 ? 's' : ''} Expiring Soon`,
          content: `The following shortened links will expire within the next 7 days:\n\n${linkList}\n\nPlease review and extend expiration dates if needed from the admin dashboard.`
        });
      } catch (notifyError) {
        console.warn("[LinkExpiration] Notification failed (non-critical):", notifyError instanceof Error ? notifyError.message : String(notifyError));
      }
    } else {
      console.log("[LinkExpiration] No links expiring within 7 days");
    }
    
    console.log("[LinkExpiration] Expiration check completed successfully");
  } catch (error) {
    console.error("[LinkExpiration] Error during expiration check:", error);
  }
}

// To manually test this job, run:
// npx tsx server/jobs/linkExpiration.ts
