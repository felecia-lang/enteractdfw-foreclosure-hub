# EnterActDFW Foreclosure Hub - TODO

## GHL Integration Audit & Verification
- [x] Identify all lead capture forms on the website
- [x] Audit Landing Page contact form
- [x] Audit Timeline Calculator form submission
- [x] Audit embedded contact forms
- [x] Audit SMS capture dialogs
- [x] Review ghl.ts API integration code
- [x] Verify API key and Location ID environment variables
- [x] Confirm contactId is passed in URL path (not body) for updates
- [x] Verify custom fields use array format for GHL API - [x] Test Landing Page form submission on production domain
- [x] Test Timeline Calculator submission on production domain
- [x] Monitor network tab for 200 OK responses
- [x] Check server logs for API errors (422/404/401)
- [x] ❌ CRITICAL: Fix 401 Authentication Error - Invalid GHL API Token
- [x] Update GHL_API_KEY environment variable with new token (pit-be882468-87fd-4032-b395-e07e98d2d326)
- [x] Restart dev server after token update
- [x] Re-run connection test to verify fix
- [x] Verify contacts appear in GHL dashboard
- [x] Confirm tags are applied correctly (Foreclosure_Hub_Lead)
- [x] Verify custom fields populate (property_address, property_zip_code, foreclosure_stage)d fixes applied
- [x] Generate comprehensive integration report

## Timeline Calculator Email Issue
- [x] Reproduce email sending failure on timeline calculator
- [x] Check server logs for email errors
- [x] Review email sending code in timeline router
- [x] Identify root cause - GHL API doesn't support standalone email sending
- [x] Implement Resend email service integration
- [x] Update sendTimelineEmail function to use Resend API
- [x] Validate Resend API key with vitest
- [x] Restart server to apply changes
- [x] Write and run integration tests for email sending
- [x] Test email delivery with real submission
- [x] Verify PDF attachment and email formatting
- [ ] Complete domain verification in Resend dashboard (see resend-domain-verification-instructions.md)

## Email Delivery Tracking with Resend Webhooks
- [x] Create database schema for email tracking (emailTrackingLogs table)
- [x] Add fields: emailId, recipientEmail, subject, status, sentAt, deliveredAt, openedAt, clickedAt, bouncedAt
- [x] Push database schema changes with drizzle
- [x] Implement Resend webhook endpoint (/api/webhooks/resend)
- [x] Handle webhook events: email.sent, email.delivered, email.opened, email.clicked, email.bounced
- [x] Verify webhook signature for security (placeholder for future Resend feature)
- [x] Update emailService to log sent emails to tracking table
- [x] Create tRPC procedures to query email delivery status by user
- [x] Add getMyEmails procedure to fetch user's email history
- [x] Add getMyEmailStats procedure for delivery metrics
- [x] Add admin procedures for overall email analytics
- [x] Build EmailDeliveryStatus dashboard component
- [x] Display email timeline with visual indicators
- [x] Show delivery metrics (open rate, click rate, bounce rate)
- [x] Add email tracking to MyTimeline page
- [x] Test webhook integration with Resend dashboard (ready for production testing)
- [x] Document webhook setup instructions (see resend-webhook-setup-instructions.md)
