# Link Expiration Job - Scheduling Guide

## Overview

This guide provides multiple options for scheduling the link expiration job to run automatically at regular intervals. Choose the method that best fits your infrastructure and operational requirements.

---

## Recommended Schedule

**Daily execution at 2:00 AM local time**

This timing ensures:
- ✓ Low traffic period (minimal user impact)
- ✓ Links are deactivated promptly after expiration
- ✓ Notifications sent early for review during business hours
- ✓ Sufficient time before peak usage

---

## Scheduling Options

### Option 1: Linux Cron (Recommended for VPS/Dedicated Servers)

#### Setup Instructions

**Step 1**: Open crontab editor
```bash
crontab -e
```

**Step 2**: Add the following line for daily execution at 2 AM
```cron
0 2 * * * cd /home/ubuntu/enteractdfw-foreclosure-hub && /home/ubuntu/enteractdfw-foreclosure-hub/run-job.sh >> /var/log/link-expiration.log 2>&1
```

**Step 3**: Save and exit

**Step 4**: Verify cron job is scheduled
```bash
crontab -l
```

#### Cron Schedule Examples

```cron
# Daily at 2:00 AM
0 2 * * * cd /path/to/project && ./run-job.sh >> /var/log/link-expiration.log 2>&1

# Every 12 hours (2 AM and 2 PM)
0 2,14 * * * cd /path/to/project && ./run-job.sh >> /var/log/link-expiration.log 2>&1

# Every 6 hours
0 */6 * * * cd /path/to/project && ./run-job.sh >> /var/log/link-expiration.log 2>&1

# Weekly on Mondays at 3 AM
0 3 * * 1 cd /path/to/project && ./run-job.sh >> /var/log/link-expiration.log 2>&1

# First day of every month at 1 AM
0 1 1 * * cd /path/to/project && ./run-job.sh >> /var/log/link-expiration.log 2>&1
```

#### Cron Environment Variables

If using `.env` file, cron may not load it automatically. Use this format:

```cron
0 2 * * * cd /home/ubuntu/enteractdfw-foreclosure-hub && DATABASE_URL="mysql://user:pass@host:3306/db" npx tsx run-link-expiration-report.ts >> /var/log/link-expiration.log 2>&1
```

Or source environment file:

```cron
0 2 * * * cd /home/ubuntu/enteractdfw-foreclosure-hub && source .env && ./run-job.sh >> /var/log/link-expiration.log 2>&1
```

#### Log Management

Create log rotation to prevent disk space issues:

```bash
sudo nano /etc/logrotate.d/link-expiration
```

Add:
```
/var/log/link-expiration.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
}
```

---

### Option 2: Systemd Timer (Modern Linux Systems)

#### Setup Instructions

**Step 1**: Create service file
```bash
sudo nano /etc/systemd/system/link-expiration.service
```

Add:
```ini
[Unit]
Description=Link Expiration Job
After=network.target mysql.service

[Service]
Type=oneshot
User=ubuntu
WorkingDirectory=/home/ubuntu/enteractdfw-foreclosure-hub
Environment="DATABASE_URL=mysql://user:pass@host:3306/db"
ExecStart=/usr/bin/npx tsx run-link-expiration-report.ts
StandardOutput=append:/var/log/link-expiration.log
StandardError=append:/var/log/link-expiration.log

[Install]
WantedBy=multi-user.target
```

**Step 2**: Create timer file
```bash
sudo nano /etc/systemd/system/link-expiration.timer
```

Add:
```ini
[Unit]
Description=Link Expiration Job Timer
Requires=link-expiration.service

[Timer]
OnCalendar=daily
OnCalendar=02:00
Persistent=true

[Install]
WantedBy=timers.target
```

**Step 3**: Enable and start timer
```bash
sudo systemctl daemon-reload
sudo systemctl enable link-expiration.timer
sudo systemctl start link-expiration.timer
```

**Step 4**: Verify timer status
```bash
sudo systemctl status link-expiration.timer
sudo systemctl list-timers
```

#### Manual Execution via Systemd

```bash
sudo systemctl start link-expiration.service
```

#### View Logs

