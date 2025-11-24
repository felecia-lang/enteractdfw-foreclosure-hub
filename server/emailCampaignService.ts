/**
 * Email Campaign Service
 * Handles sending drip campaign emails via GHL API
 */

import { sendDripEmail } from "./ghl";
import { 
  getDueEmailCampaigns, 
  markEmailAsSent, 
  logEmailDelivery,
  getLeadById 
} from "./db";
import {
  getWelcomeGuideEmail,
  getTimelineCalculatorEmail,
  getSuccessStoryEmail,
  getConsultationReminderEmail,
  type EmailTemplateData,
} from "./chatbotEmailTemplates";

/**
 * Process all due email campaigns and send emails
 * This function is designed to be called manually from an admin endpoint
 * or via a scheduled cron job
 */
export async function processDueEmails(): Promise<{
  success: boolean;
  emailsSent: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let emailsSent = 0;

  try {
    // Get all campaigns with due emails
    const dueCampaigns = await getDueEmailCampaigns();
    
    console.log(`[EmailCampaign] Found ${dueCampaigns.length} campaigns with due emails`);

    for (const campaign of dueCampaigns) {
      try {
        // Get lead data
        const lead = await getLeadById(campaign.leadId);
        if (!lead) {
          errors.push(`Lead not found for campaign ${campaign.id}`);
          continue;
        }

        const templateData: EmailTemplateData = {
          firstName: lead.firstName,
          email: lead.email,
          propertyZip: lead.propertyZip,
        };

        const now = new Date();

        // Determine which email to send
        let emailSequence = 0;
        let emailTemplate: { subject: string; htmlBody: string } | null = null;

        if (!campaign.email1SentAt && campaign.email1ScheduledAt && campaign.email1ScheduledAt <= now) {
          emailSequence = 1;
          emailTemplate = getWelcomeGuideEmail(templateData);
        } else if (!campaign.email2SentAt && campaign.email2ScheduledAt && campaign.email2ScheduledAt <= now) {
          emailSequence = 2;
          emailTemplate = getTimelineCalculatorEmail(templateData);
        } else if (!campaign.email3SentAt && campaign.email3ScheduledAt && campaign.email3ScheduledAt <= now) {
          emailSequence = 3;
          emailTemplate = getSuccessStoryEmail(templateData);
        } else if (!campaign.email4SentAt && campaign.email4ScheduledAt && campaign.email4ScheduledAt <= now) {
          emailSequence = 4;
          emailTemplate = getConsultationReminderEmail(templateData);
        }

        if (!emailTemplate || emailSequence === 0) {
          continue; // No email to send for this campaign
        }

        // Send email via GHL
        try {
          await sendDripEmail({
            email: lead.email,
            subject: emailTemplate.subject,
            htmlBody: emailTemplate.htmlBody,
          });

          // Mark as sent in database
          await markEmailAsSent(campaign.id, emailSequence);

          // Log successful delivery
          await logEmailDelivery({
            campaignId: campaign.id,
            leadId: campaign.leadId,
            emailSequence,
            emailType: `chatbot_day_${emailSequence === 1 ? "1" : emailSequence === 2 ? "3" : emailSequence === 3 ? "7" : "14"}`,
            recipientEmail: lead.email,
            subject: emailTemplate.subject,
            deliveryStatus: "sent",
            sentAt: new Date(),
          });

          emailsSent++;
          console.log(`[EmailCampaign] Sent email ${emailSequence} to ${lead.email} (campaign ${campaign.id})`);
        } catch (emailError) {
          const errorMessage = emailError instanceof Error ? emailError.message : String(emailError);
          errors.push(`Failed to send email ${emailSequence} to ${lead.email}: ${errorMessage}`);
          
          // Log failed delivery
          await logEmailDelivery({
            campaignId: campaign.id,
            leadId: campaign.leadId,
            emailSequence,
            emailType: `chatbot_day_${emailSequence === 1 ? "1" : emailSequence === 2 ? "3" : emailSequence === 3 ? "7" : "14"}`,
            recipientEmail: lead.email,
            subject: emailTemplate.subject,
            deliveryStatus: "failed",
            errorMessage,
            sentAt: new Date(),
          });
        }
      } catch (campaignError) {
        const errorMessage = campaignError instanceof Error ? campaignError.message : String(campaignError);
        errors.push(`Error processing campaign ${campaign.id}: ${errorMessage}`);
      }
    }

    return {
      success: errors.length === 0,
      emailsSent,
      errors,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[EmailCampaign] Fatal error processing due emails:", error);
    return {
      success: false,
      emailsSent,
      errors: [errorMessage],
    };
  }
}
