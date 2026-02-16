# Link Expiration Job - Complete Execution Package

## 🎯 Quick Start

The link expiration job automatically deactivates expired shortened links and sends notifications for links expiring within 7 days.

### Fastest Way to Run

```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
./run-job.sh
```

**Prerequisites**: DATABASE_URL must be configured in `.env` file or environment.

---

## 📦 What's Included

This package contains everything you need to execute and schedule the link expiration job:

### Core Files

| File | Purpose |
|------|---------|
| `server/jobs/linkExpiration.ts` | Basic job implementation |
| `server/jobs/linkExpirationWithReport.ts` | Enhanced version with detailed reporting |
| `run-link-expiration-report.ts` | Standalone execution script |

### Helper Scripts

| Script | Purpose |
|--------|---------|
| `run-job.sh` | Convenient wrapper with validation and error handling |
| `setup-cron.sh` | Interactive wizard for scheduling automation |

### Documentation

| Document | Contents |
|----------|----------|
| `LINK_EXPIRATION_EXECUTION_GUIDE.md` | Detailed execution instructions and troubleshooting |
| `LINK_EXPIRATION_SCHEDULING_GUIDE.md` | Complete guide for automated scheduling |
| `LINK_EXPIRATION_JOB_DOCUMENTATION.md` | Technical documentation and API reference |
| `LINK_EXPIRATION_README.md` | This file - overview and quick reference |

---

## 🚀 Execution Methods

### Method 1: Using Helper Script (Recommended)

```bash
./run-job.sh
```

**Features**:
- ✓ Automatic dependency checking
- ✓ Environment validation
- ✓ Database connectivity test
- ✓ Colored output and progress indicators
- ✓ Comprehensive error messages

### Method 2: Direct Execution

```bash
npx tsx run-link-expiration-report.ts
```

**When to use**: When you need raw output or are integrating with other tools.

### Method 3: Programmatic Import

```typescript
import { checkLinkExpirationWithReport } from './server/jobs/linkExpirationWithReport';

const report = await checkLinkExpirationWithReport();
console.log(report);
```

**When to use**: When integrating into your application code.

---

## ⚙️ Configuration

### Required: DATABASE_URL

The job requires a MySQL database connection string.

#### Option A: Environment File (Recommended)

Create `.env` in project root:
```env
DATABASE_URL=mysql://username:password@host:3306/database_name
```

#### Option B: System Environment Variable

```bash
export DATABASE_URL="mysql://username:password@host:3306/database_name"
```

#### Option C: Inline

```bash
DATABASE_URL="mysql://..." ./run-job.sh
```

### Connection String Format

```
mysql://[username]:[password]@[host]:[port]/[database]
```

**Example**:
```
mysql://admin:SecurePass123@db.example.com:3306/enteractdfw
```

---

## 📅 Scheduling (Automation)

### Quick Setup with Interactive Wizard

```bash
./setup-cron.sh
```

This will guide you through:
1. Selecting execution schedule
2. Configuring log location
3. Setting up DATABASE_URL
4. Creating the cron job

### Manual Cron Setup

```bash
crontab -e
```

Add this line for daily execution at 2 AM:
```cron
0 2 * * * cd /home/ubuntu/enteractdfw-foreclosure-hub && ./run-job.sh >> /var/log/link-expiration.log 2>&1
```

**See `LINK_EXPIRATION_SCHEDULING_GUIDE.md` for more options.**

---

## 📊 Understanding Output

### Console Output

```
╔════════════════════════════════════════════════════════════════════════════╗
║         EnterActDFW Foreclosure Hub - Link Expiration Report Job          ║
╚════════════════════════════════════════════════════════════════════════════╝

[LinkExpiration] Starting daily expiration check...
[LinkExpiration] Found 3 expired links
[LinkExpiration] Deactivated expired link: promo2024
[LinkExpiration] Deactivated expired link: campaign-jan
[LinkExpiration] Deactivated expired link: temp-link
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

### Generated Reports

Two files are created in `reports/` directory:

1. **JSON Report** (`link-expiration-YYYY-MM-DD_HH-MM-SS.json`)
   - Machine-readable
   - Complete execution data
   - Suitable for programmatic processing

2. **Text Summary** (`link-expiration-YYYY-MM-DD_HH-MM-SS.txt`)
   - Human-readable
   - Formatted for quick review
   - Ideal for email or notifications

---

## 🔍 What the Job Does

### Phase 1: Process Expired Links

1. **Query** database for links where `expiresAt` is in the past
2. **Deactivate** each expired link (sets `isActive = 0`)
3. **Track** success/failure for each link
4. **Notify** owner with list of deactivated links

### Phase 2: Check Expiring Links

1. **Query** database for links expiring within next 7 days
2. **Calculate** days until expiration
3. **Notify** owner with warning list

### Phase 3: Generate Reports

1. **Compile** execution statistics
2. **Generate** JSON and text reports
3. **Save** to `reports/` directory with timestamps
4. **Display** summary in console

---

## 🛠️ Troubleshooting

### Common Issues

#### "DATABASE_URL environment variable is not set"

**Solution**: Create `.env` file or export DATABASE_URL
```bash
echo 'DATABASE_URL=mysql://...' > .env
```

#### "Cannot find module"

**Solution**: Install dependencies
```bash
pnpm install
```

#### "Connection refused"

**Solution**: Check database connectivity
```bash
# Test connection
mysql -h host -u username -p database_name
```

#### "Permission denied: ./run-job.sh"

**Solution**: Make script executable
```bash
chmod +x run-job.sh
```

### Getting Help

1. **Check logs**: `tail -f /var/log/link-expiration.log`
2. **Review reports**: `ls -lah reports/`
3. **Test manually**: `./run-job.sh`
4. **Read documentation**: See guide files listed above

---

## 📈 Monitoring

### Check Last Execution

```bash
ls -lt reports/ | head -5
```

### View Recent Logs

```bash
tail -50 /var/log/link-expiration.log
```

### Verify Cron Schedule

```bash
crontab -l
```

### Test Database Connection

```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
node -e "const db = require('./server/db'); console.log('Connected');"
```

---

## 🔐 Security Considerations

### Protecting Credentials

1. **Never commit `.env` to git** (already in `.gitignore`)
2. **Use strong database passwords**
3. **Limit database user permissions** (only needs SELECT, UPDATE on `shortenedLinks`)
4. **Rotate credentials regularly**
5. **Use read-only replicas** if available for queries

### File Permissions

```bash
# Secure .env file
chmod 600 .env