```bash
sudo journalctl -u link-expiration.service -f
```

---

### Option 3: GitHub Actions (Cloud-Based Scheduling)

#### Setup Instructions

**Step 1**: Create workflow file
```bash
mkdir -p .github/workflows
nano .github/workflows/link-expiration.yml
```

**Step 2**: Add workflow configuration
```yaml
name: Link Expiration Job

on:
  schedule:
    # Run daily at 2:00 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch:  # Allow manual trigger

jobs:
  run-expiration-check:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run link expiration job
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx tsx run-link-expiration-report.ts
      
      - name: Upload reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: expiration-reports
          path: reports/
          retention-days: 30
```

**Step 3**: Add DATABASE_URL secret
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `DATABASE_URL`
4. Value: Your MySQL connection string
5. Click "Add secret"

**Step 4**: Commit and push
```bash
git add .github/workflows/link-expiration.yml
git commit -m "Add link expiration job workflow"
git push
```

**Advantages**:
- ✓ No server maintenance required
- ✓ Automatic execution logs
- ✓ Manual trigger available
- ✓ Report artifacts saved

**Limitations**:
- ✗ Requires database accessible from GitHub IPs
- ✗ Limited to public repositories (or GitHub Pro)

---

### Option 4: Cloudflare Workers Cron Triggers

If your application runs on Cloudflare Workers:

**Step 1**: Update `wrangler.jsonc`
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "enteractdfw-foreclosure-hub",
  "compatibility_date": "2026-01-03",
  "assets": {
    "directory": "./dist"
  },
  "triggers": {
    "crons": ["0 2 * * *"]
  }
}
```

**Step 2**: Create scheduled handler in your Worker
```typescript
export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Import and run the job
    const { checkLinkExpirationWithReport } = await import('./server/jobs/linkExpirationWithReport');
    await checkLinkExpirationWithReport();
  }
}
```

**Step 3**: Deploy
```bash
npx wrangler deploy
```

---

### Option 5: Node.js Scheduler (Application-Level)

Run the scheduler within your application:

**Step 1**: Install node-cron
```bash
pnpm add node-cron
```

**Step 2**: Create scheduler file
```typescript
// server/scheduler.ts
import cron from 'node-cron';
import { checkLinkExpirationWithReport } from './jobs/linkExpirationWithReport';

export function startScheduler() {
  // Run daily at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('[Scheduler] Running link expiration job...');
    try {
      await checkLinkExpirationWithReport();
      console.log('[Scheduler] Job completed successfully');
    } catch (error) {
      console.error('[Scheduler] Job failed:', error);
    }
  }, {
    timezone: "America/Chicago" // Adjust to your timezone
  });
  
  console.log('[Scheduler] Link expiration job scheduled for 2:00 AM daily');
}
```

**Step 3**: Import in your main server file
```typescript
// server/_core/index.ts
import { startScheduler } from '../scheduler';

