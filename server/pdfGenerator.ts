import PDFDocument from 'pdfkit';

export function generateAvoidingScamsPDF(): typeof PDFDocument.prototype {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: 'Avoiding Foreclosure Scams - EnterActDFW Guide',
      Author: 'EnterActDFW',
      Subject: 'Foreclosure Scam Prevention Guide',
    }
  });

  // Brand colors
  const primaryColor = '#0A2342';
  const accentColor = '#00A6A6';
  const warningColor = '#DC2626';

  // Helper function for section headers
  const addSectionHeader = (text: string, color: string = primaryColor) => {
    doc.fontSize(18).fillColor(color).font('Helvetica-Bold').text(text, { align: 'left' });
    doc.moveDown(0.5);
  };

  // Helper function for subsection headers
  const addSubsectionHeader = (text: string) => {
    doc.fontSize(14).fillColor(primaryColor).font('Helvetica-Bold').text(text, { align: 'left' });
    doc.moveDown(0.3);
  };

  // Helper function for body text
  const addBodyText = (text: string) => {
    doc.fontSize(10).fillColor('#000000').font('Helvetica').text(text, { align: 'left', lineGap: 2 });
    doc.moveDown(0.5);
  };

  // Helper function for bullet points
  const addBullet = (text: string, symbol: string = '•') => {
    const x = doc.x;
    doc.fontSize(10).fillColor('#000000').font('Helvetica').text(symbol, x, doc.y);
    doc.text(text, x + 15, doc.y - 10, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 15 });
    doc.moveDown(0.3);
  };

  // Title Page
  doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
    .text('Avoiding Foreclosure Scams', { align: 'center' });
  doc.moveDown(0.5);
  
  doc.fontSize(14).fillColor(accentColor).font('Helvetica')
    .text('A Comprehensive Guide to Protecting Yourself', { align: 'center' });
  doc.moveDown(1);

  // Warning Box
  doc.rect(doc.x - 10, doc.y, doc.page.width - 100, 60)
    .fillAndStroke('#FEE2E2', warningColor);
  doc.fillColor(warningColor).fontSize(12).font('Helvetica-Bold')
    .text('⚠ WARNING', doc.x, doc.y + 10);
  doc.fillColor('#7F1D1D').fontSize(10).font('Helvetica')
    .text('Never pay upfront fees to anyone who promises to save your home from foreclosure. Legitimate HUD-approved housing counselors provide free services.', 
      doc.x, doc.y + 5, { width: doc.page.width - 120 });
  doc.moveDown(2);

  // Introduction
  addBodyText('When you\'re facing foreclosure, you\'re vulnerable to predatory companies and scammers who prey on homeowners in distress. This guide will help you recognize common scams, protect yourself, and find legitimate help.');
  doc.moveDown(1);

  // Common Foreclosure Scams
  addSectionHeader('Common Foreclosure Scams', primaryColor);
  
  // Scam 1
  addSubsectionHeader('1. Phantom Help Scams');
  addBodyText('How it works: A company contacts you claiming they can negotiate with your lender or get a loan modification for you—but only if you pay them a large upfront fee (often $1,500 to $3,000 or more).');
  addBodyText('The reality: After you pay, they disappear without doing any work, or they submit incomplete paperwork that your lender rejects. You\'ve lost money and wasted precious time.');
  doc.fontSize(10).fillColor(warningColor).font('Helvetica-Bold').text('Red Flag: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Any company that demands payment before providing services or guarantees they can stop your foreclosure.');
  doc.moveDown(1);

  // Scam 2
  addSubsectionHeader('2. Deed/Title Transfer Fraud');
  addBodyText('How it works: A scammer convinces you to sign over the deed to your home, claiming they\'ll handle the foreclosure and let you stay as a renter. They promise you can buy the house back later.');
  addBodyText('The reality: Once they have the deed, they either sell your home to someone else, take out loans against it, or evict you. You lose your home and any equity you had.');
  doc.fontSize(10).fillColor(warningColor).font('Helvetica-Bold').text('Red Flag: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Anyone who asks you to transfer your deed or title while promising you can stay in the home or buy it back later.');
  doc.moveDown(1);

  // Scam 3
  addSubsectionHeader('3. Rent-to-Buy Schemes');
  addBodyText('How it works: A company offers to "rescue" you by buying your home and renting it back to you with an option to repurchase. They set inflated rent payments and unrealistic buyback terms.');
  addBodyText('The reality: The rent is set so high you can\'t afford it, or the buyback price is inflated beyond market value. When you can\'t keep up with payments, you\'re evicted and lose your home permanently.');
  doc.fontSize(10).fillColor(warningColor).font('Helvetica-Bold').text('Red Flag: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Rent amounts that are higher than your current mortgage payment, or buyback terms that seem impossible to meet.');
  doc.moveDown(1);

  // Scam 4
  addSubsectionHeader('4. Bankruptcy Foreclosure Scams');
  addBodyText('How it works: A scammer advises you to file for bankruptcy to stop the foreclosure, then charges you excessive fees for services that don\'t help your situation.');
  addBodyText('The reality: While bankruptcy can temporarily halt foreclosure through an automatic stay, it\'s not always the right solution. Scammers file incomplete or improper paperwork, leaving you worse off than before.');
  doc.fontSize(10).fillColor(warningColor).font('Helvetica-Bold').text('Red Flag: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Anyone who pushes bankruptcy as the only solution without reviewing your full financial situation, or who isn\'t a licensed attorney.');
  doc.moveDown(1);

  // Add page break
  doc.addPage();

  // Scam 5
  addSubsectionHeader('5. Forensic Loan Audit Scams');
  addBodyText('How it works: Companies offer to perform a "forensic loan audit" for a fee, claiming they\'ll find legal violations in your mortgage that will stop the foreclosure or get your loan canceled.');
  addBodyText('The reality: These audits rarely produce actionable results, and even if violations are found, they typically don\'t stop foreclosure. You pay hundreds or thousands of dollars for a useless report.');
  doc.fontSize(10).fillColor(warningColor).font('Helvetica-Bold').text('Red Flag: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Guarantees that an audit will stop your foreclosure or eliminate your mortgage debt.');
  doc.moveDown(1);

  // Scam 6
  addSubsectionHeader('6. Government Program Impersonators');
  addBodyText('How it works: Scammers claim to represent government programs like HAMP (Home Affordable Modification Program) or other federal assistance programs, charging fees to "expedite" your application.');
  addBodyText('The reality: Government foreclosure prevention programs are free. No legitimate government agency will charge you to apply or participate.');
  doc.fontSize(10).fillColor(warningColor).font('Helvetica-Bold').text('Red Flag: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Anyone claiming to represent a government program who asks for payment or personal financial information upfront.');
  doc.moveDown(1.5);

  // Warning Signs
  addSectionHeader('Warning Signs & Red Flags', warningColor);
  addBodyText('Protect yourself by watching for these common warning signs:');
  
  const redFlags = [
    'They demand large upfront fees before providing any services',
    'They guarantee they can stop your foreclosure or save your home',
    'They pressure you to sign documents without reading them or getting legal advice',
    'They tell you to stop communicating with your lender or attorney',
    'They ask you to make mortgage payments directly to them instead of your lender',
    'They ask you to sign over the deed or title to your property',
    'They use high-pressure sales tactics or create a false sense of urgency',
    'They contact you unsolicited via phone, email, or door-to-door',
    'They have no verifiable business address or professional credentials',
    'They claim to have a "special relationship" with your lender'
  ];

  redFlags.forEach(flag => addBullet(flag, '✗'));
  doc.moveDown(1);

  // Green Flags
  addSubsectionHeader('Green Flags - Look For These:');
  const greenFlags = [
    'They are HUD-approved housing counselors (verify at HUD.gov)',
    'They provide free or low-cost services',
    'They encourage you to stay in contact with your lender',
    'They explain all your options without pushing one specific solution',
    'They give you time to review documents and seek legal advice',
    'They have verifiable credentials (licensed attorney, certified counselor)',
    'They provide written agreements and clear fee structures',
    'They have positive reviews and references you can verify',
    'They are transparent about what they can and cannot do',
    'They respect your questions and concerns without defensiveness'
  ];

  greenFlags.forEach(flag => addBullet(flag, '✓'));
  doc.moveDown(1);

  // Add page break
  doc.addPage();

  // How to Verify Legitimate Help
  addSectionHeader('How to Verify Legitimate Help', accentColor);
  addBodyText('Before working with anyone who offers foreclosure assistance, take these steps:');
  doc.moveDown(0.5);

  addSubsectionHeader('1. Check HUD\'s Approved Counselor List');
  addBodyText('The U.S. Department of Housing and Urban Development (HUD) maintains a list of approved housing counseling agencies. Visit www.hud.gov/findacounselor to verify.');
  doc.moveDown(0.5);

  addSubsectionHeader('2. Verify Attorney Credentials');
  addBodyText('If working with an attorney, verify they are licensed to practice law in Texas through the State Bar of Texas at www.texasbar.com/findalawyer.');
  doc.moveDown(0.5);

  addSubsectionHeader('3. Check for Complaints');
  addBodyText('Search for complaints filed against the company through the Better Business Bureau (www.bbb.org) and Texas Attorney General\'s office.');
  doc.moveDown(0.5);

  addSubsectionHeader('4. Ask for References');
  addBodyText('Legitimate professionals should provide references from past clients. Contact these references and ask about their experience.');
  doc.moveDown(0.5);

  addSubsectionHeader('5. Get Everything in Writing');
  addBodyText('Never agree to anything verbally. Legitimate companies will provide written contracts that clearly outline services, fees, timelines, and your rights to cancel.');
  doc.moveDown(1.5);

  // How to Report Scams
  addSectionHeader('How to Report Foreclosure Scams', primaryColor);
  addBodyText('If you believe you\'ve been targeted by a scam, report it immediately:');
  doc.moveDown(0.5);

  addSubsectionHeader('Federal Trade Commission (FTC)');
  addBodyText('Website: reportfraud.ftc.gov | Phone: 1-877-FTC-HELP (1-877-382-4357)');
  doc.moveDown(0.5);

  addSubsectionHeader('Consumer Financial Protection Bureau (CFPB)');
  addBodyText('Website: consumerfinance.gov/complaint | Phone: 1-855-411-CFPB (1-855-411-2372)');
  doc.moveDown(0.5);

  addSubsectionHeader('Texas Attorney General - Consumer Protection Division');
  addBodyText('Website: texasattorneygeneral.gov/consumer-protection | Phone: 1-800-621-0508');
  doc.moveDown(0.5);

  addSubsectionHeader('Texas Department of Savings and Mortgage Lending');
  addBodyText('Website: sml.texas.gov | Phone: 1-877-276-5550');
  doc.moveDown(1.5);

  // What to Do If Scammed
  addSectionHeader('What to Do If You\'ve Been Scammed', warningColor);
  addBodyText('If you realize you\'ve been the victim of a foreclosure scam, take immediate action:');
  doc.moveDown(0.5);

  const scamSteps = [
    { title: '1. Stop All Communication and Payments', text: 'Immediately cease all contact with the scammer and stop making any payments to them. Do not sign any additional documents.' },
    { title: '2. Contact Your Mortgage Servicer Immediately', text: 'Call your lender or servicer right away to explain the situation. They need to know if someone has been impersonating you or submitting fraudulent documents on your behalf.' },
    { title: '3. File Reports with Authorities', text: 'Report the scam to the FTC, CFPB, Texas Attorney General, and local law enforcement. The more reports filed, the better chance authorities have of stopping the scammers.' },
    { title: '4. Consult with a Licensed Attorney', text: 'Speak with a real estate attorney who can review any documents you signed and advise you on your legal options. You may be able to void fraudulent contracts or recover losses.' },
    { title: '5. Check Your Credit Report', text: 'If you provided personal information to scammers, monitor your credit report for unauthorized activity. Consider placing a fraud alert or credit freeze.' },
    { title: '6. Seek Legitimate Help', text: 'Contact a HUD-approved housing counselor for free assistance. They can help you explore legitimate options to save your home or transition out of it safely.' }
  ];

  scamSteps.forEach(step => {
    addSubsectionHeader(step.title);
    addBodyText(step.text);
    doc.moveDown(0.3);
  });

  // Add page break
  doc.addPage();

  // About EnterActDFW
  addSectionHeader('How EnterActDFW Can Help You Safely', accentColor);
  addBodyText('At EnterActDFW, we\'re a licensed Texas real estate brokerage with a transparent, ethical approach to helping homeowners facing foreclosure. We never charge upfront fees, and we always put your interests first.');
  doc.moveDown(0.5);

  const services = [
    { title: 'Free Consultation', text: 'We\'ll review your situation at no cost and explain all your options honestly—including options that don\'t involve us.' },
    { title: 'Fair Cash Offers', text: 'If selling is your best option, we provide fair, transparent cash offers with no hidden fees or obligations.' },
    { title: 'Licensed & Verified', text: 'We\'re licensed by the Texas Real Estate Commission (TREC) and maintain full transparency in all our dealings.' },
    { title: 'Local DFW Experts', text: 'We\'ve been serving the Dallas-Fort Worth community since 2015 and have helped over 200 families navigate foreclosure.' }
  ];

  services.forEach(service => {
    doc.fontSize(11).fillColor(accentColor).font('Helvetica-Bold').text(service.title, { continued: true });
    doc.fontSize(10).fillColor('#000000').font('Helvetica').text(': ' + service.text);
    doc.moveDown(0.5);
  });

  doc.moveDown(1);
  doc.fontSize(11).fillColor(primaryColor).font('Helvetica-Bold').text('Contact Us:');
  doc.fontSize(10).fillColor('#000000').font('Helvetica')
    .text('Phone: (832) 932-7585')
    .text('Email: info@enteractdfw.com')
    .text('Address: 4440 State Hwy 121, Suite 300, Lewisville, TX 75056');
  doc.moveDown(2);

  // Legal Disclaimer
  doc.rect(doc.x - 10, doc.y, doc.page.width - 100, 80)
    .fillAndStroke('#F3F4F6', '#9CA3AF');
  doc.fillColor('#374151').fontSize(8).font('Helvetica-Oblique')
    .text('Legal Disclaimer: This information is for educational purposes only and is not legal advice. If you believe you\'ve been the victim of fraud or need legal assistance, consult with a licensed attorney. EnterActDFW is a licensed Texas real estate brokerage and is not a law firm or housing counseling agency.',
      doc.x, doc.y + 10, { width: doc.page.width - 120, align: 'justify' });

  // Note: Footer will be added when PDF is finalized
  // PDFKit doesn't support adding footers to all pages after content is added
  // in the current implementation

  return doc;
}
