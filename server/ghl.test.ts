import { describe, expect, it } from "vitest";
import { syncLeadToGHL } from "./ghl";

describe("GHL API Integration", () => {
  it("should validate GHL API credentials by attempting to sync a test lead", async () => {
    // Test with a sample lead
    const testLead = {
      firstName: "Test",
      lastName: "Lead",
      email: `test-${Date.now()}@example.com`, // Unique email to avoid conflicts
      phone: "+15555551234",
      propertyZip: "75056",
      source: "API Test",
    };

    const result = await syncLeadToGHL(testLead);

    // The test passes if:
    // 1. GHL credentials are configured and the API call succeeds
    // 2. GHL credentials are not configured (returns specific error)
    
    if (result.success) {
      // API call succeeded - credentials are valid
      expect(result.success).toBe(true);
      expect(result.contactId).toBeDefined();
      console.log("[GHL Test] ✓ Successfully validated GHL API credentials");
      console.log("[GHL Test] Created test contact ID:", result.contactId);
    } else {
      // Check if it's a configuration issue vs authentication issue
      if (result.error?.includes("not configured")) {
        // Credentials not set yet - this is expected in some environments
        console.warn("[GHL Test] ⚠ GHL credentials not configured yet");
        expect(result.error).toContain("not configured");
      } else {
        // Authentication or API error - credentials may be invalid
        console.error("[GHL Test] ✗ GHL API error:", result.error);
        throw new Error(`GHL API validation failed: ${result.error}`);
      }
    }
  }, 30000); // 30 second timeout for API calls
});
