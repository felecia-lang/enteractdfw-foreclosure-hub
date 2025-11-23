/**
 * Email Templates for Automated Follow-up Sequences
 * 
 * These templates are used for automated email nurture campaigns
 * sent via Go HighLevel after a lead submits the form.
 */

const EMAIL_STYLES = `
  body { font-family: 'Open Sans', Arial, sans-serif; line-height: 1.6; color: #333333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background-color: #0A2342; color: white; padding: 30px; text-align: center; }
  .content { background-color: #F5F5F5; padding: 30px; }
  .cta-button { display: inline-block; background-color: #00A6A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  .highlight { background-color: #FFF3CD; padding: 15px; border-left: 4px solid: #00A6A6; margin: 20px 0; }
  ul { padding-left: 20px; }
  li { margin-bottom: 10px; }
`;

const EMAIL_FOOTER = `
  <div class="footer">
    <p><strong>Felecia Fair</strong> | Licensed Texas Real Estate Broker</p>
    <p>EnterActDFW | 4400 State Hwy 121, Suite 300, Lewisville, TX 75056</p>
    <p>Phone: 832-932-7585 | Email: info@enteractdfw.com</p>
    <p style="margin-top: 20px; font-style: italic;">This is educational information only and not legal advice. For legal guidance, consult an attorney or HUD-approved housing counselor.</p>
  </div>
`;

/**
 * Day 2 Follow-up: Your Rights and Protections
 */
