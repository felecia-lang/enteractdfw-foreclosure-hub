import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Gavel, 
  DollarSign, 
  FileText,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Phone,
  Clock
} from "lucide-react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import BookingModal from "@/components/BookingModal";
import SocialShareButtons from "@/components/SocialShareButtons";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Texas Foreclosure Auction: What Happens on Sale Day",
  "description": "Complete guide to Texas foreclosure auctions. Learn what happens on sale day, who can bid, how to stop the auction, and what happens after your home is sold.",
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
  "datePublished": "2026-02-23",
  "dateModified": "2026-02-23"
};

export default function ForeclosureAuctionGuide() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <Helmet>
        <title>Texas Foreclosure Auction: What Happens on Sale Day</title>
        <meta name="description" content="Complete guide to Texas foreclosure auctions. Learn what happens on sale day, who can bid, how to stop the auction, and what happens after your home is sold." />
        <meta property="og:title" content="Texas Foreclosure Auction: What Happens on Sale Day" />
        <meta property="og:description" content="Understand the Texas foreclosure auction process. Learn what to expect on sale day and your options to stop it." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Texas Foreclosure Auction Guide" />
        <meta name="twitter:description" content="What happens at a Texas foreclosure auction? Complete guide to sale day and your options." />
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
              Texas Foreclosure Auction: What Happens on Sale Day
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Texas foreclosure auctions happen fast—on the first Tuesday of every month, at the county courthouse, between 10 AM and 4 PM. If you're facing a foreclosure sale, understanding the auction process is critical. This guide explains what happens on sale day, who can bid, and your last-minute options to stop the auction.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Published: February 23, 2026</span>
                <span>•</span>
                <span>10 min read</span>
              </div>
              <SocialShareButtons 
                url={typeof window !== 'undefined' ? window.location.href : 'https://enteractdfw.com/blog/texas-foreclosure-auction-guide'}
                title="Texas Foreclosure Auction: What Happens on Sale Day"
                description="Complete guide to Texas foreclosure auctions. Learn what happens on sale day and your options to stop it."
              />
            </div>
          </div>
        </section>

        {/* Critical Alert */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <Alert className="bg-destructive/10 border-destructive">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDescription className="text-foreground">
                <strong>URGENT:</strong> You can stop a foreclosure auction up until the moment the auctioneer's gavel falls—but only by paying off the full loan balance, filing bankruptcy, or securing a temporary restraining order. If you're within 7 days of your sale date, call EnterActDFW immediately at <strong>(832) 346-9569</strong>.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-foreground">
                Texas is a <strong>non-judicial foreclosure state</strong>, which means lenders don't need to go to court to foreclose on your home. Instead, they follow a strict timeline outlined in the Texas Property Code, culminating in a public auction at the county courthouse.
              </p>
              <p className="text-lg text-foreground">
                Foreclosure auctions in Texas happen on the <strong>first Tuesday of every month</strong>, between 10 AM and 4 PM, on the steps of the county courthouse (or in a designated area). The entire auction can be over in minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">What Happens Before the Auction?</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Notice of Default (20 days before auction)",
                  description: "Your lender sends a Notice of Default giving you 20 days to cure the default by paying all arrears plus fees."
                },
                {
                  title: "Notice of Sale (21 days before auction)",
                  description: "Your lender files a Notice of Sale with the county clerk and posts it at the courthouse. This notice lists the auction date, time, and property description."
                },
                {
                  title: "Final Opportunity to Stop the Sale",
                  description: "You have until the moment the auctioneer's gavel falls to stop the sale by paying off the loan, filing bankruptcy, or securing a court order."
                }
              ].map((item, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What Happens on Sale Day */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">What Happens on Auction Day?</h2>
            <div className="space-y-6">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    The Auction Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">1.</span>
                      <span><strong>10 AM - 4 PM:</strong> The auction must occur within this window on the first Tuesday of the month.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">2.</span>
                      <span><strong>Location:</strong> The auction takes place on the courthouse steps or in a designated area (check your Notice of Sale for the exact location).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">3.</span>
                      <span><strong>Opening Bid:</strong> The lender (or their representative) makes the opening bid, typically equal to the loan balance plus fees and costs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">4.</span>
                      <span><strong>Public Bidding:</strong> Anyone can bid, but bidders must pay cash or certified funds on the spot. Most auctions have no third-party bidders—the lender wins by default.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">5.</span>
                      <span><strong>Highest Bidder Wins:</strong> The highest bidder receives a Trustee's Deed, which transfers ownership immediately.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">6.</span>
                      <span><strong>No Right of Redemption:</strong> Texas does not have a redemption period. Once the gavel falls, you lose all ownership rights.</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* After the Auction */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">What Happens After the Auction?</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>If the Lender Wins (Most Common)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>The lender becomes the new owner and will send you an eviction notice (typically 3-30 days to vacate).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>If you don't leave voluntarily, the lender will file for eviction in court.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>You may owe a deficiency judgment if the auction price was less than your loan balance (though this is rare in Texas).</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>If a Third Party Wins</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>The winning bidder becomes the new owner and will send you an eviction notice.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>If the sale price exceeded your loan balance, you may be entitled to the surplus (after all liens are paid).</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How to Stop */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">How to Stop a Foreclosure Auction</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Pay Off the Loan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">Pay the full loan balance plus fees and costs before the gavel falls. This is the only guaranteed way to stop the auction.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">File Bankruptcy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">Filing Chapter 13 bankruptcy triggers an automatic stay, which stops the auction immediately (but you must catch up on payments through a repayment plan).</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Sell Before Auction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">Sell your home to a cash buyer before the auction date. EnterActDFW can close in 7-10 days, even if your sale is scheduled for next week.</p>
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
                  <h3 className="text-2xl font-bold text-foreground">Auction Scheduled? We Can Help.</h3>
                  <p className="text-lg text-muted-foreground">
                    If your foreclosure auction is scheduled within the next 30 days, EnterActDFW can make a cash offer and close before the sale date—stopping the auction and protecting your credit.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={() => setShowBookingModal(true)}>
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule Emergency Consultation
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
                    <Link href="/timeline-calculator">
                      <span className="hover:text-primary cursor-pointer">Texas Foreclosure Timeline Calculator</span>
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