// Start the scheduler when server starts
startScheduler();
```

**Advantages**:
- ✓ No external dependencies
- ✓ Runs with your application
- ✓ Easy to manage

**Disadvantages**:
- ✗ Requires application to be always running
- ✗ Job won't run if application is down

---

### Option 6: AWS EventBridge (Cloud Infrastructure)

For AWS-hosted applications:

**Step 1**: Create Lambda function
```bash
# Package your job as a Lambda function
zip -r function.zip server/ node_modules/ package.json
```

**Step 2**: Create Lambda via AWS CLI
```bash
aws lambda create-function \
  --function-name link-expiration-job \
  --runtime nodejs22.x \
  --handler server/jobs/linkExpirationWithReport.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
  --environment Variables={DATABASE_URL=mysql://...}
```

**Step 3**: Create EventBridge rule
```bash
aws events put-rule \
  --name link-expiration-daily \
  --schedule-expression "cron(0 2 * * ? *)"
```

**Step 4**: Add Lambda as target
```bash
aws events put-targets \
  --rule link-expiration-daily \
  --targets "Id"="1","Arn"="arn:aws:lambda:REGION:ACCOUNT_ID:function:link-expiration-job"
```

---

## Monitoring and Alerts

### Log Monitoring

**Check recent executions**:
```bash
tail -f /var/log/link-expiration.log
```

**Search for errors**:
```bash
grep -i error /var/log/link-expiration.log
```

**Count successful runs**:
```bash
grep "COMPLETED SUCCESSFULLY" /var/log/link-expiration.log | wc -l
```

### Email Alerts on Failure

Create a wrapper script with email notifications:

```bash
#!/bin/bash
# run-job-with-alerts.sh

cd /home/ubuntu/enteractdfw-foreclosure-hub

if ./run-job.sh; then
    echo "Job completed successfully" | mail -s "Link Expiration Job: Success" admin@example.com
else
    echo "Job failed - check logs" | mail -s "Link Expiration Job: FAILURE" admin@example.com
fi
```

### Health Check Endpoint

Create a status endpoint to monitor last execution:

```typescript
// server/routes/health.ts
import { readFileSync } from 'fs';

app.get('/api/health/link-expiration', (req, res) => {
  try {
    const reports = readdirSync('./reports')
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (reports.length === 0) {
      return res.json({ status: 'never_run' });
    }
    
    const latestReport = JSON.parse(
      readFileSync(`./reports/${reports[0]}`, 'utf-8')
    );
    
    const hoursSinceLastRun = 
      (Date.now() - latestReport.timestamp) / (1000 * 60 * 60);
    
    res.json({
      status: hoursSinceLastRun < 25 ? 'healthy' : 'stale',
      lastRun: latestReport.executionTime,
      hoursSinceLastRun,
      summary: latestReport.summary
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});
```

---

## Testing Your Schedule

### Dry Run

Test without waiting for scheduled time:

**Cron**:
```bash
# Run the exact command from crontab
cd /home/ubuntu/enteractdfw-foreclosure-hub && ./run-job.sh
```

**Systemd**:
```bash
sudo systemctl start link-expiration.service
sudo journalctl -u link-expiration.service -n 50
```

**GitHub Actions**:
- Go to Actions tab
- Select "Link Expiration Job"
- Click "Run workflow"

### Verify Schedule

**Cron**:
```bash
crontab -l
```

**Systemd**:
```bash
systemctl list-timers --all | grep link-expiration
```

**GitHub Actions**:
- Check `.github/workflows/link-expiration.yml`
- View "Actions" tab for execution history

---

## Troubleshooting

### Job Not Running

**Check cron service**:
```bash
sudo systemctl status cron
```

**Check systemd timer**:
```bash
sudo systemctl status link-expiration.timer
```

**Verify cron syntax**:
```bash
# Use online tools like crontab.guru
```

### Job Running But Failing

**Check logs**:
```bash
tail -100 /var/log/link-expiration.log
```

**Test manually**:
```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
./run-job.sh
```

**Verify DATABASE_URL**:
```bash
echo $DATABASE_URL
```

### Missing Reports

**Check reports directory**:
```bash
ls -lah /home/ubuntu/enteractdfw-foreclosure-hub/reports/
```

**Verify write permissions**:
```bash
ls -ld /home/ubuntu/enteractdfw-foreclosure-hub/reports/
```

---

## Best Practices

1. **Always log output**: Redirect stdout and stderr to log files
2. **Monitor execution**: Set up alerts for failures
3. **Test before scheduling**: Run manually first
4. **Use absolute paths**: Avoid relative paths in cron
5. **Set timezone**: Specify timezone in cron or systemd
6. **Rotate logs**: Prevent disk space issues
7. **Backup reports**: Archive old reports regularly
8. **Document schedule**: Keep this guide updated

---

## Quick Reference

| Method | Best For | Complexity | Reliability |
|--------|----------|------------|-------------|
| Cron | VPS/Dedicated | Low | High |
| Systemd | Modern Linux | Medium | High |
| GitHub Actions | Cloud/CI | Medium | Medium |
| Cloudflare Workers | Edge Computing | High | High |
| Node.js Scheduler | Application-Level | Low | Medium |
| AWS EventBridge | AWS Infrastructure | High | High |

---

**Last Updated**: February 16, 2026  
**Version**: 1.0  
**Maintainer**: EnterActDFW Development Team
