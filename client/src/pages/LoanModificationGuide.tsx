import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  DollarSign, 
  TrendingDown,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Phone
} from "lucide-react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import BookingModal from "@/components/BookingModal";
import SocialShareButtons from "@/components/SocialShareButtons";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Texas Loan Modification Guide: How to Negotiate with Your Lender",
  "description": "Complete guide to loan modifications in Texas. Learn how to reduce your monthly payment, lower your interest rate, and make your mortgage affordable again.",
  "author": {
    "@type": "Organization",
    "name": "EnterActDFW"
  },
  "publisher": {
    "@type": "Organization",
    "name": "EnterActDFW",
    "logo": {
      "@type": "ImageObject",
      "url": "https://enteractdfw.com/enteractdfw-logo.png"
    }
  },
  "datePublished": "2026-02-21",
  "dateModified": "2026-02-21"
};

export default function LoanModificationGuide() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <Helmet>
        <title>Texas Loan Modification Guide: How to Negotiate with Your Lender</title>
        <meta name="description" content="Complete guide to loan modifications in Texas. Learn how to reduce your monthly payment, lower your interest rate, and make your mortgage affordable again." />
        <meta property="og:title" content="Texas Loan Modification Guide: How to Negotiate with Your Lender" />
        <meta property="og:description" content="Step-by-step guide to securing a loan modification in Texas. Reduce your payment and avoid foreclosure." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Texas Loan Modification Guide" />
        <meta name="twitter:description" content="Learn how to negotiate a loan modification and make your mortgage affordable again." />
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
                <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10" />
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/knowledge-base">
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
                <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>
                  Call Now
                </TrackablePhoneLink>
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
              Texas Loan Modification Guide: How to Negotiate with Your Lender
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              A loan modification can reduce your monthly payment, lower your interest rate, or extend your loan term—making your mortgage affordable again. This guide walks you through the entire loan modification process in Texas, from application to approval, with scripts and templates included.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Published: February 21, 2026</span>
                <span>•</span>
                <span>18 min read</span>
              </div>
              <SocialShareButtons 
                url={typeof window !== 'undefined' ? window.location.href : 'https://enteractdfw.com/blog/texas-loan-modification-guide'}
                title="Texas Loan Modification Guide: How to Negotiate with Your Lender"
                description="Complete guide to securing a loan modification in Texas. Reduce your payment and avoid foreclosure."
              />
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-foreground">
                A <strong>loan modification</strong> is a permanent change to your mortgage terms that makes your monthly payment affordable. Unlike forbearance (which is temporary), a loan modification restructures your loan to reduce your payment long-term.
              </p>
              <p className="text-lg text-foreground">
                Loan modifications can lower your interest rate, extend your loan term (e.g., from 30 years to 40 years), or even reduce your principal balance in rare cases. The goal is simple: <strong>make your mortgage payment sustainable so you can keep your home</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* What is a Loan Modification */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">What is a Loan Modification?</h2>
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-foreground">
                    A loan modification is a <strong>permanent change</strong> to one or more terms of your mortgage contract. Common modifications include:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Interest Rate Reduction:</strong> Lower your rate from 6.5% to 4.0%, reducing your monthly payment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Term Extension:</strong> Extend your loan from 30 years to 40 years, spreading payments over more time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Principal Forbearance:</strong> Move a portion of your principal to the end of the loan (non-interest bearing)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Principal Reduction:</strong> Forgive a portion of your loan balance (rare, only in extreme hardship cases)</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Do You Qualify */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">Do You Qualify for a Loan Modification?</h2>
            <div className="space-y-6">
              <p className="text-lg text-foreground">
                Lenders evaluate loan modification applications based on <strong>financial hardship</strong> and your <strong>ability to make a reduced payment</strong>. You're more likely to qualify if:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      You Have a Hardship
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Job loss or reduced income</li>
                      <li>• Medical emergency or disability</li>
                      <li>• Divorce or death of co-borrower</li>
                      <li>• Business failure</li>
                      <li>• Natural disaster damage</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      You Can Afford a Reduced Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• You have stable income (even if reduced)</li>
                      <li>• Your debt-to-income ratio is below 50%</li>
                      <li>• You can document your income</li>
                      <li>• You want to keep your home long-term</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Process */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">Step-by-Step: How to Apply for a Loan Modification</h2>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Contact Your Servicer's Loss Mitigation Department",
                  content: "Call your mortgage servicer and ask to speak with the loss mitigation department (NOT customer service). Tell them you're experiencing financial hardship and want to apply for a loan modification. Ask what documents they require."
                },
                {
                  step: 2,
                  title: "Gather Financial Documentation",
                  content: "Collect: 2 most recent pay stubs, 2 most recent bank statements, 2 years of tax returns, proof of hardship (termination letter, medical bills, etc.), and a detailed list of monthly expenses."
                },
                {
                  step: 3,
                  title: "Write Your Hardship Letter",
                  content: "Explain what caused your financial hardship, how it affected your ability to pay your mortgage, what steps you've taken to recover, and why a loan modification will help you keep your home. Be honest, specific, and concise (1-2 pages max)."
                },
                {
                  step: 4,
                  title: "Complete the Loss Mitigation Application",
                  content: "Fill out your servicer's loss mitigation application (Form 710 for most lenders). Attach all required documents. Submit via certified mail OR upload through your servicer's online portal."
                },
                {
                  step: 5,
                  title: "Follow Up Weekly",
                  content: "Call your servicer every 7 days to confirm they received your application and ask for a timeline. Document every call: date, time, representative name, and what was discussed."
                },
                {
                  step: 6,
                  title: "Review the Modification Offer",
                  content: "If approved, your servicer will send a Trial Period Plan (TPP). Review the new payment amount, interest rate, and loan term carefully. Make sure you can afford the new payment before accepting."
                },
                {
                  step: 7,
                  title: "Complete the Trial Period",
                  content: "Make 3-4 trial payments on time (exact amount, exact date). Missing even one trial payment can disqualify you. After successful completion, your modification becomes permanent."
                }
              ].map((item) => (
                <Card key={item.step} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {item.step}
                      </span>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-primary/5">
          <div className="container max-w-4xl">
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Loan Modification Denied?</h3>
                  <p className="text-lg text-muted-foreground">
                    If your lender denies your loan modification application, selling your home may be your best option. EnterActDFW offers fast cash purchases that close in 7-10 days—no repairs, no fees, no commissions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={() => setShowBookingModal(true)}>
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule Free Consultation
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>
                        Call (832) 346-9569 Now
                      </TrackablePhoneLink>
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
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/notice-of-default-action-plan">
                      <span className="hover:text-primary cursor-pointer">Notice of Default: Your 21-Day Action Plan</span>
                    </Link>
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/texas-short-sale-guide">
                      <span className="hover:text-primary cursor-pointer">Texas Short Sale Guide</span>
                    </Link>
                  </CardTitle>
                </CardHeader>
              </Card>
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
                  <li><Link href="/knowledge-base"><span className="text-muted-foreground hover:text-primary cursor-pointer">Knowledge Base</span></Link></li>
                  <li><Link href="/blog"><span className="text-muted-foreground hover:text-primary cursor-pointer">Blog</span></Link></li>
                  <li><Link href="/timeline-calculator"><span className="text-muted-foreground hover:text-primary cursor-pointer">Timeline Calculator</span></Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Phone: (832) 346-9569</li>
                  <li>Email: info@enteractdfw.com</li>
                </ul>
              </div>
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
