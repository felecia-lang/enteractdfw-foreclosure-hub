import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";

const glossaryTerms = [
  {
    term: "Acceleration",
    definition: "When a lender demands immediate payment of the entire remaining loan balance after a borrower defaults. This clause is typically triggered after several missed payments and is stated in the mortgage or deed of trust. Once accelerated, the borrower can no longer make monthly payments and must pay the full amount owed to avoid foreclosure."
  },
  {
    term: "Adjustable-Rate Mortgage (ARM)",
    definition: "A mortgage loan where the interest rate can change periodically based on market conditions. Rate changes can cause monthly payments to increase, sometimes leading to payment difficulties and potential foreclosure if borrowers cannot afford the higher payments."
  },
  {
    term: "Bankruptcy",
    definition: "A legal process that can temporarily stop foreclosure through an automatic stay. Chapter 7 bankruptcy may delay foreclosure temporarily, while Chapter 13 allows homeowners to catch up on missed payments over 3-5 years while keeping their home. Filing bankruptcy does not eliminate the mortgage debt but can provide time to reorganize finances."
  },
  {
    term: "Breach Letter",
    definition: "A formal notice from the lender stating that the borrower has violated the terms of the mortgage agreement, typically by missing payments. This letter often precedes the Notice of Default and gives the borrower a final opportunity to cure the default before foreclosure proceedings begin."
  },
  {
    term: "Deed in Lieu of Foreclosure",
    definition: "An agreement where the homeowner voluntarily transfers ownership of the property to the lender to avoid foreclosure. This option may be less damaging to credit than a foreclosure and can sometimes result in the lender waiving any deficiency balance. However, it requires lender approval and the home must typically be listed for sale first."
  },
  {
    term: "Deed of Trust",
    definition: "A legal document used in Texas instead of a traditional mortgage. It involves three parties: the borrower (trustor), the lender (beneficiary), and a neutral third party (trustee). The trustee holds legal title to the property until the loan is paid off. This document allows for non-judicial foreclosure in Texas."
  },
  {
    term: "Default",
    definition: "Failure to meet the legal obligations of the mortgage loan, most commonly by missing monthly payments. Other defaults can include failure to pay property taxes, maintain homeowners insurance, or keep the property in good condition. Default triggers the lender's right to begin foreclosure proceedings."
  },
  {
    term: "Deficiency Judgment",
    definition: "A court order requiring the borrower to pay the difference between the foreclosure sale price and the total amount owed on the mortgage. In Texas, lenders can pursue deficiency judgments, but they must follow specific procedures and file within certain timeframes. The amount is limited to the difference between the debt and the property's fair market value."
  },
  {
    term: "Delinquency",
    definition: "The status of a loan when payments are past due but foreclosure has not yet been initiated. Loans are typically considered delinquent after 30 days, seriously delinquent after 90 days. Federal law requires lenders to wait until a loan is 120 days delinquent before starting foreclosure."
  },
  {
    term: "Equity",
    definition: "The difference between the property's current market value and the amount owed on the mortgage. Positive equity means the home is worth more than the debt; negative equity (underwater) means the debt exceeds the home's value. Homeowners with equity have more options to avoid foreclosure, such as selling the property."
  },
  {
    term: "Forbearance",
    definition: "A temporary agreement with the lender to reduce or suspend mortgage payments for a specific period, typically 3-12 months. This option is designed for borrowers facing short-term financial hardship. After forbearance ends, borrowers must resume regular payments plus make up the missed amounts through a repayment plan, loan modification, or lump sum."
  },
  {
    term: "Foreclosure",
    definition: "The legal process by which a lender takes ownership of a property when the borrower fails to make mortgage payments. In Texas, most foreclosures are non-judicial, meaning they don't require court proceedings. The process includes notice requirements, a public auction sale, and potential deficiency judgment."
  },
  {
    term: "Homestead Exemption",
    definition: "Texas law that protects a portion of a homeowner's equity from creditors and provides property tax reductions. While it protects against most creditors, it does not prevent foreclosure for failure to pay the mortgage, property taxes, home equity loans, or home improvement liens. It can affect the amount of deficiency judgment a lender can pursue."
  },
  {
    term: "Judicial Foreclosure",
    definition: "A foreclosure process that requires court proceedings and a judge's order. While Texas primarily uses non-judicial foreclosure, judicial foreclosure may be used in certain circumstances, such as when the deed of trust doesn't contain a power of sale clause. This process is longer and more expensive than non-judicial foreclosure."
  },
  {
    term: "Lien",
    definition: "A legal claim against a property that must be paid when the property is sold. Mortgage liens give lenders the right to foreclose if payments aren't made. Other liens (tax liens, mechanic's liens, HOA liens) can also lead to foreclosure. First lien holders (primary mortgages) have priority over junior liens."
  },
  {
    term: "Loan Modification",
    definition: "A permanent change to the original mortgage terms to make payments more affordable. Modifications can include reducing the interest rate, extending the loan term, adding missed payments to the loan balance, or changing from an adjustable to fixed rate. This option requires lender approval and documentation of financial hardship."
  },
  {
    term: "Loss Mitigation",
    definition: "The process lenders use to work with borrowers to avoid foreclosure. Options include loan modifications, repayment plans, forbearance, short sales, and deeds in lieu. Federal law requires servicers to review borrowers for loss mitigation options before proceeding with foreclosure if the borrower submits a complete application more than 37 days before a foreclosure sale."
  },
  {
    term: "Notice of Default (NOD)",
    definition: "A formal written notice from the lender stating that the borrower has defaulted on the mortgage and foreclosure proceedings will begin unless the default is cured. In Texas, this notice must be sent at least 20 days before the Notice of Sale for home equity loans and reverse mortgages. It specifies the amount needed to reinstate the loan."
  },
  {
    term: "Notice of Sale",
    definition: "A legal notice announcing the date, time, and location of the foreclosure auction. In Texas, this notice must be posted at the county courthouse at least 21 days before the sale and sent to the borrower. The sale must occur on the first Tuesday of the month between 10 AM and 4 PM at the county courthouse."
  },
  {
    term: "Non-Judicial Foreclosure",
    definition: "The foreclosure process used in Texas that doesn't require court proceedings. It's based on the power of sale clause in the deed of trust. This process is faster and less expensive than judicial foreclosure but still requires specific notice requirements and procedures to protect homeowner rights."
  },
  {
    term: "Power of Sale",
    definition: "A clause in a deed of trust that gives the lender the right to sell the property without court approval if the borrower defaults. This clause enables non-judicial foreclosure in Texas. It must be properly executed and recorded, and the lender must follow all statutory requirements for notice and sale procedures."
  },
  {
    term: "Pre-Foreclosure",
    definition: "The period between when a homeowner defaults on mortgage payments and when the property is sold at foreclosure auction. During this time, homeowners have opportunities to cure the default, negotiate with the lender, sell the property, or pursue alternatives like loan modification or short sale."
  },
  {
    term: "Principal",
    definition: "The original amount borrowed on a mortgage loan, not including interest. As payments are made, the principal balance decreases. In foreclosure situations, the total amount owed includes the remaining principal plus interest, late fees, legal costs, and other charges specified in the loan agreement."
  },
  {
    term: "Redemption Period",
    definition: "A period after foreclosure sale during which the borrower can reclaim the property by paying the full sale price plus costs. Texas does not provide a statutory right of redemption for non-judicial foreclosures, meaning once the property is sold at auction, the homeowner cannot buy it back. This makes acting before the sale date critical."
  },
  {
    term: "Refinance",
    definition: "Replacing an existing mortgage with a new loan, typically to obtain better terms, lower interest rates, or access equity. Refinancing can help avoid foreclosure if the homeowner qualifies for a new loan with more affordable payments. However, it requires good credit and sufficient equity, which may not be available when facing foreclosure."
  },
  {
    term: "Reinstatement",
    definition: "Bringing a delinquent mortgage current by paying all past-due amounts, including missed payments, late fees, and legal costs. In Texas, borrowers have the right to reinstate their loan up to 20 days before the foreclosure sale date (30 days for certain loan types). This stops the foreclosure process and restores the original loan terms."
  },
  {
    term: "Repayment Plan",
    definition: "An agreement with the lender to catch up on missed payments by adding an extra amount to regular monthly payments over a set period, typically 3-6 months. This option works best for borrowers who experienced a temporary financial setback but can now afford their regular payment plus extra to make up the shortage."
  },
  {
    term: "Servicer",
    definition: "The company that manages the day-to-day tasks of a mortgage loan, including collecting payments, managing escrow accounts, and handling loss mitigation. The servicer may not be the same company that originally made the loan or currently owns it. Borrowers facing foreclosure should contact their servicer to discuss options."
  },
  {
    term: "Short Sale",
    definition: "Selling the property for less than the amount owed on the mortgage with the lender's approval. The lender agrees to accept the sale proceeds as full or partial satisfaction of the debt. This option can be less damaging to credit than foreclosure and may result in the lender waiving the deficiency, though this must be negotiated in writing."
  },
  {
    term: "Trustee",
    definition: "The neutral third party named in a deed of trust who holds legal title to the property and conducts the foreclosure sale if the borrower defaults. In Texas, the trustee must follow strict legal requirements for notice and sale procedures. The trustee has a duty to conduct the sale fairly and obtain a reasonable price."
  },
  {
    term: "Trustee's Deed",
    definition: "The document that transfers ownership of the property from the borrower to the winning bidder at a foreclosure auction. This deed is issued by the trustee after the foreclosure sale is complete. It conveys whatever interest the borrower had in the property but may not guarantee clear title."
  },
  {
    term: "Underwater (Negative Equity)",
    definition: "When the amount owed on a mortgage exceeds the current market value of the property. Homeowners who are underwater have fewer options to avoid foreclosure since they cannot sell the property for enough to pay off the loan without bringing cash to closing or negotiating a short sale."
  }
];

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter terms based on search
  const filteredTerms = useMemo(() => {
    if (!searchTerm) return glossaryTerms;
    const lower = searchTerm.toLowerCase();
    return glossaryTerms.filter(
      item =>
        item.term.toLowerCase().includes(lower) ||
        item.definition.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof glossaryTerms> = {};
    filteredTerms.forEach(item => {
      const firstLetter = item.term[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(item);
    });
    return groups;
  }, [filteredTerms]);

  const letters = Object.keys(groupedTerms).sort();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10" />
            </a>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Home
              </span>
            </Link>
            <Link href="/knowledge-base/understanding-foreclosure">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Knowledge Base
              </span>
            </Link>
            <Link href="/resources">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Resources
              </span>
            </Link>
            <Link href="/faq">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                FAQ
              </span>
            </Link>
            <Button variant="outline" size="sm" asChild>
              <TrackablePhoneLink phoneNumber="832-932-7585" showIcon>Call Now
              </TrackablePhoneLink>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Foreclosure Glossary
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Plain-language definitions of key foreclosure terms to help you understand legal documents, notices, and your options.
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search terms or definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </section>

      {/* Alphabet Navigation */}
      <section className="py-6 bg-muted/30 sticky top-16 z-40 border-b">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-card hover:bg-primary hover:text-primary-foreground transition-colors font-semibold text-sm border"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Terms List */}
      <section className="py-12">
        <div className="container max-w-4xl">
          {letters.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  No terms found matching "{searchTerm}". Try a different search term.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {letters.map(letter => (
                <div key={letter} id={`letter-${letter}`} className="scroll-mt-32">
                  <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b">
                    {letter}
                  </h2>
                  <div className="space-y-6">
                    {groupedTerms[letter].map((item, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold text-foreground mb-3">
                            {item.term}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {item.definition}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary/5">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Get your free foreclosure survival guide or speak with Felecia Fair for personalized guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/">
                <span>Get Free Guide</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <TrackablePhoneLink phoneNumber="832-932-7585" showIcon>Call (832) 932-7585
              </TrackablePhoneLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-8 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Licensed real estate brokerage helping Texas homeowners navigate foreclosure with dignity and fairness.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/knowledge-base/understanding-foreclosure"><span className="text-muted-foreground hover:text-primary cursor-pointer">Knowledge Base</span></Link></li>
                <li><Link href="/resources"><span className="text-muted-foreground hover:text-primary cursor-pointer">Support Directory</span></Link></li>
                <li><Link href="/faq"><span className="text-muted-foreground hover:text-primary cursor-pointer">FAQ</span></Link></li>
                <li><Link href="/about"><span className="text-muted-foreground hover:text-primary cursor-pointer">About Felecia Fair</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Phone: (832) 932-7585</li>
                <li>Email: info@enteractdfw.com</li>
                <li>4400 State Hwy 121, Suite 300</li>
                <li>Lewisville, Texas 75056</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Legal Disclaimer:</strong> This information is for educational purposes only and is not legal advice. 
              EnterActDFW is a licensed real estate brokerage in Texas. For legal guidance, consult an attorney or HUD-approved housing counselor.
            </p>
            <p>© 2025 EnterActDFW. All rights reserved. | <Link href="/privacy"><span className="hover:text-primary cursor-pointer">Privacy Policy</span></Link> | <Link href="/terms"><span className="hover:text-primary cursor-pointer">Terms of Service</span></Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
