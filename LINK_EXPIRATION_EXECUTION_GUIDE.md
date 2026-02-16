# Link Expiration Job - Execution Guide

## Overview

This guide provides step-by-step instructions for executing the link expiration job that automatically deactivates expired shortened links and sends notifications for links expiring within 7 days.

---

## Quick Start

### Prerequisites

1. **Database Access**: Ensure you have the DATABASE_URL connection string
2. **Dependencies Installed**: Run `pnpm install` in the project directory
3. **Environment Configured**: Set up your `.env` file or environment variables

### Immediate Execution

```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
DATABASE_URL="your_connection_string" npx tsx run-link-expiration-report.ts
```

---

## Detailed Execution Methods

### Method 1: Using Environment File (Recommended)

**Step 1**: Create `.env` file in project root
```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
nano .env
```

**Step 2**: Add your database connection string
```env
DATABASE_URL=mysql://username:password@host:port/database_name
```

**Step 3**: Execute the job
```bash
npx tsx run-link-expiration-report.ts
```

**Expected Output**:
```
╔════════════════════════════════════════════════════════════════════════════╗
║         EnterActDFW Foreclosure Hub - Link Expiration Report Job          ║
╚════════════════════════════════════════════════════════════════════════════╝

[LinkExpiration] Starting daily expiration check...
[LinkExpiration] Found 3 expired links
[LinkExpiration] Deactivated expired link: abc123
[LinkExpiration] Deactivated expired link: def456
[LinkExpiration] Deactivated expired link: ghi789
[LinkExpiration] Found 2 links expiring within 7 days
[LinkExpiration] Expiration check completed successfully

╔════════════════════════════════════════════════════════════════════════════╗
║                          JOB COMPLETED SUCCESSFULLY                        ║
╚════════════════════════════════════════════════════════════════════════════╝

📊 Summary:
   - Expired Links Processed: 3
   - Successfully Deactivated: 3
   - Failed Deactivations: 0
   - Links Expiring Soon: 2
   - Notifications Sent: 2

📁 Reports saved to: ./reports/
```

---

### Method 2: Inline Environment Variable

Execute with DATABASE_URL provided directly in the command:

```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
DATABASE_URL="mysql://user:pass@host:3306/db" npx tsx run-link-expiration-report.ts
```

**Advantages**:
- No `.env` file needed
- Useful for one-time execution
- Works well in CI/CD pipelines

**Disadvantages**:
- Database credentials visible in command history
- Must be provided every time

---

### Method 3: System Environment Variable

**Step 1**: Export DATABASE_URL to your shell session
```bash
export DATABASE_URL="mysql://username:password@host:port/database_name"
```

**Step 2**: Execute the job
```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
npx tsx run-link-expiration-report.ts
```

**Step 3**: (Optional) Make permanent by adding to `~/.bashrc` or `~/.zshrc`
```bash
echo 'export DATABASE_URL="mysql://username:password@host:port/database_name"' >> ~/.bashrc
source ~/.bashrc
```

---

## Understanding the Output

### Console Output Structure

1. **Header**: Job identification banner
2. **Execution Logs**: Real-time progress updates
3. **Summary Statistics**: Counts and results
4. **Report Location**: Where files are saved

### Generated Reports

The job creates two report files in the `reports/` directory:

#### JSON Report (`link-expiration-YYYY-MM-DD_HH-MM-SS.json`)
Machine-readable format with complete execution data:
```json
{
  "executionTime": "2026-02-16T03:15:30.123Z",
  "timestamp": 1739329530123,
  "expiredLinks": {
    "count": 3,
    "deactivated": 3,
    "failed": 0,
    "details": [...]
  },
  "expiringLinks": {
    "count": 2,
    "details": [...]
  },
  "notifications": {
    "expiredSent": true,
    "expiringSent": true,
    "errors": []
  }
}
```

#### Text Summary (`link-expiration-YYYY-MM-DD_HH-MM-SS.txt`)
Human-readable execution summary with formatted details.

---

## Execution Scenarios

