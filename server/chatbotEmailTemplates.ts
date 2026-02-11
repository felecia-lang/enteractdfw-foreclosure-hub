/**
 * Email templates for the chatbot lead nurture drip campaign.
 * Each template is personalized with lead data and includes clear CTAs.
 * 
 * Campaign Schedule:
 * - Day 1: Welcome + Foreclosure Survival Guide PDF
 * - Day 3: Timeline Calculator introduction
 * - Day 7: Success story with testimonial
 * - Day 14: Consultation reminder with urgency
 */

export interface EmailTemplateData {
  firstName: string;
  email: string;
  propertyZip: string;
}

/**
 * Day 1: Welcome email with Foreclosure Survival Guide
 */
export function getWelcomeGuideEmail(data: EmailTemplateData) {
  const subject = `${data.firstName}, Here's Your FREE Foreclosure Survival Guide`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">EnterActDFW</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your Foreclosure Prevention Partner</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${data.firstName},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for reaching out to us through our AI assistant. We understand that facing foreclosure is overwhelming, but you're not alone—and you have options.
              </p>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                As promised, here's your <strong>FREE Texas Foreclosure Survival Guide</strong>. This comprehensive resource covers:
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 20px; font-size: 16px;">
                <li>The Texas foreclosure timeline and key deadlines</li>
                <li>Your legal rights and protections as a homeowner</li>
                <li>Options to avoid foreclosure (loan modification, short sale, cash sale)</li>
                <li>Step-by-step action plans for each stage</li>
                <li>How EnterActDFW can help you navigate this process</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://3000-i64vwy79wp9j6ts7lkr3r-60124f42.manusvm.computer/api/pdf/foreclosure-survival-guide" style="display: inline-block; background-color: #0d9488; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                  Download Your Free Guide
                </a>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                  <strong>⏰ Time is critical:</strong> In Texas, the foreclosure process moves quickly—typically 4-5 months from the first notice to sale. The sooner you act, the more options you have.
                </p>
              </div>
              
              <h3 style="color: #1f2937; margin: 30px 0 15px 0; font-size: 20px;">What's Next?</h3>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Over the next two weeks, I'll send you additional resources to help you understand your situation and take action:
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 20px; font-size: 16px;">
                <li><strong>Day 3:</strong> Timeline Calculator to see your specific deadlines</li>
                <li><strong>Day 7:</strong> Success story from a homeowner who avoided foreclosure</li>
                <li><strong>Day 14:</strong> Invitation to schedule your free consultation</li>
              </ul>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                In the meantime, if you have urgent questions or want to discuss your situation right away, don't hesitate to call us at <strong>(844) 981-2937</strong>. We're here to help.
              </p>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 30px 0 0 0; font-size: 16px;">
                You've got this,<br>
                <strong>The EnterActDFW Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                <strong>EnterActDFW</strong><br>
                Licensed Texas Real Estate Brokerage<br>
                Lewisville, Texas 75056
              </p>
              <p style="color: #6b7280; margin: 10px 0; font-size: 14px;">
                Phone: (844) 981-2937<br>
                Email: info@enteractdfw.com
              </p>
              <p style="color: #9ca3af; margin: 20px 0 0 0; font-size: 12px;">
                You're receiving this email because you requested information from EnterActDFW.<br>
                <a href="{{unsubscribe_url}}" style="color: #0d9488; text-decoration: none;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  
  return { subject, htmlBody };
}

/**
 * Day 3: Timeline Calculator introduction
 */
export function getTimelineCalculatorEmail(data: EmailTemplateData) {
  const subject = `${data.firstName}, See Your Personalized Foreclosure Timeline`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">EnterActDFW</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your Foreclosure Prevention Partner</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${data.firstName},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                I hope you found the Foreclosure Survival Guide helpful. Today, I want to introduce you to a powerful tool that can help you visualize your specific situation.
              </p>
              
              <h3 style="color: #1f2937; margin: 30px 0 15px 0; font-size: 20px;">📅 Your Personalized Timeline Calculator</h3>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Every foreclosure case is different, and timing is everything. Our <strong>Timeline Calculator</strong> shows you:
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 20px; font-size: 16px;">
                <li>Your specific deadlines based on your Notice of Default date</li>
                <li>Exactly how many days you have until the foreclosure sale</li>
                <li>Action items for each milestone in your timeline</li>
                <li>Urgency indicators so you know what's critical</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://3000-i64vwy79wp9j6ts7lkr3r-60124f42.manusvm.computer/timeline-calculator" style="display: inline-block; background-color: #0d9488; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                  Calculate Your Timeline Now
                </a>
              </div>
              
              <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
                  <strong>💡 Pro Tip:</strong> After you calculate your timeline, you can download it as a PDF or have it emailed to you for easy reference. You can also share it with your attorney or financial advisor.
                </p>
              </div>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                If you have questions about your timeline or want to discuss your options, call us at <strong>(844) 981-2937</strong>. We're here to help you navigate every step.
              </p>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 30px 0 0 0; font-size: 16px;">
                Here to support you,<br>
                <strong>The EnterActDFW Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                <strong>EnterActDFW</strong><br>
                Licensed Texas Real Estate Brokerage<br>
                Lewisville, Texas 75056
              </p>
              <p style="color: #6b7280; margin: 10px 0; font-size: 14px;">
                Phone: (844) 981-2937<br>
                Email: info@enteractdfw.com
              </p>
              <p style="color: #9ca3af; margin: 20px 0 0 0; font-size: 12px;">
                You're receiving this email because you requested information from EnterActDFW.<br>
                <a href="{{unsubscribe_url}}" style="color: #0d9488; text-decoration: none;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  
  return { subject, htmlBody };
}