export function getDay2Email(firstName: string): { subject: string; body: string } {
  return {
    subject: "Your Rights During Foreclosure - Important Protections",
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You Have Rights</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            
            <p>I wanted to follow up and make sure you know about the important legal protections you have as a Texas homeowner facing foreclosure.</p>
            
            <div class="highlight">
              <strong>⏰ Critical Timeline:</strong> In Texas, you have at least 20 days after receiving a Notice of Default to take action. Don't wait—every day counts.
            </div>
            
            <p><strong>Your Federal Rights Include:</strong></p>
            <ul>
              <li><strong>120-Day Protection:</strong> Your lender cannot start foreclosure until you're 120 days delinquent</li>
              <li><strong>Loss Mitigation Review:</strong> You have the right to apply for loan modification or other assistance</li>
              <li><strong>Dual Tracking Prohibition:</strong> Lenders can't foreclose while reviewing your application</li>
              <li><strong>Notice Requirements:</strong> You must receive proper written notice before foreclosure</li>
            </ul>
            
            <p><strong>Texas-Specific Protections:</strong></p>
            <ul>
              <li><strong>Reinstatement Right:</strong> You can stop foreclosure by paying past-due amounts plus fees</li>
              <li><strong>First Tuesday Rule:</strong> Foreclosure sales only happen on the first Tuesday of each month</li>
              <li><strong>Homestead Exemption:</strong> Your primary residence has special protections</li>
            </ul>
            
            <p>Understanding your rights is the first step to protecting your home and your future.</p>
            
            <a href="https://enteractdfw-foreclosure-hub.manus.space/knowledge-base/homeowner-rights" class="cta-button">Read Full Rights Guide</a>
            
            <p>Have questions about your specific situation? I'm here to help—no pressure, no judgment.</p>
            
            <p>Best regards,<br>
            <strong>Felecia Fair</strong><br>
            832-932-7585</p>
          </div>
          ${EMAIL_FOOTER}
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * Day 5 Follow-up: Exploring Your Options
 */
export function getDay5Email(firstName: string): { subject: string; body: string } {
  return {
    subject: "7 Ways to Avoid Foreclosure - You Have Options",
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You Have Options</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            
            <p>Foreclosure isn't inevitable. There are several paths forward, and the right choice depends on your unique situation.</p>
            
            <p><strong>Here are your main options:</strong></p>
            
            <p><strong>1. Loan Modification</strong><br>
            Permanently change your loan terms to make payments affordable. Success rate: 40-50% when applied early.</p>
            
            <p><strong>2. Repayment Plan</strong><br>
            Spread past-due amounts over 3-12 months while resuming regular payments.</p>
            
            <p><strong>3. Forbearance Agreement</strong><br>
            Temporarily reduce or pause payments while you get back on your feet.</p>
            
            <p><strong>4. Short Sale</strong><br>
            Sell your home for less than you owe (with lender approval). Protects your credit better than foreclosure.</p>
            
            <p><strong>5. Deed in Lieu</strong><br>
            Voluntarily transfer the property to avoid foreclosure proceedings.</p>
            
            <p><strong>6. Refinance</strong><br>
            Replace your current loan with a new one at better terms (if you qualify).</p>
            
            <p><strong>7. Sell to a Cash Buyer</strong><br>
            Get a fair offer and close quickly—sometimes in as little as 7-10 days.</p>
            
            <div class="highlight">
              <strong>💡 Which option is right for you?</strong> It depends on your income, equity, timeline, and long-term goals. I can help you evaluate each path.
            </div>
            
            <a href="https://enteractdfw-foreclosure-hub.manus.space/knowledge-base/options" class="cta-button">Explore All Options</a>
            
            <p>Want to discuss your situation confidentially? Let's talk.</p>
            
            <p>Best regards,<br>
            <strong>Felecia Fair</strong><br>
            832-932-7585</p>
          </div>
          ${EMAIL_FOOTER}
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * Day 10 Follow-up: Success Stories and Next Steps
 */
export function getDay10Email(firstName: string): { subject: string; body: string } {
  return {
    subject: "Real Stories, Real Solutions - You're Not Alone",
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're Not Alone</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            
            <p>Over the past 10 days, I've shared information about your rights and options. Today, I want to share something more personal: real stories from people who've been exactly where you are now.</p>
            
            <p><strong>Maria's Story - Dallas</strong><br>
            "I received a Notice of Default and panicked. Felecia helped me understand my options without any pressure. We worked with my lender on a loan modification, and I was able to keep my home. I'm so grateful I reached out."</p>
            
            <p><strong>James & Linda - Fort Worth</strong><br>
            "After my husband lost his job, we fell behind on our mortgage. We thought foreclosure was inevitable. Felecia helped us sell our home quickly for a fair price. We avoided foreclosure, protected our credit, and moved into a more affordable place. It was the fresh start we needed."</p>
            
            <p><strong>Robert - Lewisville</strong><br>
            "I tried to handle everything myself and got overwhelmed. Felecia walked me through the process step-by-step, helped me gather documents, and coached me on what to say to my lender. Having someone in my corner made all the difference."</p>
            
            <div class="highlight">
              <strong>What these stories have in common:</strong> They all took action early. They reached out for help. They explored their options with someone who cared.
            </div>
            
            <p><strong>Where do you go from here?</strong></p>
            <p>You have three choices:</p>
            <ol>
              <li><strong>Do nothing</strong> - and let foreclosure proceed</li>
              <li><strong>Try to handle it alone</strong> - and risk missing deadlines or opportunities</li>
              <li><strong>Get expert guidance</strong> - and explore every option available to you</li>
            </ol>
            
            <p>I've helped over 200 families navigate foreclosure in the DFW area. I know the process, I know the lenders, and I know what works.</p>
            
            <p><strong>Let's talk about your situation—no cost, no obligation, no pressure.</strong></p>
            
            <a href="tel:832-932-7585" class="cta-button">Call Me: 832-932-7585</a>
            
            <p>Or reply to this email with your phone number and the best time to reach you. I'll call you personally.</p>
            
            <p>You don't have to face this alone.</p>
            
            <p>Best regards,<br>
            <strong>Felecia Fair</strong><br>
            Licensed Texas Real Estate Broker<br>
            832-932-7585<br>
            info@enteractdfw.com</p>
          </div>
          ${EMAIL_FOOTER}
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * Owner Notification Email (sent to Felecia when a new lead comes in)
 */
export function getOwnerNotificationEmail(leadData: {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  propertyZip: string;
  submittedAt: Date;
}): { subject: string; body: string } {
  return {
    subject: `🔔 New Foreclosure Lead: ${leadData.firstName} ${leadData.lastName || ""} - ${leadData.propertyZip}`,
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${EMAIL_STYLES}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Lead Submitted</h1>
          </div>
          <div class="content">
            <p><strong>A new foreclosure lead just submitted the form on your website.</strong></p>
            
            <h3>Lead Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${leadData.firstName} ${leadData.lastName || ""}</li>
              <li><strong>Email:</strong> ${leadData.email}</li>
              <li><strong>Phone:</strong> ${leadData.phone}</li>
              <li><strong>Property ZIP:</strong> ${leadData.propertyZip}</li>
              <li><strong>Submitted:</strong> ${leadData.submittedAt.toLocaleString("en-US", { timeZone: "America/Chicago" })}</li>
            </ul>
            
            <div class="highlight">
              <strong>⏰ Action Required:</strong> Follow up within 24 hours for best results. Leads who receive a call within the first day are 3x more likely to convert.
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Call ${leadData.firstName} at ${leadData.phone}</li>
              <li>Check your GHL CRM for the full contact record and automated task</li>
              <li>Review the admin dashboard for lead details and notes</li>
            </ol>
            
            <a href="https://enteractdfw-foreclosure-hub.manus.space/admin" class="cta-button">View in Admin Dashboard</a>
            
            <p>The lead has been automatically synced to your GHL CRM with:</p>
            <ul>
              <li>Contact record created/updated</li>
              <li>Tags: "Foreclosure Lead", "Website Lead"</li>
              <li>Follow-up task created for tomorrow</li>
              <li>Welcome email sent automatically</li>
            </ul>
            
            <p>Good luck!</p>
          </div>
          ${EMAIL_FOOTER}
        </div>
      </body>
      </html>
    `,
  };
}
