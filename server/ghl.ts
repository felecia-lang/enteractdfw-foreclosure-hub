/**
 * Go HighLevel (GHL) CRM Integration
 * 
 * This module handles all interactions with the Go HighLevel API
 * to sync leads, track activities, and manage CRM data.
 * 
 * Setup Instructions:
 * 1. Get your GHL API Key from Settings → API Keys in your GHL account
 * 2. Get your Location ID from Settings → Business Profile
 * 3. Add these to your environment variables via the Management UI:
 *    - GHL_API_KEY: Your GHL API key
 *    - GHL_LOCATION_ID: Your GHL location ID
 *    - GHL_API_URL: https://services.leadconnectorhq.com (default)
 */

const GHL_API_URL = process.env.GHL_API_URL || "https://services.leadconnectorhq.com";
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

interface GHLContact {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  website?: string;
  tags?: string[];
  customFields?: Record<string, string>;
  source?: string;
}

interface GHLOpportunity {
  pipelineId: string;
  locationId: string;
  name: string;
  pipelineStageId: string;
  status: "open" | "won" | "lost" | "abandoned";
  contactId: string;
  monetaryValue?: number;
  assignedTo?: string;
  customFields?: Record<string, string>;
}

interface GHLNote {
  contactId: string;
  body: string;
  userId?: string;
}

interface GHLTask {
  contactId: string;
  title: string;
  body?: string;
  dueDate: string;
  assignedTo?: string;
  status?: "incomplete" | "completed";
}

/**
 * Make a request to the GHL API
 */
