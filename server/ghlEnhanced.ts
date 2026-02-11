/**
 * Enhanced GHL Integration Functions
 * 
 * Additional GHL integration functions for timeline calculator
 * and other advanced features.
 */

import { syncContactToGHL, addGHLNote } from "./ghl";

interface TimelineMilestone {
  title: string;
  date: string;
  daysFromNotice: number;
  urgency: "low" | "medium" | "high" | "critical";
  status: "upcoming" | "current" | "passed";
  actions: string[];
}

/**
 * Sync timeline calculator submission to GHL
 * Creates contact and adds detailed timeline note
 */
export async function syncTimelineToGHL(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  noticeDate: string;
  milestones: TimelineMilestone[];
}): Promise<{
  success: boolean;
  contactId?: string;
  error?: string;
}> {
  try {
    // Extract name from email if not provided
    const firstName = data.firstName || data.email.split("@")[0];
    
    // Step 1: Create/update contact with Foreclosure_Hub_Lead tag
    const contactResult = await syncContactToGHL({
      firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      // REQUIRED: Add Foreclosure_Hub_Lead tag
      tags: ["Foreclosure_Hub_Lead", "Timeline_Calculator", "Active_Timeline"],
      customFields: [
        {
          key: "notice_of_default_date",
          field_value: data.noticeDate,
        },
        {
          key: "timeline_calculated_date",
          field_value: new Date().toISOString(),
        },
        {
          key: "foreclosure_stage",
          field_value: "Notice of Default Received",
        },
      ],
      source: "EnterActDFW Foreclosure Hub - Timeline Calculator",
    });

    if (!contactResult.success || !contactResult.contactId) {
      return { success: false, error: contactResult.error };
    }

    // Step 2: Add detailed timeline note with all calculated dates
    const timelineNote = formatTimelineNote(data.noticeDate, data.milestones);
    
    await addGHLNote({
      contactId: contactResult.contactId,
      body: timelineNote,
    });

    console.log("[GHL Enhanced] Successfully synced timeline to GHL:", contactResult.contactId);
    return { success: true, contactId: contactResult.contactId };
  } catch (error) {
    console.error("[GHL Enhanced] Error syncing timeline:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Format timeline milestones into a readable note for GHL
 */
function formatTimelineNote(noticeDate: string, milestones: TimelineMilestone[]): string {
  const lines = [
    "📅 FORECLOSURE TIMELINE CALCULATED",
    "=" .repeat(50),
    "",
    `Notice of Default Date: ${new Date(noticeDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`,
    "",
    "KEY MILESTONES:",
    "-".repeat(50),
  ];

  milestones.forEach((milestone, index) => {
    lines.push("");
    lines.push(`${index + 1}. ${milestone.title}`);
    lines.push(`   Date: ${new Date(milestone.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })} (Day ${milestone.daysFromNotice})`);
    lines.push(`   Urgency: ${milestone.urgency.toUpperCase()}`);
    lines.push(`   Status: ${milestone.status}`);
    
    if (milestone.actions && milestone.actions.length > 0) {
      lines.push(`   Actions:`);
      milestone.actions.forEach(action => {
        lines.push(`   • ${action}`);
      });
    }
  });

  lines.push("");
  lines.push("-".repeat(50));
  lines.push(`Timeline generated: ${new Date().toLocaleString("en-US")}`);
  lines.push("");
  lines.push("⚠️ FOLLOW-UP REQUIRED: Contact homeowner to discuss options and next steps.");

  return lines.join("\n");
}

/**
 * Update GHL contact when user saves timeline to their dashboard
 */
export async function trackTimelineSaved(data: {
  email: string;
  noticeDate: string;
  milestones: TimelineMilestone[];
}): Promise<{
  success: boolean;
  contactId?: string;
  error?: string;
}> {
  try {
    // First, find or create the contact
    const contactResult = await syncContactToGHL({
      firstName: data.email.split("@")[0],
      email: data.email,
      tags: ["Foreclosure_Hub_Lead", "Timeline_Saved", "Registered_User"],
      customFields: [
        {
          key: "notice_of_default_date",
          field_value: data.noticeDate,
        },
        {
          key: "timeline_saved_date",
          field_value: new Date().toISOString(),
        },
        {
          key: "user_engagement",
          field_value: "High - Saved Timeline",
        },
      ],
      source: "EnterActDFW Foreclosure Hub - My Timeline Dashboard",
    });

    if (!contactResult.success || !contactResult.contactId) {
      return { success: false, error: contactResult.error };
    }

    // Add note about timeline being saved
    await addGHLNote({
      contactId: contactResult.contactId,
      body: `✅ User saved their foreclosure timeline to dashboard.\n\nNotice Date: ${data.noticeDate}\nEngagement Level: HIGH\n\nThis user is actively tracking their foreclosure timeline and should be prioritized for outreach.`,
    });

    return { success: true, contactId: contactResult.contactId };
  } catch (error) {
    console.error("[GHL Enhanced] Error tracking timeline save:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Track when user completes an action item in their timeline
 */
export async function trackTimelineProgress(data: {
  email: string;
  actionCompleted: string;
  milestoneTitle: string;
  completionPercentage: number;
}): Promise<void> {
  try {
    // Find contact by email
    const contactResult = await syncContactToGHL({
      firstName: data.email.split("@")[0],
      email: data.email,
      tags: ["Foreclosure_Hub_Lead", "Active_User"],
      customFields: [
        {
          key: "timeline_progress",
          field_value: `${data.completionPercentage}%`,
        },
        {
          key: "last_activity_date",
          field_value: new Date().toISOString(),
        },
      ],
      source: "EnterActDFW Foreclosure Hub",
    });

    if (contactResult.success && contactResult.contactId) {
      // Add note about progress
      await addGHLNote({
        contactId: contactResult.contactId,
        body: `📊 Timeline Progress Update\n\nMilestone: ${data.milestoneTitle}\nAction Completed: ${data.actionCompleted}\nOverall Progress: ${data.completionPercentage}%\n\nUser is actively working through their foreclosure timeline.`,
      });
    }
  } catch (error) {
    console.error("[GHL Enhanced] Error tracking timeline progress:", error);
  }
}
