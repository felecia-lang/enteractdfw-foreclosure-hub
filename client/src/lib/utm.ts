/**
 * UTM Parameters interface
 */
export interface UTMParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

/**
 * Extract UTM parameters from URL query string
 */
export function extractUTMParams(): UTMParams {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
  };
}

/**
 * Get first-touch UTM parameters from sessionStorage
 * First-touch attribution: credits the first marketing touchpoint in the session
 */
export function getFirstTouchUTM(): UTMParams {
  const stored = sessionStorage.getItem("first_touch_utm");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Store first-touch UTM parameters if not already set
 */
export function storeFirstTouchUTM(utm: UTMParams): void {
  const existing = sessionStorage.getItem("first_touch_utm");
  if (!existing && Object.values(utm).some(v => v)) {
    sessionStorage.setItem("first_touch_utm", JSON.stringify(utm));
  }
}

/**
 * Get UTM parameters for attribution (first-touch or current)
 * Returns first-touch UTM if available, otherwise current URL UTM
 */
export function getAttributionUTM(): UTMParams {
  const firstTouch = getFirstTouchUTM();
  if (Object.values(firstTouch).some(v => v)) {
    return firstTouch;
  }
  return extractUTMParams();
}

/**
 * Alias for getAttributionUTM for convenience
 */
export const getUTMParams = getAttributionUTM;