### Scenario 1: No Expired Links

```
[LinkExpiration] Starting daily expiration check...
[LinkExpiration] No expired links found
[LinkExpiration] No links expiring within 7 days
[LinkExpiration] Expiration check completed successfully

📊 Summary:
   - Expired Links Processed: 0
   - Links Expiring Soon: 0
   - Notifications Sent: 0
```

### Scenario 2: Expired Links Found

```
[LinkExpiration] Starting daily expiration check...
[LinkExpiration] Found 5 expired links
[LinkExpiration] Deactivated expired link: promo2024
[LinkExpiration] Deactivated expired link: campaign-jan
[LinkExpiration] Deactivated expired link: temp-link-123
[LinkExpiration] Deactivated expired link: event-rsvp
[LinkExpiration] Deactivated expired link: limited-offer

📊 Summary:
   - Expired Links Processed: 5
   - Successfully Deactivated: 5
   - Notifications Sent: 1
```

### Scenario 3: Links Expiring Soon

```
[LinkExpiration] Starting daily expiration check...
[LinkExpiration] No expired links found
[LinkExpiration] Found 3 links expiring within 7 days

📊 Summary:
   - Expired Links Processed: 0
   - Links Expiring Soon: 3
   - Notifications Sent: 1
```

---

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"

**Cause**: The job cannot find the database connection string.

**Solution**:
1. Verify `.env` file exists in project root
2. Check that DATABASE_URL is set: `echo $DATABASE_URL`
3. Ensure no typos in variable name (case-sensitive)

---

### Error: "Cannot find module"

**Cause**: Dependencies not installed.

**Solution**:
```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
pnpm install
```

---

### Error: "Connection refused" or "ECONNREFUSED"

**Cause**: Database server not accessible.

**Solution**:
1. Verify database server is running
2. Check connection string format
3. Verify network connectivity
4. Check firewall rules
5. Confirm credentials are correct

---

### Error: "Table doesn't exist"

**Cause**: Database schema not migrated.

**Solution**:
```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
pnpm drizzle-kit push
```

---

### No Notifications Received

**Cause**: Notification system not configured.

**Solution**:
1. Check `server/_core/notification.ts` configuration
2. Verify notification service credentials
3. Review notification logs in reports

---

## Security Best Practices

### Protecting DATABASE_URL

1. **Never commit `.env` to version control**
   - Already in `.gitignore`
   - Double-check before pushing

2. **Use environment-specific credentials**
   - Development: Local database
   - Staging: Staging database
   - Production: Production database

3. **Rotate credentials regularly**
   - Update DATABASE_URL periodically
   - Use strong passwords

4. **Limit database permissions**
   - Job only needs: SELECT, UPDATE on `shortenedLinks` table
   - Grant minimal required permissions

---

## Performance Considerations

### Expected Execution Time

- **< 100 links**: 1-2 seconds
- **100-1000 links**: 2-10 seconds
- **1000+ links**: 10-30 seconds

### Database Load

The job performs:
- 1 SELECT query for expired links
- 1 SELECT query for expiring links
- N UPDATE queries (where N = number of expired links)

**Optimization Tips**:
- Ensure `expiresAt` column is indexed
- Run during low-traffic periods
- Monitor database performance

---

## Next Steps

1. **Test Execution**: Run the job manually to verify it works
2. **Review Reports**: Check generated reports in `reports/` directory
3. **Set Up Scheduling**: Configure automated execution (see scheduling guide)
4. **Monitor Results**: Regularly review execution reports

---

## Support Resources

- **Job Documentation**: `LINK_EXPIRATION_JOB_DOCUMENTATION.md`
- **Scheduling Guide**: `LINK_EXPIRATION_SCHEDULING_GUIDE.md`
- **Database Schema**: `drizzle/schema.ts`
- **Job Source Code**: `server/jobs/linkExpirationWithReport.ts`

---

**Last Updated**: February 16, 2026  
**Version**: 1.0  
**Maintainer**: EnterActDFW Development Team
