import PDFDocument from 'pdfkit';

export function generateContactingLenderPDF(): typeof PDFDocument.prototype {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: 'Contacting Your Lender - A Complete Guide',
      Author: 'EnterActDFW',
      Subject: 'Complete guide to communicating with your mortgage servicer',
    }
  });

  // Brand colors
  const primaryColor = '#0A2342';
  const accentColor = '#00A6A6';
  const tipColor = '#059669';
  const tipBg = '#D1FAE5';
  const tipTextColor = '#065F46';

  // Helper functions
  const addSectionHeader = (text: string, color: string = primaryColor) => {
    doc.fontSize(18).fillColor(color).font('Helvetica-Bold').text(text, { align: 'left' });
    doc.moveDown(0.5);
  };

  const addSubsectionHeader = (text: string) => {
    doc.fontSize(14).fillColor(primaryColor).font('Helvetica-Bold').text(text, { align: 'left' });
    doc.moveDown(0.3);
  };

  const addBodyText = (text: string) => {
    doc.fontSize(10).fillColor('#000000').font('Helvetica').text(text, { align: 'left', lineGap: 2 });
    doc.moveDown(0.5);
  };

  const addBullet = (text: string) => {
    const x = doc.x;
    doc.fontSize(10).fillColor('#000000').font('Helvetica').text('•', x, doc.y);
    doc.text(text, x + 15, doc.y - 10, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 15 });
    doc.moveDown(0.3);
  };

  const addTipBox = (text: string) => {
    const boxHeight = 50;
    doc.rect(doc.x - 10, doc.y, doc.page.width - 100, boxHeight)
      .fillAndStroke(tipBg, tipColor);
    doc.fillColor(tipColor).fontSize(10).font('Helvetica-Bold')
      .text('💡 TIP', doc.x, doc.y + 10);
    doc.fillColor(tipTextColor).fontSize(9).font('Helvetica')
      .text(text, doc.x, doc.y + 5, { width: doc.page.width - 120 });
    doc.moveDown(1.5);
  };

  const addQuote = (text: string) => {
    doc.fontSize(10).fillColor('#4B5563').font('Helvetica-Oblique')
      .text(text, { align: 'left', indent: 20 });
    doc.moveDown(0.8);
  };

  // PAGE 1: Title and Introduction
  doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
    .text('Contacting Your Lender', { align: 'center' });
  doc.moveDown(0.5);
  
  doc.fontSize(14).fillColor(accentColor).font('Helvetica')
    .text('A Complete Guide to Communicating with Your Mortgage Servicer', { align: 'center' });
  doc.moveDown(1.5);

  // Introduction
  addBodyText('When you\'re facing foreclosure, effective communication with your mortgage servicer is critical. This guide provides scripts, questions to ask, documentation tips, and best practices to help you navigate these important conversations with confidence.');
  doc.moveDown(1);

  // Before You Call: Preparation Checklist
  addSectionHeader('Before You Call: Preparation Checklist', accentColor);
  addBodyText('Being prepared will make your conversation more productive and less stressful:');
  doc.moveDown(0.3);

  addBullet('Gather your mortgage documents: loan number, original loan agreement, recent statements');
  addBullet('Have a pen and paper ready to take detailed notes');
  addBullet('Prepare a list of questions you want to ask');
  addBullet('Review your budget so you can discuss your financial situation accurately');
  addBullet('Find a quiet place where you can talk without interruptions');
  addBullet('Allow at least 30-45 minutes for the call (you may be on hold)');
  addBullet('Call during business hours (Monday-Friday, 9 AM - 5 PM servicer time zone)');
  doc.moveDown(0.8);

  addTipBox('Call from a phone where you can take notes comfortably. Avoid calling while driving or in a noisy environment.');

  // Phone Script: Opening the Conversation
  addSectionHeader('Phone Script: Opening the Conversation', primaryColor);
  addBodyText('Use this script to start your call professionally and get to the right department:');
  doc.moveDown(0.3);

  addQuote('"Hello, my name is [YOUR NAME] and I\'m calling about my mortgage account. My loan number is [LOAN NUMBER]. I recently received a Notice of Default and I need to speak with someone in the Loss Mitigation Department about my options to avoid foreclosure."');

  addBodyText('If transferred or put on hold:');
  addQuote('"Thank you. I\'ll hold."');

  addBodyText('When you reach Loss Mitigation:');
  addQuote('"Hello, my name is [YOUR NAME]. I\'m calling about loan number [LOAN NUMBER]. I received a Notice of Default dated [DATE] and I want to explore my options to bring my account current and avoid foreclosure. Can you help me with that?"');

  addTipBox('Write down the representative\'s name and employee ID at the start of the call. This helps with follow-up calls.');

  // PAGE 2: Important Questions
  doc.addPage();

  addSectionHeader('Important Questions to Ask Your Servicer', primaryColor);
  addBodyText('Ask these questions during your call and write down the answers:');
  doc.moveDown(0.5);

  addSubsectionHeader('About Your Account Status');
  addBullet('What is the total amount I need to pay to reinstate my loan and bring it current?');
  addBullet('Can you provide a detailed breakdown of this amount (principal, interest, fees, penalties)?');
  addBullet('What is the deadline to cure the default and reinstate my loan?');
  addBullet('How many payments am I behind?');
  addBullet('Are there any errors in the amount owed? Can we review the payment history together?');
  doc.moveDown(0.8);

  addSubsectionHeader('About Your Options');
  addBullet('What foreclosure prevention options am I eligible for?');
  addBullet('Do I qualify for a loan modification? What would that process look like?');
  addBullet('Can I set up a repayment plan to catch up on missed payments over time?');
  addBullet('Is forbearance available? How long would it last and what would happen after?');
  addBullet('What documents do I need to provide to apply for these programs?');
  doc.moveDown(0.8);

  addSubsectionHeader('About Next Steps');
  addBullet('What happens next in the foreclosure process if I don\'t cure the default?');
  addBullet('Can foreclosure proceedings be paused while my application is being reviewed?');
  addBullet('How long does it typically take to review a loan modification application?');
  addBullet('Will I be assigned a single point of contact, or will I speak with different representatives?');
  addBullet('What\'s the best way to follow up: phone, email, or online portal?');
  doc.moveDown(0.8);

  addTipBox('If the representative can\'t answer a question, ask when you can expect a callback with the information.');

  // Explaining Your Financial Hardship
  addSectionHeader('Explaining Your Financial Hardship', accentColor);
  addBodyText('Be honest and clear about why you fell behind. Use this framework:');
  doc.moveDown(0.3);

  addQuote('"I fell behind on my mortgage because [REASON: job loss, medical emergency, divorce, reduced income, etc.]. This happened [TIMEFRAME: three months ago, last year, etc.]. Since then, [WHAT YOU\'VE DONE: I\'ve found new employment, my medical situation has stabilized, I\'ve cut expenses, etc.]. I\'m now in a position to [YOUR PLAN: resume payments, make partial payments, catch up over time, etc.], and I\'m committed to keeping my home."');

  addBodyText('Key points to emphasize:');
  addBullet('The hardship was temporary or is improving');
  addBullet('You\'ve taken steps to address the underlying issue');
  addBullet('You\'re committed to working with them to find a solution');
  addBullet('You want to keep your home if possible');
  doc.moveDown(0.8);

  addTipBox('Avoid making promises you can\'t keep. Be realistic about what you can afford.');

  // PAGE 3: Documenting Your Call
  doc.addPage();

  addSectionHeader('Documenting Your Call', primaryColor);
  addBodyText('Keep a detailed record of every conversation with your servicer:');
  doc.moveDown(0.5);

  addSubsectionHeader('Call Log Template');
  doc.moveDown(0.3);

  // Call log form
  const formX = doc.x;
  const formY = doc.y;
  doc.fontSize(9).fillColor('#000000').font('Helvetica');
  
  doc.text('Date: _______________', formX, formY);
  doc.text('Time: _______________', formX + 200, formY);
  doc.moveDown(0.5);
  
  doc.text('Servicer Name: _____________________________________');
  doc.moveDown(0.5);
  doc.text('Representative Name: _______________________________');
  doc.moveDown(0.5);
  doc.text('Employee ID: _______________________________________');
  doc.moveDown(0.5);
  doc.text('Department: ________________________________________');
  doc.moveDown(0.8);
  
  doc.text('Purpose of Call:');
  doc.moveDown(0.3);
  doc.text('________________________________________________________________');
  doc.moveDown(0.3);
  doc.text('________________________________________________________________');
  doc.moveDown(0.8);
  
  doc.text('Key Points Discussed:');
  doc.moveDown(0.3);
  doc.text('________________________________________________________________');
  doc.moveDown(0.3);
  doc.text('________________________________________________________________');
  doc.moveDown(0.3);
  doc.text('________________________________________________________________');
  doc.moveDown(0.3);
  doc.text('________________________________________________________________');
  doc.moveDown(0.8);
  
  doc.text('Action Items / Next Steps:');
  doc.moveDown(0.3);
  doc.text('________________________________________________________________');
  doc.moveDown(0.3);
  doc.text('________________________________________________________________');
  doc.moveDown(0.8);
  
  doc.text('Follow-Up Required: ☐ Yes ☐ No');
  doc.moveDown(0.5);
  doc.text('Follow-Up Date: ____________________');
  doc.moveDown(1);

  addTipBox('After the call, send a follow-up email or letter summarizing what was discussed and agreed upon.');

  // PAGE 4: Follow-Up Letter Template
  doc.addPage();

  addSectionHeader('Follow-Up Letter Template', accentColor);
  addBodyText('Send this letter via certified mail with return receipt requested:');
  doc.moveDown(0.5);

  doc.fontSize(9).fillColor('#4B5563').font('Helvetica');
  doc.text('[Your Name]');
  doc.text('[Your Address]');
  doc.text('[City, State ZIP]');
  doc.text('[Date]');
  doc.moveDown(0.5);
  doc.text('[Servicer Name]');
  doc.text('Loss Mitigation Department');
  doc.text('[Servicer Address]');
  doc.moveDown(0.5);
  doc.text('Re: Loan Number [YOUR LOAN NUMBER]');
  doc.moveDown(0.5);
  doc.text('Dear Loss Mitigation Team,');
  doc.moveDown(0.5);
  doc.text('I am writing to follow up on my phone conversation with [REPRESENTATIVE NAME] on [DATE] regarding my mortgage account [LOAN NUMBER]. During our conversation, we discussed [SUMMARY OF DISCUSSION].');
  doc.moveDown(0.5);
  doc.text('As discussed, I understand that [NEXT STEPS AGREED UPON]. I am committed to [YOUR COMMITMENT].');
  doc.moveDown(0.5);
  doc.text('Please confirm receipt of this letter and let me know if you need any additional information from me.');
  doc.moveDown(0.5);
  doc.text('Thank you for your time and assistance.');
  doc.moveDown(0.5);
  doc.text('Sincerely,');
  doc.moveDown(0.8);
  doc.text('[Your Signature]');
  doc.text('[Your Printed Name]');
  doc.moveDown(1.5);

  // PAGE 5: Hardship Letter Template
  doc.addPage();

  addSectionHeader('Hardship Letter Template', accentColor);
  addBodyText('Include this letter with your loan modification application:');
  doc.moveDown(0.5);

  doc.fontSize(9).fillColor('#4B5563').font('Helvetica');
  doc.text('[Your Name]');
  doc.text('[Your Address]');
  doc.text('[City, State ZIP]');
  doc.text('[Date]');
  doc.moveDown(0.5);
  doc.text('[Servicer Name]');
  doc.text('Loss Mitigation Department');
  doc.text('[Servicer Address]');
  doc.moveDown(0.5);
  doc.text('Re: Request for Loan Modification - Loan Number [YOUR LOAN NUMBER]');
  doc.moveDown(0.5);
  doc.text('Dear Loss Mitigation Team,');
  doc.moveDown(0.5);
  doc.text('I am writing to request a loan modification for my mortgage at [PROPERTY ADDRESS]. I have fallen behind on my payments due to [SPECIFIC HARDSHIP: job loss, medical emergency, divorce, etc.].');
  doc.moveDown(0.5);
  doc.text('[EXPLAIN YOUR HARDSHIP IN DETAIL: When it happened, how it affected your income, what steps you\'ve taken to address it.]');
  doc.moveDown(0.5);
  doc.text('I am now in a position to resume making mortgage payments because [EXPLANATION: new job, recovered health, reduced expenses, etc.]. However, I cannot afford the current payment amount of $[CURRENT PAYMENT]. Based on my current income and expenses, I can afford a monthly payment of approximately $[AFFORDABLE AMOUNT].');
  doc.moveDown(0.5);
  doc.text('I am requesting a loan modification that would [WHAT YOU\'RE ASKING FOR: reduce my interest rate, extend the loan term, capitalize the arrears, etc.] to make my payments affordable and allow me to keep my home.');
  doc.moveDown(0.5);
  doc.text('I have attached the following documents to support my request: [LIST DOCUMENTS: pay stubs, bank statements, tax returns, etc.].');
  doc.moveDown(0.5);
  doc.text('I am committed to working with you to find a solution that allows me to keep my home and resume regular payments. Please contact me at [PHONE NUMBER] or [EMAIL] if you need any additional information.');
  doc.moveDown(0.5);
  doc.text('Thank you for your consideration.');
  doc.moveDown(0.5);
  doc.text('Sincerely,');
  doc.moveDown(0.8);
  doc.text('[Your Signature]');
  doc.text('[Your Printed Name]');

  // PAGE 6: Best Practices
  doc.addPage();

  addSectionHeader('Best Practices for Lender Communication', primaryColor);
  doc.moveDown(0.5);

  addSubsectionHeader('DO:');
  addBullet('Call as soon as you receive a Notice of Default or miss a payment');
  addBullet('Be honest about your financial situation');
  addBullet('Take detailed notes during every call');
  addBullet('Follow up in writing after important phone conversations');
  addBullet('Keep copies of all letters, emails, and documents you send');
  addBullet('Send important documents via certified mail with return receipt');
  addBullet('Respond promptly to requests for information or documentation');
  addBullet('Stay calm and professional, even if you\'re frustrated');
  addBullet('Ask for clarification if you don\'t understand something');
  doc.moveDown(0.8);

  addSubsectionHeader('DON\'T:');
  addBullet('Ignore calls, letters, or emails from your servicer');
  addBullet('Make promises you can\'t keep about payment amounts or dates');
  addBullet('Provide false information about your income or expenses');
  addBullet('Agree to anything you don\'t fully understand');
  addBullet('Send payments without confirming where they should be applied');
  addBullet('Assume verbal agreements are binding (get it in writing)');
  addBullet('Give up if your first request is denied (ask about other options)');
  doc.moveDown(1);

  // Red Flags
  addSectionHeader('Red Flags: When to Get Help', '#DC2626');
  addBodyText('Contact a HUD-approved housing counselor or attorney if:');
  doc.moveDown(0.3);

  addBullet('Your servicer refuses to discuss foreclosure prevention options');
  addBullet('You\'re told conflicting information by different representatives');
  addBullet('Your application is denied without a clear explanation');
  addBullet('You\'re being charged fees that seem excessive or unexplained');
  addBullet('Your servicer loses your documents repeatedly');
  addBullet('You\'re told you must be in default to qualify for a modification');
  addBullet('Foreclosure proceedings continue despite an active application');

  // PAGE 7: Additional Resources
  doc.addPage();

  addSectionHeader('Additional Resources', accentColor);
  doc.moveDown(0.5);

  addSubsectionHeader('HUD-Approved Housing Counselors');
  addBodyText('Find free, expert help at:');
  doc.fontSize(10).fillColor(accentColor).font('Helvetica').text('www.hud.gov/findacounselor');
  doc.fontSize(10).fillColor('#000000').font('Helvetica').text('Phone: 1-800-569-4287');
  doc.moveDown(1);

  addSubsectionHeader('Consumer Financial Protection Bureau (CFPB)');
  addBodyText('File a complaint:');
  doc.fontSize(10).fillColor(accentColor).font('Helvetica').text('www.consumerfinance.gov/complaint');
  doc.fontSize(10).fillColor('#000000').font('Helvetica').text('Phone: 1-855-411-CFPB (1-855-411-2372)');
  doc.moveDown(1);

  addSubsectionHeader('EnterActDFW - Licensed Texas Real Estate Brokerage');
  addBodyText('If you\'re considering selling to avoid foreclosure, we offer free consultations and fair cash offers.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#000000').font('Helvetica')
    .text('Phone: (832) 932-7585')
    .text('Email: info@enteractdfw.com')
    .text('Address: 4400 State Hwy 121, Suite 300, Lewisville, TX 75056');
  doc.moveDown(2);

  // Legal Disclaimer
  doc.rect(doc.x - 10, doc.y, doc.page.width - 100, 60)
    .fillAndStroke('#F3F4F6', '#9CA3AF');
  doc.fillColor('#374151').fontSize(8).font('Helvetica-Oblique')
    .text('Legal Disclaimer: This guide is for informational purposes only and does not constitute legal advice. Consult with a HUD-approved housing counselor or licensed attorney for advice specific to your situation. EnterActDFW is a licensed Texas real estate brokerage and is not a law firm or housing counseling agency.',
      doc.x, doc.y + 10, { width: doc.page.width - 120, align: 'justify' });

  return doc;
}
