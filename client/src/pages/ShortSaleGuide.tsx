import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Home as HomeIcon, 
  DollarSign, 
  FileText,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Phone,
  TrendingDown
} from "lucide-react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import BookingModal from "@/components/BookingModal";
import SocialShareButtons from "@/components/SocialShareButtons";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Texas Short Sale Guide: Sell Your Home and Avoid Foreclosure",
  "description": "Complete guide to short sales in Texas. Learn how to sell your home for less than you owe, get lender approval, and avoid foreclosure damage to your credit.",
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
  "datePublished": "2026-02-22",
  "dateModified": "2026-02-22"
};

export default function ShortSaleGuide() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <Helmet>
        <title>Texas Short Sale Guide: Sell Your Home and Avoid Foreclosure</title>
        <meta name="description" content="Complete guide to short sales in Texas. Learn how to sell your home for less than you owe, get lender approval, and avoid foreclosure damage to your credit." />
        <meta property="og:title" content="Texas Short Sale Guide: Sell Your Home and Avoid Foreclosure" />
        <meta property="og:description" content="Step-by-step guide to short sales in Texas. Sell your underwater home and avoid foreclosure." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Texas Short Sale Guide" />
        <meta name="twitter:description" content="Learn how to sell your home for less than you owe and avoid foreclosure in Texas." />
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
              Texas Short Sale Guide: Sell Your Home and Avoid Foreclosure
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              A short sale allows you to sell your home for less than you owe on your mortgage—with your lender's approval. It's a way to exit an underwater property, avoid foreclosure, and minimize credit damage. This guide explains how short sales work in Texas, step-by-step.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Published: February 22, 2026</span>
                <span>•</span>
                <span>14 min read</span>
              </div>
              <SocialShareButtons 
                url={typeof window !== 'undefined' ? window.location.href : 'https://enteractdfw.com/blog/texas-short-sale-guide'}
                title="Texas Short Sale Guide: Sell Your Home and Avoid Foreclosure"
                description="Complete guide to short sales in Texas. Sell your underwater home and avoid foreclosure."
              />
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-foreground">
                A <strong>short sale</strong> is when you sell your home for less than the outstanding mortgage balance, and your lender agrees to accept the sale proceeds as full or partial satisfaction of the debt. It's called a "short" sale because the sale proceeds fall short of what you owe.
              </p>
              <p className="text-lg text-foreground">
                Short sales are common when homeowners are underwater (owe more than the home is worth) and can no longer afford the mortgage. Instead of letting the home go to foreclosure, a short sale allows you to exit with less credit damage and potentially avoid a deficiency judgment.
              </p>
            </div>
          </div>
        </section>

        {/* When to Consider */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">When Should You Consider a Short Sale?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Good Fit for Short Sale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• You owe more than your home is worth</li>
                    <li>• You can't afford your mortgage payment</li>
                    <li>• You don't have savings to cover the shortfall</li>
                    <li>• You want to avoid foreclosure</li>
                    <li>• You're experiencing financial hardship</li>
                    <li>• You need to relocate for work</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    NOT a Good Fit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• You have equity in your home</li>
                    <li>• You can afford your payment</li>
                    <li>• You want to stay in your home</li>
                    <li>• You have cash to bring to closing</li>
                    <li>• Your lender won't approve a short sale</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">How Does a Short Sale Work in Texas?</h2>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Contact Your Lender",
                  icon: Phone,
                  content: "Call your mortgage servicer's loss mitigation department and tell them you want to pursue a short sale. Ask what documents they require and whether they have a short sale program."
                },
                {
                  step: 2,
                  title: "Submit a Short Sale Package",
                  icon: FileText,
                  content: "Prepare a short sale package including: hardship letter, financial statements (pay stubs, bank statements, tax returns), comparative market analysis (CMA) showing your home's value, and a purchase offer (once you have a buyer)."
                },
                {
                  step: 3,
                  title: "List Your Home for Sale",
                  icon: HomeIcon,
                  content: "Work with a real estate agent experienced in short sales to list your home at fair market value. Disclose to buyers that the sale is contingent on lender approval."
                },
                {
                  step: 4,
                  title: "Receive and Submit an Offer",
                  icon: DollarSign,
                  content: "When you receive a purchase offer, submit it to your lender along with your short sale package. The lender will review the offer and either approve, counter, or deny it."
                },
                {
                  step: 5,
                  title: "Wait for Lender Approval",
                  icon: Calendar,
                  content: "Lender approval can take 30-90 days (or longer). During this time, your lender will order a BPO (Broker Price Opinion) or appraisal to verify the home's value. Follow up weekly."
                },
                {
                  step: 6,
                  title: "Close the Sale",
                  icon: CheckCircle2,
                  content: "If your lender approves the short sale, you'll proceed to closing. The lender receives the sale proceeds, and you walk away with no mortgage debt (if they agree to waive the deficiency)."
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.step} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                          {item.step}
                        </span>
                        <Icon className="h-5 w-5 text-primary" />
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground">{item.content}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pros and Cons */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">Pros and Cons of Short Sales</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Avoid foreclosure and its credit damage</li>
                    <li>• Less impact on credit score than foreclosure</li>
                    <li>• Potential to avoid deficiency judgment</li>
                    <li>• Control over the sale process</li>
                    <li>• May qualify for relocation assistance (up to $3,000)</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Disadvantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Still damages your credit (but less than foreclosure)</li>
                    <li>• Lender approval can take months</li>
                    <li>• No guarantee lender will approve</li>
                    <li>• May still owe deficiency if not waived</li>
                    <li>• Requires buyer willing to wait for approval</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-primary/5">
          <div className="container max-w-4xl">
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Need a Faster Solution?</h3>
                  <p className="text-lg text-muted-foreground">
                    Short sales can take 3-6 months and require lender approval. If you need to sell fast, EnterActDFW offers cash purchases that close in 7-10 days—no lender approval needed, no repairs, no commissions.
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
                    <Link href="/blog/texas-loan-modification-guide">
                      <span className="hover:text-primary cursor-pointer">Texas Loan Modification Guide</span>
                    </Link>
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/notice-of-default-action-plan">
                      <span className="hover:text-primary cursor-pointer">Notice of Default: Your 21-Day Action Plan</span>
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
