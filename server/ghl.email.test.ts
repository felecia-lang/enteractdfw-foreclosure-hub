import { describe, expect, it } from "vitest";
import { sendWelcomeEmail, sendGHLEmail, triggerGHLWorkflow } from "./ghl";

describe("GHL Email Automation", () => {
  it("sendGHLEmail should have correct structure", () => {
    expect(typeof sendGHLEmail).toBe("function");
    expect(sendGHLEmail.length).toBe(2); // contactId and emailData parameters
  });

  it("sendWelcomeEmail should have correct structure", () => {
    expect(typeof sendWelcomeEmail).toBe("function");
    expect(sendWelcomeEmail.length).toBe(2); // contactId and firstName parameters
  });

  it("triggerGHLWorkflow should have correct structure", () => {
    expect(typeof triggerGHLWorkflow).toBe("function");
    expect(triggerGHLWorkflow.length).toBe(2); // contactId and workflowId parameters
  });

  it("sendGHLEmail handles missing credentials gracefully", async () => {
    // When GHL credentials are not configured, it should return error without throwing
    const result = await sendGHLEmail("test-contact-id", {
      subject: "Test Email",
      body: "<p>Test content</p>",
    });

    // Should return an object with success property
    expect(result).toHaveProperty("success");
    
    // If credentials are missing, success should be false
    if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    }
  });

  it("sendWelcomeEmail handles missing credentials gracefully", async () => {
    // When GHL credentials are not configured, it should not throw
    await expect(
      sendWelcomeEmail("test-contact-id", "John")
    ).resolves.not.toThrow();
  });
});

describe("Email Templates", () => {
  it("email templates should be importable", async () => {
    const { getDay2Email, getDay5Email, getDay10Email, getOwnerNotificationEmail } = await import("./emailTemplates");
    
    expect(typeof getDay2Email).toBe("function");
    expect(typeof getDay5Email).toBe("function");
    expect(typeof getDay10Email).toBe("function");
    expect(typeof getOwnerNotificationEmail).toBe("function");
  });

  it("getDay2Email should return email with subject and body", async () => {
    const { getDay2Email } = await import("./emailTemplates");
    const email = getDay2Email("John");
    
    expect(email).toHaveProperty("subject");
    expect(email).toHaveProperty("body");
    expect(email.subject).toContain("Rights");
    expect(email.body).toContain("John");
    expect(email.body).toContain("<!DOCTYPE html>");
  });

  it("getDay5Email should return email with subject and body", async () => {
    const { getDay5Email } = await import("./emailTemplates");
    const email = getDay5Email("Jane");
    
    expect(email).toHaveProperty("subject");
    expect(email).toHaveProperty("body");
    expect(email.subject).toContain("Options");
    expect(email.body).toContain("Jane");
    expect(email.body).toContain("Loan Modification");
  });

  it("getDay10Email should return email with subject and body", async () => {
    const { getDay10Email } = await import("./emailTemplates");
    const email = getDay10Email("Bob");
    
    expect(email).toHaveProperty("subject");
    expect(email).toHaveProperty("body");
    expect(email.subject).toContain("Stories");
    expect(email.body).toContain("Bob");
    expect(email.body).toContain("Maria");
  });

  it("getOwnerNotificationEmail should return email with lead data", async () => {
    const { getOwnerNotificationEmail } = await import("./emailTemplates");
    const email = getOwnerNotificationEmail({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "555-1234",
      propertyZip: "75001",
      submittedAt: new Date(),
    });
    
    expect(email).toHaveProperty("subject");
    expect(email).toHaveProperty("body");
    expect(email.subject).toContain("New Foreclosure Lead");
    expect(email.subject).toContain("Test User");
    expect(email.body).toContain("test@example.com");
    expect(email.body).toContain("555-1234");
    expect(email.body).toContain("75001");
  });
});
