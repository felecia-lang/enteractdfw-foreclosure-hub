import { Resend } from "resend";

// Initialize Resend with API key from environment
const RESEND_API_KEY = process.env.RESEND_API_KEY;
let resend: Resend | null = null;

if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
} else {
  console.warn("[EmailService] RESEND_API_KEY not configured");
}

/**
 * Send timeline PDF via email using Resend
 */
export async function sendTimelinePDFEmail(params: {
  email: string;
  firstName: string;
  noticeDate: string;
  pdfBuffer: Buffer;
}): Promise<{ success: boolean; error?: string }> {
  const { email, firstName, noticeDate, pdfBuffer } = params;

  if (!resend) {
    console.error("[EmailService] Resend not initialized - missing API key");
    return { success: false, error: "Email service not configured" };
  }

  try {
    // Format the notice date for display
    const formattedDate = new Date(noticeDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create email HTML body
    const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0891B2 0%, #0E7490 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px 20px; }
        .content p { margin: 0 0 15px 0; }
        .content ul { margin: 15px 0; padding-left: 20px; }
        .content li { margin: 8px 0; }
        .cta-button { display: inline-block; background: #EA580C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; }
        .footer p { margin: 5px 0; }
        .highlight { background: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Your Personalized Foreclosure Timeline</h1>
        </div>
        <div class="content">
          <p>Hi ${firstName},</p>
          
          <p>Thank you for using our Foreclosure Timeline Calculator. Your personalized timeline is attached to this email as a PDF document.</p>
          
          <div class="highlight">
            <strong>Notice of Default Date:</strong> ${formattedDate}<br>
            <strong>Attached:</strong> Your complete foreclosure timeline with all key milestones and action items
          </div>
          
          <p><strong>What's included in your timeline:</strong></p>
          <ul>
            <li>7 critical milestones with specific dates</li>
            <li>Detailed action items for each milestone</li>
            <li>Color-coded urgency indicators</li>
            <li>Contact information for immediate assistance</li>
          </ul>
          
          <p><strong>Important:</strong> Keep this timeline handy and refer to it regularly. Missing a deadline can significantly impact your options.</p>
          
          <p><strong>Need personalized help?</strong> I'm here to discuss your specific situation and explore all available options—with no pressure and no judgment.</p>
          
          <a href="tel:844-981-2937" class="cta-button">Call Me: 844-981-2937</a>
          
          <p>Best regards,<br>
          <strong>Felecia Fair</strong><br>
          Licensed Texas Real Estate Broker<br>
          EnterActDFW<br>
          844-981-2937<br>
          info@enteractdfw.com</p>
        </div>
        <div class="footer">
          <p>EnterActDFW | 4400 State Hwy 121, Suite 300, Lewisville, TX 75056</p>
          <p>This timeline is for educational purposes only and not legal advice.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send email via Resend
    const result = await resend.emails.send({
      from: "EnterActDFW <noreply@foreclosurehub.enteractdfw.com>",
      to: [email],
      subject: "Your Personalized Foreclosure Timeline - EnterActDFW",
      html: emailBody,
      attachments: [
        {
          filename: "My_Foreclosure_Timeline.pdf",
          content: pdfBuffer,
        },
      ],
    });

    if (result.error) {
      console.error("[EmailService] Resend API error:", result.error);
      return { success: false, error: result.error.message };
    }

    console.log("[EmailService] Timeline email sent successfully to:", email, "ID:", result.data?.id);
    return { success: true };
  } catch (error) {
    console.error("[EmailService] Failed to send timeline email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
