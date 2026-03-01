#!/bin/bash
# GA4 Verification Script for foreclosurehub.enteractdfw.com

echo "=========================================="
echo "GA4 Verification Script"
echo "=========================================="

URL="https://foreclosurehub.enteractdfw.com"
GA4_ID="G-513232595"

echo ""
echo "1. Checking if GA4 script is present in HTML..."
RESULT=$(curl -s "$URL" | grep -o "$GA4_ID" | head -1)

if [ "$RESULT" = "$GA4_ID" ]; then
    echo "   ✅ SUCCESS: GA4 tracking code ($GA4_ID) found!"
else
    echo "   ❌ FAILED: GA4 tracking code ($GA4_ID) NOT found"
    echo "   → The site needs to be redeployed"
fi

echo ""
echo "2. Checking gtag.js script tag..."
GTAG_SCRIPT=$(curl -s "$URL" | grep -o "googletagmanager.com/gtag/js" | head -1)

if [ -n "$GTAG_SCRIPT" ]; then
    echo "   ✅ SUCCESS: gtag.js script tag found!"
else
    echo "   ❌ FAILED: gtag.js script tag NOT found"
fi

echo ""
echo "3. Current deployment check complete."
echo ""
echo "Next steps if verification failed:"
echo "   1. Deploy the site via Cloudflare Dashboard"
echo "   2. Or run: npx wrangler pages deploy dist --project-name=enteractdfw-foreclosure-hub"
echo "   3. Wait 1-2 minutes for propagation"
echo "   4. Re-run this script"
echo ""
