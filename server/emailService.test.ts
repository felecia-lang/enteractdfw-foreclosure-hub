import { describe, expect, it } from "vitest";
import { Resend } from "resend";

/**
 * Tests for email service using Resend API
 * 
 * This test validates that the RESEND_API_KEY is configured correctly
 * by attempting to retrieve the API key information from Resend.
 */

describe("emailService - Resend API Key Validation", () => {
  it("validates RESEND_API_KEY is configured and valid", async () => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    // Check that API key is set
    expect(RESEND_API_KEY).toBeDefined();
    expect(RESEND_API_KEY).not.toBe("");
    
    // Initialize Resend client
    const resend = new Resend(RESEND_API_KEY);
    
    // Test API key by calling a lightweight endpoint (list API keys)
    // This validates the key without sending actual emails
    try {
      const result = await resend.apiKeys.list();
      
      // Check if the key is restricted to sending emails only
      if (result.error && result.error.name === "restricted_api_key") {
        // This is actually good - the key is valid but restricted to sending emails
        console.log("[EmailService Test] Resend API key validated (restricted to sending emails)");
        expect(result.error.message).toContain("send emails");
        return;
      }
      
      // If we get here without errors, the API key is valid with full permissions
      expect(result).toBeDefined();
      expect(result.error).toBeUndefined();
      
      console.log("[EmailService Test] Resend API key validated successfully");
    } catch (error) {
      // If the API call fails completely, the key is invalid
      console.error("[EmailService Test] Resend API key validation failed:", error);
      throw new Error("Invalid RESEND_API_KEY - please provide a valid Resend API key");
    }
  });
});
