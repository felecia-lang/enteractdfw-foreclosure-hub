/**
 * Email service for Save & Resume feature
 * Sends resume links to users who save their calculations
 */

const GHL_API_URL = process.env.GHL_API_URL || "https://services.leadconnectorhq.com";
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const APP_URL = process.env.VITE_APP_URL || "https://enteractdfw.com";

interface SaveResumeEmailData {
  to: string;
  token: string;
  propertyDetails: {
    zipCode: string;
    propertyType: string;
    squareFeet: number;
  };
}

/**
 * Send resume link email to user
 */
export async function sendResumeEmail(data: SaveResumeEmailData): Promise<void> {
  const { to, token, propertyDetails } = data;

  const resumeUrl = `${APP_URL}/property-value-estimator?resume=${token}`;

  const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .property-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .highlight { color: #2563eb; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Your Property Calculation is Saved!</h1>
    </div>
    
    <div class="content">
      <p>Hi there,</p>
      
      <p>We've saved your property valuation calculation so you can return to it anytime within the next <span class="highlight">30 days</span>.</p>
      
      <div class="property-details">
        <h3>Your Property:</h3>
        <ul>
          <li><strong>Location:</strong> ${propertyDetails.zipCode}</li>
          <li><strong>Type:</strong> ${propertyDetails.propertyType.replace(/_/g, " ")}</li>
          <li><strong>Size:</strong> ${propertyDetails.squareFeet.toLocaleString()} sq ft</li>
        </ul>
      </div>
      
      <p>Click the button below to resume your calculation with all your data pre-filled:</p>
      
      <div style="text-align: center;">
        <a href="${resumeUrl}" class="button">Resume My Calculation →</a>
      </div>
      
      <p style="margin-top: 30px;">Or copy and paste this link into your browser:</p>
      <p style="background: white; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 13px;">
        ${resumeUrl}
      </p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <h3>What's Next?</h3>
      <p>Once you complete your calculation, you'll see:</p>
      <ul>
        <li>✅ Your estimated property value and equity position</li>
        <li>✅ Side-by-side comparison of Traditional Sale, Cash Offer, and Short Sale</li>
        <li>✅ Personalized recommendation based on your situation</li>
        <li>✅ Option to schedule a free consultation with our licensed broker</li>
      </ul>
      
      <p><strong>Questions?</strong> Call us at <a href="tel:832-932-7585" style="color: #2563eb;">832-932-7585</a></p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>Felecia Fair</strong><br>
        EnterActDFW<br>
        Licensed Texas Real Estate Brokerage
      </p>
    </div>
    
    <div class="footer">
      <p>This link will expire in 30 days.</p>
      <p>© 2025 EnterActDFW. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const response = await fetch(`${GHL_API_URL}/conversations/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        "Version": "2021-07-28",
      },
      body: JSON.stringify({
        type: "Email",
        locationId: GHL_LOCATION_ID,
        contactId: to,
        subject: "Your Property Calculation is Saved - Resume Anytime",
        html: emailBody,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[SaveResumeEmail] GHL API error:", errorText);
      
      // Fallback: Just log the email attempt
      console.log("[SaveResumeEmail] Would send to:", to);
      console.log("[SaveResumeEmail] Resume URL:", resumeUrl);
    } else {
      console.log("[SaveResumeEmail] Successfully sent to:", to);
    }
  } catch (error) {
    console.error("[SaveResumeEmail] Failed to send email:", error);
    // Don't throw - we don't want to fail the entire request if email fails
  }
}
