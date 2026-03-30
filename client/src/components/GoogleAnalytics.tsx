/**
 * Google Analytics 4 Component
 * 
 * This component ensures GA4 tracking code is loaded even if the HTML template
 * doesn't include it (e.g., if deployed from wrong folder).
 * 
 * GA4 Property ID: G-513232595
 */
import { useEffect } from 'react';

const GA4_MEASUREMENT_ID = 'G-513232595';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function GoogleAnalytics() {
  useEffect(() => {
    // Check if gtag is already loaded (from HTML template)
    if (typeof window.gtag === 'function') {
      console.log('[GA4] Already initialized from HTML template');
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    
    script.onload = () => {
      // Initialize GA4 after script loads
      gtag('js', new Date());
      gtag('config', GA4_MEASUREMENT_ID);
      console.log('[GA4] Initialized via React component');
    };

    // Insert script at the beginning of head
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup is not typically needed for analytics
    };
  }, []);

  return null; // This component doesn't render anything
}

export default GoogleAnalytics;