/**
 * Day 7: Success story email
 */
export function getSuccessStoryEmail(data: EmailTemplateData) {
  const subject = `${data.firstName}, How Maria Saved Her Home (You Can Too)`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">EnterActDFW</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your Foreclosure Prevention Partner</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${data.firstName},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                I wanted to share a story that might resonate with you. This is about Maria, a Dallas homeowner who was facing foreclosure just like you—and how she turned things around.
              </p>
              
              <div style="background-color: #f0fdfa; border-left: 4px solid #0d9488; padding: 25px; margin: 30px 0; border-radius: 4px;">
                <h3 style="color: #0d9488; margin: 0 0 15px 0; font-size: 20px;">Maria's Story</h3>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 15px 0; font-size: 15px; font-style: italic;">
                  "After my husband lost his job, we fell behind on our mortgage. The notices kept coming, and I felt paralyzed. I didn't know where to turn or what to do. I thought we'd lose everything."
                </p>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 15px 0; font-size: 15px;">
                  <strong>The Situation:</strong> Maria was 90 days behind on payments, with a foreclosure sale scheduled in 45 days. She had received multiple notices but didn't understand her options.
                </p>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 15px 0; font-size: 15px;">
                  <strong>What We Did:</strong> We helped Maria explore all her options—loan modification, short sale, and a cash offer. After reviewing her situation, we presented a fair cash offer that paid off her mortgage and gave her $12,000 to start fresh.
                </p>
                
                <p style="color: #4b5563; line-height: 1.6; margin: 0; font-size: 15px; font-style: italic;">
                  "EnterActDFW didn't just buy my house—they gave me peace of mind. They explained everything, answered all my questions, and closed in 10 days. I avoided foreclosure, protected my credit, and walked away with cash to move forward."
                </p>
                
                <p style="color: #0d9488; margin: 15px 0 0 0; font-size: 14px; font-weight: bold;">
                  — Maria T., Dallas
                </p>
              </div>
              
              <h3 style="color: #1f2937; margin: 30px 0 15px 0; font-size: 20px;">You Have Options Too</h3>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Like Maria, you don't have to face this alone. Whether you want to keep your home through a loan modification, sell through a short sale, or get a fair cash offer, we can help you find the best path forward.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="tel:8449812937" style="display: inline-block; background-color: #0d9488; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                  Call Us Today: (844) 981-2937
                </a>
              </div>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 30px 0 0 0; font-size: 16px;">
                Your situation is unique, and so is your solution. Let's talk about what's possible for you.
              </p>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 20px 0 0 0; font-size: 16px;">
                Rooting for you,<br>
                <strong>The EnterActDFW Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                <strong>EnterActDFW</strong><br>
                Licensed Texas Real Estate Brokerage<br>
                Lewisville, Texas 75056
              </p>
              <p style="color: #6b7280; margin: 10px 0; font-size: 14px;">
                Phone: (844) 981-2937<br>
                Email: info@enteractdfw.com
              </p>
              <p style="color: #9ca3af; margin: 20px 0 0 0; font-size: 12px;">
                You're receiving this email because you requested information from EnterActDFW.<br>
                <a href="{{unsubscribe_url}}" style="color: #0d9488; text-decoration: none;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  
  return { subject, htmlBody };
}

/**
 * Day 14: Consultation reminder email
 */
export function getConsultationReminderEmail(data: EmailTemplateData) {
  const subject = `${data.firstName}, Let's Talk About Your Options (Free Consultation)`;
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">EnterActDFW</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your Foreclosure Prevention Partner</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${data.firstName},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Over the past two weeks, I've shared resources to help you understand the foreclosure process and your options. Now, I want to invite you to take the next step.
              </p>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="color: #92400e; margin: 0; font-size: 16px; line-height: 1.6;">
                  <strong>⏰ Time is running out.</strong> Every day that passes brings you closer to the foreclosure sale date. The sooner we talk, the more options you'll have.
                </p>
              </div>
              
              <h3 style="color: #1f2937; margin: 30px 0 15px 0; font-size: 20px;">Schedule Your FREE Consultation</h3>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                In a free, no-obligation consultation, we'll:
              </p>
              
              <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 30px 20px; font-size: 16px;">
                <li><strong>Review your specific situation</strong> and timeline</li>
                <li><strong>Explain all your options</strong> in plain language</li>
                <li><strong>Answer your questions</strong> about the process</li>
                <li><strong>Provide a fair cash offer</strong> if that's the right solution</li>
                <li><strong>Connect you with resources</strong> for loan modification or legal help</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="tel:8449812937" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 18px 36px; border-radius: 6px; font-size: 18px; font-weight: bold;">
                  Call Now: (844) 981-2937
                </a>
              </div>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 30px 0 0 0; font-size: 16px;">
                I'm here to help you navigate this difficult time. Let's talk about what's possible for you.
              </p>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 20px 0 0 0; font-size: 16px;">
                Looking forward to speaking with you,<br>
                <strong>The EnterActDFW Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                <strong>EnterActDFW</strong><br>
                Licensed Texas Real Estate Brokerage<br>
                Lewisville, Texas 75056
              </p>
              <p style="color: #6b7280; margin: 10px 0; font-size: 14px;">
                Phone: (844) 981-2937<br>
                Email: info@enteractdfw.com
              </p>
              <p style="color: #9ca3af; margin: 20px 0 0 0; font-size: 12px;">
                You're receiving this email because you requested information from EnterActDFW.<br>
                <a href="{{unsubscribe_url}}" style="color: #0d9488; text-decoration: none;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  
  return { subject, htmlBody };
}
