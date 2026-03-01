/**
 * Google Analytics 4 Event Tracking Utilities
 * 
 * This module provides functions to track custom events in GA4
 * for conversion monitoring and funnel analysis.
 * 
 * GA4 Property ID: 513232595
 */

// Declare gtag on window for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Generic GA4 event tracking function
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log(`[GA4] Event tracked: ${eventName}`, eventParams);
  } else {
    console.warn('[GA4] gtag not available, event not tracked:', eventName);
  }
}

/**
 * Track Step 1 email submission (lead capture)
 * Event: lead_capture_step1
 */
export function trackLeadCaptureStep1(email?: string): void {
  trackEvent('lead_capture_step1', {
    event_category: 'lead_generation',
    event_label: 'email_submission',
    // Don't send PII, just track the event occurred
    form_type: 'hero_email_form',
    page_location: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track Step 2 form completion (additional info)
 * Event: lead_capture_step2
 */
export function trackLeadCaptureStep2(serviceInterest?: string): void {
  trackEvent('lead_capture_step2', {
    event_category: 'lead_generation',
    event_label: 'form_completion',
    service_interest: serviceInterest || 'not_specified',
    form_type: 'thank_you_form',
    page_location: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track Sticky CTA button clicks
 * Event: sticky_cta_click
 */
export function trackStickyCTAClick(): void {
  trackEvent('sticky_cta_click', {
    event_category: 'engagement',
    event_label: 'mobile_sticky_cta',
    cta_text: 'Schedule Free Consultation',
    page_location: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track page views (optional, GA4 does this automatically but useful for SPAs)
 */
export function trackPageView(pagePath?: string, pageTitle?: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-513232595', {
      page_path: pagePath || window.location.pathname,
      page_title: pageTitle || document.title,
    });
  }
}
