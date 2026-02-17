import type { Request, Response } from "express";
import { getDb } from "../db";
import { emailTrackingLogs } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Resend Webhook Handler
 * 
 * Handles incoming webhook events from Resend for email delivery tracking.
 * Supported events: email.sent, email.delivered, email.opened, email.clicked, email.bounced
 * 
 * Webhook URL: https://your-domain.com/api/webhooks/resend
 * 
 * Documentation: https://resend.com/docs/dashboard/webhooks/introduction
 */

interface ResendWebhookEvent {
  type: "email.sent" | "email.delivered" | "email.opened" | "email.clicked" | "email.bounced" | "email.delivery_delayed" | "email.complained";
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
    click?: {
      link: string;
      timestamp: string;
    };
    bounce?: {
      type: string;
      reason: string;
    };
  };
}

/**
 * Verify Resend webhook signature
 * TODO: Implement signature verification when Resend adds this feature
 * For now, we'll rely on HTTPS and keeping the webhook URL secret
 */
function verifyWebhookSignature(req: Request): boolean {
  // Resend doesn't currently support webhook signature verification
  // This is a placeholder for future implementation
  // For now, return true and rely on HTTPS + secret URL
  return true;
}

/**
 * Handle Resend webhook events
 */
export async function handleResendWebhook(req: Request, res: Response) {
  try {
    // Verify webhook signature (placeholder for now)
    if (!verifyWebhookSignature(req)) {
      console.error("[Resend Webhook] Invalid signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const event: ResendWebhookEvent = req.body;
    console.log(`[Resend Webhook] Received event: ${event.type} for email ${event.data.email_id}`);

    const db = await getDb();
    if (!db) {
      console.error("[Resend Webhook] Database not available");
      return res.status(500).json({ error: "Database unavailable" });
    }

    const emailId = event.data.email_id;
    const recipientEmail = event.data.to[0]; // Resend sends to array, we use first recipient

    // Check if this email is already tracked
    const existing = await db
      .select()
      .from(emailTrackingLogs)
      .where(eq(emailTrackingLogs.resendEmailId, emailId))
      .limit(1);

    if (existing.length === 0 && event.type !== "email.sent") {
      // If we don't have a record and this isn't the initial "sent" event,
      // create one now (in case we missed the sent event)
      await db.insert(emailTrackingLogs).values({
        resendEmailId: emailId,
        recipientEmail,
        subject: event.data.subject,
        emailType: "unknown", // We don't know the type from webhook alone
        status: "sent",
        sentAt: new Date(event.data.created_at),
        lastWebhookEvent: event.type,
        lastWebhookAt: new Date(event.created_at),
      });
      console.log(`[Resend Webhook] Created tracking record for ${emailId}`);
    }

    // Update tracking based on event type
    switch (event.type) {
      case "email.sent":
        if (existing.length === 0) {
          // Create new tracking record
          await db.insert(emailTrackingLogs).values({
            resendEmailId: emailId,
            recipientEmail,
            subject: event.data.subject,
            emailType: "unknown", // Will be set when email is sent from our code
            status: "sent",
            sentAt: new Date(event.data.created_at),
            lastWebhookEvent: event.type,
            lastWebhookAt: new Date(event.created_at),
          });
          console.log(`[Resend Webhook] Email sent: ${emailId}`);
        }
        break;

      case "email.delivered":
        await db
          .update(emailTrackingLogs)
          .set({
            status: "delivered",
            deliveredAt: new Date(event.created_at),
            lastWebhookEvent: event.type,
            lastWebhookAt: new Date(event.created_at),
          })
          .where(eq(emailTrackingLogs.resendEmailId, emailId));
        console.log(`[Resend Webhook] Email delivered: ${emailId}`);
        break;

      case "email.opened":
        await db
          .update(emailTrackingLogs)
          .set({
            status: "opened",
            openedAt: new Date(event.created_at),
            lastWebhookEvent: event.type,
            lastWebhookAt: new Date(event.created_at),
          })
          .where(eq(emailTrackingLogs.resendEmailId, emailId));
        console.log(`[Resend Webhook] Email opened: ${emailId}`);
        break;

      case "email.clicked":
        const clickedUrl = event.data.click?.link || null;
        await db
          .update(emailTrackingLogs)
          .set({
            status: "clicked",
            clickedAt: new Date(event.created_at),
            clickedUrl,
            lastWebhookEvent: event.type,
            lastWebhookAt: new Date(event.created_at),
          })
          .where(eq(emailTrackingLogs.resendEmailId, emailId));
        console.log(`[Resend Webhook] Email clicked: ${emailId} - URL: ${clickedUrl}`);
        break;

      case "email.bounced":
        const bounceReason = event.data.bounce
          ? `${event.data.bounce.type}: ${event.data.bounce.reason}`
          : "Unknown bounce reason";
        await db
          .update(emailTrackingLogs)
          .set({
            status: "bounced",
            bouncedAt: new Date(event.created_at),
            bounceReason,
            lastWebhookEvent: event.type,
            lastWebhookAt: new Date(event.created_at),
          })
          .where(eq(emailTrackingLogs.resendEmailId, emailId));
        console.log(`[Resend Webhook] Email bounced: ${emailId} - Reason: ${bounceReason}`);
        break;

      case "email.delivery_delayed":
        console.log(`[Resend Webhook] Email delivery delayed: ${emailId}`);
        // Don't update status, just log the event
        await db
          .update(emailTrackingLogs)
          .set({
            lastWebhookEvent: event.type,
            lastWebhookAt: new Date(event.created_at),
          })
          .where(eq(emailTrackingLogs.resendEmailId, emailId));
        break;

      case "email.complained":
        console.log(`[Resend Webhook] Email complained (spam report): ${emailId}`);
        await db
          .update(emailTrackingLogs)
          .set({
            status: "bounced", // Treat complaints as bounces
            bouncedAt: new Date(event.created_at),
            bounceReason: "Spam complaint",
            lastWebhookEvent: event.type,
            lastWebhookAt: new Date(event.created_at),
          })
          .where(eq(emailTrackingLogs.resendEmailId, emailId));
        break;

      default:
        console.log(`[Resend Webhook] Unknown event type: ${event.type}`);
    }

    // Return 200 OK to acknowledge receipt
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[Resend Webhook] Error processing webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
