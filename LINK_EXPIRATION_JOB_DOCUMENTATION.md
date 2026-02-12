# Link Expiration Job - Enhanced with Reporting

## Overview

The **Link Expiration Job** is an automated system designed to manage the lifecycle of shortened links in the EnterActDFW Foreclosure Hub. This enhanced version includes comprehensive reporting capabilities, detailed execution logs, and robust error handling.

## Features

### Core Functionality
- **Automatic Deactivation**: Identifies and deactivates expired shortened links
- **Proactive Notifications**: Alerts the owner about links expiring within 7 days
- **Detailed Reporting**: Generates comprehensive JSON and text reports for each execution
- **Error Handling**: Captures and reports failures during link deactivation
- **Execution Tracking**: Records timestamps, duration, and detailed status for audit purposes

### Reporting Capabilities
- **JSON Reports**: Machine-readable execution data saved with timestamps
- **Text Summaries**: Human-readable execution summaries for quick review
- **Historical Tracking**: All reports saved to `reports/` directory with unique timestamps
- **Real-time Console Output**: Live progress updates during execution

## File Structure

```
enteractdfw-foreclosure-hub/
├── server/
│   ├── jobs/
│   │   ├── linkExpiration.ts              # Basic version (original)
│   │   └── linkExpirationWithReport.ts    # Enhanced version with reporting
│   ├── db.ts                               # Database functions
│   └── _core/
│       └── notification.ts                 # Notification system
├── run-link-expiration-report.ts           # Standalone runner script
└── reports/                                # Generated reports directory
    ├── link-expiration-YYYY-MM-DD_HH-MM-SS.json
    └── link-expiration-YYYY-MM-DD_HH-MM-SS.txt
```

## Usage

### Prerequisites

1. **Environment Configuration**
   ```bash
   # Required: Database connection string
   DATABASE_URL=your_database_connection_string
   ```

2. **Dependencies Installation**
   ```bash
   pnpm install
   ```

### Execution Methods

#### Method 1: Standalone Execution (Recommended)
```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
npx tsx run-link-expiration-report.ts
```

#### Method 2: Direct Import
```typescript
import { checkLinkExpirationWithReport } from "./server/jobs/linkExpirationWithReport";

const report = await checkLinkExpirationWithReport();
console.log(report);
```

#### Method 3: Scheduled Execution (Cron)
```bash
# Add to crontab for daily execution at 2 AM
0 2 * * * cd /home/ubuntu/enteractdfw-foreclosure-hub && npx tsx run-link-expiration-report.ts >> /var/log/link-expiration.log 2>&1
```

## Job Workflow

### Phase 1: Process Expired Links
1. Query database for links with `expiresAt` date in the past
2. Attempt to deactivate each expired link
3. Track success/failure status for each link
4. Send notification to owner with deactivation results

### Phase 2: Check for Expiring Links
1. Query database for links expiring within the next 7 days
2. Calculate days until expiration for each link
3. Send notification to owner with expiring links list

### Phase 3: Generate Reports
1. Compile execution statistics and details
2. Generate human-readable summary
3. Save JSON report with full execution data
4. Save text summary for quick review
5. Display summary in console output

### Phase 4: Save and Archive
1. Create `reports/` directory if it doesn't exist
2. Save reports with timestamp-based filenames
3. Log file paths for reference

## Report Structure

### JSON Report Format
```json
{
  "executionTime": "2026-02-12T03:15:30.123Z",
  "timestamp": 1739329530123,
  "expiredLinks": {
    "count": 5,
    "deactivated": 4,
    "failed": 1,
    "details": [
      {
        "shortCode": "abc123",
        "title": "Property Listing XYZ",
        "expiresAt": "2026-02-10T00:00:00.000Z",
        "status": "success"
      }
    ]
  },
  "expiringLinks": {
    "count": 3,
    "details": [
      {
        "shortCode": "def456",
        "title": "Foreclosure Guide",
        "expiresAt": "2026-02-18T00:00:00.000Z",
        "daysUntilExpiration": 6
      }
    ]
  },
  "notifications": {
    "expiredSent": true,
    "expiringSent": true,
    "errors": []
  },
  "summary": "..."
}
```

