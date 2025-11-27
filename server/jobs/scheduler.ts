import cron from 'node-cron';
import { checkLinkExpiration } from './linkExpiration';

/**
 * Initialize all scheduled jobs
 * This file should be imported in server/_core/index.ts to start the scheduler
 */
export function initializeScheduledJobs() {
  console.log('[Scheduler] Initializing scheduled jobs...');
  
  // Run link expiration check daily at 2 AM
  // Cron format: second minute hour day month dayOfWeek
  cron.schedule('0 2 * * *', async () => {
    console.log('[Scheduler] Running daily link expiration check at 2 AM');
    try {
      await checkLinkExpiration();
    } catch (error) {
      console.error('[Scheduler] Error running link expiration check:', error);
    }
  }, {
    timezone: 'America/Chicago' // CST timezone
  });
  
  console.log('[Scheduler] Scheduled jobs initialized:');
  console.log('  - Link expiration check: Daily at 2:00 AM CST');
}