# Secure scripts
chmod 700 run-job.sh setup-cron.sh
```

---

## 📋 Checklist for Production Deployment

- [ ] DATABASE_URL configured in `.env` or environment
- [ ] Dependencies installed (`pnpm install`)
- [ ] Test execution completed successfully (`./run-job.sh`)
- [ ] Reports directory created and writable
- [ ] Cron job scheduled (`./setup-cron.sh` or manual)
- [ ] Log rotation configured (`/etc/logrotate.d/link-expiration`)
- [ ] Monitoring alerts set up
- [ ] Notification system tested
- [ ] Database backup strategy in place
- [ ] Documentation reviewed by team

---

## 🎓 Learning Resources

### For Beginners

1. Start with `LINK_EXPIRATION_EXECUTION_GUIDE.md`
2. Run `./run-job.sh` manually to see it work
3. Review generated reports in `reports/` directory
4. Use `./setup-cron.sh` for automated scheduling

### For Advanced Users

1. Review `server/jobs/linkExpirationWithReport.ts` source code
2. Customize notification logic in `server/_core/notification.ts`
3. Extend report format in job implementation
4. Integrate with monitoring systems (Datadog, New Relic, etc.)

---

## 📞 Support

### Self-Service Resources

1. **Execution Guide**: `LINK_EXPIRATION_EXECUTION_GUIDE.md`
2. **Scheduling Guide**: `LINK_EXPIRATION_SCHEDULING_GUIDE.md`
3. **Technical Docs**: `LINK_EXPIRATION_JOB_DOCUMENTATION.md`
4. **Source Code**: `server/jobs/linkExpirationWithReport.ts`

### Debug Mode

Run with verbose output:
```bash
DEBUG=* ./run-job.sh
```

---

## 🔄 Updates and Maintenance

### Updating the Job

```bash
cd /home/ubuntu/enteractdfw-foreclosure-hub
git pull origin main
pnpm install
```

### Backing Up Reports

```bash
# Archive old reports
tar -czf reports-backup-$(date +%Y%m%d).tar.gz reports/

# Move to backup location
mv reports-backup-*.tar.gz /path/to/backups/
```

### Cleaning Old Reports

```bash
# Delete reports older than 90 days
find reports/ -name "*.json" -mtime +90 -delete
find reports/ -name "*.txt" -mtime +90 -delete
```

---

## 📊 Performance Metrics

### Expected Performance

| Links | Execution Time | Database Queries |
|-------|----------------|------------------|
| < 100 | 1-2 seconds | 3 |
| 100-1000 | 2-10 seconds | 3 + N updates |
| 1000+ | 10-30 seconds | 3 + N updates |

### Optimization Tips

1. **Index `expiresAt` column** for faster queries
2. **Run during low-traffic hours** (2-4 AM)
3. **Use database connection pooling**
4. **Monitor query performance** with EXPLAIN
5. **Consider batch updates** for large datasets

---

## 🎯 Best Practices

1. **Test before scheduling**: Always run manually first
2. **Monitor logs regularly**: Check for errors weekly
3. **Review reports**: Analyze trends monthly
4. **Update documentation**: Keep guides current
5. **Backup reports**: Archive before deletion
6. **Rotate credentials**: Change passwords quarterly
7. **Update dependencies**: Keep packages current
8. **Test after updates**: Verify after each deployment

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | Feb 12, 2026 | Added comprehensive reporting |
| 1.0 | Initial | Basic expiration checking |

---

## 🏆 Success Criteria

Your link expiration job is working correctly if:

- ✓ Job executes on schedule without errors
- ✓ Reports are generated in `reports/` directory
- ✓ Expired links are deactivated in database
- ✓ Notifications are sent to owner
- ✓ Logs show successful completion
- ✓ No failed deactivations in reports

---

**Last Updated**: February 16, 2026  
**Version**: 1.0  
**Maintainer**: EnterActDFW Development Team  
**Repository**: felecia-lang/enteractdfw-foreclosure-hub
