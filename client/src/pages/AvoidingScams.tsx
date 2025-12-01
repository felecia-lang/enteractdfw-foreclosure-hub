import { useState } from "react";
import { AlertTriangle, Shield, CheckCircle2, XCircle, Phone, Mail, ExternalLink, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import KnowledgeBaseLayout from "@/components/KnowledgeBaseLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import BookingModal from "@/components/BookingModal";

export default function AvoidingScams() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const downloadPDF = () => {
    // Direct link to PDF download endpoint
    const url = '/api/pdf/avoiding-scams-guide';
    window.open(url, '_blank');
    toast.success('PDF download started');
  };
  return (
    <KnowledgeBaseLayout title="Avoiding Foreclosure Scams">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-10 w-10 text-[#00A6A6]" />
              <h1 className="text-4xl font-bold text-[#0A2342]">
                Avoiding Foreclosure Scams
              </h1>
            </div>
            <Button 
              onClick={downloadPDF}
              variant="outline"
              className="flex items-center gap-2 border-[#00A6A6] text-[#00A6A6] hover:bg-[#00A6A6] hover:text-white"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            When you're facing foreclosure, you're vulnerable to predatory companies and scammers who prey on homeowners in distress. Learn how to recognize common scams, protect yourself, and find legitimate help.
          </p>
        </div>

        {/* Urgent Warning Alert */}
        <Alert className="mb-8 border-red-500 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-900 font-medium">
            <strong>Warning:</strong> Never pay upfront fees to anyone who promises to save your home from foreclosure. Legitimate HUD-approved housing counselors provide free services.
          </AlertDescription>
        </Alert>

        {/* Common Foreclosure Scams */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#0A2342] mb-6">Common Foreclosure Scams</h2>
          
          <div className="space-y-6">
            {/* Scam 1: Phantom Help */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <XCircle className="h-5 w-5 text-red-500" />
                  1. Phantom Help Scams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  <strong>How it works:</strong> A company contacts you claiming they can negotiate with your lender or get a loan modification for you—but only if you pay them a large upfront fee (often $1,500 to $3,000 or more).
                </p>
                <p className="text-gray-700">
                  <strong>The reality:</strong> After you pay, they disappear without doing any work, or they submit incomplete paperwork that your lender rejects. You've lost money and wasted precious time.
                </p>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-900 font-medium">
                    <strong>Red Flag:</strong> Any company that demands payment before providing services or guarantees they can stop your foreclosure.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Scam 2: Deed/Title Transfer Fraud */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <XCircle className="h-5 w-5 text-red-500" />
                  2. Deed/Title Transfer Fraud
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  <strong>How it works:</strong> A scammer convinces you to sign over the deed to your home, claiming they'll handle the foreclosure and let you stay as a renter. They promise you can buy the house back later.
                </p>
                <p className="text-gray-700">
                  <strong>The reality:</strong> Once they have the deed, they either sell your home to someone else, take out loans against it, or evict you. You lose your home and any equity you had.
                </p>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-900 font-medium">
                    <strong>Red Flag:</strong> Anyone who asks you to transfer your deed or title while promising you can stay in the home or buy it back later.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Scam 3: Rent-to-Buy Schemes */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <XCircle className="h-5 w-5 text-red-500" />
                  3. Rent-to-Buy Schemes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  <strong>How it works:</strong> A company offers to "rescue" you by buying your home and renting it back to you with an option to repurchase. They set inflated rent payments and unrealistic buyback terms.
                </p>
                <p className="text-gray-700">
                  <strong>The reality:</strong> The rent is set so high you can't afford it, or the buyback price is inflated beyond market value. When you can't keep up with payments, you're evicted and lose your home permanently.
                </p>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-900 font-medium">
                    <strong>Red Flag:</strong> Rent amounts that are higher than your current mortgage payment, or buyback terms that seem impossible to meet.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Scam 4: Bankruptcy Foreclosure Scams */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <XCircle className="h-5 w-5 text-red-500" />
                  4. Bankruptcy Foreclosure Scams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  <strong>How it works:</strong> A scammer advises you to file for bankruptcy to stop the foreclosure, then charges you excessive fees for services that don't help your situation.
                </p>
                <p className="text-gray-700">
                  <strong>The reality:</strong> While bankruptcy can temporarily halt foreclosure through an automatic stay, it's not always the right solution. Scammers file incomplete or improper paperwork, leaving you worse off than before.
                </p>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-900 font-medium">
                    <strong>Red Flag:</strong> Anyone who pushes bankruptcy as the only solution without reviewing your full financial situation, or who isn't a licensed attorney.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Scam 5: Forensic Loan Audit Scams */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <XCircle className="h-5 w-5 text-red-500" />
                  5. Forensic Loan Audit Scams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  <strong>How it works:</strong> Companies offer to perform a "forensic loan audit" for a fee, claiming they'll find legal violations in your mortgage that will stop the foreclosure or get your loan canceled.
                </p>
                <p className="text-gray-700">
                  <strong>The reality:</strong> These audits rarely produce actionable results, and even if violations are found, they typically don't stop foreclosure. You pay hundreds or thousands of dollars for a useless report.
                </p>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-900 font-medium">
                    <strong>Red Flag:</strong> Guarantees that an audit will stop your foreclosure or eliminate your mortgage debt.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Scam 6: Government Program Impersonators */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <XCircle className="h-5 w-5 text-red-500" />
                  6. Government Program Impersonators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  <strong>How it works:</strong> Scammers claim to represent government programs like HAMP (Home Affordable Modification Program) or other federal assistance programs, charging fees to "expedite" your application.
                </p>
                <p className="text-gray-700">
                  <strong>The reality:</strong> Government foreclosure prevention programs are free. No legitimate government agency will charge you to apply or participate.
                </p>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm text-red-900 font-medium">
                    <strong>Red Flag:</strong> Anyone claiming to represent a government program who asks for payment or personal financial information upfront.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Warning Signs & Red Flags */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#0A2342] mb-6">Warning Signs & Red Flags</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Protect yourself by watching for these common warning signs that indicate you may be dealing with a scammer:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Red Flags */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <AlertTriangle className="h-5 w-5" />
                  Red Flags - Avoid These
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They demand large upfront fees before providing any services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They guarantee they can stop your foreclosure or save your home</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They pressure you to sign documents without reading them or getting legal advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They tell you to stop communicating with your lender or attorney</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They ask you to make mortgage payments directly to them instead of your lender</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They ask you to sign over the deed or title to your property</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They use high-pressure sales tactics or create a false sense of urgency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They contact you unsolicited via phone, email, or door-to-door</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They have no verifiable business address or professional credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They claim to have a "special relationship" with your lender</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Green Flags */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <CheckCircle2 className="h-5 w-5" />
                  Green Flags - Look For These
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They are HUD-approved housing counselors (verify at HUD.gov)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They provide free or low-cost services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They encourage you to stay in contact with your lender</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They explain all your options without pushing one specific solution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They give you time to review documents and seek legal advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They have verifiable credentials (licensed attorney, certified counselor)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They provide written agreements and clear fee structures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They have positive reviews and references you can verify</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They are transparent about what they can and cannot do</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">They respect your questions and concerns without defensiveness</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Verify Legitimate Help */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#0A2342] mb-6">How to Verify Legitimate Help</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Before working with anyone who offers foreclosure assistance, take these steps to verify they are legitimate:
          </p>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Check HUD's Approved Counselor List</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  The U.S. Department of Housing and Urban Development (HUD) maintains a list of approved housing counseling agencies. These counselors provide free or low-cost services.
                </p>
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="https://www.hud.gov/findacounselor" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Find a HUD-Approved Counselor
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Verify Attorney Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  If working with an attorney, verify they are licensed to practice law in Texas through the State Bar of Texas.
                </p>
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="https://www.texasbar.com/findalawyer" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Verify Texas Attorney License
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Check for Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">
                  Search for complaints filed against the company or individual through the Better Business Bureau (BBB) and your state attorney general's office.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <a href="https://www.bbb.org" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      BBB.org
                    </a>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <a href="https://www.texasattorneygeneral.gov/consumer-protection" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      TX Attorney General
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4. Ask for References</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Legitimate professionals should be able to provide references from past clients. Contact these references and ask about their experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">5. Get Everything in Writing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Never agree to anything verbally. Legitimate companies will provide written contracts that clearly outline services, fees, timelines, and your rights to cancel.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Report Foreclosure Scams */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#0A2342] mb-6">How to Report Foreclosure Scams</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            If you believe you've been targeted by a foreclosure scam or have already fallen victim, report it immediately to these agencies:
          </p>

          <div className="space-y-4">
            <Card className="border-l-4 border-l-[#00A6A6]">
              <CardHeader>
                <CardTitle className="text-lg">Federal Trade Commission (FTC)</CardTitle>
                <CardDescription>Reports consumer fraud and scams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Website:</strong>{" "}
                    <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-[#00A6A6] hover:underline">
                      reportfraud.ftc.gov
                    </a>
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Phone:</strong> 1-877-FTC-HELP (1-877-382-4357)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#00A6A6]">
              <CardHeader>
                <CardTitle className="text-lg">Consumer Financial Protection Bureau (CFPB)</CardTitle>
                <CardDescription>Handles mortgage and foreclosure-related complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Website:</strong>{" "}
                    <a href="https://www.consumerfinance.gov/complaint" target="_blank" rel="noopener noreferrer" className="text-[#00A6A6] hover:underline">
                      consumerfinance.gov/complaint
                    </a>
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Phone:</strong> 1-855-411-CFPB (1-855-411-2372)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#00A6A6]">
              <CardHeader>
                <CardTitle className="text-lg">Texas Attorney General - Consumer Protection Division</CardTitle>
                <CardDescription>Investigates fraud and deceptive business practices in Texas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Website:</strong>{" "}
                    <a href="https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint" target="_blank" rel="noopener noreferrer" className="text-[#00A6A6] hover:underline">
                      File a Consumer Complaint
                    </a>
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Phone:</strong> 1-800-621-0508
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#00A6A6]">
              <CardHeader>
                <CardTitle className="text-lg">Texas Department of Savings and Mortgage Lending</CardTitle>
                <CardDescription>Regulates mortgage companies operating in Texas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Website:</strong>{" "}
                    <a href="https://www.sml.texas.gov" target="_blank" rel="noopener noreferrer" className="text-[#00A6A6] hover:underline">
                      sml.texas.gov
                    </a>
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Phone:</strong> 1-877-276-5550
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#00A6A6]">
              <CardHeader>
                <CardTitle className="text-lg">Local Law Enforcement</CardTitle>
                <CardDescription>For criminal fraud cases</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Contact your local police department or sheriff's office to file a report if you believe you've been the victim of criminal fraud.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What to Do If You've Been Scammed */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-[#0A2342] mb-6">What to Do If You've Been Scammed</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            If you realize you've been the victim of a foreclosure scam, take immediate action:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-[#00A6A6] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Stop All Communication and Payments</h3>
                <p className="text-gray-700 text-sm">
                  Immediately cease all contact with the scammer and stop making any payments to them. Do not sign any additional documents.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-[#00A6A6] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Contact Your Mortgage Servicer Immediately</h3>
                <p className="text-gray-700 text-sm">
                  Call your lender or servicer right away to explain the situation. They need to know if someone has been impersonating you or submitting fraudulent documents on your behalf.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-[#00A6A6] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">File Reports with Authorities</h3>
                <p className="text-gray-700 text-sm">
                  Report the scam to the FTC, CFPB, Texas Attorney General, and local law enforcement. The more reports filed, the better chance authorities have of stopping the scammers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-[#00A6A6] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Consult with a Licensed Attorney</h3>
                <p className="text-gray-700 text-sm">
                  Speak with a real estate attorney who can review any documents you signed and advise you on your legal options. You may be able to void fraudulent contracts or recover losses.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-[#00A6A6] text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Check Your Credit Report</h3>
                <p className="text-gray-700 text-sm">
                  If you provided personal information to scammers, monitor your credit report for unauthorized activity. Consider placing a fraud alert or credit freeze.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-[#00A6A6] text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Seek Legitimate Help</h3>
                <p className="text-gray-700 text-sm">
                  Contact a HUD-approved housing counselor for free assistance. They can help you explore legitimate options to save your home or transition out of it safely.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How EnterActDFW Can Help */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-[#0A2342] to-[#00A6A6] text-white">
            <CardHeader>
              <CardTitle className="text-2xl">How EnterActDFW Can Help You Safely</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                At EnterActDFW, we're a licensed Texas real estate brokerage with a transparent, ethical approach to helping homeowners facing foreclosure. We never charge upfront fees, and we always put your interests first.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Free Consultation
                  </h3>
                  <p className="text-sm text-gray-100">
                    We'll review your situation at no cost and explain all your options honestly—including options that don't involve us.
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Fair Cash Offers
                  </h3>
                  <p className="text-sm text-gray-100">
                    If selling is your best option, we provide fair, transparent cash offers with no hidden fees or obligations.
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Licensed & Verified
                  </h3>
                  <p className="text-sm text-gray-100">
                    We're licensed by the Texas Real Estate Commission (TREC) and maintain full transparency in all our dealings.
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Local DFW Experts
                  </h3>
                  <p className="text-sm text-gray-100">
                    We've been serving the Dallas-Fort Worth community since 2015 and have helped over 200 families navigate foreclosure.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="secondary" size="lg" className="flex items-center gap-2" asChild>
                  <TrackablePhoneLink phoneNumber="832-932-7585" showIcon>
                    Call (832) 932-7585
                  </TrackablePhoneLink>
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-white/30" asChild>
                  <a href="mailto:info@enteractdfw.com">
                    <Mail className="h-5 w-5" />
                    Email Us
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call-to-Action Section */}
        <div className="mt-12 mb-8 p-8 bg-gradient-to-br from-[#00A6A6]/10 to-[#0A2342]/10 rounded-lg border-2 border-[#00A6A6]">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#0A2342] mb-3">
              Need Help Protecting Your Home?
            </h3>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Don't face foreclosure alone. Schedule a free, no-obligation consultation with our team to explore your options and get honest answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#00A6A6] hover:bg-[#008A8A] text-white font-semibold px-8 py-6 text-lg"
                asChild
              >
                <TrackablePhoneLink phoneNumber="832-932-7585" showIcon>Call Now: (832) 932-7585
                </TrackablePhoneLink>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-[#0A2342] text-[#0A2342] hover:bg-[#0A2342] hover:text-white font-semibold px-8 py-6 text-lg"
                onClick={() => setShowBookingModal(true)}
              >
                Schedule Free Consultation
              </Button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 p-6 bg-gray-100 rounded-lg border border-gray-300">
          <p className="text-sm text-gray-700 italic">
            <strong>Legal Disclaimer:</strong> This information is for educational purposes only and is not legal advice. If you believe you've been the victim of fraud or need legal assistance, consult with a licensed attorney. EnterActDFW is a licensed Texas real estate brokerage and is not a law firm or housing counseling agency.
          </p>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal open={showBookingModal} onOpenChange={setShowBookingModal} />
    </KnowledgeBaseLayout>
  );
}
