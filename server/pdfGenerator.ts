import PDFDocument from 'pdfkit';
import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';

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
  doc.moveDown(0.5);

  addSubsectionHeader('Local Law Enforcement');
  addBodyText('For criminal fraud cases: Contact your local police department or sheriff\'s office to file a report if you believe you\'ve been the victim of criminal fraud.');
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
    .text('Phone: (844) 981-2937')
    .text('Email: info@enteractdfw.com')
    .text('Address: 4400 State Hwy 121, Suite 300, Lewisville, TX 75056');
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


export function generateForeclosureGuidePDF(): typeof PDFDocument.prototype {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: 'Texas Foreclosure Survival Guide - EnterActDFW',
      Author: 'EnterActDFW Real Estate Brokerage',
      Subject: 'Foreclosure Prevention and Options Guide',
    }
  });

  // Brand colors
  const primaryColor = '#0A2342';
  const accentColor = '#00A6A6';
  const warningColor = '#DC2626';

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

  const addBullet = (text: string, symbol: string = '•') => {
    const x = doc.x;
    doc.fontSize(10).fillColor('#000000').font('Helvetica').text(symbol, x, doc.y);
    doc.text(text, x + 15, doc.y - 10, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 15 });
    doc.moveDown(0.3);
  };

  // Title Page
  doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
    .text('Texas Foreclosure Survival Guide', { align: 'center' });
  doc.moveDown(0.5);
  
  doc.fontSize(14).fillColor(accentColor).font('Helvetica')
    .text('Your Complete Resource for Understanding Your Rights and Options', { align: 'center' });
  doc.moveDown(2);

  // Introduction
  addBodyText('Facing foreclosure can feel overwhelming and isolating. This guide was created to help Texas homeowners understand the foreclosure process, know their rights, and explore all available options. Whether you\'ve just received your first notice or are weeks away from a foreclosure sale, you have options—and you\'re not alone.');
  doc.moveDown(1);

  // Understanding Foreclosure in Texas
  addSectionHeader('Understanding Foreclosure in Texas', primaryColor);
  addBodyText('Foreclosure is the legal process by which a lender takes possession of a property when the homeowner fails to make mortgage payments. In Texas, most foreclosures are non-judicial, meaning they do not require court involvement and can proceed relatively quickly compared to other states.');
  doc.moveDown(1);

  addSubsectionHeader('Texas Foreclosure Timeline');
  addBodyText('The typical foreclosure process in Texas follows these stages:');
  doc.moveDown(0.5);

  const timelineSteps = [
    'Missed Payment (Day 1): First payment is missed',
    'Notice of Default (30-60 days): Lender notifies you of default',
    'Notice of Acceleration (60-90 days): Entire loan balance becomes due',
    'Notice of Sale Posted (90-120 days): Property posted for auction (21 days\' notice)',
    'Foreclosure Sale (120+ days): Property sold at courthouse auction',
    'Eviction (130+ days): New owner takes possession'
  ];

  timelineSteps.forEach(step => addBullet(step));
  doc.moveDown(1);

  // Add page break
  doc.addPage();

  // Your Rights
  addSectionHeader('Your Rights as a Texas Homeowner', accentColor);
  addBodyText('Even when facing foreclosure, you have important legal rights and protections under federal and Texas state law.');
  doc.moveDown(0.5);

  addSubsectionHeader('Federal Protections');
  const federalProtections = [
    'Servicemembers Civil Relief Act (SCRA): Special protections for active-duty military',
    'Fair Debt Collection Practices Act (FDCPA): Protection from abusive collection practices',
    'Real Estate Settlement Procedures Act (RESPA): Servicer must respond to written requests',
    'Homeowner Assistance Fund (HAF): Potential federal/state assistance programs'
  ];
  federalProtections.forEach(protection => addBullet(protection));
  doc.moveDown(0.5);

  addSubsectionHeader('Texas-Specific Protections');
  const texasProtections = [
    'Right to Reinstate: Cure default by paying past-due amounts until day before sale',
    'Notice Requirements: Lenders must provide specific notices at specific times',
    'Homestead Exemption: Strong protections for primary residence',
    'Deficiency Judgment Limitations: Limits on when lenders can pursue deficiency',
    'Limited Right of Redemption: Available for property tax foreclosures only'
  ];
  texasProtections.forEach(protection => addBullet(protection));
  doc.moveDown(1);

  // Options to Avoid Foreclosure
  addSectionHeader('Options to Avoid Foreclosure', primaryColor);
  addBodyText('You have several options to avoid foreclosure, even if you are already behind on payments. The best option depends on your financial situation, your goals, and how much time you have.');
  doc.moveDown(1);

  // Option 1: Loan Modification
  addSubsectionHeader('1. Loan Modification');
  addBodyText('A loan modification changes the terms of your existing mortgage to make your payments more affordable.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Who it\'s for: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Homeowners who want to keep their home and can afford modified payments.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Pros: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Allows you to keep your home, can significantly reduce monthly payments, stops foreclosure if approved.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Cons: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Not guaranteed, requires proof of hardship, may extend loan life and increase total interest.');
  doc.moveDown(1);

  // Option 2: Forbearance
  addSubsectionHeader('2. Forbearance Agreement');
  addBodyText('A forbearance agreement temporarily reduces or suspends your mortgage payments for a specific period (typically 3-12 months) while you recover from a financial hardship.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Who it\'s for: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Homeowners experiencing a temporary financial setback who expect to recover within a few months.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Pros: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Provides immediate relief, stops foreclosure during forbearance period, doesn\'t require selling home.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Cons: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Payments only postponed not forgiven, must have plan to repay missed amounts after forbearance ends.');
  doc.moveDown(1);

  // Add page break
  doc.addPage();

  // Option 3: Short Sale
  addSubsectionHeader('3. Short Sale');
  addBodyText('A short sale occurs when you sell your home for less than the amount you owe on the mortgage, and the lender agrees to accept the sale proceeds as full or partial satisfaction of the debt.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Who it\'s for: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Homeowners who can no longer afford their home, owe more than the home is worth, and want to avoid foreclosure.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Pros: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Avoids foreclosure and its credit impact, may avoid deficiency judgment, allows you to move on with less damage.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Cons: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('You lose your home, lender must approve sale price, can be lengthy and uncertain process.');
  doc.moveDown(1);

  // Option 4: Cash Sale
  addSubsectionHeader('4. Sell Your Home for Cash (Fast Sale)');
  addBodyText('If you need to sell quickly to avoid foreclosure, selling your home to a cash buyer (such as a real estate investor or iBuyer) can provide a fast solution.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Who it\'s for: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Homeowners who need to sell immediately, have some equity, and want to avoid the lengthy short sale process.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Timeline: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Cash sales can close in as little as 7-10 days.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Pros: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Very fast, no need for lender approval (if you have equity), avoids foreclosure and credit damage, you may receive cash from your equity.');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('Cons: ', { continued: true });
  doc.font('Helvetica').fillColor('#000000').text('Cash offers typically below market value, you lose your home, only works if you have equity or can cover the difference.');
  doc.moveDown(0.5);

  // Highlight EnterActDFW
  doc.rect(doc.x - 10, doc.y, doc.page.width - 100, 40)
    .fillAndStroke('#EFF6FF', accentColor);
  doc.fillColor(accentColor).fontSize(11).font('Helvetica-Bold')
    .text('EnterActDFW specializes in fast, fair cash offers for homeowners facing foreclosure.', doc.x, doc.y + 10, { width: doc.page.width - 120 });
  doc.fillColor('#000000').fontSize(10).font('Helvetica')
    .text('We can close in as little as 7 days and help you move forward with dignity.', doc.x, doc.y + 5, { width: doc.page.width - 120 });
  doc.moveDown(2);

  // Immediate Action Steps
  addSectionHeader('Immediate Action Steps', warningColor);
  addBodyText('If you are facing foreclosure, time is critical. Follow these steps immediately to protect your rights and explore your options:');
  doc.moveDown(0.5);

  const actionSteps = [
    { title: 'Step 1: Open and Read All Mail', text: 'Do not ignore letters from your mortgage servicer. These notices contain critical information about deadlines and your rights.' },
    { title: 'Step 2: Contact Your Mortgage Servicer', text: 'Call your servicer as soon as you know you will have trouble making payments. Ask about forbearance, repayment plans, and loan modification programs.' },
    { title: 'Step 3: Gather Financial Documents', text: 'Collect recent pay stubs, bank statements, tax returns, and create a hardship letter explaining your situation.' },
    { title: 'Step 4: Seek Professional Help', text: 'Contact a HUD-approved housing counselor for free advice. Call 1-800-569-4287 or visit consumerfinance.gov/find-a-housing-counselor.' },
    { title: 'Step 5: Explore All Your Options', text: 'Review the options in this guide and determine which ones fit your situation. Don\'t wait until the last minute.' }
  ];

  actionSteps.forEach(step => {
    doc.fontSize(11).fillColor(primaryColor).font('Helvetica-Bold').text(step.title);
    doc.fontSize(10).fillColor('#000000').font('Helvetica').text(step.text);
    doc.moveDown(0.5);
  });

  // Add page break
  doc.addPage();

  // Common Mistakes
  addSectionHeader('Common Mistakes to Avoid', warningColor);
  addBodyText('When facing foreclosure, avoid these common mistakes that can make your situation worse:');
  doc.moveDown(0.5);

  const mistakes = [
    'Ignoring the Problem: Ignoring notices will not make the problem go away. Act immediately.',
    'Paying Foreclosure "Rescue" Scams: Beware of companies that promise to stop foreclosure for upfront fees or ask you to sign over your deed.',
    'Not Documenting Everything: Keep copies of all letters, emails, and notices. Document every phone call.',
    'Missing Deadlines: Foreclosure involves strict deadlines. Missing one can eliminate your options.',
    'Assuming You Have No Options: Even weeks away from sale, you may still have options. Contact a professional immediately.',
    'Draining Savings or Retirement: Consult a financial advisor before using retirement funds to catch up on payments.'
  ];

  mistakes.forEach(mistake => addBullet(mistake, '✗'));
  doc.moveDown(1);

  // How EnterActDFW Can Help
  addSectionHeader('How EnterActDFW Can Help', accentColor);
  addBodyText('EnterActDFW Real Estate Brokerage specializes in helping Texas homeowners facing foreclosure. We understand that every situation is unique, and we work with you to find the best solution for your circumstances.');
  doc.moveDown(0.5);

  addSubsectionHeader('Our Services');
  const services = [
    'Free Consultation: No-obligation assessment of your situation',
    'Fair Cash Offers: Transparent pricing with no hidden fees',
    'Fast Closings: Close in as little as 7-10 days',
    'No Repairs, No Fees, No Commissions: We buy homes in any condition',
    'Local DFW Team: Licensed Texas real estate brokerage serving DFW since 2015',
    'Compassionate Service: We treat you with dignity and respect'
  ];
  services.forEach(service => addBullet(service, '✓'));
  doc.moveDown(1);

  // Contact Information
  doc.rect(doc.x - 10, doc.y, doc.page.width - 100, 80)
    .fillAndStroke('#EFF6FF', accentColor);
  doc.fillColor(accentColor).fontSize(14).font('Helvetica-Bold')
    .text('Contact Us Today', doc.x, doc.y + 10);
  doc.fillColor('#000000').fontSize(11).font('Helvetica')
    .text('Phone: (844) 981-2937', doc.x, doc.y + 10)
    .text('Email: info@enteractdfw.com', doc.x, doc.y + 5)
    .text('Address: 4400 State Hwy 121, Suite 300, Lewisville, Texas 75056', doc.x, doc.y + 5, { width: doc.page.width - 120 });
  doc.moveDown(2);

  // Additional Resources
  addSectionHeader('Additional Resources', primaryColor);
  addBodyText('HUD-Approved Housing Counselors: 1-800-569-4287 or www.consumerfinance.gov/find-a-housing-counselor');
  addBodyText('Texas Legal Services: www.texaslegalservices.org');
  addBodyText('Consumer Financial Protection Bureau (CFPB): www.consumerfinance.gov');
  addBodyText('Texas Department of Housing and Community Affairs: www.tdhca.state.tx.us');
  doc.moveDown(2);

  // Legal Disclaimer
  doc.rect(doc.x - 10, doc.y, doc.page.width - 100, 60)
    .fillAndStroke('#F3F4F6', '#9CA3AF');
  doc.fillColor('#374151').fontSize(8).font('Helvetica-Oblique')
    .text('Legal Disclaimer: This guide is for educational purposes only and does not constitute legal, financial, or professional advice. Every foreclosure situation is unique. For guidance specific to your circumstances, consult with a licensed attorney, HUD-approved housing counselor, or financial advisor. EnterActDFW Real Estate Brokerage is a licensed Texas real estate brokerage and is not a law firm.',
      doc.x, doc.y + 10, { width: doc.page.width - 120, align: 'justify' });

  return doc;
}


