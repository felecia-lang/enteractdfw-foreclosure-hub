import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { getUTMParams } from "@/lib/utm";

/**
 * ChatEngagementTracker - Monitors GHL chat widget interactions
 * 
 * Tracks three event types:
 * 1. chat_opened - When user opens the chat widget
 * 2. message_sent - When user sends a message
 * 3. conversation_completed - When chat conversation ends
 * 
 * Uses MutationObserver to detect DOM changes since GHL doesn't expose a JS API
 */
export function ChatEngagementTracker() {
  const [location] = useLocation();
  const trackMutation = trpc.chat.trackEngagement.useMutation();
  const trackedEvents = useRef(new Set<string>());
  const chatOpenedTracked = useRef(false);

  useEffect(() => {
    // Reset chat_opened tracking when navigating to new page
    chatOpenedTracked.current = false;
  }, [location]);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("sessionId") || crypto.randomUUID();
    if (!sessionStorage.getItem("sessionId")) {
      sessionStorage.setItem("sessionId", sessionId);
    }

    const utmParams = getUTMParams();

    const trackEvent = (eventType: "chat_opened" | "message_sent" | "conversation_completed") => {
      const eventKey = `${eventType}-${Date.now()}`;
      
      // Prevent duplicate tracking within 1 second
      if (trackedEvents.current.has(eventType) && eventType === "chat_opened") {
        return;
      }

      trackedEvents.current.add(eventType);
      if (eventType === "chat_opened") {
        chatOpenedTracked.current = true;
      }

      // Clear tracked events after 1 second to allow re-tracking
      setTimeout(() => {
        if (eventType !== "chat_opened") {
          trackedEvents.current.delete(eventType);
        }
      }, 1000);

      trackMutation.mutate({
        sessionId,
        eventType,
        pagePath: window.location.pathname,
        pageTitle: document.title,
        ...utmParams,
      });
    };

    // Monitor for GHL chat widget DOM changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Check for chat widget opening (iframe or container becomes visible)
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          const target = mutation.target as HTMLElement;
          
          // GHL chat widget typically uses iframe with specific data attributes
          if (
            (target.tagName === "IFRAME" || target.closest("iframe")) &&
            target.style.display !== "none" &&
            target.style.visibility !== "hidden" &&
            !chatOpenedTracked.current
          ) {
            trackEvent("chat_opened");
          }
        }

        // Check for new nodes (chat messages)
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              
              // Look for message indicators in GHL chat
              if (
                element.querySelector('[class*="message"]') ||
                element.querySelector('[class*="chat"]') ||
                element.classList.toString().includes("message")
              ) {
                // Check if it's a user message (not bot/agent)
                const isUserMessage = 
                  element.textContent && 
                  element.textContent.trim().length > 0 &&
                  !element.classList.toString().includes("bot") &&
                  !element.classList.toString().includes("agent");
                
                if (isUserMessage) {
                  trackEvent("message_sent");
                }
              }
            }
          });
        }
      }
    });

    // Start observing the entire document for GHL chat widget changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Also listen for click events on chat widget elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if click is on chat widget button/icon
      if (
        target.closest('[data-widget-id]') ||
        target.closest('iframe[src*="leadconnectorhq"]') ||
        target.closest('[class*="chat"]')
      ) {
        if (!chatOpenedTracked.current) {
          trackEvent("chat_opened");
        }
      }
    };

    document.addEventListener("click", handleClick, true);

    // Track conversation completion when user closes chat after sending messages
    const handleVisibilityChange = () => {
      if (document.hidden && trackedEvents.current.has("message_sent")) {
        trackEvent("conversation_completed");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [location, trackMutation]);

  return null; // This component doesn't render anything
}
