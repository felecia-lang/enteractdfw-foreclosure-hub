import { Router } from "express";
import { getShortenedLink, incrementLinkClicks, trackLinkClick } from "../db";

const router = Router();

/**
 * Redirect handler for shortened links
 * Route: /l/:shortCode
 * 
 * This handler:
 * 1. Looks up the shortened link by code or custom alias
 * 2. Checks if the link has expired
 * 3. Increments the click counter
 * 4. Tracks detailed click metadata
 * 5. Preserves any UTM parameters from the request
 * 6. Redirects to the original URL
 */
router.get("/l/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  try {
    // Look up the shortened link
    const link = await getShortenedLink(shortCode);

    if (!link) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Not Found - EnterActDFW</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
              max-width: 500px;
            }
            h1 { font-size: 3rem; margin: 0 0 1rem 0; }
            p { font-size: 1.2rem; margin: 0 0 2rem 0; opacity: 0.9; }
            a {
              display: inline-block;
              padding: 0.75rem 2rem;
              background: white;
              color: #667eea;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              transition: transform 0.2s;
            }
            a:hover { transform: translateY(-2px); }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404</h1>
            <p>This shortened link doesn't exist or has been removed.</p>
            <a href="https://enteractdfw.com">Visit EnterActDFW</a>
          </div>
        </body>
        </html>
      `);
    }

    // Check if link has expired
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Expired - EnterActDFW</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
              max-width: 500px;
            }
            h1 { font-size: 3rem; margin: 0 0 1rem 0; }
            p { font-size: 1.2rem; margin: 0 0 2rem 0; opacity: 0.9; }
            a {
              display: inline-block;
              padding: 0.75rem 2rem;
              background: white;
              color: #f5576c;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              transition: transform 0.2s;
            }
            a:hover { transform: translateY(-2px); }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Link Expired</h1>
            <p>This shortened link has expired and is no longer available.</p>
            <a href="https://enteractdfw.com">Visit EnterActDFW</a>
          </div>
        </body>
        </html>
      `);
    }

    // Build the redirect URL with UTM parameters
    let redirectUrl = link.originalUrl;
    const url = new URL(redirectUrl);

    // Add UTM parameters from the link configuration (if any)
    if (link.utmSource) url.searchParams.set("utm_source", link.utmSource);
    if (link.utmMedium) url.searchParams.set("utm_medium", link.utmMedium);
    if (link.utmCampaign) url.searchParams.set("utm_campaign", link.utmCampaign);
    if (link.utmTerm) url.searchParams.set("utm_term", link.utmTerm);
    if (link.utmContent) url.searchParams.set("utm_content", link.utmContent);

    // Preserve any UTM parameters from the incoming request
    // (Request UTMs override link UTMs)
    const requestUtmParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];
    requestUtmParams.forEach((param) => {
      const value = req.query[param];
      if (value && typeof value === "string") {
        url.searchParams.set(param, value);
      }
    });

    redirectUrl = url.toString();

    // Track the click asynchronously (don't wait for it)
    const trackingData = {
      shortCode: link.shortCode,
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
      referer: req.get("referer"),
      sessionId: undefined, // Session tracking can be added if needed
    };

    // Increment click counter and track detailed click
    Promise.all([
      incrementLinkClicks(link.shortCode),
      trackLinkClick(trackingData),
    ]).catch((error) => {
      console.error("[ShortLinks] Failed to track click:", error);
      // Don't fail the redirect if tracking fails
    });

    // Redirect to the original URL
    res.redirect(302, redirectUrl);
  } catch (error) {
    console.error("[ShortLinks] Error processing redirect:", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error - EnterActDFW</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            color: #333;
          }
          .container {
            text-align: center;
            padding: 2rem;
            max-width: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          h1 { font-size: 2.5rem; margin: 0 0 1rem 0; color: #fa709a; }
          p { font-size: 1.1rem; margin: 0 0 2rem 0; color: #666; }
          a {
            display: inline-block;
            padding: 0.75rem 2rem;
            background: #fa709a;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: transform 0.2s;
          }
          a:hover { transform: translateY(-2px); }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Oops!</h1>
          <p>Something went wrong processing this link. Please try again later.</p>
          <a href="https://enteractdfw.com">Visit EnterActDFW</a>
        </div>
      </body>
      </html>
    `);
  }
});

export default router;
