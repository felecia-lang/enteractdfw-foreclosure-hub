import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { verifyRecaptchaToken, isScoreAcceptable } from "./recaptcha";

// Mock fetch globally
global.fetch = vi.fn();

describe("reCAPTCHA Verification", () => {
  const originalEnv = process.env.RECAPTCHA_SECRET_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";
  });

  afterEach(() => {
    process.env.RECAPTCHA_SECRET_KEY = originalEnv;
  });

  describe("verifyRecaptchaToken", () => {
    it("should successfully verify a valid token with good score", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          score: 0.9,
          action: "contact_form",
          challenge_ts: "2024-01-01T00:00:00Z",
          hostname: "example.com",
        }),
      });

      const result = await verifyRecaptchaToken("valid-token", "contact_form");

      expect(result.success).toBe(true);
      expect(result.score).toBe(0.9);
      expect(result.action).toBe("contact_form");
      expect(result.error).toBeUndefined();
    });

    it("should fail verification for invalid token", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          score: 0,
          "error-codes": ["invalid-input-response"],
        }),
      });

      const result = await verifyRecaptchaToken("invalid-token", "contact_form");

      expect(result.success).toBe(false);
      expect(result.score).toBe(0);
      expect(result.error).toContain("invalid-input-response");
    });

    it("should fail verification for action mismatch", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          score: 0.8,
          action: "wrong_action",
          challenge_ts: "2024-01-01T00:00:00Z",
          hostname: "example.com",
        }),
      });

      const result = await verifyRecaptchaToken("valid-token", "contact_form");

      expect(result.success).toBe(false);
      expect(result.action).toBe("wrong_action");
      expect(result.error).toBe("Action mismatch");
    });

    it("should handle missing secret key", async () => {
      delete process.env.RECAPTCHA_SECRET_KEY;

      const result = await verifyRecaptchaToken("token", "contact_form");

      expect(result.success).toBe(false);
      expect(result.error).toBe("reCAPTCHA not configured");
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should handle missing token", async () => {
      const result = await verifyRecaptchaToken("", "contact_form");

      expect(result.success).toBe(false);
      expect(result.error).toBe("No token provided");
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should handle network errors", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      const result = await verifyRecaptchaToken("token", "contact_form");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network error");
    });

    it("should handle API request failure", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await verifyRecaptchaToken("token", "contact_form");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Verification request failed");
    });

    it("should send correct request to Google API", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          score: 0.7,
          action: "contact_form",
          challenge_ts: "2024-01-01T00:00:00Z",
          hostname: "example.com",
        }),
      });

      await verifyRecaptchaToken("test-token", "contact_form");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://www.google.com/recaptcha/api/siteverify",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
      );

      const callArgs = (global.fetch as any).mock.calls[0];
      const body = callArgs[1].body;
      expect(body.toString()).toContain("secret=test-secret-key");
      expect(body.toString()).toContain("response=test-token");
    });
  });

  describe("isScoreAcceptable", () => {
    it("should accept scores above default threshold (0.5)", () => {
      expect(isScoreAcceptable(0.6)).toBe(true);
      expect(isScoreAcceptable(0.9)).toBe(true);
      expect(isScoreAcceptable(1.0)).toBe(true);
    });

    it("should reject scores below default threshold (0.5)", () => {
      expect(isScoreAcceptable(0.4)).toBe(false);
      expect(isScoreAcceptable(0.1)).toBe(false);
      expect(isScoreAcceptable(0.0)).toBe(false);
    });

    it("should accept score exactly at threshold", () => {
      expect(isScoreAcceptable(0.5)).toBe(true);
    });

    it("should respect custom threshold", () => {
      expect(isScoreAcceptable(0.6, 0.7)).toBe(false);
      expect(isScoreAcceptable(0.8, 0.7)).toBe(true);
      expect(isScoreAcceptable(0.3, 0.3)).toBe(true);
    });
  });
});
