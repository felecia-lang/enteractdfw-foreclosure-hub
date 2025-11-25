# GoHighLevel Booking Webhook Setup

This document explains how to configure GoHighLevel (GHL) to send booking confirmations to your EnterActDFW website for conversion tracking.

## Webhook Endpoint

**URL:** `https://your-domain.com/api/webhooks/ghl-booking`

Replace `your-domain.com` with your actual production domain (e.g., `enteractdfw.manus.space` or your custom domain).

## Configuration Steps

### 1. Access GHL Calendar Settings

1. Log in to your GoHighLevel account
2. Navigate to **Settings** → **Calendars**
3. Select **Felecia Fair Personal Calendar** (or the calendar you're using)
4. Click on the **Webhooks** or **Integrations** tab

### 2. Add Webhook URL

1. Click **Add Webhook** or **New Webhook**
2. Enter the webhook URL: `https://your-domain.com/api/webhooks/ghl-booking`
3. Select trigger event: **Appointment Booked** or **Booking Confirmed**
4. Set HTTP method to **POST**
5. Content-Type: **application/json**
6. Save the webhook configuration

### 3. Test the Webhook

1. Book a test appointment through your calendar
2. Check the admin analytics dashboard at `/admin/analytics`
3. Verify the booking appears in the "Recent Consultation Bookings" table
4. Check the "Consultations Booked" metric increased
5. Verify the "Conversion Rate" is calculated correctly

## Expected Webhook Payload

GHL will send a JSON payload similar to this:

```json
{
  "type": "appointment_booked",
  "contact": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  },
  "appointment": {
    "id": "event-id-123",
    "calendarName": "Felecia Fair Personal Calendar",
    "startTime": "2025-12-01T15:00:00Z",
    "endTime": "2025-12-01T15:30:00Z"
  }
}
```

## Webhook Endpoint Features

The webhook endpoint (`/api/webhooks/ghl-booking`) automatically:

- ✅ Validates required fields (email, startTime)
- ✅ Handles flexible field names (different GHL versions)
- ✅ Captures contact information (name, email, phone)
- ✅ Records booking date/time
- ✅ Stores calendar event ID for reference
- ✅ Logs IP address and user agent
- ✅ Saves full webhook payload for debugging
- ✅ Returns success/error responses

## Tracked Data

Each booking confirmation captures:

| Field | Description | Example |
|-------|-------------|---------|
| Name | Contact's full name | "John Doe" |
| Email | Contact's email address | "john.doe@example.com" |
| Phone | Contact's phone number | "+1234567890" |
| Booking Date/Time | When consultation is scheduled | "2025-12-01 3:00 PM" |
| Calendar Event ID | GHL event identifier | "event-id-123" |
| Calendar Name | Which calendar was booked | "Felecia Fair Personal Calendar" |
| Source Page | Page where booking button was clicked | "/property-value-estimator" |
| IP Address | Visitor's IP address | "192.168.1.100" |
| Created At | When booking was confirmed | "2025-11-25 8:53 AM" |

## Analytics Dashboard

View booking metrics at `/admin/analytics`:

### Summary Cards
- **Total Calls** - All-time phone call clicks
- **Unique Pages** - Pages with call activity
- **Consultations Booked** - Total confirmed bookings
- **Conversion Rate** - Bookings per call click (%)

### Recent Consultation Bookings Table
- Booked On (date/time)
- Consultation Date (scheduled appointment)
- Name
- Email
- Phone
- Source Page

### Filters
- Date range (start/end date)
- Source page filter
- Export to CSV

## Troubleshooting

### Webhook Not Receiving Data

1. **Check webhook URL** - Ensure it matches your production domain
2. **Verify HTTPS** - GHL requires secure HTTPS connections
3. **Check GHL logs** - View webhook delivery logs in GHL settings
4. **Test manually** - Use curl to test the endpoint:

```bash
curl -X POST https://your-domain.com/api/webhooks/ghl-booking \
  -H "Content-Type: application/json" \
  -d '{
    "contact": {
      "name": "Test User",
      "email": "test@example.com"
    },
    "appointment": {
      "startTime": "2025-12-01T15:00:00Z"
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Booking confirmation received and saved"
}
```

### Bookings Not Appearing in Dashboard

1. **Check admin access** - Only admin users can view analytics
2. **Refresh page** - Dashboard data updates in real-time
3. **Check database** - Verify bookings are being saved
4. **Check browser console** - Look for JavaScript errors
5. **Check server logs** - Look for webhook processing errors

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid payload format" | Webhook body is not JSON | Check GHL Content-Type header |
| "Missing required field: email" | Email not in payload | Verify GHL sends contact email |
| "Missing required field: startTime" | Start time not in payload | Verify GHL sends appointment time |
| "Invalid date format for startTime" | Date string not parseable | Check GHL date format |

## Support

For webhook configuration issues:
1. Check GHL webhook delivery logs
2. Review server logs at `/var/log/`
3. Test with sample payload using curl
4. Contact support at https://help.manus.im

## Security Notes

- Webhook endpoint is publicly accessible (required for GHL)
- No authentication required (GHL doesn't support webhook auth)
- All data is validated before saving
- Full payload is logged for debugging
- Consider adding IP whitelist if GHL provides static IPs
- Monitor for suspicious webhook activity

## Next Steps

After webhook is configured:

1. ✅ Book test appointment to verify tracking
2. ✅ Monitor conversion rates in analytics dashboard
3. ✅ Optimize pages with low booking conversion
4. ✅ Export booking data for CRM integration
5. ✅ Set up automated follow-up emails for booked consultations