### Text Summary Format
```
LINK EXPIRATION JOB - EXECUTION REPORT
================================================================================
Execution Time: 2026-02-12T03:15:30.123Z
Duration: 1234ms

EXPIRED LINKS:
  Total Found: 5
  Successfully Deactivated: 4
  Failed: 1

  Details:
    [✓ SUCCESS] abc123 - Property Listing XYZ (expired: 2/10/2026)
    [✗ FAILED] xyz789 - Old Campaign Link (expired: 2/9/2026)
              Error: Database connection timeout

EXPIRING LINKS (Next 7 Days):
  Total Found: 3

  Details:
    def456 - Foreclosure Guide (6 days until 2/18/2026)
    ghi789 - Resource Download (3 days until 2/15/2026)

NOTIFICATIONS:
  Expired Links Notification: ✓ Sent
  Expiring Links Notification: ✓ Sent

================================================================================
```

## Database Functions

The job relies on the following database functions from `server/db.ts`:

### `getExpiredLinks()`
Returns all shortened links where `expiresAt` is in the past and `isActive` is true.

### `getExpiringLinks(days: number)`
Returns all active shortened links where `expiresAt` is within the specified number of days.

### `deactivateLink(shortCode: string)`
Sets `isActive` to false for the specified link. Returns boolean indicating success.

## Notification System

Notifications are sent via `server/_core/notification.ts`:

### `notifyOwner(options: { title: string, content: string })`
Sends notification to the system owner/administrator through configured channels (email, SMS, dashboard, etc.).

## Error Handling

The job implements comprehensive error handling:

1. **Database Connection Errors**: Caught and logged with clear error messages
2. **Deactivation Failures**: Individual link failures don't stop the entire job
3. **Notification Failures**: Tracked in report but don't prevent job completion
4. **Report Save Failures**: Logged but don't throw exceptions
5. **Critical Errors**: Cause job to exit with error code and save partial report

## Monitoring and Maintenance

### Success Indicators
- ✓ Job completes without throwing exceptions
- ✓ Reports are saved to `reports/` directory
- ✓ Notifications are sent successfully
- ✓ Console output shows detailed progress

### Failure Indicators
- ✗ Job exits with error code 1
- ✗ DATABASE_URL not configured
- ✗ Database connection failures
- ✗ Multiple link deactivation failures

### Maintenance Tasks
1. **Review Reports**: Regularly check `reports/` directory for execution history
2. **Monitor Failures**: Investigate any failed deactivations in reports
3. **Archive Old Reports**: Implement rotation policy for old report files
4. **Database Health**: Ensure database performance remains optimal
5. **Notification Delivery**: Verify notifications are being received

## Best Practices

1. **Environment Variables**: Always configure DATABASE_URL before execution
2. **Scheduled Execution**: Run daily during low-traffic hours (e.g., 2 AM)
3. **Report Review**: Check reports weekly for patterns or issues
4. **Error Investigation**: Address failed deactivations promptly
5. **Backup Reports**: Include `reports/` directory in backup strategy
6. **Testing**: Test in staging environment before production deployment

## Troubleshooting

### Issue: "DATABASE_URL environment variable is not set"
**Solution**: Configure DATABASE_URL in your environment or .env file

### Issue: "Cannot find module" errors
**Solution**: Run `pnpm install` to install all dependencies

### Issue: Links not being deactivated
**Solution**: Check database connectivity and verify `deactivateLink()` function

### Issue: Notifications not being sent
**Solution**: Verify notification system configuration in `server/_core/notification.ts`

### Issue: Reports not being saved
**Solution**: Check write permissions on `reports/` directory

## Future Enhancements

Potential improvements for future versions:

1. **Email Report Delivery**: Automatically email reports to administrators
2. **Dashboard Integration**: Display report summaries in admin dashboard
3. **Configurable Expiration Window**: Allow customization of 7-day warning period
4. **Bulk Extension**: Provide option to extend multiple links at once
5. **Analytics Integration**: Track link expiration patterns over time
6. **Webhook Support**: Trigger webhooks on link expiration events
7. **Slack/Teams Integration**: Send notifications to team channels

## Support

For issues, questions, or feature requests related to the Link Expiration Job:

1. Review this documentation thoroughly
2. Check execution reports in `reports/` directory
3. Examine console output for error messages
4. Verify database connectivity and configuration
5. Contact the development team with specific error details

---

**Last Updated**: February 12, 2026  
**Version**: 2.0 (Enhanced with Reporting)  
**Maintainer**: EnterActDFW Development Team