async function makeGHLRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<any> {
  if (!GHL_API_KEY) {
    console.warn("[GHL] API key not configured. Skipping GHL API call.");
    return { success: false, error: "GHL_API_KEY not configured" };
  }

  if (!GHL_LOCATION_ID) {
    console.warn("[GHL] Location ID not configured. Skipping GHL API call.");
    return { success: false, error: "GHL_LOCATION_ID not configured" };
  }

  try {
    const url = `${GHL_API_URL}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        "Version": "2021-07-28", // GHL API version
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[GHL] API error (${response.status}):`, errorText);
      return {
        success: false,
        error: `GHL API error: ${response.status}`,
        details: errorText,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("[GHL] Request failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create or update a contact in GHL
 */
export async function syncContactToGHL(contact: GHLContact): Promise<{
  success: boolean;
  contactId?: string;
  error?: string;
}> {
  console.log("[GHL] Syncing contact:", contact.email);

  // First, search for existing contact by email
  const searchResult = await makeGHLRequest(
    `/contacts/?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent(contact.email)}`,
    "GET"
  );

  if (!searchResult.success) {
    return { success: false, error: searchResult.error };
  }

  const existingContact = searchResult.data?.contacts?.[0];

  if (existingContact) {
    // Update existing contact
    console.log("[GHL] Updating existing contact:", existingContact.id);
    const updateResult = await makeGHLRequest(
      `/contacts/${existingContact.id}`,
      "PUT",
      {
        ...contact,
        locationId: GHL_LOCATION_ID,
      }
    );

    if (!updateResult.success) {
      return { success: false, error: updateResult.error };
    }

    return { success: true, contactId: existingContact.id };
  } else {
    // Create new contact
    console.log("[GHL] Creating new contact");
    const createResult = await makeGHLRequest(
      `/contacts/`,
      "POST",
      {
        ...contact,
        locationId: GHL_LOCATION_ID,
      }
    );

    if (!createResult.success) {
      return { success: false, error: createResult.error };
    }

    return { success: true, contactId: createResult.data?.contact?.id };
  }
}

/**
 * Create an opportunity in GHL
 */
export async function createGHLOpportunity(opportunity: GHLOpportunity): Promise<{
  success: boolean;
  opportunityId?: string;
  error?: string;
}> {
  console.log("[GHL] Creating opportunity:", opportunity.name);

  const result = await makeGHLRequest(
    `/opportunities/`,
    "POST",
    opportunity
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, opportunityId: result.data?.opportunity?.id };
}

/**
 * Add a note to a contact in GHL
 */
export async function addGHLNote(note: GHLNote): Promise<{
  success: boolean;
  noteId?: string;
  error?: string;
}> {
  console.log("[GHL] Adding note to contact:", note.contactId);

  const result = await makeGHLRequest(
    `/contacts/${note.contactId}/notes`,
    "POST",
    note
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, noteId: result.data?.note?.id };
}

/**
 * Create a task for a contact in GHL
 */
export async function createGHLTask(task: GHLTask): Promise<{
  success: boolean;
  taskId?: string;
  error?: string;
}> {
  console.log("[GHL] Creating task for contact:", task.contactId);

  const result = await makeGHLRequest(
    `/contacts/${task.contactId}/tasks`,
    "POST",
    task
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, taskId: result.data?.task?.id };
}

/**
 * Add tags to a contact in GHL
 */
export async function addGHLTags(contactId: string, tags: string[]): Promise<{
  success: boolean;
  error?: string;
}> {
  console.log("[GHL] Adding tags to contact:", contactId, tags);

  const result = await makeGHLRequest(
    `/contacts/${contactId}/tags`,
    "POST",
    { tags }
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}

/**
 * Track a custom event/activity in GHL
 */
export async function trackGHLActivity(
  contactId: string,
  activityType: string,
  description: string,
  metadata?: Record<string, any>
): Promise<{
  success: boolean;
  error?: string;
}> {
  console.log("[GHL] Tracking activity:", activityType, "for contact:", contactId);

  // Add as a note with metadata
  const noteBody = `${description}\n\nMetadata: ${JSON.stringify(metadata, null, 2)}`;
  
  return await addGHLNote({
    contactId,
    body: noteBody,
  });
}

/**
 * Sync a lead submission to GHL
 * This is the main function called when a lead submits the form
 */
export async function syncLeadToGHL(leadData: {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  propertyZip: string;
  source?: string;
}): Promise<{
  success: boolean;
  contactId?: string;
  error?: string;
}> {
  try {
    // Step 1: Create/update contact
    const contactResult = await syncContactToGHL({
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone,
      postalCode: leadData.propertyZip,
      tags: ["Foreclosure Lead", "Website Lead", leadData.source || "Direct"],
      customFields: {
        property_zip: leadData.propertyZip,
        lead_source: leadData.source || "Website Form",
        foreclosure_stage: "Initial Contact",
      },
      source: "EnterActDFW Foreclosure Hub",
    });

    if (!contactResult.success || !contactResult.contactId) {
      return { success: false, error: contactResult.error };
    }

    // Step 2: Add initial note
    await addGHLNote({
      contactId: contactResult.contactId,
      body: `New foreclosure lead submitted via website.\n\nProperty ZIP: ${leadData.propertyZip}\nPhone: ${leadData.phone}\n\nLead requested foreclosure survival guide.`,
    });

    // Step 3: Create follow-up task
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await createGHLTask({
      contactId: contactResult.contactId,
      title: "Follow up with foreclosure lead",
      body: `Contact ${leadData.firstName} to discuss their foreclosure situation and options.`,
      dueDate: tomorrow.toISOString(),
      status: "incomplete",
    });

    console.log("[GHL] Successfully synced lead to GHL:", contactResult.contactId);
    return { success: true, contactId: contactResult.contactId };
  } catch (error) {
    console.error("[GHL] Error syncing lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Track email interaction in GHL
 */
export async function trackEmailInteraction(
  contactId: string,
  interactionType: "sent" | "opened" | "clicked",
  emailSubject: string,
  linkClicked?: string
): Promise<void> {
  let description = "";
  
  switch (interactionType) {
    case "sent":
      description = `Email sent: "${emailSubject}"`;
      break;
    case "opened":
      description = `Email opened: "${emailSubject}"`;
      break;
    case "clicked":
      description = `Email link clicked: "${emailSubject}"${linkClicked ? `\nLink: ${linkClicked}` : ""}`;
      break;
  }

  await trackGHLActivity(contactId, `email_${interactionType}`, description, {
    emailSubject,
    linkClicked,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track guide download in GHL
 */
export async function trackGuideDownload(
  contactId: string,
  guideName: string,
  downloadMethod: "email" | "direct"
): Promise<void> {
  await trackGHLActivity(
    contactId,
    "guide_download",
    `Downloaded: ${guideName} (via ${downloadMethod})`,
    {
      guideName,
      downloadMethod,
      timestamp: new Date().toISOString(),
    }
  );
}

/**
 * Trigger an email workflow/campaign in GHL
 * This adds the contact to a workflow which will send automated emails
 */
export async function triggerGHLWorkflow(
  contactId: string,
  workflowId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  console.log("[GHL] Triggering workflow:", workflowId, "for contact:", contactId);

  const result = await makeGHLRequest(
    `/contacts/${contactId}/workflow/${workflowId}/subscribe`,
    "POST",
    {}
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}

/**
 * Send a single email via GHL
 * This sends an immediate email (not part of a workflow)
 */
export async function sendGHLEmail(
  contactId: string,
  emailData: {
    subject: string;
    body: string;
    from?: string;
    replyTo?: string;
  }
): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  console.log("[GHL] Sending email to contact:", contactId);

  const result = await makeGHLRequest(
    `/conversations/messages/email`,
    "POST",
    {
      type: "Email",
      contactId,
      subject: emailData.subject,
      html: emailData.body,
      emailFrom: emailData.from,
      replyTo: emailData.replyTo,
    }
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, messageId: result.data?.messageId };
}

/**
 * Send immediate welcome email to new lead
 */
export async function sendWelcomeEmail(
  contactId: string,
  firstName: string
): Promise<void> {
  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Open Sans', Arial, sans-serif; line-height: 1.6; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0A2342; color: white; padding: 30px; text-align: center; }
        .content { background-color: #F5F5F5; padding: 30px; }
        .cta-button { display: inline-block; background-color: #00A6A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Foreclosure Survival Guide</h1>
        </div>
        <div class="content">
          <p>Hi ${firstName},</p>
          
          <p>Thank you for requesting your FREE Foreclosure Survival Guide from EnterActDFW.</p>
          
          <p>I understand that facing foreclosure can be overwhelming and stressful. You're not alone, and you have options.</p>
          
          <p><strong>Here's what you'll find in your guide:</strong></p>
          <ul>
            <li>Understanding the Texas foreclosure timeline</li>
            <li>Your legal rights and protections</li>
            <li>Options to avoid foreclosure</li>
            <li>Step-by-step action plans</li>
            <li>How to contact your lender effectively</li>
          </ul>
          
          <p>Over the next few days, I'll send you additional resources to help you navigate this situation with confidence.</p>
          
          <p><strong>Need immediate help?</strong> I'm here to answer your questions and discuss your specific situation—with no pressure and no judgment.</p>
          
          <a href="tel:832-932-7585" class="cta-button">Call Me: 832-932-7585</a>
          
          <p>Best regards,<br>
          <strong>Felecia Fair</strong><br>
          Licensed Texas Real Estate Broker<br>
          EnterActDFW<br>
          832-932-7585<br>
          info@enteractdfw.com</p>
        </div>
        <div class="footer">
          <p>EnterActDFW | 4400 State Hwy 121, Suite 300, Lewisville, TX 75056</p>
          <p>This is educational information only and not legal advice.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendGHLEmail(contactId, {
    subject: "Your FREE Foreclosure Survival Guide - EnterActDFW",
    body: emailBody,
    from: "info@enteractdfw.com",
    replyTo: "info@enteractdfw.com",
  });

  // Track the email send
  await trackEmailInteraction(contactId, "sent", "Your FREE Foreclosure Survival Guide - EnterActDFW");
}


/**
 * Send personalized timeline PDF via email
 */
export async function sendTimelineEmail(params: {
  email: string;
  firstName: string;
  noticeDate: string;
  pdfBuffer: Buffer;
}): Promise<{ success: boolean; error?: string }> {
  const { email, firstName, noticeDate, pdfBuffer } = params;

  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.warn("[GHL] API credentials not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    // Format the notice date for display
    const formattedDate = new Date(noticeDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
          
          <a href="tel:832-932-7585" class="cta-button">Call Me: 832-932-7585</a>
          
          <p>Best regards,<br>
          <strong>Felecia Fair</strong><br>
          Licensed Texas Real Estate Broker<br>
          EnterActDFW<br>
          832-932-7585<br>
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

    // Convert PDF buffer to base64 for attachment
    const pdfBase64 = pdfBuffer.toString('base64');

    // Send email via GHL API
    const response = await fetch(`${GHL_API_URL}/conversations/messages/email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        to: email,
        subject: "Your Personalized Foreclosure Timeline - EnterActDFW",
        html: emailBody,
        from: "info@enteractdfw.com",
        replyTo: "info@enteractdfw.com",
        attachments: [
          {
            filename: "My_Foreclosure_Timeline.pdf",
            content: pdfBase64,
            contentType: "application/pdf",
            encoding: "base64",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[GHL] Email API error:", errorData);
      return { success: false, error: `GHL API error: ${response.status}` };
    }

    const result = await response.json();
    console.log("[GHL] Timeline email sent successfully to:", email);
    return { success: true };
  } catch (error) {
    console.error("[GHL] Failed to send timeline email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
