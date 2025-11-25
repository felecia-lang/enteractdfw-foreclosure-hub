import type { Request, Response } from "express";
import { saveBookingConfirmation } from "../db";

/**
 * GHL Booking Webhook Handler
 * 
 * This endpoint receives booking confirmation webhooks from GoHighLevel calendar.
 * Configure in GHL: Settings → Calendars → [Your Calendar] → Webhooks
 * 
 * Webhook URL: https://your-domain.com/api/webhooks/ghl-booking
 * 
 * Expected GHL webhook payload structure:
 * {
 *   "type": "appointment_booked",
 *   "contact": {
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "phone": "+1234567890"
 *   },
 *   "appointment": {
 *     "id": "event-id-123",
 *     "calendarName": "Felecia Fair Personal Calendar",
 *     "startTime": "2025-11-25T15:00:00Z",
 *     "endTime": "2025-11-25T15:30:00Z"
 *   }
 * }
 */
export async function handleGHLBookingWebhook(req: Request, res: Response) {
  try {
    const payload = req.body;
    
    // Log the webhook for debugging
    console.log("[GHL Webhook] Received booking confirmation:", JSON.stringify(payload, null, 2));

    // Validate required fields
    if (!payload || typeof payload !== 'object') {
      console.error("[GHL Webhook] Invalid payload: not an object");
      return res.status(400).json({ 
        success: false, 
        error: "Invalid payload format" 
      });
    }

    // Extract contact information (flexible field names for different GHL versions)
    const contact = payload.contact || payload.Contact || {};
    const appointment = payload.appointment || payload.Appointment || payload.event || {};
    
    const name = contact.name || contact.Name || contact.fullName || contact.FullName || "Unknown";
    const email = contact.email || contact.Email || contact.emailAddress || contact.EmailAddress;
    const phone = contact.phone || contact.Phone || contact.phoneNumber || contact.PhoneNumber;
    
    // Extract appointment details
    const startTime = appointment.startTime || appointment.StartTime || appointment.start || appointment.Start;
    const calendarEventId = appointment.id || appointment.Id || appointment.appointmentId || appointment.AppointmentId;
    const calendarName = appointment.calendarName || appointment.CalendarName || appointment.calendar || appointment.Calendar;

    // Validate essential fields
    if (!email) {
      console.error("[GHL Webhook] Missing required field: email");
      return res.status(400).json({ 
        success: false, 
        error: "Missing required field: email" 
      });
    }

    if (!startTime) {
      console.error("[GHL Webhook] Missing required field: startTime");
      return res.status(400).json({ 
        success: false, 
        error: "Missing required field: startTime/appointment time" 
      });
    }

    // Parse booking date/time
    let bookingDateTime: Date;
    try {
      bookingDateTime = new Date(startTime);
      if (isNaN(bookingDateTime.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      console.error("[GHL Webhook] Invalid date format:", startTime);
      return res.status(400).json({ 
        success: false, 
        error: "Invalid date format for startTime" 
      });
    }

    // Extract request metadata
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
                      || req.socket.remoteAddress 
                      || undefined;
    const userAgent = req.headers['user-agent'] || undefined;

    // Save to database
    await saveBookingConfirmation({
      name,
      email,
      phone: phone || undefined,
      bookingDateTime,
      calendarEventId: calendarEventId || undefined,
      calendarName: calendarName || undefined,
      sourcePage: payload.sourcePage || undefined, // Optional: can be passed from frontend
      ipAddress,
      userAgent,
      webhookPayload: JSON.stringify(payload), // Store full payload for debugging
    });

    console.log("[GHL Webhook] Successfully saved booking confirmation for:", email);

    // Return success response
    return res.status(200).json({ 
      success: true,
      message: "Booking confirmation received and saved"
    });

  } catch (error) {
    console.error("[GHL Webhook] Error processing webhook:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error processing webhook" 
    });
  }
}
