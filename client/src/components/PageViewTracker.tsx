import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { extractUTMParams, getFirstTouchUTM, storeFirstTouchUTM } from "@/lib/utm";

/**
 * PageViewTracker - Automatically tracks page views with UTM attribution
 * 
 * Features:
 * - Tracks unique visitors using session-based deduplication
 * - Captures page path, title, referrer, and user info
 * - Extracts and persists UTM parameters for marketing attribution
 * - Uses first-touch attribution model (credits first UTM in session)
 * - Runs on every page navigation
 * - Silent tracking (no UI impact)
 */
export function PageViewTracker() {
  const [location] = useLocation();
  const trackPageView = trpc.funnel.trackPageView.useMutation();

  useEffect(() => {
    // Generate or retrieve session ID from sessionStorage
    let sessionId = sessionStorage.getItem("visitor_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("visitor_session_id", sessionId);
    }

    // Extract UTM parameters from current URL
    const currentUTM = extractUTMParams();
    
    // Store first-touch UTM if this is the first page with UTM params
    storeFirstTouchUTM(currentUTM);
    
    // Use first-touch UTM for attribution (or current if no first-touch stored)
    const attributionUTM = getFirstTouchUTM();
    const utm = Object.values(attributionUTM).some(v => v) ? attributionUTM : currentUTM;

    // Track page view with UTM attribution
    trackPageView.mutate({
      sessionId,
      pagePath: location,
      pageTitle: document.title,
      referrer: document.referrer || undefined,
      ...utm,
    });
  }, [location]); // Re-track on every navigation

  return null; // No UI
}
