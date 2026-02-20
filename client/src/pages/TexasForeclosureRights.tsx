import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Phone, AlertTriangle, CheckCircle2, Scale, Shield } from "lucide-react";
import SocialShareButtons from "@/components/SocialShareButtons";
import BookingModal from "@/components/BookingModal";
import { APP_LOGO } from "@/const";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Texas Homeowner's Legal Rights During Foreclosure: Complete Guide",
  "description": "Comprehensive guide to Texas homeowners' legal rights during foreclosure. Learn about notice requirements, redemption periods, deficiency judgments, and how to protect yourself.",
  "author": {
    "@type": "Organization",
    "name": "EnterActDFW"
  },
  "publisher": {
    "@type": "Organization",
    "name": "EnterActDFW",
    "logo": {
      "@type": "ImageObject",
      "url": "https://foreclosurehub-ljpdyh45.manus.space/enteractdfw-logo.png"
    }
  },
  "datePublished": "2026-02-20",
  "dateModified": "2026-02-20"
};

export default function TexasForeclosureRights() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <Helmet>
        <title>Texas Homeowner's Legal Rights During Foreclosure | Complete Guide 2026</title>
        <meta name="description" content="Know your rights as a Texas homeowner facing foreclosure. Learn about notice requirements, redemption periods, deficiency judgments, and legal protections under Texas Property Code." />
        <meta property="og:title" content="Texas Homeowner's Legal Rights During Foreclosure | EnterActDFW" />
        <meta property="og:description" content="Comprehensive guide to Texas homeowners' legal rights during foreclosure. Protect yourself with knowledge of Texas foreclosure laws." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Texas Homeowner's Legal Rights During Foreclosure" />
        <meta name="twitter:description" content="Know your rights as a Texas homeowner facing foreclosure. Complete guide to Texas foreclosure laws and protections." />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src={APP_LOGO} alt="EnterActDFW" className="h-10" />
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/knowledge-base">
                <span className="text-sm font-medium hover:text-primary cursor-pointer">Knowledge Base</span>
              </Link>
              <Link href="/resources">
                <span className="text-sm font-medium hover:text-primary cursor-pointer">Resources</span>
              </Link>
              <Link href="/faq">
                <span className="text-sm font-medium hover:text-primary cursor-pointer">FAQ</span>
              </Link>
              <Button variant="outline" size="sm" asChild>
                <a href="tel:832-346-9569">Call Now</a>
              </Button>
            </nav>
          </div>
        </header>

        {/* Article Header */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container max-w-4xl">
            <div className="mb-6">
              <Link href="/blog">
                <span className="text-sm text-primary hover:underline cursor-pointer">← Back to Blog</span>
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Texas Homeowner's Legal Rights During Foreclosure
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Understanding your legal rights under Texas foreclosure law is critical to protecting your home and your financial future. This comprehensive guide explains every legal protection available to Texas homeowners facing foreclosure.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Published: February 20, 2026</span>
                <span>•</span>
                <span>16 min read</span>
              </div>
              <SocialShareButtons 
                url={typeof window !== 'undefined' ? window.location.href : 'https://foreclosurehub-ljpdyh45.manus.space/blog/texas-foreclosure-rights'}
                title="Texas Homeowner's Legal Rights During Foreclosure"
                description="Complete guide to Texas homeowners' legal rights during foreclosure. Know your protections under Texas law."
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <Alert className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-900 dark:text-amber-100">
                <strong>KNOW YOUR RIGHTS:</strong> Texas foreclosure law provides specific protections for homeowners. Understanding these rights can help you stop or delay foreclosure, negotiate better terms, or protect yourself from illegal foreclosure practices. If you believe your lender has violated your rights, call EnterActDFW immediately at <a href="tel:832-346-9569" className="font-bold underline">(832) 346-9569</a>.
              </AlertDescription>
            </Alert>

            <div className="prose prose-lg max-w-none">
              <p>
                Texas is a <strong>non-judicial foreclosure state</strong>, meaning lenders can foreclose without going to court. However, Texas law still provides significant protections for homeowners. This guide covers every legal right you have under the Texas Property Code, Texas Constitution, and federal law.
              </p>

              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground mt-12 mb-6">
                <Scale className="h-8 w-8 text-primary" />
                1. Right to Proper Notice
              </h2>

              <p>
                Under Texas Property Code §51.002, your lender <strong>must provide specific notices before foreclosing</strong>. Failure to provide proper notice can invalidate the foreclosure.
              </p>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Notice of Default (20 Days Before Auction)</h3>
              <p>
                Your lender must send a <strong>Notice of Default</strong> at least 20 days before the foreclosure sale. This notice must:
              </p>
              <ul className="space-y-2">
                <li>Be sent by certified mail to your last known address</li>
                <li>State the specific default (e.g., "missed 3 mortgage payments totaling $4,500")</li>
                <li>Provide the exact amount needed to cure the default</li>
                <li>Give you 20 days to cure the default before the sale</li>
              </ul>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Notice of Sale (21 Days Before Auction)</h3>
              <p>
                Your lender must file a <strong>Notice of Sale</strong> with the county clerk at least 21 days before the auction. This notice must:
              </p>
              <ul className="space-y-2">
                <li>Be posted at the county courthouse</li>
                <li>Include the date, time, and location of the sale</li>
                <li>Describe the property being sold</li>
                <li>State the earliest time the sale can occur (no earlier than 10 AM on the first Tuesday of the month)</li>
              </ul>

              <div className="bg-primary/5 border-l-4 border-primary p-6 my-8">
                <p className="font-semibold text-foreground mb-2">Your Right: Challenge Improper Notice</p>
                <p className="text-muted-foreground">
                  If your lender fails to provide proper notice, you can file a lawsuit to stop the foreclosure. Common notice violations include: sending notice to the wrong address, failing to send certified mail, not providing 20 days to cure, or posting the Notice of Sale late.
                </p>
              </div>

              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground mt-12 mb-6">
                <Shield className="h-8 w-8 text-primary" />
                2. Right to Cure the Default
              </h2>

              <p>
                Texas law gives you <strong>20 days to cure the default</strong> after receiving the Notice of Default. "Curing" means paying all arrears plus fees to bring your loan current.
              </p>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">What You Must Pay to Cure</h3>
              <ul className="space-y-2">
                <li><strong>All missed payments</strong> (principal + interest)</li>
                <li><strong>Late fees</strong> (as specified in your mortgage contract)</li>
                <li><strong>Property inspection fees</strong> (if the lender inspected the property)</li>
                <li><strong>Attorney fees</strong> (if specified in your mortgage contract)</li>
                <li><strong>Foreclosure costs</strong> (filing fees, posting fees, etc.)</li>
              </ul>

              <p className="mt-6">
                Your lender <strong>must accept payment</strong> if you cure the default within 20 days. Once you cure, the foreclosure process stops, and your loan is reinstated.
              </p>

              <div className="bg-primary/5 border-l-4 border-primary p-6 my-8">
                <p className="font-semibold text-foreground mb-2">Your Right: Demand an Itemized Payoff Statement</p>
                <p className="text-muted-foreground">
                  Your lender must provide an itemized statement showing exactly how much you owe to cure the default. If the lender refuses or provides an incorrect amount, you can challenge the foreclosure in court.
                </p>
              </div>

              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground mt-12 mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                3. Right to Reinstatement (Before the Auction)
              </h2>

              <p>
                Even after the 20-day cure period expires, you can still <strong>reinstate your loan</strong> by paying all arrears plus fees <strong>before the auctioneer's gavel falls</strong>. This is your last chance to stop the foreclosure.
              </p>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">How to Reinstate Your Loan</h3>
              <ol className="space-y-2">
                <li>Contact your lender or their attorney immediately</li>
                <li>Request a payoff statement (must include all fees and costs)</li>
                <li>Pay the full amount by certified check or wire transfer</li>
                <li>Obtain written confirmation that the foreclosure has been canceled</li>
              </ol>

              <p className="mt-6">
                If you pay the full amount before the auction, your lender <strong>must cancel the sale</strong> and reinstate your loan.
              </p>

              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground mt-12 mb-6">
                <Scale className="h-8 w-8 text-primary" />
                4. Right to No Deficiency Judgment (Homestead Property)
              </h2>

              <p>
                Texas Constitution Article XVI, Section 50(a)(6) provides <strong>powerful protection against deficiency judgments</strong> for homestead property.
              </p>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">What is a Deficiency Judgment?</h3>
              <p>
                A deficiency judgment occurs when the foreclosure sale price is less than your loan balance. For example:
              </p>
              <ul className="space-y-2">
                <li>Loan balance: $200,000</li>
                <li>Foreclosure sale price: $150,000</li>
                <li>Deficiency: $50,000</li>
              </ul>

              <p className="mt-6">
                In most states, the lender can sue you for the $50,000 deficiency. <strong>But in Texas, if the property is your homestead, the lender cannot pursue a deficiency judgment.</strong>
              </p>

              <div className="bg-primary/5 border-l-4 border-primary p-6 my-8">
                <p className="font-semibold text-foreground mb-2">Your Right: Homestead Protection</p>
                <p className="text-muted-foreground">
                  If the foreclosed property was your primary residence (homestead), you are protected from deficiency judgments. However, this protection does NOT apply to investment properties, second homes, or vacation homes.
                </p>
              </div>

              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground mt-12 mb-6">
                <Shield className="h-8 w-8 text-primary" />
                5. Right to Challenge Wrongful Foreclosure
              </h2>

              <p>
                Texas law allows you to sue your lender for <strong>wrongful foreclosure</strong> if they violated foreclosure procedures. Common grounds for wrongful foreclosure include:
              </p>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Common Wrongful Foreclosure Claims</h3>
              <ul className="space-y-3">
                <li><strong>Improper Notice:</strong> Lender failed to send required notices or sent them to the wrong address</li>
                <li><strong>Failure to Credit Payments:</strong> Lender foreclosed despite receiving timely payments</li>
                <li><strong>Dual Tracking:</strong> Lender foreclosed while you were in an active loan modification process</li>
                <li><strong>Lack of Standing:</strong> The entity foreclosing doesn't actually own your loan</li>
                <li><strong>Breach of Contract:</strong> Lender violated terms of your mortgage agreement</li>
                <li><strong>Violation of RESPA/TILA:</strong> Lender violated federal lending laws</li>
              </ul>

              <p className="mt-6">
                If you win a wrongful foreclosure lawsuit, you may be entitled to:
              </p>
              <ul className="space-y-2">
                <li>Reinstatement of your loan</li>
                <li>Damages for emotional distress</li>
                <li>Attorney fees and court costs</li>
                <li>Punitive damages (in cases of intentional misconduct)</li>
              </ul>

              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground mt-12 mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                6. Right to Bankruptcy Protection
              </h2>

              <p>
                Filing for bankruptcy triggers an <strong>automatic stay</strong> that immediately stops all foreclosure proceedings. This is a federal right under the U.S. Bankruptcy Code.
              </p>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Chapter 13 Bankruptcy (Reorganization)</h3>
              <p>
                Chapter 13 allows you to keep your home by catching up on missed payments through a 3-5 year repayment plan. Benefits include:
              </p>
              <ul className="space-y-2">
                <li>Stops foreclosure immediately</li>
                <li>Allows you to catch up on arrears over time</li>
                <li>Protects your home from future foreclosure (as long as you make plan payments)</li>
                <li>May allow you to "strip" second mortgages if your home is underwater</li>
              </ul>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Chapter 7 Bankruptcy (Liquidation)</h3>
              <p>
                Chapter 7 provides temporary relief but does not allow you to catch up on missed payments. It can delay foreclosure by 3-6 months while your bankruptcy case is pending.
              </p>

              <div className="bg-primary/5 border-l-4 border-primary p-6 my-8">
                <p className="font-semibold text-foreground mb-2">Your Right: Automatic Stay</p>
                <p className="text-muted-foreground">
                  The automatic stay stops foreclosure the moment you file bankruptcy—even if the foreclosure sale is scheduled for tomorrow. However, your lender can ask the bankruptcy court to lift the stay if you don't make ongoing mortgage payments.
                </p>
              </div>

              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground mt-12 mb-6">
                <Scale className="h-8 w-8 text-primary" />
                7. Right to Surplus Funds (If Sale Price Exceeds Loan Balance)
              </h2>

              <p>
                If the foreclosure sale price exceeds your loan balance plus fees, you are entitled to the <strong>surplus funds</strong>.
              </p>

              <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">Example:</h3>
              <ul className="space-y-2">
                <li>Loan balance: $150,000</li>
                <li>Foreclosure sale price: $180,000</li>
                <li>Surplus: $30,000 (minus fees and costs)</li>
              </ul>

              <p className="mt-6">
                Under Texas Property Code §51.003, the trustee (the person conducting the sale) must hold the surplus funds and distribute them in this order:
              </p>
              <ol className="space-y-2">
                <li>Pay off any junior liens (second mortgages, HOA liens, tax liens)</li>
                <li>Pay the foreclosure sale costs</li>
                <li>Pay the remaining surplus to you (the former homeowner)</li>
              </ol>

              <div className="bg-primary/5 border-l-4 border-primary p-6 my-8">
                <p className="font-semibold text-foreground mb-2">Your Right: Claim Surplus Funds</p>
                <p className="text-muted-foreground">
                  You must file a claim with the county clerk to receive surplus funds. If you don't claim the funds within a certain period (typically 2 years), they may be forfeited to the county.
                </p>
              </div>

              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground mt-12 mb-6">
                <Shield className="h-8 w-8 text-primary" />
                8. Right to Fair Debt Collection Practices
              </h2>

              <p>
                The federal <strong>Fair Debt Collection Practices Act (FDCPA)</strong> protects you from abusive, deceptive, or unfair debt collection practices. Your lender and their attorneys must:
              </p>

              <ul className="space-y-3">
                <li><strong>Not harass you:</strong> No repeated phone calls, threats, or abusive language</li>
                <li><strong>Not misrepresent the debt:</strong> Must provide accurate information about what you owe</li>
                <li><strong>Not threaten illegal actions:</strong> Cannot threaten to foreclose without proper notice</li>
                <li><strong>Validate the debt:</strong> Must provide proof that you owe the debt if you request it</li>
              </ul>

              <p className="mt-6">
                If your lender violates the FDCPA, you can sue for damages, attorney fees, and court costs.
              </p>

              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground mt-12 mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                9. Right to Loan Modification (Federal Programs)
              </h2>

              <p>
                Federal law requires lenders to <strong>consider you for loss mitigation options</strong> before foreclosing. Under the Consumer Financial Protection Bureau (CFPB) rules, your lender must:
              </p>

              <ul className="space-y-3">
                <li>Review your loan modification application (if submitted more than 37 days before the sale)</li>
                <li>Not foreclose while your application is pending</li>
                <li>Provide a written explanation if your application is denied</li>
                <li>Allow you to appeal the denial</li>
              </ul>

              <p className="mt-6">
                This is known as the <strong>"dual tracking" prohibition</strong>—lenders cannot pursue foreclosure while simultaneously evaluating you for a loan modification.
              </p>

              <div className="bg-primary/5 border-l-4 border-primary p-6 my-8">
                <p className="font-semibold text-foreground mb-2">Your Right: Loss Mitigation Review</p>
                <p className="text-muted-foreground">
                  If you submit a complete loan modification application at least 37 days before the foreclosure sale, your lender MUST review it and cannot proceed with the sale until they've made a decision.
                </p>
              </div>

              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground mt-12 mb-6">
                <Scale className="h-8 w-8 text-primary" />
                10. Right to Redemption (Limited in Texas)
              </h2>

              <p>
                Unlike many states, Texas does <strong>NOT</strong> have a post-sale redemption period for non-judicial foreclosures. Once the gavel falls at the foreclosure auction, you lose all ownership rights immediately.
              </p>

              <p className="mt-6">
                <strong>Exception:</strong> If your lender obtains a judicial foreclosure (through a court order), you may have a redemption period. However, judicial foreclosures are rare in Texas.
              </p>

              <h2 className="text-3xl font-bold text-foreground mt-12 mb-6">
                Summary: Your Legal Rights Checklist
              </h2>

              <div className="bg-card border rounded-lg p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Right to 20 days' notice before foreclosure sale</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Right to cure the default within 20 days</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Right to reinstate your loan before the auction</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Right to no deficiency judgment (homestead property)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Right to challenge wrongful foreclosure</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Right to bankruptcy protection (automatic stay)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Right to surplus funds (if sale price exceeds loan balance)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Right to fair debt collection practices</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Right to loan modification review (if applied 37+ days before sale)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Right to demand itemized payoff statement</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-primary/5">
          <div className="container max-w-4xl">
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Know Your Rights. Protect Your Home.</h3>
                  <p className="text-lg text-muted-foreground">
                    If you believe your lender has violated your legal rights, EnterActDFW can help you understand your options and take action. Our licensed brokers and legal experts will review your case and fight for your rights.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={() => setShowBookingModal(true)}>
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule Free Legal Review
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="tel:832-346-9569">
                        <Phone className="h-5 w-5 mr-2" />
                        Call (832) 346-9569 Now
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    <Link href="/blog/notice-of-default-action-plan">
                      <span className="hover:text-primary cursor-pointer">Notice of Default: Your 21-Day Action Plan</span>
                    </Link>
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Step-by-step guide to responding to a Notice of Default and exercising your right to cure.
                  </p>
                  <Link href="/blog/notice-of-default-action-plan">
                    <span className="text-primary hover:underline cursor-pointer">Read More →</span>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    <Link href="/timeline-calculator">
                      <span className="hover:text-primary cursor-pointer">Texas Foreclosure Timeline Calculator</span>
                    </Link>
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Calculate your exact foreclosure timeline and see when each legal deadline occurs.
                  </p>
                  <Link href="/timeline-calculator">
                    <span className="text-primary hover:underline cursor-pointer">Use Calculator →</span>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    <Link href="/knowledge-base">
                      <span className="hover:text-primary cursor-pointer">Knowledge Base</span>
                    </Link>
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Browse our complete library of foreclosure prevention resources and legal guides.
                  </p>
                  <Link href="/knowledge-base">
                    <span className="text-primary hover:underline cursor-pointer">Browse Resources →</span>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    <Link href="/blog">
                      <span className="hover:text-primary cursor-pointer">Blog</span>
                    </Link>
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Read more articles about foreclosure prevention, legal rights, and homeowner protections.
                  </p>
                  <Link href="/blog">
                    <span className="text-primary hover:underline cursor-pointer">View All Posts →</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t py-12">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <img src={APP_LOGO} alt="EnterActDFW" className="h-10 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Licensed Texas real estate brokers helping homeowners stop foreclosure.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/timeline-calculator">
                      <span className="hover:text-primary cursor-pointer">Timeline Calculator</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/knowledge-base">
                      <span className="hover:text-primary cursor-pointer">Knowledge Base</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources">
                      <span className="hover:text-primary cursor-pointer">Resources</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq">
                      <span className="hover:text-primary cursor-pointer">FAQ</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="tel:832-346-9569" className="hover:text-primary">
                      (832) 346-9569
                    </a>
                  </li>
                  <li>Dallas-Fort Worth, TX</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/privacy">
                      <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms">
                      <span className="hover:text-primary cursor-pointer">Terms of Service</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>© 2026 EnterActDFW. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      <BookingModal 
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
      />
    </>
  );
}
