# Deployment Guide for Foreclosure Hub

## Current Issue

The GA4 tracking code (Property ID: G-513232595) has been merged to the main branch but is NOT appearing on the live site. This is because the deployment hasn't been triggered.

## GA4 Implementation Status

✅ GA4 tracking script added to `client/index.html`
✅ Analytics utility created at `client/src/lib/analytics.ts`
✅ Event tracking integrated in:
   - `Home.tsx` - `lead_capture_step1` event
   - `ThankYou.tsx` - `lead_capture_step2` event
   - `StickyCTA.tsx` - `sticky_cta_click` event
✅ Code merged to main branch (commit f9cef15)
✅ Local build verified with GA4 code included

## Deployment Required

The live site at `foreclosurehub.enteractdfw.com` needs a new deployment to include the GA4 tracking.

### Option 1: Cloudflare Dashboard (Recommended)

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Pages"
3. Find the `enteractdfw-foreclosure-hub` project
4. Click "Create deployment" or trigger a rebuild from the latest main branch

### Option 2: Manual Wrangler Deploy

```bash
# Install wrangler globally if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
pnpm run build

# Deploy
wrangler deploy
```

### Option 3: GitHub Actions (Setup Required)

To enable automatic deployments, add these secrets to the GitHub repository:

1. `CLOUDFLARE_API_TOKEN` - Create at Cloudflare Dashboard > API Tokens
2. `CLOUDFLARE_ACCOUNT_ID` - Found in Cloudflare Dashboard URL
3. `VITE_APP_LOGO` - Logo URL
4. `VITE_APP_TITLE` - Site title
5. `VITE_RECAPTCHA_SITE_KEY` - reCAPTCHA key
6. `VITE_ANALYTICS_ENDPOINT` - Analytics endpoint
7. `VITE_ANALYTICS_WEBSITE_ID` - Analytics website ID

Then add a workflow file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    name: Deploy to Cloudflare Pages
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
        env:
          VITE_APP_LOGO: ${{ secrets.VITE_APP_LOGO }}
          VITE_APP_TITLE: ${{ secrets.VITE_APP_TITLE }}
          VITE_RECAPTCHA_SITE_KEY: ${{ secrets.VITE_RECAPTCHA_SITE_KEY }}
          VITE_ANALYTICS_ENDPOINT: ${{ secrets.VITE_ANALYTICS_ENDPOINT }}
          VITE_ANALYTICS_WEBSITE_ID: ${{ secrets.VITE_ANALYTICS_WEBSITE_ID }}
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: enteractdfw-foreclosure-hub
          directory: dist/public
```

## Verifying GA4 After Deployment

After deployment, verify GA4 is working:

1. Visit https://foreclosurehub.enteractdfw.com
2. Open browser DevTools (F12)
3. Go to Network tab
4. Filter by "google" 
5. Look for requests to `googletagmanager.com`

Or check in browser console:
```javascript
typeof gtag !== 'undefined' && typeof window.dataLayer !== 'undefined'
// Should return true
```

## GA4 Events to Test

After deployment, test these events:

1. **lead_capture_step1**: Submit email on homepage
2. **lead_capture_step2**: Complete optional form on Thank You page
3. **sticky_cta_click**: Click the mobile sticky CTA button (on mobile viewport)

Check events in GA4 Realtime reports at:
https://analytics.google.com/analytics/web/#/realtime/
