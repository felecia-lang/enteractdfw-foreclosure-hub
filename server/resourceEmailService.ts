import fs from "fs";
import path from "path";

interface SendResourceEmailParams {
  recipientName: string;
  recipientEmail: string;
  resourceName: string;
  resourceFile: string;
}

export async function sendResourceEmail(params: SendResourceEmailParams): Promise<boolean> {
  const { recipientName, recipientEmail, resourceName, resourceFile } = params;

  const GHL_API_KEY = process.env.GHL_API_KEY;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.warn("[ResourceEmail] GHL credentials not configured");
    return false;
  }

  try {
    // Read PDF file from public directory
    const pdfPath = path.join(process.cwd(), "client", "public", "pdfs", resourceFile);
    
    if (!fs.existsSync(pdfPath)) {
      console.error(`[ResourceEmail] PDF file not found: ${pdfPath}`);
      return false;
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString("base64");

    // Send email via GHL
    const response = await fetch(`https://services.leadconnectorhq.com/emails/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        "Version": "2021-07-28",
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        to: recipientEmail,
        subject: `Your ${resourceName} from EnterActDFW`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Your ${resourceName}</h2>
            <p>Hi ${recipientName},</p>
            <p>Thank you for downloading the <strong>${resourceName}</strong> from EnterActDFW.</p>
            <p>This comprehensive guide is attached to this email. We hope it provides valuable information to help you understand your options and make informed decisions.</p>
            <h3 style="color: #1e40af;">Need Help?</h3>
            <p>If you have questions or would like to discuss your specific situation, we're here to help:</p>
            <ul>
              <li><strong>Phone:</strong> (844) 981-2937</li>
              <li><strong>Email:</strong> info@enteractdfw.com</li>
            </ul>
            <p>We offer free consultations with no obligation. Our team is ready to answer your questions and explore your options.</p>
            <p style="margin-top: 30px;">Best regards,<br><strong>The EnterActDFW Team</strong></p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              EnterActDFW | Licensed Texas Real Estate Brokerage<br>
              4400 State Hwy 121, Suite 300, Lewisville, TX 75056
            </p>
          </div>
        `,
        attachments: [
          {
            name: resourceFile,
            content: pdfBase64,
            contentType: "application/pdf",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[ResourceEmail] GHL API error:", errorData);
      return false;
    }

    console.log(`[ResourceEmail] Successfully sent ${resourceName} to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error("[ResourceEmail] Failed to send email:", error);
    return false;
  }
}
