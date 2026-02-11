/**
 * Email Service for Sale Options Comparison Reports
 * Sends personalized comparison reports to homeowners via GHL
 */

import type { SaleOptionsComparison } from "./saleOptionsComparison";

const GHL_API_URL = process.env.GHL_API_URL || "https://services.leadconnectorhq.com";
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

interface ComparisonEmailData {
  to: string;
  propertyValue: number;
  comparison: SaleOptionsComparison;
  pdfBuffer: Buffer;
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Send comparison report email via GHL
 */
export async function sendComparisonEmail(data: ComparisonEmailData): Promise<void> {
  const { to, propertyValue, comparison, pdfBuffer } = data;

  // Find the recommended option
  const recommendedOption = comparison.options.find(opt => opt.recommended);
  const equity = comparison.equity;
  const equityPercentage = ((equity / propertyValue) * 100).toFixed(1);

  // Create email HTML content
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Property Sale Options Comparison</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #f9fafb;
      padding: 30px 20px;
      border-radius: 0 0 8px 8px;
    }
    .summary-box {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .summary-box h2 {
      margin-top: 0;
      color: #1e40af;
      font-size: 18px;
    }
    .value-display {
      font-size: 32px;
      font-weight: bold;
      color: #1e40af;
      text-align: center;
      margin: 15px 0;
    }
    .equity-display {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin: 15px 0;
    }
    .equity-positive {
      color: #059669;
    }
    .equity-negative {
      color: #dc2626;
    }
    .option-card {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
    }
    .option-recommended {
      border-color: #1e40af;
      background: #eff6ff;
    }
    .recommended-badge {
      background: #1e40af;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      margin-bottom: 10px;
    }
    .option-name {
      font-size: 20px;
      font-weight: bold;
      color: #1f2937;
      margin: 10px 0;
    }
    .option-timeline {
      color: #6b7280;
      font-size: 14px;
      margin: 5px 0;
    }
    .option-proceeds {
      font-size: 28px;
      font-weight: bold;
      margin: 15px 0;
      text-align: center;
    }
    .proceeds-positive {
      color: #059669;
    }
    .proceeds-negative {
      color: #dc2626;
    }
    .cta-button {
      display: inline-block;
      background: #1e40af;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .cta-button:hover {
      background: #1e3a8a;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 14px;
    }
    .contact-info {
      background: #eff6ff;
      border-left: 4px solid #1e40af;
      padding: 15px;
      margin: 20px 0;
    }
    .contact-info h3 {
      margin-top: 0;
      color: #1e40af;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Your Property Sale Options Comparison</h1>
    <p>Personalized Analysis from EnterActDFW</p>
  </div>
  
  <div class="content">
    <p>Thank you for using our Property Value Estimator! We've prepared a detailed comparison of your sale options.</p>
    
    <div class="summary-box">
      <h2>Estimated Property Value</h2>
      <div class="value-display">${formatCurrency(propertyValue)}</div>
      
      <h2 style="margin-top: 20px;">Your Equity Position</h2>
      <div class="equity-display ${equity >= 0 ? 'equity-positive' : 'equity-negative'}">
        ${formatCurrency(equity)} (${equityPercentage}%)
      </div>
    </div>

    ${recommendedOption ? `
    <div class="option-card option-recommended">
      <span class="recommended-badge">⭐ RECOMMENDED FOR YOU</span>
      <div class="option-name">${recommendedOption.name}</div>
      <div class="option-timeline">Timeline: ${recommendedOption.timeline}</div>
      <p>${recommendedOption.description}</p>
      <div class="option-proceeds ${recommendedOption.netProceeds >= 0 ? 'proceeds-positive' : 'proceeds-negative'}">
        Your Net Proceeds: ${formatCurrency(recommendedOption.netProceeds)}
      </div>
    </div>
    ` : ''}

    <p><strong>📎 Attached:</strong> Your complete comparison report (PDF) includes detailed breakdowns of all three sale options - Traditional Sale, Cash Offer, and Short Sale.</p>

    <div class="contact-info">
      <h3>Ready to Discuss Your Options?</h3>
      <p>Every situation is unique. Let's talk about which option is best for you.</p>
      <p><strong>Felecia Fair</strong><br>
      Licensed Texas Real Estate Broker<br>
      EnterActDFW</p>
      <p>
        📞 <a href="tel:844-981-2937" style="color: #1e40af; text-decoration: none;">844-981-2937</a><br>
        ✉️ <a href="mailto:info@enteractdfw.com" style="color: #1e40af; text-decoration: none;">info@enteractdfw.com</a>
      </p>
    </div>

    <center>
      <a href="tel:844-981-2937" class="cta-button">📞 Schedule Your Free Consultation</a>
    </center>

    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      <strong>Next Steps:</strong><br>
      1. Review the attached PDF comparison report<br>
      2. Consider which option aligns with your timeline and goals<br>
      3. Call us to discuss your specific situation<br>
      4. Get a professional appraisal for the most accurate value
    </p>
  </div>

  <div class="footer">
    <p>EnterActDFW<br>
    4400 State Hwy 121, Suite 300<br>
    Lewisville, Texas 75056</p>
    <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
      This comparison is based on general market data and should be verified with a professional appraisal. 
      Actual sale proceeds may vary based on specific property features, market conditions, and other factors.
    </p>
  </div>
</body>
</html>
  `;

  // Send via GHL email API
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
        contactId: to, // Will need to create/find contact first in production
        subject: "Your Property Sale Options Comparison Report",
        html: emailHtml,
        attachments: [
          {
            name: `sale-options-comparison-${Date.now()}.pdf`,
            content: pdfBuffer.toString("base64"),
            contentType: "application/pdf",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ComparisonEmail] GHL API error:", errorText);
      
      // Fallback: Just log the email attempt
      console.log("[ComparisonEmail] Would send to:", to);
      console.log("[ComparisonEmail] Property value:", formatCurrency(propertyValue));
      console.log("[ComparisonEmail] Recommended:", recommendedOption?.name);
    } else {
      console.log("[ComparisonEmail] Successfully sent to:", to);
    }
  } catch (error) {
    console.error("[ComparisonEmail] Failed to send email:", error);
    // Don't throw - we don't want to fail the entire request if email fails
  }
}
