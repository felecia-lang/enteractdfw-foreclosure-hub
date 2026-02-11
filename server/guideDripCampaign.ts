import { drizzle } from "drizzle-orm/mysql2";
import { eq, and, lt } from "drizzle-orm";
import { emailDeliveryLog, resourceDownloads } from "../drizzle/schema";
import { sendDripEmail } from "./ghl";

const db = drizzle(process.env.DATABASE_URL!);

interface DripEmailTemplate {
  dayNumber: number;
  subject: string;
  getBody: (name: string, resourceName: string) => string;
}

const DRIP_TEMPLATES: DripEmailTemplate[] = [
  {
    dayNumber: 1,
    subject: "Your Foreclosure Survival Guide + Next Steps",
    getBody: (name: string, resourceName: string) => `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to EnterActDFW</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p>Hi ${name},</p>
            
            <p>Thank you for downloading the <strong>${resourceName}</strong>. We're here to help you navigate this challenging time with confidence.</p>
            
            <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">What to Do Next</h2>
            
            <ol style="padding-left: 20px;">
              <li style="margin-bottom: 15px;"><strong>Review Your Guide:</strong> Take time to read through the strategies and understand your rights.</li>
              <li style="margin-bottom: 15px;"><strong>Assess Your Situation:</strong> Use our Property Value Estimator to see your options: <a href="${process.env.VITE_OAUTH_PORTAL_URL}/property-value-estimator" style="color: #3b82f6;">Calculate Now</a></li>
              <li style="margin-bottom: 15px;"><strong>Schedule a Free Consultation:</strong> Let's discuss your specific situation and create an action plan.</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:8449812937" style="display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Call (844) 981-2937</a>
            </div>
            
            <p style="background: #e0f2fe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <strong>Time is critical.</strong> The sooner you act, the more options you'll have. We've helped hundreds of Texas homeowners avoid foreclosure—let us help you too.
            </p>
            
            <p>Looking forward to speaking with you,</p>
            <p><strong>The EnterActDFW Team</strong><br>
            (844) 981-2937</p>
          </div>
          
          <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px;">
            <p>EnterActDFW | Dallas-Fort Worth, Texas</p>
            <p>You're receiving this because you downloaded a foreclosure resource from our website.</p>
            <p><a href="#" style="color: #60a5fa;">Unsubscribe</a></p>
          </div>
        </body>
      </html>
    `,
  },
  {
    dayNumber: 3,
    subject: "Real Success Story: How Maria Avoided Foreclosure",
    getBody: (name: string) => `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Success Story</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p>Hi ${name},</p>
            
            <p>I wanted to share a real success story that might resonate with your situation.</p>
            
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #1e40af; margin-top: 0;">Maria's Story: From Notice of Default to Fresh Start</h2>
              
              <p><em>"I was 3 months behind on my mortgage and received a Notice of Default. I felt hopeless and didn't know where to turn."</em></p>
              
              <p>Maria, a single mother in Dallas, was facing foreclosure after losing her job. Here's how we helped:</p>
              
              <ul style="padding-left: 20px;">
                <li style="margin-bottom: 10px;"><strong>Day 1:</strong> Free consultation to assess her situation</li>
                <li style="margin-bottom: 10px;"><strong>Day 3:</strong> Negotiated with her lender to pause foreclosure proceedings</li>
                <li style="margin-bottom: 10px;"><strong>Week 2:</strong> Presented her with 3 viable options (loan modification, short sale, cash offer)</li>
                <li style="margin-bottom: 10px;"><strong>Week 4:</strong> Closed on a cash offer, walked away with $12,000</li>
              </ul>
              
              <p style="background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <em>"EnterActDFW gave me hope when I had none. They explained everything clearly and helped me make the best decision for my family. I'm so grateful."</em><br>
                <strong>— Maria T., Dallas</strong>
              </p>
            </div>
            
            <h3 style="color: #1e40af;">Your situation is unique, but you have options.</h3>
            
            <p>Every homeowner's situation is different, but one thing is constant: <strong>the sooner you act, the more options you have.</strong></p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:8449812937" style="display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Schedule Your Free Consultation</a>
            </div>
            
            <p>Let's discuss your situation and create a personalized action plan.</p>
            
            <p>Best regards,</p>
            <p><strong>The EnterActDFW Team</strong><br>
            (844) 981-2937</p>
          </div>
          
          <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px;">
            <p>EnterActDFW | Dallas-Fort Worth, Texas</p>
            <p><a href="#" style="color: #60a5fa;">Unsubscribe</a></p>
          </div>
        </body>
      </html>
    `,
  },
  {
    dayNumber: 7,
    subject: "Final Reminder: Let's Create Your Action Plan",
    getBody: (name: string) => `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">⏰ Time is Running Out</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p>Hi ${name},</p>
            
            <p>It's been a week since you downloaded our foreclosure guide. I wanted to reach out one more time because <strong>time is critical</strong> when facing foreclosure.</p>
            
            <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">Why Acting Now Matters</h3>
              <ul style="padding-left: 20px; margin: 10px 0;">
                <li>Every day that passes reduces your options</li>
                <li>Lenders become less flexible as foreclosure progresses</li>
                <li>Your credit score takes more damage with each missed payment</li>
                <li>Legal fees and penalties continue to accumulate</li>
              </ul>
            </div>
            
            <h3 style="color: #1e40af;">Here's What Happens Next:</h3>
            
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p><strong>1. Schedule Your Free Consultation</strong><br>
              We'll review your situation in detail (15-20 minutes)</p>
              
              <p><strong>2. Get Your Personalized Action Plan</strong><br>
              We'll present your options with clear pros and cons</p>
              
              <p><strong>3. Take Action Immediately</strong><br>
              We'll help you execute the best strategy for your situation</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:8449812937" style="display: inline-block; background: #dc2626; color: white; padding: 18px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">Call Now: (844) 981-2937</a>
            </div>
            
            <p style="background: #e0f2fe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <strong>No obligation. No pressure. Just honest advice from people who care.</strong>
            </p>
            
            <p>We've helped over 500 Texas homeowners avoid foreclosure. Let us help you too.</p>
            
            <p>This is my final email in this series. If you need help, please don't hesitate to reach out.</p>
            
            <p>Wishing you the best,</p>
            <p><strong>The EnterActDFW Team</strong><br>
            (844) 981-2937</p>
          </div>
          
          <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px;">
            <p>EnterActDFW | Dallas-Fort Worth, Texas</p>
            <p><a href="#" style="color: #60a5fa;">Unsubscribe</a></p>
          </div>
        </body>
      </html>
    `,
  },
];

