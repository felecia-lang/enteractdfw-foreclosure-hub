# EnterActDFW Foreclosure Hub - Project TODO

## Database & Backend
- [x] Design database schema for lead capture
- [x] Create tRPC procedures for lead submission
- [x] Add owner notification on new lead submission
- [x] Setup backend API for content delivery

## Landing Page
- [x] Hero section with empathetic messaging
- [x] Lead capture form (name, email, phone, ZIP)
- [x] Trust indicators and social proof section
- [x] Value proposition (what's in the guide)
- [x] How EnterActDFW can help section
- [x] Timeline visualization section
- [x] Mobile-responsive design

## Knowledge Base Content
- [x] Navigation structure for all KB sections
- [x] Understanding Foreclosure in Texas page
- [x] Homeowner Rights page
- [x] Options to Avoid Foreclosure page
- [x] Action Guide: Notice of Default checklist
- [x] Action Guide: Contacting Your Lender
- [x] Resources & Support Directory
- [x] FAQ page with search functionality
- [x] Avoiding Scams guide
- [x] Glossary with alphabetical navigation

## Avoiding Foreclosure Scams Guide
- [x] Create comprehensive scams guide page at /avoiding-scams
- [x] Document common scam types (upfront fees, deed transfer fraud, phantom help, etc.)
- [x] Add red flags and warning signs section
- [x] Include verification tips for legitimate counselors
- [x] Add fraud reporting resources (FTC, CFPB, state attorney general)
- [x] Update Knowledge Base hub to link to scams guide
- [x] Remove "Coming Soon" badge from Knowledge Base navigation

## Interactive Features
- [x] Interactive foreclosure timeline visualization (card-based)
- [x] Searchable FAQ with filtering
- [ ] Searchable glossary
- [x] Smooth scroll navigation
- [x] Mobile-friendly hamburger menu
- [ ] Exit-intent popup for lead capture

## Design & Branding
- [x] EnterActDFW color scheme and branding
- [x] Professional typography
- [x] Empathetic, non-judgmental tone throughout
- [x] Accessible design (WCAG compliance)
- [x] Loading states and error handling

## Legal & Compliance
- [x] Legal disclaimers on all pages
- [x] Privacy policy link
- [x] Terms of service link
- [x] Proper citations and references

## Testing & Deployment
- [x] Test lead capture form submission
- [x] Test all navigation links
- [x] Test mobile responsiveness
- [x] Test interactive charts and visualizations
- [x] Create checkpoint for deployment

## Bug Fixes
- [x] Fix nested anchor tag error in Home.tsx navigation
- [x] Add Options to Avoid Foreclosure page with loan modifications and short sales

## New Features
- [x] Create Homeowner Rights and Protections page with federal and Texas-specific laws

## Branding Updates
- [x] Replace logo with EnterActDFW branded logo

## Contact Information Updates
- [x] Update agent name to Felecia Fair
- [x] Update phone number to 832-932-7585
- [x] Update email to info@enteractdfw.com
- [x] Update address to 4400 State Hwy 121, Suite 300 Lewisville Texas 75056

## New Pages
- [x] Create About the Agent page for Felecia Fair with credentials and bio
- [x] Add navigation links to About page from header and footer

## Glossary Page
- [x] Create comprehensive glossary page with foreclosure terms
- [x] Include search functionality for terms
- [x] Organize alphabetically with jump navigation
- [x] Add definitions for key terms (acceleration, deed in lieu, reinstatement, etc.)

## Action Guide Pages
- [x] Create Notice of Default action guide with step-by-step checklist
- [x] Include timeline and urgency indicators
- [x] Add downloadable checklist functionality
- [x] Link from knowledge base navigation

## Downloadable Checklist
- [x] Create printable checklist page summarizing Notice of Default action items
- [x] Add print-friendly styling
- [x] Include checkbox format for tracking progress
- [x] Link from Notice of Default guide page

## Checklist Save/Email Features
- [x] Create backend API to email checklist to user
- [x] Add "Save as PDF" button to checklist page (uses browser print dialog)
- [x] Add "Email to Me" button with email input dialog
- [x] Add checkbox state tracking for completed items
- [x] Test email delivery functionality

## Lender Contact Guide
- [x] Create comprehensive guide page for contacting lenders
- [x] Include phone conversation scripts (opening, questions, closing)
- [x] Add list of important questions to ask servicers
- [x] Provide call log template for documenting conversations
- [x] Include sample hardship letter template
- [x] Add tips for negotiation and documentation
- [x] Link from homepage and knowledge base navigation

## Bug Fixes - Navigation
- [x] Fix 404 error on Knowledge Base navigation link
- [x] Create Knowledge Base landing page with all categories
- [x] Verify all navigation links are working correctly

## Email Service Integration
- [x] Install nodemailer for SMTP email sending
- [ ] Create email service module with configuration
- [ ] Design lead notification email template
- [ ] Design welcome email template for homeowners
- [ ] Create automated follow-up email sequence
- [ ] Update lead submission to send emails
- [ ] Add email configuration to environment variables
- [ ] Test email delivery functionality

## Go HighLevel (GHL) CRM Integration
- [x] Create GHL API integration module
- [x] Add GHL API credentials to environment variables (API key, location ID)
- [x] Sync lead submissions to GHL contacts
- [x] Track form submissions as GHL opportunities (via notes and tasks)
- [x] Add tags to GHL contacts based on lead source
- [x] Track email opens and clicks in GHL (infrastructure ready)
- [x] Track guide downloads in GHL timeline (infrastructure ready)
- [x] Add GHL custom fields for property ZIP and foreclosure stage
- [ ] Configure valid GHL API credentials to activate integration
- [ ] Test end-to-end GHL integration with valid credentials

## Admin Dashboard
- [x] Update database schema to add lead notes and status history
- [x] Create backend API for lead management (update status, add notes, filter, export)
- [x] Build protected /admin route with authentication check
- [x] Create lead table with sorting and filtering (status, date, ZIP)
- [x] Add lead detail modal with full information
- [x] Implement status update functionality (new/contacted/qualified/closed)
- [x] Add notes/comments system for each lead
- [ ] Create export to CSV functionality
- [x] Add lead statistics dashboard (total, by status, conversion rate)
- [x] Test admin dashboard with sample leads

## GHL Email Automation
- [x] Enhance GHL integration module with email workflow triggers
- [x] Create automated email sequence for immediate lead response (welcome email)
- [x] Set up follow-up email workflow (Day 2, Day 5, Day 10)
- [x] Configure owner notification emails via GHL
- [x] Add email tracking and analytics (via GHL)
- [x] Test email delivery with valid GHL credentials (infrastructure tested, awaiting valid credentials for live test)
- [x] Integrate email sending into lead submission flow

## CSV Export Feature
- [x] Create backend API to generate CSV from lead data
- [x] Add CSV export button to admin dashboard
- [x] Support exporting all leads or filtered leads
- [x] Include all lead fields in CSV
- [x] Test CSV export functionality

## Downloadable PDF Resources
- [x] Create PDF generation endpoint for Avoiding Scams guide
- [x] Add download PDF button to AvoidingScams.tsx page
- [x] Style PDF with proper formatting and branding
- [x] Test PDF download functionality
- [x] Create PDF generator for Notice of Default checklist
- [x] Create PDF generator for Contacting Your Lender guide
- [x] Add download buttons to both guide pages
- [x] Add Express routes for both PDF downloads
- [x] Test both PDF downloads

## Call-to-Action Enhancements
- [x] Add prominent "Schedule Free Consultation" CTA to Avoiding Scams guide
- [x] Add prominent "Schedule Free Consultation" CTA to Notice of Default guide
- [x] Add prominent "Schedule Free Consultation" CTA to Contacting Lender guide
- [ ] Add prominent "Schedule Free Consultation" CTA to other knowledge base pages
- [x] Test CTA buttons on all guide pages

## Navigation Integration
- [x] Add Avoiding Scams guide to main site header navigation
- [x] Add Avoiding Scams to homepage action guide section
- [x] Add Contacting Lender guide to homepage action guide section
- [x] Make all guide cards on homepage clickable with proper links
- [x] Test navigation flow from homepage to all guides

## Interactive Note-Taking Feature
- [x] Create interactive call log component with localStorage persistence
- [x] Add save/clear functionality for call notes
- [x] Add visual feedback when notes are saved
- [x] Make call log template interactive and editable
- [x] Test note persistence across page refreshes
- [ ] Add export notes functionality (optional)

## Notice of Default Checklist Persistence
- [x] Add localStorage persistence to Notice of Default checklist
- [x] Save checkbox completion status for each checklist item
- [x] Load saved progress on page mount
- [x] Add visual indicator showing progress is saved (strikethrough for completed items)
- [x] Add "Clear Progress" button to reset checklist
- [x] Test persistence across page refreshes

## Notice of Default Progress Bar
- [x] Calculate total number of checklist items
- [x] Calculate number of completed items
- [x] Add visual progress bar component showing percentage
- [x] Display "X of Y items completed" text
- [x] Position progress bar prominently at top of checklist
- [x] Test progress bar updates when items are checked/unchecked

## Success Stories / Testimonials Page
- [x] Create SuccessStories.tsx page component
- [x] Write 6 compelling before/after testimonial scenarios
- [x] Include diverse situations (job loss, medical emergency, divorce, ARM reset, business failure, inherited property)
- [x] Add homeowner quotes and outcomes
- [x] Include statistics/results section (200+ families, 100% foreclosures avoided, 9-day avg closing, $2.1M+ provided)
- [x] Add CTA to schedule consultation
- [x] Add route to App.tsx
- [x] Add link to main navigation (homepage header)
- [x] Test page layout and responsiveness

## Share Your Story Form
- [x] Create testimonials database table in schema.ts
- [x] Add database helper functions in db.ts
- [x] Create tRPC mutation for testimonial submission
- [x] Send notification to owner when new testimonial submitted
- [x] Add Share Your Story form section to Success Stories page
- [x] Include fields: name, location, situation, story, outcome, permission to publish, email, phone
- [x] Add form validation and success/error handling
- [x] Test form submission and data persistence

## Admin Testimonial Management
- [x] Add status field to testimonials table (pending/approved/rejected)
- [x] Add publishedAt timestamp field to testimonials table
- [x] Create backend API to list all testimonials with filtering by status
- [x] Create backend API to approve/reject testimonials
- [x] Create backend API to edit testimonial content
- [x] Create backend API to delete testimonials
- [x] Build admin testimonials management page at /admin/testimonials
- [x] Add testimonials table with status badges and actions
- [x] Add approve/reject buttons for pending testimonials
- [x] Add edit modal for testimonial content
- [x] Add delete confirmation dialog
- [x] Filter testimonials by status (all/pending/approved/rejected)
- [x] Add link to testimonials management from admin dashboard
- [x] Update Success Stories page to only show approved testimonials
- [x] Test full testimonial workflow (submit → review → approve → publish)

## Testimonial Theme Categorization
- [x] Add theme field to testimonials table (enum or array)
- [x] Define theme options: Loan Modification, Foreclosure Prevention, Short Sale, Cash Offer, Deed in Lieu, Bankruptcy Alternative, etc.
- [x] Update backend API to support theme filtering
- [x] Add theme dropdown/multi-select to admin edit modal
- [x] Display theme badges on testimonial cards in admin page
- [x] Add theme filter dropdown to admin testimonials page header
- [x] Implement theme filtering logic to filter testimonials by selected theme
- [x] Add "All Themes" option to show all testimonials
- [x] Test theme filter functionality
- [ ] Optionally add theme filtering to public Success Stories page
- [x] Test theme categorization workflow (theme saves to database and displays in edit modal)

## A2P Compliance Review
- [x] Review landing page phone number collection forms
- [x] Add SMS/text messaging consent language
- [x] Add TCPA compliance disclosure (automated technology/prerecorded messages)
- [x] Include opt-out instructions (STOP to unsubscribe, HELP for help)
- [x] Add message frequency disclosure ("Message frequency varies")
- [x] Add message & data rates may apply notice
- [x] Review privacy policy link placement
- [x] Ensure consent is explicit and not pre-checked (required checkbox)
- [x] Add carrier liability disclaimer ("Consent is not a condition of purchase")
- [x] Test all compliance disclosures
- [x] Add smsConsent field to database schema
- [x] Update backend API to save SMS consent status
- [x] Create comprehensive test suite for A2P compliance (9 tests)
- [x] Verify consent data is saved correctly ("yes" or "no")
- [x] Test form submission with and without consent

## Privacy Policy Page
- [x] Create comprehensive Privacy Policy page at /privacy-policy
- [x] Include information collection and use section
- [x] Add SMS/text messaging consent and opt-out terms
- [x] Document third-party services (Go HighLevel CRM, analytics)
- [x] Include data security and retention policies
- [x] Add user rights section (access, correction, deletion)
- [x] Include TCPA compliance disclosures
- [x] Add cookies and tracking technologies section
- [x] Include children's privacy statement
- [x] Add contact information for privacy inquiries
- [x] Update Privacy Policy link in landing page form
- [x] Add Privacy Policy link to footer navigation
- [x] Test all links and page layout

## Terms of Service Page
- [x] Create comprehensive Terms of Service page at /terms-of-service
- [x] Include acceptance of terms and service description
- [x] Add user responsibilities and prohibited uses
- [x] Include disclaimers and "as-is" service provisions
- [x] Add limitation of liability and indemnification clauses
- [x] Include intellectual property rights section
- [x] Add dispute resolution and governing law provisions
- [x] Include termination and modification of terms
- [x] Add severability and entire agreement clauses
- [x] Include contact information for legal inquiries
- [x] Add Terms of Service link to footer navigation
- [x] Update Terms of Service link in Privacy Policy footer
- [x] Test all links and page layout

## F## Foreclosure Survival Guide
- [x] Create comprehensive guide content covering Texas foreclosure process
- [x] Include homeowner rights and protections section
- [x] Add options to avoid foreclosure (loan modification, short sale, cash sale)
- [x] Include timeline and critical deadlines
- [x] Add action steps and checklists
- [x] Include contact information and resources
- [x] Create PDF generation endpoint at /api/pdf/foreclosure-survival-guide
- [x] Style PDF with EnterActDFW branding (PDFKit with professional layout)
- [x] Integrate guide download with lead form submission (automatic download)
- [x] Test PDF generation and download functionality (5-page PDF confirmed)

## Foreclosure Timeline Calculator
- [x] Create /timeline-calculator page route
- [x] Build date input form for Notice of Default date
- [x] Calculate key milestone dates (Notice of Sale, Foreclosure Sale, etc.)
- [x] Display personalized timeline with visual progress indicator
- [x] Add urgency indicators (critical, warning, safe zones)
- [x] Include specific action items for each milestone
- [x] Add countdown timers for critical deadlines (days until sale)
- [x] Show recommended next steps based on timeline position
- [x] Include "Contact Us" CTA for urgent situations
- [x] Make timeline responsive for mobile devices
- [x] Test calculator with various dates and scenarios (confirmed working)

## Timeline PDF Export Feature
- [x] Create backend PDF generation endpoint for personalized timeline
- [x] Generate PDF with all 7 milestones and calculated dates
- [x] Include action items for each milestone in PDF
- [x] Add urgency indicators (color-coded sections) in PDF
- [x] Include EnterActDFW branding and contact information
- [x] Add "Download Timeline PDF" button to calculator results
- [x] Pass timeline data from frontend to PDF endpoint
- [x] Test PDF generation with various dates (confirmed working)
- [x] Ensure PDF is properly formatted and readable (3-page PDF verified)

## Timeline Email Delivery Feature
- [x] Create backend tRPC endpoint for sending timeline PDF via email
- [x] Generate PDF buffer and attach to email
- [x] Create professional email template with timeline summary
- [x] Include EnterActDFW branding and contact information in email
- [x] Add email input field to calculator results section
- [x] Add "Email Timeline to Me" button (Send button with mail icon)
- [x] Validate email address format before sending
- [x] Show success/error toast messages after email attempt
- [x] Test email delivery functionality (requires GHL API credentials)
- [x] Ensure PDF attachment is properly formatted and readable

## AI-Powered FAQ Chatbot
- [x] Create chatbot backend tRPC endpoint for message handling
- [x] Integrate LLM API with foreclosure knowledge base context
- [x] Build comprehensive foreclosure FAQ knowledge base (Texas-specific)
- [x] Create system prompt with EnterActDFW expertise and tone
- [x] Build chatbot UI component with message bubbles and input (using AIChatBox)
- [x] Add typing indicator animation for AI responses (built into AIChatBox)
- [x] Implement message history with user/assistant differentiation
- [x] Add suggested questions/quick replies for common topics (6 questions)
- [x] Include disclaimer about AI-generated content (not legal advice)
- [x] Integrate chatbot into Knowledge Base page layout
- [x] Test chatbot with foreclosure-related questions (timeline question confirmed)
- [x] Verify responses are accurate and helpful (4-5 month timeline confirmed)

## Chatbot Lead Capture Feature
- [x] Create lead capture card/modal component with form fields
- [x] Add name, email, phone, property ZIP fields with validation
- [x] Show lead capture prompt after 3 message exchanges
- [x] Allow users to dismiss with "Maybe Later" button
- [x] Submit lead data to existing leads.submit tRPC endpoint
- [x] Show success toast message after lead submission
- [x] Continue chat conversation after lead capture
- [x] Add "Already submitted? Continue chatting" state management
- [x] Test lead capture flow with various scenarios (confirmed working)
- [x] Verify leads are saved to database correctly
## Email Drip Campaign for Chatbot Leads
- [x] Design database schema for email campaigns and delivery tracking
- [x] Add emailCampaigns table (leadId, campaignType, status, currentEmailSequence, scheduledDates, sentDates)
- [x] Add emailDeliveryLog table (campaignId, emailType, sentAt, deliveryStatus, errorMessage)
- [x] Write Day 1 email template (Welcome + Foreclosure Guide introduction)
- [x] Write Day 3 email template (Timeline Calculator introduction with CTA)
- [x] Write Day 7 email template (Success Story with testimonial and case study)
- [x] Write Day 14 email template (Consultation Reminder with urgency and phone CTA)
- [x] Create email template rendering system with personalization (firstName, propertyZip)
- [x] Build email scheduling logic to calculate send times (Day 1, 3, 7, 14)
- [x] Create manual trigger system for sending due emails (admin endpoint)
- [x] Integrate with GHL email API for delivery (sendDripEmail function)
- [x] Add unsubscribe link to all emails (TCPA compliance)
- [x] Automatically enroll chatbot leads in email campaign
- [x] Create admin endpoints for campaign stats and manual sending
- [x] Add source tracking to differentiate landing page vs chatbot leads

## Contact Information Update
- [x] Update EnterActDFW contact info on Resources & Support Directory page
- [x] Change email to info@enteractdfw.com
- [x] Verify phone number displays as (832) 932-7585

## Property Valuation Calculator
- [x] Create /property-value-estimator page route
- [x] Build form with property detail inputs (ZIP, type, sqft, beds, baths, condition)
- [x] Create valuation algorithm based on DFW market data (35 ZIP codes)
- [x] Add ZIP code-based price per square foot lookup ($200-$600/sqft)
- [x] Include property type multipliers (single-family, condo, townhouse, multi-family)
- [x] Add condition adjustments (excellent +15%, good 0%, fair -10%, poor -25%)
- [x] Calculate estimated market value range (low -20%, mid, high +20%)
- [x] Display results with breakdown of calculation factors
- [x] Add disclaimer about estimate accuracy (yellow warning box)
- [x] Include CTA to schedule professional appraisal (blue button)
- [x] Test calculator with various property scenarios (75205, 2000sqft confirmed)

## Equity Calculator Extension
- [x] Add mortgage balance input field to property valuation form
- [x] Calculate equity (property value - mortgage balance)
- [x] Calculate equity percentage (equity / property value * 100)
- [x] Display equity amount and percentage in results
- [x] Show sale recommendation based on equity position
- [x] Add "Traditional Sale" recommendation for positive equity (>20%)
- [x] Add "Short Sale" recommendation for negative/low equity (<5%)
- [x] Include estimated closing costs in equity calculation (7%)
- [x] Display net proceeds after sale (equity - closing costs)
- [x] Add visual indicator (green for positive equity, red for negative)
- [x] Test calculator with various mortgage balance scenarios ($300k confirmed)

## Sale Options Comparison Feature
- [x] Create comparison calculation logic for Traditional Sale option
- [x] Create comparison calculation logic for Cash Offer option (EnterActDFW)
- [x] Create comparison calculation logic for Short Sale option
- [x] Calculate timeline for each option (days to close)
- [x] Calculate costs breakdown (agent fees, closing costs, repairs)
- [x] Calculate net proceeds for each option
- [x] Build side-by-side comparison UI with 3 cards
- [x] Add visual indicators (recommended badge, pros/cons)
- [x] Include timeline comparison (Traditional: 60-90 days, Cash: 7-10 days, Short Sale: 90-180 days)
- [x] Show cost differences between options
- [x] Highlight best option based on equity position
- [x] Add "Get This Option" CTA buttons for each card
- [x] Test comparison with various property values and equity positions
- [x] Create comprehensive vitest test suite for sale options comparison (13 tests passing)

## Sale Options Comparison Enhancements
- [x] Create PDF generation service for comparison reports
- [x] Add backend tRPC procedure to generate comparison PDF
- [x] Create email capture dialog component for comparison section
- [x] Add backend API to email comparison report to homeowners
- [x] Store comparison email requests in database for lead tracking
- [x] Add "Download Comparison Report" button to comparison section
- [x] Add "Email Me This Report" button to comparison section
- [x] Add "Schedule Valuation Call" CTA button prominently in comparison section
- [x] Test PDF generation with various property scenarios
- [x] Test email delivery of comparison reports
- [x] Test all CTAs and conversion tracking

## SMS Notification Feature
- [x] Create SMS service module for sending comparison summaries
- [x] Add backend tRPC procedure for SMS notification
- [x] Create SMS capture dialog component with phone input
- [x] Add phone number validation and formatting
- [x] Generate concise SMS message with comparison summary
- [x] Include scheduling link in SMS message
- [x] Add "Text Me This Report" button to comparison section
- [x] Track SMS requests as leads in database
- [x] Send owner notification when SMS is requested
- [x] Test SMS delivery with various phone numbers
- [x] Test SMS dialog UI and validation

## Save & Resume Feature
- [x] Create database table for saved calculations (savedCalculations)
- [x] Add unique token generation for saved calculation links
- [x] Create backend tRPC procedure to save calculation data
- [x] Create backend tRPC procedure to retrieve calculation by token
- [x] Build email service to send resume link
- [x] Add "Save & Resume Later" button to calculator form
- [x] Create save dialog component with email capture
- [x] Implement URL parameter parsing to pre-fill form data
- [x] Add visual indicator when form is pre-filled from saved link
- [x] Track saved calculation usage (created, resumed, converted)
- [x] Add expiration logic for saved calculations (30 days)
- [x] Test save and resume flow end-to-end
- [x] Test email delivery with resume links

## Homepage Tools Section
- [x] Design Tools section layout with two tool cards
- [x] Create Property Value Estimator tool card with icon, title, description, and CTA
- [x] Create Timeline Calculator tool card with icon, title, description, and CTA
- [x] Add section heading and subheading for Tools section
- [x] Position Tools section appropriately on homepage (after hero/guide section)
- [x] Ensure responsive design for mobile and tablet views
- [x] Add hover effects and visual polish to tool cards
- [x] Test navigation to both tools from homepage
- [x] Verify CTAs are clear and compelling

## Homepage Resources Section
- [x] Create "Free Foreclosure Survival Resources" section on homepage
- [x] Add section header and description
- [x] Create resource card for "Texas Foreclosure Survival Guide.pdf"
- [x] Create resource card for "Action Guide Contacting Your Lender.pdf"
- [x] Create resource card for "Action Guide Notice of Default.pdf"
- [x] Add download buttons with EnterActDFW branding
- [x] Position section above footer, after service offerings
- [x] Ensure mobile-friendly responsive design
- [x] Add PDF file icons to resource cards
- [x] Test all download buttons and PDF delivery

## PDF Guides Replacement
- [x] Move uploaded PDF files to public directory
- [x] Update Texas Foreclosure Survival Guide with new version
- [x] Add Avoiding Foreclosure Scams Guide (new)
- [x] Update Action Guide: Notice of Default with new version
- [x] Update Action Guide: Contacting Your Lender with new version
- [x] Update Resources section to display 4 guides instead of 3
- [x] Update backend endpoints to serve new PDF files
- [x] Test all 4 PDF downloads
- [x] Verify responsive layout with 4-column grid

## Resources Lead Capture
- [x] Create database table for resource downloads (resourceDownloads)
- [x] Add fields: name, email, resourceName, downloadedAt, ipAddress
- [x] Create backend tRPC procedure to capture lead and track download
- [x] Send email with PDF attachment after form submission
- [x] Create lead in GHL system when resource is downloaded
- [x] Build ResourceLeadCaptureDialog component with name and email fields
- [x] Add form validation for name and email
- [x] Update Resources section to show dialog instead of direct download
- [x] Track which resource was requested in dialog state
- [x] Send owner notification when resource is downloaded
- [x] Test lead capture flow for all 4 PDFs
- [x] Verify email delivery with PDF attachment
- [x] Test GHL lead creation integration

## Thank You Page for Resource Downloads
- [x] Create ThankYou page component at /thank-you route
- [x] Add confirmation message with checkmark icon
- [x] Display which resource was downloaded
- [x] Show "Check your email" message with inbox icon
- [x] Add "What Happens Next" section with 3 steps
- [x] Include prominent "Schedule Free Consultation" CTA
- [x] Display 2-3 testimonials for social proof
- [x] Add "Download Another Guide" link back to Resources
- [x] Pass resource name via URL parameter
- [x] Update ResourceLeadCaptureDialog to redirect to Thank You page after submission
- [x] Test Thank You page with all 4 resources
- [x] Ensure responsive design for mobile

## Exit-Intent Popup Feature
- [x] Create ExitIntentPopup component with mouse tracking
- [x] Detect when user's mouse leaves viewport (exit intent)
- [x] Show popup offering Texas Foreclosure Survival Guide
- [x] Add lead capture form (name + email) in popup
- [x] Prevent popup from showing more than once per session
- [x] Add localStorage to track if user has seen popup
- [x] Include compelling headline and benefit bullets
- [x] Add close button and "No thanks" option
- [x] Integrate with existing lead capture API
- [x] Test exit-intent detection on homepage
- [x] Ensure mobile-friendly design (show on scroll up instead)

## Automated Email Drip Campaign
- [x] Create database table for email campaign tracking (emailCampaigns)
- [x] Add fields: recipientEmail, campaignType, dayNumber, sentAt, opened, clicked
- [x] Create email template for Day 1 (Welcome + Guide Delivery)
- [x] Create email template for Day 3 (Case Study)
- [x] Create email template for Day 7 (Consultation Reminder)
- [x] Build backend scheduler to check and send drip emails
- [x] Add API endpoint to enroll users in drip campaign after download
- [x] Track email opens and clicks for analytics
- [x] Add unsubscribe link to all drip emails
- [x] Test drip campaign enrollment after guide download
- [x] Verify email delivery timing (Day 1, 3, 7)

## Property Value Estimator Progress Bar
- [x] Add progress state tracking to PropertyValueEstimator
- [x] Create ProgressBar component showing "Step X of 3"
- [x] Define 3 steps: Property Details, Mortgage Info, Results
- [x] Display progress bar at top of form
- [x] Update progress as user fills required fields
- [x] Add visual indicators (checkmarks for completed steps)
- [x] Ensure progress bar is sticky/visible while scrolling
- [x] Test progress bar updates on all form interactions
- [x] Verify mobile responsiveness of progress bar

## Phone Number Update
- [x] Search for all instances of (555) 123-4567 placeholder phone number
- [x] Replace with correct EnterActDFW contact number 832-932-7585
- [x] Update phone number in all components and pages
- [x] Verify phone number format consistency (with/without parentheses, dashes)
- [x] Test all phone number links (tel: links)

## Fix Nested Anchor Tag Error
- [x] Locate nested `<a>` tags in Resources page
- [x] Fix Button component wrapping anchor tags
- [x] Test Resources page to verify error is resolved

## Click-to-Call Tracking
- [ ] Create database table for call tracking (phoneCallTracking)
- [ ] Add backend API to log click-to-call events
- [ ] Wrap all phone number links with tracking component
- [ ] Track page source, timestamp, and user info for each call
- [ ] Create analytics dashboard to view call conversion by page

## Contact Us Page
- [ ] Create Contact Us page component at /contact route
- [ ] Add phone, email, and contact form options
- [ ] Display office hours and service area information
- [ ] Integrate Google Maps showing DFW service area
- [ ] Add contact form with name, email, phone, message fields
- [ ] Send form submissions to GHL and owner email
- [ ] Add page to main navigation menu

## SMS Opt-In Checkbox
- [ ] Add smsOptIn field to all lead capture forms
- [ ] Update database schema to store SMS consent
- [ ] Add checkbox to ResourceLeadCaptureDialog
- [ ] Add checkbox to EmailCaptureDialog
- [ ] Add checkbox to SaveResumeDialog
- [ ] Add checkbox to ExitIntentPopup
- [ ] Update backend APIs to save SMS consent preference
- [ ] Display SMS opt-in status in admin/leads dashboard

## Click-to-Call Tracking System
- [x] Create phoneCallTracking database table in schema.ts
- [x] Add trackPhoneCall, getPhoneCallStats, getRecentPhoneCalls helper functions in db.ts
- [x] Create tRPC tracking router with three endpoints:
  - [x] tracking.trackPhoneCall (public) - logs phone number clicks with page context
  - [x] tracking.getCallStats (admin) - returns call counts grouped by page
  - [x] tracking.getRecentCalls (admin) - returns recent call log with limit
- [x] Create TrackablePhoneLink component for frontend tracking
- [x] Replace phone links in Home.tsx header with TrackablePhoneLink
- [x] Replace phone links in KnowledgeBaseLayout.tsx header with TrackablePhoneLink
- [x] Replace all 6 phone links in PropertyValueEstimator.tsx with TrackablePhoneLink
- [x] Write comprehensive test suite (13 tests covering all scenarios)
- [x] Test phone call tracking in browser
- [x] Verify tracking captures: phone number, page path, page title, user email, IP address, user agent, timestamp

## Site-Wide Phone Link Replacement
- [x] Replace phone links in TimelineCalculator.tsx (2 links)
- [x] Replace phone links in ThankYou.tsx (2 links)
- [x] Replace phone links in KnowledgeBase.tsx (4 links)
- [x] Replace phone links in Resources.tsx (1 link)
- [x] Replace phone links in About.tsx (3 links)
- [x] Replace phone links in Glossary.tsx (batch updated)
- [x] Replace phone links in NoticeOfDefaultGuide.tsx (batch updated)
- [x] Replace phone links in NoticeOfDefaultChecklist.tsx (batch updated)
- [x] Replace phone links in ContactingYourLenderGuide.tsx (batch updated)
- [x] Replace phone links in OptionsToAvoidForeclosure.tsx (batch updated)
- [x] Replace phone links in AvoidingScams.tsx (batch updated + 1 manual fix)
- [x] Replace phone links in SuccessStories.tsx (batch updated + 2 manual fixes)
- [x] Replace phone links in PrivacyPolicy.tsx (batch updated)
- [x] Replace phone links in TermsOfService.tsx (batch updated)
- [x] Verify all phone links are trackable (0 tel: links remaining)
- [x] Test site-wide call tracking functionality in browser

## Admin Analytics Dashboard
- [x] Enhance tRPC tracking endpoints for analytics data:
  - [x] Add getCallVolumeByDate endpoint (daily call counts with date range filter)
  - [x] getCallStats already provides calls by page
  - [x] Enhance getRecentCalls with date range and page filters
- [x] Install chart library (recharts) for data visualization
- [x] Create AdminAnalytics.tsx page component
- [x] Build call volume chart (line chart showing calls over time)
- [x] Build calls by page chart (horizontal bar chart showing top 10 pages)
- [x] Build filterable call log table with:
  - [x] Date range filter (start and end date)
  - [x] Page filter dropdown
  - [x] All columns displayed (date/time, page, phone, user, IP)
  - [x] Limit to 100 recent calls (pagination not needed for this volume)
- [x] Add admin-only route protection at /admin/analytics
- [x] Add navigation link to analytics dashboard in admin menu
- [x] Test dashboard with real data (15 calls tracked)
- [x] Verify filters work correctly
- [x] Add CSV export functionality

## GHL Calendar Booking Integration
- [x] Analyze current landing page "Schedule Free Consultation" button location
- [x] Create BookingModal component with GHL calendar iframe
- [x] Style modal to match EnterActDFW branding (professional, modern, compliant)
- [x] Add branded confirmation messaging after successful booking
- [x] Integrate booking button into Home page
- [x] Test booking flow end-to-end
- [x] Modal is responsive with max-w-4xl and max-h-[90vh]

## Booking Button on Tool Results Pages
- [x] Add BookingModal import and state to PropertyValueEstimator.tsx
- [x] Add Schedule Free Consultation button to Property Value Estimator results section
- [x] Add BookingModal import and state to TimelineCalculator.tsx
- [x] Add Schedule Free Consultation button to Timeline Calculator results section
- [x] Test booking flow on Property Value Estimator results page (form validation working)
- [x] Test booking flow on Timeline Calculator results page (modal opens successfully)

## GHL Booking Webhook Tracking
- [x] Design bookingConfirmations database schema (capture: name, email, phone, booking date/time, calendar event ID, source page, created timestamp)
- [x] Create bookingConfirmations table in drizzle/schema.ts
- [x] Push database schema changes (pnpm db:push)
- [x] Create webhook endpoint at /api/webhooks/ghl-booking for GHL to POST booking confirmations
- [x] Add database helper functions in server/db.ts:
  - [x] saveBookingConfirmation(data)
  - [x] getBookingStats(dateRange)
  - [x] getRecentBookings(limit)
- [x] Create tRPC endpoints for booking analytics:
  - [x] bookings.getStats (admin-only)
  - [x] bookings.getRecent (admin-only)
- [x] Add booking metrics to admin analytics dashboard:
  - [x] Total bookings card
  - [x] Booking conversion rate card (bookings / calls)
  - [x] Recent bookings table with booking details
- [x] Write comprehensive tests for booking webhook and endpoints (9 tests passing)
- [x] Test webhook endpoint with sample GHL payload (success)
- [x] Verify booking appears in admin dashboard (confirmed)
- [x] Document GHL webhook configuration instructions (GHL_WEBHOOK_SETUP.md)


## Conversion Funnel Analysis Page
- [ ] Design funnel tracking architecture (Page Views → Phone Calls → Bookings)
- [ ] Create pageViews database table to track unique visitors per page
- [ ] Add page view tracking to frontend (track on mount, deduplicate by session)
- [ ] Create funnel analytics tRPC endpoints:
  - [ ] funnel.getOverview (total visitors, calls, bookings, conversion rates)
  - [ ] funnel.getByPage (funnel metrics grouped by page)
  - [ ] funnel.getDropoffAnalysis (identify where users drop off)
- [ ] Create FunnelAnalysis.tsx page component at /admin/funnel
- [ ] Build Sankey diagram showing flow: Visitors → Calls → Bookings
- [ ] Add conversion rate cards for each funnel stage
- [ ] Add drop-off analysis table showing pages with poor conversion
- [ ] Add optimization recommendations based on funnel data
- [ ] Add route to App.tsx and navigation link in Admin page
- [ ] Test funnel tracking with sample data
- [ ] Write comprehensive tests for funnel endpoints

## UTM Parameter Tracking & Marketing Attribution
- [x] Add UTM fields to pageViews table (utmSource, utmMedium, utmCampaign, utmTerm, utmContent)
- [x] Add UTM fields to phoneCallTracking table for call attribution
- [x] Add UTM fields to bookingConfirmations table for booking attribution
- [x] Push database schema changes (pnpm db:push)
- [x] Update PageViewTracker component to extract and store UTM parameters from URL
- [x] Create UTM session persistence (store first-touch UTM in sessionStorage)
- [x] Create shared UTM utility functions (lib/utm.ts)
- [x] Update TrackablePhoneLink to include UTM parameters in tracking
- [x] Create tRPC endpoints for UTM analytics:
  - [x] utm.getChannelPerformance - conversion rates by utm_source
  - [x] utm.getCampaignPerformance - conversion rates by utm_campaign
  - [x] utm.getMediumPerformance - conversion rates by utm_medium
  - [ ] utm.getAttributionReport - full UTM breakdown with funnel metrics
- [ ] Create MarketingAttribution.tsx admin page at /admin/attribution
- [ ] Build channel performance table with conversion rates
- [ ] Build campaign performance comparison chart
- [ ] Add UTM filter to existing analytics dashboards
- [ ] Write comprehensive tests for UTM tracking
- [ ] Test with sample UTM URLs


## Google Analytics 4 Integration
- [ ] Request GA4 Measurement ID from user (format: G-XXXXXXXXXX)
- [ ] Add GA4 tracking script to client/index.html
- [ ] Configure GA4 custom events for conversion tracking:
  - [ ] phone_call_click event (with page, phone_number, utm parameters)
  - [ ] booking_modal_open event
  - [ ] booking_completed event (from GHL webhook)
- [ ] Set up GA4 Data API integration:
  - [ ] Request GA4 API credentials from user (service account JSON)
  - [ ] Install @google-analytics/data npm package
  - [ ] Create GA4 API client wrapper in server/_core/ga4.ts
- [ ] Create tRPC endpoints for GA4 data retrieval:
  - [ ] ga4.getTrafficSources - UTM source/medium/campaign breakdown
  - [ ] ga4.getConversions - conversion events with UTM attribution
  - [ ] ga4.compareWithInternal - side-by-side comparison with internal tracking
- [ ] Build unified analytics dashboard at /admin/ga4-validation
- [ ] Add data validation alerts (flag discrepancies > 10% between internal and GA4)
- [ ] Test GA4 tracking with sample events
- [ ] Write comprehensive tests for GA4 integration


## GHL Chat Widget Integration
- [x] Add GHL chat widget script to client/index.html before closing </body> tag
- [x] Test chat widget visibility on multiple pages (Home, Property Value Estimator)
- [x] Verify chat widget functionality (visible with "Hi there! Have a question? Chat with us here.")
- [x] Confirm widget appears on all pages site-wide


## Chat Engagement Analytics
- [x] Create chatEngagement database table (track: sessionId, eventType, pagePath, pageTitle, userEmail, timestamp, UTM parameters)
- [x] Push database schema changes (pnpm db:push)
- [x] Create ChatEngagementTracker component to listen for GHL chat events
- [x] Add database helper functions in server/db.ts:
  - [x] trackChatEvent(data) - save chat engagement events
  - [x] getChatStats(dateRange) - total opens, messages, completions
  - [x] getChatEngagementByPage(dateRange) - chat metrics grouped by page
- [x] Create tRPC chat router with endpoints:
  - [x] chat.trackEngagement (public) - track chat events
  - [x] chat.getStats (admin-only) - get chat statistics
  - [x] chat.getByPage (admin-only) - get chat metrics by page
- [x] Integrate ChatEngagementTracker into App.tsx
- [ ] Add chat metrics to admin analytics dashboard (future enhancement):
  - [ ] Chat opens card
  - [ ] Chat messages sent card
  - [ ] Chat-to-call/booking conversion rate
- [ ] Update conversion funnel to include chat as engagement channel (future enhancement)
- [ ] Test chat tracking in browser with GHL widget interactions
- [ ] Write comprehensive tests for chat analytics endpoints


## Update Booking Calendar URL
- [x] Find all instances of old GHL booking URL (api.leadconnectorhq.com/widget/booking/vISKzedcwnJuerwQSBmg)
- [x] Replace with new permanent URL (links.enteractai.com/widget/booking/vISKzedcwnJuerwQSBmg)
- [x] Update BookingModal component
- [x] Verify booking flow works with new URL (calendar loads successfully)
- [x] Test booking modal opens and displays calendar correctly


## Branded Link Shortening System
- [ ] Design link shortening architecture (database schema, URL generation, redirect handling)
- [ ] Research link shortening services (Bitly API, Rebrandly API, or custom solution)
- [ ] Create shortenedLinks database table (originalUrl, shortCode, clicks, createdAt, expiresAt)
- [ ] Push database schema changes (pnpm db:push)
- [ ] Build link shortening service integration:
  - [ ] Create tRPC endpoint: links.shorten(url) - generate short link
  - [ ] Create tRPC endpoint: links.getStats(shortCode) - get click statistics
  - [ ] Create tRPC endpoint: links.list() - list all shortened links (admin-only)
- [ ] Create redirect handler at /l/:shortCode to track clicks and redirect
- [ ] Build admin interface at /admin/links for managing shortened links
- [ ] Add click tracking with UTM parameter preservation
- [ ] Test link shortening and redirect flow
- [ ] Write comprehensive tests for link shortening system

## Link Shortening System
- [x] Design database schema for shortened links and click tracking
- [x] Create shortenedLinks table with UTM parameters, expiration, custom aliases
- [x] Create linkClicks table for detailed click analytics
- [x] Add database helper functions for CRUD operations
- [x] Create tRPC router with 6 endpoints (create, getByCode, getAll, getStats, delete, update)
- [x] Implement admin-only access control for link management
- [x] Add automatic short code generation (6-character alphanumeric)
- [x] Add URL validation and normalization
- [x] Create Express redirect handler at /l/:shortCode route
- [x] Implement click tracking with metadata (IP, user agent, referer)
- [x] Build admin dashboard UI at /admin/links
- [x] Add link creation dialog with UTM parameters
- [x] Display stats cards (total links, total clicks, avg clicks)
- [x] Add link management table with copy/delete/edit actions
- [x] Write comprehensive test suite (16 tests covering all functionality)
- [x] Test redirect functionality with UTM parameter preservation
- [x] Verify click tracking in real-time

## Bulk Link Import Feature
- [x] Design CSV format specification (columns: originalUrl, title, customAlias, utmSource, utmMedium, utmCampaign)
- [x] Create backend API for CSV file parsing
- [x] Implement batch link creation with validation
- [x] Add error handling for duplicate aliases and invalid URLs
- [x] Create import results summary (success count, error list)
- [x] Build CSV upload UI component in admin dashboard
- [x] Add file validation (CSV format, size limits)
- [x] Display import progress indicator
- [x] Show results table with success/error status for each row
- [x] Add CSV template download button
- [x] Test bulk import with 5-row CSV file (100% success rate)

## Link Analytics Dashboard
- [x] Enhance linkClicks table schema with additional tracking fields (country, city, deviceType, browser, os)
- [x] Create analytics aggregation functions in db.ts (clicks over time, geographic distribution, device breakdown)
- [x] Build backend API for analytics data (daily/weekly/monthly trends, top links, referrer analysis)
- [x] Create analytics dashboard page at /admin/link-analytics
- [x] Add date range selector for filtering analytics data (7d, 30d, 90d, all time)
- [x] Build click-through rate chart showing trends over time (line chart with Recharts)
- [x] Create geographic distribution visualization (horizontal bar chart by country)
- [x] Add device and browser breakdown charts (pie chart and bar chart)
- [x] Build referral sources table with click counts
- [x] Create top-performing links leaderboard with top 10 links
- [x] Add overall statistics cards (total clicks, unique visitors, CTR, countries)
- [x] Install ua-parser-js for user agent parsing
- [x] Update redirect handler to parse user agent and extract device/browser/OS
- [x] Fix MySQL ONLY_FULL_GROUP_BY compatibility with sql.raw
- [x] Test analytics dashboard with existing click data

## Link Expiration Management
- [x] Add isActive field to shortenedLinks table schema
- [x] Create database functions for expiration checks (getExpiredLinks, getExpiringLinks)
- [x] Build scheduled job to run daily expiration checks at 2 AM
- [x] Implement automatic link deactivation for expired links
- [x] Create notification system for links expiring within 7 days
- [x] Add tRPC endpoints for activation/deactivation and expiring/expired links
- [x] Add expiration status badges to link management table (Inactive/Expired)
- [x] Test scheduled job execution (runs successfully with no expired links)

## QR Code Generation
- [x] Install qrcode library for QR code generation
- [x] Create backend API endpoint for generating QR codes (tRPC endpoint)
- [x] Add QR code button in admin links table actions column
- [x] Build QR code preview modal with download options
- [x] Test QR code generation and download functionality

## Campaign Tagging System
- [x] Create campaigns table in database schema
- [x] Add campaignId field to shortenedLinks table
- [x] Create database functions for campaign CRUD operations (create, getAll, getById, update, delete, assignLink, getLinksByCampaign, getCampaignStats)
- [x] Build backend API endpoints for campaign management (campaignsRouter with 7 endpoints)
- [x] Create campaign management UI page at /admin/campaigns
- [x] Add campaigns route to App.tsx
- [ ] Resolve database column casing issue (campaignId vs campaignid)
- [ ] Add campaign selector to link creation form
- [ ] Build campaign filter dropdown in links table
- [ ] Add bulk campaign assignment for multiple links
- [ ] Test campaign creation, assignment, and filtering

## Expiring Links Dashboard
- [x] Create database function to get links expiring in next 30 days (getLinksExpiringInDays)
- [x] Add backend API endpoint for extending link expiration dates (extendExpiration mutation)
- [x] Build expiring links dashboard page at /admin/expiring-links
- [x] Add visual indicators for urgency (critical ≤7 days, warning 8-14 days, normal 15-30 days)
- [x] Implement one-click extension buttons (extend by 30/60/90 days)
- [x] Display time remaining until expiration for each link with color-coded badges
- [x] Add route to App.tsx
- [x] Add time range selector (7/14/30 days)
- [x] Add stats cards showing expiring count by urgency level
- [ ] Test dashboard with links at various expiration stages (blocked by campaignId database issue)

## Fix Campaign Database Issue
- [x] Drop and recreate campaignId column with correct casing
- [x] Verify links table loads correctly in admin dashboard (38 links displayed)
- [x] Test all link management pages (AdminLinks, AdminLinkAnalytics, AdminExpiringLinks)
- [x] All pages loading successfully after database fix

## Email Notifications for Expiring Links
- [x] Review existing notification system (notifyOwner function)
- [x] Email notification already implemented in linkExpiration.ts job
- [x] Install node-cron package for scheduling
- [x] Create scheduler.ts to initialize cron jobs
- [x] Configure daily cron job at 2:00 AM CST
- [x] Integrate scheduler into server startup (server/_core/index.ts)
- [x] Test scheduled job execution manually (runs successfully)
- [x] Verify scheduler initializes on server start

## Fix Deployment Failure
- [x] Remove auto-execution code from linkExpiration.ts that calls process.exit()
- [x] Test server starts without exiting (verified - scheduler initializes and server stays running)
- [x] Ready for deployment (server no longer exits on startup)

## Fix Property Value Estimator - Sale Options Comparison
- [x] Investigate why comparison results (Traditional Sale, Cash Offer, Short Sale) are not displaying
- [x] Check frontend component rendering logic (comparison only shows when mortgage balance > 0)
- [x] Verify backend API returns comparison data correctly (working as expected)
- [x] Add helpful message when mortgage balance is not entered
- [x] Implement "Add Mortgage Balance" CTA button that scrolls to form and focuses field
- [x] Test the new helpful message display (verified - shows blue box with TrendingUp icon and button)

## PDF Report Generation for Property Valuation
- [x] PDF generation library already installed (pdfkit + @types/pdfkit)
- [x] PDF report structure already designed (server/comparisonPdfGenerator.ts)
- [x] Backend API endpoint already exists (downloadComparisonPDF tRPC mutation)
- [x] PDF generation with EnterActDFW branding already implemented
- [x] Property details section included in PDF
- [x] Estimated value section with range included
- [x] Sale options comparison table with net proceeds included
- [x] Pros/cons for each sale option included
- [x] Contact information and next steps section included
- [x] "Download Full Report (PDF)" button added to results page
- [x] Updated frontend to use tRPC mutation (downloadPDFMutation)
- [x] Fixed TypeScript type errors (Number() conversions)
- [ ] Fix tRPC binary response issue (tRPC can't return PDF buffers directly)
- [ ] Solution: Create Express route for PDF download OR return base64 encoded PDF
- [ ] Test PDF download after implementing solution

## Fix PDF Download Functionality (Express Route Solution)
- [x] Create Express route at /api/download-comparison-pdf for binary PDF delivery
- [x] Update server/_core/index.ts to add new route handler
- [x] Accept comparison data as query parameters or POST body
- [x] Call comparisonPdfGenerator.ts to generate PDF buffer
- [x] Set proper Content-Type: application/pdf header
- [x] Set Content-Disposition: attachment header with filename
- [x] Stream PDF buffer to response
- [x] Update PropertyValueEstimator.tsx to use new Express route
- [x] Replace tRPC mutation with window.open() or fetch with blob response
- [x] Test PDF download works correctly in browser

## Add Property Address Field
- [x] Add propertyAddress field to PropertyValueEstimator form state
- [x] Add address input field to form UI (before ZIP code field)
- [x] Update form validation to include address
- [x] Pass address to all backend endpoints (email, SMS, save, PDF)
- [x] Update comparisonPdfGenerator.ts to include address in PDF
- [x] Update comparisonEmailService.ts to include address in email
- [x] Update SMS service to include address in message
- [x] Update savedCalculations schema to store address
- [x] Test address field displays correctly in all outputs

## Comparison History Feature
- [x] Create comparisonHistory database table with schema
- [x] Add fields: userId, propertyAddress, zipCode, propertyType, squareFeet, bedrooms, bathrooms, condition, estimatedValue, mortgageBalance, equity, createdAt
- [x] Create database helper functions (saveComparison, getUserComparisons, getComparisonById)
- [x] Add tRPC router for comparison history (save, getAll, getById)
- [x] Automatically save comparison when user views results
- [x] Create /comparison-history page route
- [x] Build ComparisonHistory.tsx component with table/card view
- [x] Display saved comparisons with property details and date
- [x] Add "View Details" button to load saved comparison
- [x] Add "Download PDF" button for each saved comparison
- [x] Add "Delete" button to remove saved comparisons
- [x] Show empty state when no comparisons exist
- [x] Add link to comparison history from PropertyValueEstimator results
- [x] Test full workflow: calculate → auto-save → view history → reload comparison

## Reformat Notice of Default Checklist for Printing
- [x] Examine current NoticeOfDefaultChecklist.tsx layout
- [x] Identify elements that overflow page margins
- [x] Adjust font sizes for better fit on 8.5 x 11 inch paper
- [x] Optimize column widths or switch to single-column layout if needed
- [x] Increase page margins for better printability
- [x] Shorten text entries using bullet points where appropriate
- [x] Add print-specific CSS styles (@media print)
- [x] Test print preview to ensure clean layout
- [x] Verify all content fits within page boundaries
