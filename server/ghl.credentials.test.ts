import { describe, expect, it } from "vitest";

/**
 * GHL Credentials Validation Test
 * 
 * This test validates that the GHL_API_KEY and GHL_LOCATION_ID
 * are correctly configured and can successfully authenticate
 * with the GoHighLevel API.
 */

const GHL_API_URL = process.env.GHL_API_URL || "https://services.leadconnectorhq.com";
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

describe("GHL Credentials Validation", () => {
  it("should have GHL_API_KEY configured", () => {
    expect(GHL_API_KEY).toBeDefined();
    expect(GHL_API_KEY).not.toBe("");
    expect(typeof GHL_API_KEY).toBe("string");
  });

  it("should have GHL_LOCATION_ID configured", () => {
    expect(GHL_LOCATION_ID).toBeDefined();
    expect(GHL_LOCATION_ID).not.toBe("");
    expect(typeof GHL_LOCATION_ID).toBe("string");
  });

  it("should successfully authenticate with GHL API", async () => {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      console.warn("[Test] Skipping API validation - credentials not configured");
      return;
    }

    try {
      // Try to fetch location details to validate credentials
      const response = await fetch(
        `${GHL_API_URL}/locations/${GHL_LOCATION_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${GHL_API_KEY}`,
            "Content-Type": "application/json",
            Version: "2021-07-28",
          },
        }
      );

      console.log(`[Test] GHL API Response Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Test] GHL API Error (${response.status}):`, errorText);
        
        if (response.status === 401) {
          throw new Error(
            "Invalid GHL_API_KEY - Please check your API key in GoHighLevel Settings → API Keys"
          );
        } else if (response.status === 404) {
          throw new Error(
            "Invalid GHL_LOCATION_ID - Please check your Location ID in GoHighLevel Settings → Company"
          );
        } else {
          throw new Error(`GHL API returned ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log("[Test] ✅ GHL API authentication successful!");
      console.log(`[Test] Location Name: ${data.name || "N/A"}`);

      expect(response.status).toBe(200);
      expect(data).toBeDefined();
      expect(data.id).toBe(GHL_LOCATION_ID);
    } catch (error) {
      console.error("[Test] ❌ GHL API validation failed:", error);
      throw error;
    }
  }, 15000); // 15 second timeout for API call
});