/**
 * Check for resource downloads that need drip emails and send them.
 * This function should be called periodically (e.g., every hour via cron job).
 */
export async function processDripCampaign() {
  console.log("[DripCampaign] Starting drip campaign check...");

  try {
    // Get all resource downloads
    const downloads = await db.select().from(resourceDownloads);

    for (const download of downloads) {
      for (const template of DRIP_TEMPLATES) {
        const daysSinceDownload = Math.floor(
          (Date.now() - download.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Check if it's time to send this email
        if (daysSinceDownload >= template.dayNumber) {
          // Check if we've already sent this email
          const existingEmail = await db
            .select()
            .from(emailDeliveryLog)
            .where(
              and(
                eq(emailDeliveryLog.recipientEmail, download.email),
                eq(emailDeliveryLog.emailType, `drip-day-${template.dayNumber}`)
              )
            )
            .limit(1);

          if (existingEmail.length === 0) {
            // Send the email
            console.log(
              `[DripCampaign] Sending Day ${template.dayNumber} email to ${download.email}`
            );

            const emailBody = template.getBody(
              download.name,
              download.resourceName
            );

            await sendDripEmail({
              email: download.email,
              subject: template.subject,
              htmlBody: emailBody,
            });

            // Log the email delivery
            await db.insert(emailDeliveryLog).values({
              campaignId: 0, // Default campaign ID for guide drip
              leadId: 0, // We don't have a leadId from resourceDownloads
              emailSequence: template.dayNumber,
              emailType: `drip-day-${template.dayNumber}`,
              recipientEmail: download.email,
              subject: template.subject,
              deliveryStatus: "sent",
              sentAt: new Date(),
            });

            console.log(
              `[DripCampaign] Successfully sent Day ${template.dayNumber} email to ${download.email}`
            );
          }
        }
      }
    }

    console.log("[DripCampaign] Drip campaign check complete");
  } catch (error) {
    console.error("[DripCampaign] Error processing drip campaign:", error);
  }
}

/**
 * Enroll a new guide downloader in the drip campaign.
 * This should be called immediately after a resource download.
 */
export async function enrollInDripCampaign(email: string, name: string, resourceName: string) {
  console.log(`[DripCampaign] Enrolling ${email} in drip campaign`);
  
  // The enrollment is automatic - they'll receive emails based on their download date
  // We just need to ensure the download is recorded in resourceDownloads table
  // which happens in the downloadWithCapture procedure
  
  return { success: true, message: "Enrolled in drip campaign" };
}
