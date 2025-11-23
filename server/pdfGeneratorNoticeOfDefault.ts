import PDFDocument from 'pdfkit';

export function generateNoticeOfDefaultPDF(): typeof PDFDocument.prototype {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: 'Notice of Default Action Checklist - EnterActDFW',
      Author: 'EnterActDFW',
      Subject: 'Step-by-step checklist for responding to a Notice of Default',
    }
  });

  // Brand colors
  const primaryColor = '#0A2342';
  const accentColor = '#00A6A6';
  const urgentColor = '#DC2626';

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

  const addCheckbox = (text: string, isUrgent: boolean = false) => {
    const x = doc.x;
    const y = doc.y;
    
    // Draw checkbox
    doc.rect(x, y, 12, 12).stroke('#000000');
    
    // Add text
    const textColor = isUrgent ? urgentColor : '#000000';
    doc.fontSize(10).fillColor(textColor).font('Helvetica')
      .text(text, x + 20, y, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 25 });
    doc.moveDown(0.4);
  };

  // Title Page
  doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
    .text('Notice of Default', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(18).fillColor(primaryColor).font('Helvetica')
    .text('Action Checklist', { align: 'center' });
  doc.moveDown(0.5);
  
  doc.fontSize(14).fillColor(accentColor).font('Helvetica')
    .text('Your Step-by-Step Guide to Responding', { align: 'center' });
  doc.moveDown(1.5);

  // Urgent Alert Box
  doc.rect(doc.x - 10, doc.y, doc.page.width - 100, 80)
    .fillAndStroke('#FEE2E2', urgentColor);
  doc.fillColor(urgentColor).fontSize(12).font('Helvetica-Bold')
    .text('⏰ TIME-SENSITIVE', doc.x, doc.y + 10);
  doc.fillColor('#7F1D1D').fontSize(10).font('Helvetica')
    .text('In Texas, you typically have 20 days from receiving a Notice of Default to act before the foreclosure process accelerates. Every day counts. Start with the urgent items marked in red below.', 
      doc.x, doc.y + 5, { width: doc.page.width - 120 });
  doc.moveDown(2);

  // Introduction
  addBodyText('This checklist will guide you through the critical steps you need to take after receiving a Notice of Default. Check off each item as you complete it, and keep this document with your important foreclosure paperwork.');
  doc.moveDown(1);

  // IMMEDIATE ACTIONS (Day 1-2)
  addSectionHeader('IMMEDIATE ACTIONS (Day 1-2)', urgentColor);
  addBodyText('These are the most urgent steps. Complete them within 48 hours of receiving your Notice of Default:');
  doc.moveDown(0.5);

  addCheckbox('Read the entire Notice of Default carefully. Highlight key dates, amounts owed, and deadlines.', true);
  addCheckbox('Verify the amount owed. Check if the total matches your records. Look for any errors in fees, interest, or principal.', true);
  addCheckbox('Note the deadline to cure (reinstate your loan). Mark this date on your calendar and set multiple reminders.', true);
  addCheckbox('Gather all mortgage documents: original loan agreement, payment history, correspondence with your lender.', true);
  addCheckbox('Create a dedicated folder (physical or digital) for all foreclosure-related documents.', true);
  addCheckbox('Contact your mortgage servicer immediately. Call the number on the Notice and request to speak with the Loss Mitigation Department.', true);
  addCheckbox('Ask your servicer: "What are my options to avoid foreclosure?" Take detailed notes during the call.', true);
  addCheckbox('Request a written breakdown of the total amount needed to reinstate your loan.', true);
  doc.moveDown(1);

  // WITHIN THE FIRST WEEK (Day 3-7)
  addSectionHeader('WITHIN THE FIRST WEEK (Day 3-7)', primaryColor);
  addBodyText('Build on your immediate actions with these important next steps:');
  doc.moveDown(0.5);

  addCheckbox('Contact a HUD-approved housing counselor for free, expert advice. Find one at www.hud.gov/findacounselor.');
  addCheckbox('Schedule an appointment with the housing counselor within the next few days.');
  addCheckbox('Prepare for your counseling session: gather income proof, expense records, and all mortgage documents.');
  addCheckbox('Review your household budget. Calculate your true monthly income and expenses.');
  addCheckbox('Identify areas where you can cut expenses or increase income to free up money for mortgage payments.');
  addCheckbox('Research your options: loan modification, repayment plan, forbearance, short sale, or deed in lieu.');
  addCheckbox('If you\'re still employed, contact your HR department about hardship withdrawal options from retirement accounts (use as last resort).');
  addCheckbox('Explore local and state assistance programs for homeowners facing foreclosure.');
  doc.moveDown(1);

  // Add page break
  doc.addPage();

  // COMMUNICATE WITH YOUR LENDER (Day 8-14)
  addSectionHeader('COMMUNICATE WITH YOUR LENDER (Day 8-14)', primaryColor);
  addBodyText('Maintain open, documented communication with your mortgage servicer:');
  doc.moveDown(0.5);

  addCheckbox('Call your servicer again to follow up on your initial conversation. Ask about the status of any applications or requests.');
  addCheckbox('Keep a detailed call log: date, time, representative name, employee ID, and summary of conversation.');
  addCheckbox('Request a loan modification application if that\'s the path you\'re pursuing.');
  addCheckbox('Submit the loan modification application with all required documents (pay stubs, tax returns, bank statements, hardship letter).');
  addCheckbox('Write a hardship letter explaining why you fell behind and how you plan to get back on track.');
  addCheckbox('Follow up in writing (email or certified mail) to confirm any verbal agreements or promises made by your servicer.');
  addCheckbox('Ask for confirmation that your application has been received and is being reviewed.');
  addCheckbox('Request that foreclosure proceedings be paused while your application is under review.');
  doc.moveDown(1);

  // EXPLORE ALL OPTIONS (Day 15-20)
  addSectionHeader('EXPLORE ALL OPTIONS (Day 15-20)', primaryColor);
  addBodyText('Use the remaining time before your deadline to explore every possible solution:');
  doc.moveDown(0.5);

  addCheckbox('If loan modification isn\'t approved, ask about a repayment plan to catch up on missed payments over time.');
  addCheckbox('Inquire about forbearance: temporarily reduced or suspended payments while you get back on your feet.');
  addCheckbox('Consider a short sale if you owe more than your home is worth and can\'t afford to stay.');
  addCheckbox('Explore deed in lieu of foreclosure as a last resort to avoid foreclosure on your credit report.');
  addCheckbox('Consult with a real estate agent about your home\'s current market value.');
  addCheckbox('If selling, contact EnterActDFW for a free, no-obligation cash offer: (832) 932-7585.');
  addCheckbox('Review any offers carefully. Ensure you understand all terms, fees, and timelines.');
  addCheckbox('Consult with your housing counselor or attorney before accepting any offer or signing any agreement.');
  doc.moveDown(1);

  // PROTECT YOURSELF FROM SCAMS
  addSectionHeader('PROTECT YOURSELF FROM SCAMS', urgentColor);
  addBodyText('Be vigilant against foreclosure rescue scams:');
  doc.moveDown(0.5);

  addCheckbox('Never pay upfront fees to anyone promising to save your home.', true);
  addCheckbox('Never sign over the deed to your property to anyone claiming they\'ll "rescue" you.', true);
  addCheckbox('Verify that any counselor or attorney is HUD-approved or state-licensed before working with them.', true);
  addCheckbox('Be wary of anyone who contacts you unsolicited offering foreclosure help.', true);
  addCheckbox('Get everything in writing. Never agree to anything based solely on verbal promises.', true);
  addCheckbox('Report suspected scams to the FTC (reportfraud.ftc.gov) and Texas Attorney General.', true);
  doc.moveDown(1);

  // ONGOING ACTIONS
  addSectionHeader('ONGOING ACTIONS', primaryColor);
  addBodyText('Continue these practices throughout the foreclosure prevention process:');
  doc.moveDown(0.5);

  addCheckbox('Keep copies of everything: letters, emails, faxes, applications, and notes from phone calls.');
  addCheckbox('Send important documents via certified mail with return receipt requested.');
  addCheckbox('Follow up on every application, request, or promise within 3-5 business days.');
  addCheckbox('Stay in regular contact with your housing counselor for guidance and support.');
  addCheckbox('Continue making partial payments if you can\'t afford the full amount (check with your servicer first).');
  addCheckbox('Keep your servicer informed of any changes in your financial situation.');
  addCheckbox('Respond promptly to any requests for additional information or documentation.');
  addCheckbox('Stay organized. Update your foreclosure folder regularly with new documents and notes.');
  doc.moveDown(1.5);

  // Add page break
  doc.addPage();

  // IMPORTANT CONTACTS
  addSectionHeader('Important Contacts & Resources', accentColor);
  doc.moveDown(0.5);

  addSubsectionHeader('Your Mortgage Servicer');
  addBodyText('Company Name: _________________________________________________');
  addBodyText('Phone Number: _________________________________________________');
  addBodyText('Loss Mitigation Dept: __________________________________________');
  addBodyText('Account/Loan Number: __________________________________________');
  doc.moveDown(1);

  addSubsectionHeader('HUD-Approved Housing Counselor');
  addBodyText('Counselor Name: _______________________________________________');
  addBodyText('Agency: _______________________________________________________');
  addBodyText('Phone Number: _________________________________________________');
  addBodyText('Email: ________________________________________________________');
  addBodyText('Next Appointment: ______________________________________________');
  doc.moveDown(1);

  addSubsectionHeader('Attorney (if applicable)');
  addBodyText('Attorney Name: ________________________________________________');
  addBodyText('Firm: _________________________________________________________');
  addBodyText('Phone Number: _________________________________________________');
  addBodyText('Email: ________________________________________________________');
  doc.moveDown(1);

  addSubsectionHeader('EnterActDFW - Licensed Texas Real Estate Brokerage');
  addBodyText('Phone: (832) 932-7585');
  addBodyText('Email: info@enteractdfw.com');
  addBodyText('Address: 4440 State Hwy 121, Suite 300, Lewisville, TX 75056');
  addBodyText('Website: www.enteractdfw.com');
  doc.moveDown(1.5);

  // KEY DATES
  addSectionHeader('Key Dates & Deadlines', urgentColor);
  doc.moveDown(0.5);

  addBodyText('Date Notice of Default Received: ________________________________');
  addBodyText('Deadline to Cure/Reinstate Loan: ________________________________');
  addBodyText('Total Amount Needed to Reinstate: $______________________________');
  addBodyText('Foreclosure Sale Date (if scheduled): ____________________________');
  addBodyText('Loan Modification Application Submitted: _________________________');
  addBodyText('Expected Decision Date: _________________________________________');
  doc.moveDown(1.5);

  // NOTES SECTION
  addSectionHeader('Notes & Action Items', primaryColor);
  doc.moveDown(0.5);

  // Draw lined note area
  for (let i = 0; i < 15; i++) {
    const y = doc.y;
    doc.moveTo(doc.x, y).lineTo(doc.page.width - doc.page.margins.right, y).stroke('#CCCCCC');
    doc.moveDown(0.8);
  }

  doc.moveDown(1);

  // Legal Disclaimer
  doc.rect(doc.x - 10, doc.y, doc.page.width - 100, 70)
    .fillAndStroke('#F3F4F6', '#9CA3AF');
  doc.fillColor('#374151').fontSize(8).font('Helvetica-Oblique')
    .text('Legal Disclaimer: This checklist is for informational purposes only and does not constitute legal advice. Every foreclosure situation is unique. Consult with a HUD-approved housing counselor or licensed attorney for advice specific to your circumstances. EnterActDFW is a licensed Texas real estate brokerage (TREC License #9013257) and is not a law firm or housing counseling agency.',
      doc.x, doc.y + 10, { width: doc.page.width - 120, align: 'justify' });

  return doc;
}