interface TimelineMilestone {
  id: string;
  title: string;
  date: Date;
  daysFromNotice: number;
  description: string;
  actionItems: string[];
  urgency: "critical" | "warning" | "safe";
  status: "past" | "current" | "upcoming";
}

export async function generatePersonalizedTimelinePDF(
  noticeDate: string,
  milestones: TimelineMilestone[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const primaryColor = '#0891B2'; // Teal
    const criticalColor = '#DC2626'; // Red
    const warningColor = '#EA580C'; // Orange
    const safeColor = '#16A34A'; // Green

    // Header
    doc.fontSize(24).fillColor(primaryColor).text('Your Personalized', { align: 'center' });
    doc.fontSize(28).text('Foreclosure Timeline', { align: 'center' });
    doc.moveDown(0.5);
    
    doc.fontSize(12).fillColor('#666666')
       .text(`Notice of Default Date: ${new Date(noticeDate).toLocaleDateString('en-US', { 
         weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
       })}`, { align: 'center' });
    
    doc.moveDown(1);

    // Introduction
    doc.fontSize(10).fillColor('#000000')
       .text('This personalized timeline shows the key milestones in the Texas foreclosure process based on your Notice of Default date. Use this guide to understand your deadlines and take timely action to protect your rights.', {
         align: 'left',
         width: 500
       });
    
    doc.moveDown(1.5);

    // Milestones
    milestones.forEach((milestone, index) => {
      // Check if we need a new page
      if (doc.y > 650) {
        doc.addPage();
      }

      // Milestone header with color indicator
      const urgencyColor = milestone.urgency === 'critical' ? criticalColor : 
                          milestone.urgency === 'warning' ? warningColor : safeColor;
      
      // Draw colored bar
      doc.rect(50, doc.y, 5, 20).fill(urgencyColor);
      
      // Milestone title and date
      doc.fontSize(14).fillColor('#000000')
         .text(milestone.title, 65, doc.y, { continued: false });
      
      doc.fontSize(10).fillColor('#666666')
         .text(`Day ${milestone.daysFromNotice} • ${milestone.date.toLocaleDateString('en-US', { 
           weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
         })}`, 65);
      
      doc.moveDown(0.5);

      // Description
      doc.fontSize(10).fillColor('#000000')
         .text(milestone.description, 65, doc.y, { width: 480 });
      
      doc.moveDown(0.5);

      // Action items
      doc.fontSize(10).fillColor('#000000').text('Action Items:', 65);
      doc.moveDown(0.3);
      
      milestone.actionItems.forEach((item) => {
        doc.fontSize(9).fillColor('#333333')
           .text(`• ${item}`, 75, doc.y, { width: 470 });
        doc.moveDown(0.2);
      });
      
      doc.moveDown(1);

      // Add separator line (except for last milestone)
      if (index < milestones.length - 1) {
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#E5E7EB');
        doc.moveDown(1);
      }
    });

    // Footer section
    doc.addPage();
    doc.fontSize(18).fillColor(primaryColor)
       .text('Need Help? Contact EnterActDFW', { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(11).fillColor('#000000')
       .text('EnterActDFW can provide a fair cash offer and close in as little as 7-10 days.', { align: 'center' });
    doc.text('Let us help you avoid foreclosure and move forward with dignity.', { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(12).fillColor('#000000')
       .text('Phone: (844) 981-2937', { align: 'center' });
    doc.text('Email: info@enteractdfw.com', { align: 'center' });
    doc.text('Lewisville, Texas 75056', { align: 'center' });
    
    doc.moveDown(2);

    // Legal disclaimer
    doc.fontSize(8).fillColor('#666666')
       .text('Legal Disclaimer: This timeline is for educational purposes only and is not legal advice. Foreclosure timelines can vary based on individual circumstances. For specific guidance, consult an attorney or HUD-approved housing counselor.', {
         align: 'center',
         width: 500
       });

    doc.end();
  });
}
