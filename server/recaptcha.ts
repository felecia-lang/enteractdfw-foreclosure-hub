/**
 * Google reCAPTCHA v3 Verification
 * 
 * Verifies reCAPTCHA tokens on the server side and returns a score (0.0 - 1.0)
 * - 1.0 is very likely a good interaction
 * - 0.0 is very likely a bot
 * 
 * Recommended threshold: 0.5
 */

interface RecaptchaVerifyResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export interface RecaptchaVerificationResult {
  success: boolean;
  score: number;
  action?: string;
  error?: string;
}

/**
 * Verify a reCAPTCHA token with Google's API
 * @param token - The reCAPTCHA token from the frontend
 * @param expectedAction - The expected action name (e.g., 'contact_form')
 * @returns Verification result with success status and score
 */
export async function verifyRecaptchaToken(
  token: string,
  expectedAction: string = 'contact_form'
): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('[reCAPTCHA] Secret key not configured');
    return {
      success: false,
      score: 0,
      error: 'reCAPTCHA not configured',
    };
  }

  if (!token) {
    return {
      success: false,
      score: 0,
      error: 'No token provided',
    };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    if (!response.ok) {
      console.error('[reCAPTCHA] Verification request failed:', response.status);
      return {
        success: false,
        score: 0,
        error: 'Verification request failed',
      };
    }

    const data: RecaptchaVerifyResponse = await response.json();

    if (!data.success) {
      console.warn('[reCAPTCHA] Verification failed:', data['error-codes']);
      return {
        success: false,
        score: 0,
        error: data['error-codes']?.join(', ') || 'Verification failed',
      };
    }

    // Check if action matches
    if (data.action !== expectedAction) {
      console.warn('[reCAPTCHA] Action mismatch:', data.action, 'expected:', expectedAction);
      return {
        success: false,
        score: data.score,
        action: data.action,
        error: 'Action mismatch',
      };
    }

    console.log(`[reCAPTCHA] Verification successful - Score: ${data.score}, Action: ${data.action}`);

    return {
      success: true,
      score: data.score,
      action: data.action,
    };
  } catch (error) {
    console.error('[reCAPTCHA] Verification error:', error);
    return {
      success: false,
      score: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if a reCAPTCHA score meets the minimum threshold
 * @param score - The score from reCAPTCHA (0.0 - 1.0)
 * @param threshold - Minimum acceptable score (default: 0.5)
 * @returns true if score meets threshold
 */
export function isScoreAcceptable(score: number, threshold: number = 0.5): boolean {
  return score >= threshold;
}
