/**
 * SMS Service for Sale Options Comparison Summaries
 * Sends concise comparison summaries via SMS with scheduling link
 */

import type { SaleOptionsComparison } from "./saleOptionsComparison";

const GHL_API_URL = process.env.GHL_API_URL || "https://services.leadconnectorhq.com";
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

interface ComparisonSmsData {
  phone: string;
  propertyValue: number;
  comparison: SaleOptionsComparison;
}

/**
 * Format currency for SMS (shorter format)
 */
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

/**
 * Format phone number to E.164 format (required by GHL)
 * Assumes US phone numbers
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  
  // Add +1 for US numbers if not present
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  
  // Return as-is if already formatted or invalid
  return phone;
}

/**
 * Send comparison summary via SMS
 */
export async function sendComparisonSms(data: ComparisonSmsData): Promise<void> {
  const { phone, propertyValue, comparison } = data;

  // Find the recommended option
  const recommendedOption = comparison.options.find(opt => opt.recommended);
  const equity = comparison.equity;
  const equityPercentage = ((equity / propertyValue) * 100).toFixed(0);

  // Create concise SMS message (160 chars ideal, 320 max for multi-part)
  const smsMessage = `EnterActDFW Property Analysis:

🏠 Value: ${formatCurrency(propertyValue)}
💰 Your Equity: ${formatCurrency(equity)} (${equityPercentage}%)

${recommendedOption ? `⭐ RECOMMENDED: ${recommendedOption.name}
Net Proceeds: ${formatCurrency(recommendedOption.netProceeds)}
Timeline: ${recommendedOption.timeline}` : ''}

Compare all 3 options:
Traditional Sale: ${formatCurrency(comparison.options.find(o => o.type === 'traditional')?.netProceeds || 0)}
Cash Offer: ${formatCurrency(comparison.options.find(o => o.type === 'cash_offer')?.netProceeds || 0)}
Short Sale: ${formatCurrency(comparison.options.find(o => o.type === 'short_sale')?.netProceeds || 0)}

📞 Schedule Free Call: 832-346-9569
Or text SCHEDULE to this number

- Felecia Fair, EnterActDFW`;

  // Format phone number
  const formattedPhone = formatPhoneNumber(phone);

  // Send via GHL SMS API
  try {
    const response = await fetch(`${GHL_API_URL}/conversations/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        "Version": "2021-07-28",
      },
      body: JSON.stringify({
        type: "SMS",
        locationId: GHL_LOCATION_ID,
        contactId: formattedPhone, // Will need to create/find contact first in production
        message: smsMessage,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ComparisonSMS] GHL API error:", errorText);
      
      // Fallback: Just log the SMS attempt
      console.log("[ComparisonSMS] Would send to:", formattedPhone);
      console.log("[ComparisonSMS] Message:", smsMessage);
    } else {
      console.log("[ComparisonSMS] Successfully sent to:", formattedPhone);
    }
  } catch (error) {
    console.error("[ComparisonSMS] Failed to send SMS:", error);
    // Don't throw - we don't want to fail the entire request if SMS fails
  }
}

/**
 * Validate US phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  
  // Valid if 10 digits (US) or 11 digits starting with 1 (US with country code)
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}
