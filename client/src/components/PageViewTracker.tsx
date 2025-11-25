import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

/**
 * PageViewTracker - Automatically tracks page views for funnel analysis
 * 
 * Features:
 * - Tracks unique visitors using session-based deduplication
 * - Captures page path, title, referrer, and user info
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

    // Track page view
    trackPageView.mutate({
      sessionId,
      pagePath: location,
      pageTitle: document.title,
      referrer: document.referrer || undefined,
    });
  }, [location]); // Re-track on every navigation

  return null; // No UI
}
