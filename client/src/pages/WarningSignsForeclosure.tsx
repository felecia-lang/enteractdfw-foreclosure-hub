import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  TrendingDown, 
  CreditCard, 
  Phone, 
  FileText,
  DollarSign,
  Home as HomeIcon,
  Clock,
  Mail,
  Scale,
  CheckCircle2
} from "lucide-react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import BookingModal from "@/components/BookingModal";
import SocialShareButtons from "@/components/SocialShareButtons";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const warningSignsData = [
  {
    id: 1,
    icon: CreditCard,
    title: "You're Using Credit Cards to Pay Your Mortgage",
    description: "If you're relying on credit cards, payday loans, or cash advances to make your monthly mortgage payment, you're entering dangerous territory. This creates a debt spiral where high-interest credit card debt compounds your financial problems.",
    severity: "critical",
    actionSteps: [
      "Stop using credit to pay your mortgage immediately",
      "Contact a HUD-approved housing counselor to review your budget",
      "Explore loan modification or forbearance options with your lender",
      "Consider selling your home before you fall behind on payments"
    ]
  },
  {
    id: 2,
    icon: TrendingDown,
    title: "Your Income Has Dropped Significantly",
    description: "Job loss, reduced hours, medical leave, or business income decline can make your mortgage unaffordable. If your income has dropped by 20% or more and your mortgage payment now exceeds 43% of your gross monthly income, you're at high risk.",
    severity: "critical",
    actionSteps: [
      "Document your income change with pay stubs or tax returns",
      "Contact your mortgage servicer immediately to discuss hardship options",
      "Apply for unemployment benefits or disability if eligible",
      "Explore short-term forbearance to buy time while you stabilize income"
    ]
  },
  {
    id: 3,
    icon: DollarSign,
    title: "You're Skipping Other Bills to Pay Your Mortgage",
    description: "If you're consistently late on utilities, car payments, medical bills, or credit cards because you're prioritizing your mortgage, you're robbing Peter to pay Paul. This strategy is unsustainable and indicates you're overextended.",
    severity: "warning",
    actionSteps: [
      "Create a realistic budget that accounts for all essential expenses",
      "Prioritize necessities: food, utilities, transportation, then housing",
      "Contact your lender to discuss payment reduction options",
      "Consider whether keeping the home is financially viable long-term"
    ]
  },
  {
    id: 4,
    icon: Clock,
    title: "You've Missed One or More Mortgage Payments",
    description: "Missing even one mortgage payment is a red flag. After 30 days, you're officially delinquent. After 90 days, your lender can begin foreclosure proceedings. After 120 days, foreclosure is almost certain unless you take immediate action.",
    severity: "critical",
    actionSteps: [
      "Contact your servicer's loss mitigation department immediately",
      "Request a forbearance or repayment plan to catch up",
      "Submit a complete loss mitigation application if you're past 90 days",
      "Use our Timeline Calculator to understand your exact deadlines"
    ]
  },
  {
    id: 5,
    icon: Mail,
    title: "You're Avoiding Calls and Letters from Your Lender",
    description: "Ignoring your mortgage servicer's calls, emails, and letters is one of the worst mistakes you can make. Lenders are required to offer loss mitigation options, but only if you engage with them. Avoidance eliminates your options.",
    severity: "critical",
    actionSteps: [
      "Answer the phone when your servicer calls",
      "Open and read all mail from your lender immediately",
      "Document all conversations with dates, times, and representative names",
      "Respond to requests for financial documents within the deadline"
    ]
  },
  {
    id: 6,
    icon: Scale,
    title: "Your Mortgage Payment is More Than 43% of Your Income",
    description: "The Consumer Financial Protection Bureau considers a debt-to-income ratio above 43% to be financially unstable. If your mortgage payment (including taxes and insurance) exceeds 43% of your gross monthly income, you're house-poor and vulnerable to foreclosure.",
    severity: "warning",
    actionSteps: [
      "Calculate your true debt-to-income ratio including all debts",
      "Explore loan modification to reduce your monthly payment",
      "Consider refinancing if you have equity and good credit",
      "Evaluate whether selling now prevents future foreclosure"
    ]
  },
  {
    id: 7,
    icon: TrendingDown,
    title: "You Have No Emergency Savings",
    description: "If you have less than three months of mortgage payments saved and you're living paycheck to paycheck, a single unexpected expense (car repair, medical bill, job loss) can trigger a foreclosure cascade.",
    severity: "warning",
    actionSteps: [
      "Build a $1,000 emergency fund as quickly as possible",
      "Cut discretionary spending to create a financial buffer",
      "Explore side income opportunities to increase cash flow",
      "Consider downsizing to a more affordable home before crisis hits"
    ]
  },
  {
    id: 8,
    icon: FileText,
    title: "You're Receiving Pre-Foreclosure Notices",
    description: "If you've received a Notice of Default, Notice of Acceleration, or Notice of Trustee Sale, foreclosure is no longer a risk—it's actively happening. In Texas, you may have as little as 21 days from the first notice to the foreclosure sale.",
    severity: "critical",
    actionSteps: [
      "Read the notice carefully and note all deadlines",
      "Contact a foreclosure defense attorney immediately",
      "File for bankruptcy if you need to stop the sale (consult attorney first)",
      "Contact EnterActDFW for a fast cash offer to sell before the auction"
    ]
  },
  {
    id: 9,
    icon: HomeIcon,
    title: "Your Home is Worth Less Than You Owe (Underwater)",
    description: "If your home's market value is less than your mortgage balance, you're underwater. This makes refinancing impossible and leaves you with no equity cushion. If you also face financial hardship, foreclosure risk is extremely high.",
    severity: "warning",
    actionSteps: [
      "Get a professional home valuation to know your true equity position",
      "Explore short sale options with your lender's approval",
      "Contact EnterActDFW to discuss cash offer options",
      "Do not attempt to refinance—you won't qualify without equity"
    ]
  },
  {
    id: 10,
    icon: Phone,
    title: "You're Receiving Calls from 'Foreclosure Rescue' Companies",
    description: "If you're getting unsolicited calls, emails, or door-knocks from companies promising to 'save your home' for an upfront fee, you're likely already on a public foreclosure list. This means a Notice of Default has been filed and your situation is public record.",
    severity: "warning",
    actionSteps: [
      "Never pay upfront fees for foreclosure assistance",
      "Verify you're not already in foreclosure by checking county records",
      "Work only with HUD-approved housing counselors (free service)",
      "Contact EnterActDFW for legitimate, no-fee assistance"
    ]
  }
];

export default function WarningSignsForeclosure() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "10 Warning Signs You're Heading Toward Foreclosure in Texas",
    "description": "Learn the early warning signs of foreclosure in Texas and what action steps to take before it's too late. Expert guidance from licensed Texas real estate brokers.",
    "author": {
      "@type": "Organization",
      "name": "EnterActDFW"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EnterActDFW",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.enteractdfw.com/enteractdfw-logo.png"
      }
    },
    "datePublished": "2026-02-19",
    "dateModified": "2026-02-19",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.enteractdfw.com/blog/warning-signs-foreclosure-texas"
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50";
      case "warning":
        return "border-orange-500 bg-orange-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold"><AlertTriangle className="h-3 w-3" /> Critical</span>;
      case "warning":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold"><Clock className="h-3 w-3" /> Warning</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>10 Warning Signs You're Heading Toward Foreclosure in Texas</title>
        <meta name="description" content="Recognize the early warning signs of foreclosure in Texas before it's too late. Expert guidance on what to do if you're struggling with mortgage payments in Dallas-Fort Worth." />
        <meta property="og:title" content="10 Warning Signs You're Heading Toward Foreclosure in Texas" />
        <meta property="og:description" content="Recognize the early warning signs of foreclosure in Texas before it's too late. Expert guidance on what to do if you're struggling with mortgage payments." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="10 Warning Signs You're Heading Toward Foreclosure in Texas" />
        <meta name="twitter:description" content="Recognize the early warning signs of foreclosure in Texas before it's too late." />
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
              <Link href="/knowledge-base">
                <span className="text-sm text-primary hover:underline cursor-pointer">← Back to Knowledge Base</span>
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              10 Warning Signs You're Heading Toward Foreclosure in Texas
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Recognize the early warning signs before it's too late. Most homeowners don't realize they're in foreclosure danger until they receive the Notice of Default—but by then, your options are limited. Learn what to watch for and what action steps to take now.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Published: February 19, 2026</span>
                <span>•</span>
                <span>12 min read</span>
              </div>
              <SocialShareButtons 
                url={typeof window !== 'undefined' ? window.location.href : 'https://enteractdfw.com/blog/warning-signs-foreclosure-texas'}
                title="10 Warning Signs You're Heading Toward Foreclosure in Texas"
                description="Recognize the early warning signs of foreclosure in Texas before it's too late. Expert guidance from EnterActDFW."
              />
            </div>
          </div>
        </section>

        {/* Introduction Alert */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <Alert className="bg-primary/10 border-primary">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <AlertDescription className="text-foreground">
                <strong>Time-Sensitive Information:</strong> If you're experiencing three or more of these warning signs, you're at high risk of foreclosure. Contact a HUD-approved housing counselor immediately at <strong>1-888-995-HOPE (4673)</strong> or call EnterActDFW at <strong>(832) 346-9569</strong> for a free consultation.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <div className="space-y-8">
              {warningSignsData.map((sign, index) => {
                const Icon = sign.icon;
                return (
                  <Card key={sign.id} className={`border-2 ${getSeverityColor(sign.severity)}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-muted-foreground">Warning Sign #{sign.id}</span>
                              {getSeverityBadge(sign.severity)}
                            </div>
                            <CardTitle className="text-2xl">{sign.title}</CardTitle>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">
                        {sign.description}
                      </p>
                      <div className="bg-background rounded-lg p-4 border">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          What to Do Right Now:
                        </h4>
                        <ul className="space-y-2">
                          {sign.actionSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary font-bold mt-0.5">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mid-Article CTA */}
        <section className="py-12 bg-primary/5">
          <div className="container max-w-4xl">
            <Card className="border-2 border-primary">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Facing Foreclosure? Calculate Your Timeline Now
                </h3>
                <p className="text-muted-foreground mb-6">
                  Use our free Texas Foreclosure Timeline Calculator to see exactly how much time you have and what steps to take at each stage.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/timeline-calculator">
                      <span>Calculate My Timeline</span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setShowBookingModal(true)}>
                    <Phone className="h-5 w-5 mr-2" />
                    Schedule Free Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What to Do Next Section */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              What to Do If You Recognize These Warning Signs
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                If you're experiencing one or more of these warning signs, you're not alone—and you still have options. The key is to act quickly and strategically. Here's your immediate action plan:
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Step 1: Face the Reality of Your Situation</h3>
              <p>
                Denial and avoidance are the enemies of foreclosure prevention. The sooner you acknowledge the problem, the more options you'll have. Calculate your true debt-to-income ratio, review your budget honestly, and determine whether your current home is financially sustainable.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Step 2: Contact Your Mortgage Servicer Immediately</h3>
              <p>
                Call your lender's loss mitigation department and explain your situation. Ask about forbearance, repayment plans, or loan modification programs. Federal law requires lenders to offer loss mitigation options if you submit a complete application at least 37 days before a foreclosure sale.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Step 3: Get Free Professional Help</h3>
              <p>
                Contact a HUD-approved housing counselor at <strong>1-888-995-HOPE (4673)</strong>. These counselors are free, unbiased, and trained to help you explore all your options. They can review your budget, negotiate with your lender, and help you apply for assistance programs.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Step 4: Consider Selling Before Foreclosure</h3>
              <p>
                If you can't afford your mortgage long-term, selling your home before foreclosure may be your best option. This allows you to avoid the credit damage of foreclosure, potentially walk away with cash, and move forward with dignity. EnterActDFW specializes in fast cash purchases and can close in as little as 7-10 days.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Step 5: Understand Your Timeline</h3>
              <p>
                Use our <Link href="/timeline-calculator"><span className="text-primary hover:underline cursor-pointer">Texas Foreclosure Timeline Calculator</span></Link> to see exactly how much time you have from your Notice of Default to the foreclosure sale. In Texas, the process moves fast—you may have as little as 41 days from the first notice to the auction.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-12 bg-gradient-to-b from-background to-primary/5">
          <div className="container max-w-4xl">
            <Card className="border-2 border-primary shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    Need Help Right Now?
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    EnterActDFW has helped over 200 Texas families avoid foreclosure. We offer free consultations, fair cash offers, and fast closings (7-10 days). No pressure, no judgment—just honest guidance.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" asChild>
                    <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>
                      Call (832) 346-9569 Now
                    </TrackablePhoneLink>
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setShowBookingModal(true)}>
                    Schedule Free Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container max-w-2xl">
            <NewsletterSignup variant="inline" />
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-12 bg-muted/30">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/timeline-calculator">
                      <span className="text-primary hover:underline cursor-pointer">
                        Texas Foreclosure Timeline Calculator
                      </span>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Calculate your exact foreclosure timeline and see what action steps to take at each stage.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/guides/notice-of-default">
                      <span className="text-primary hover:underline cursor-pointer">
                        What to Do When You Receive a Notice of Default
                      </span>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Step-by-step action guide for the first 21 days after receiving your Notice of Default.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/knowledge-base/options-to-avoid-foreclosure">
                      <span className="text-primary hover:underline cursor-pointer">
                        7 Options to Avoid Foreclosure in Texas
                      </span>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Explore all your alternatives including loan modification, forbearance, short sale, and more.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/contacting-lender-guide">
                      <span className="text-primary hover:underline cursor-pointer">
                        How to Contact Your Lender: Scripts & Templates
                      </span>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Professional phone scripts, email templates, and hardship letter samples for effective communication.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-12">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Licensed Texas real estate brokerage specializing in foreclosure prevention and distressed property solutions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/knowledge-base"><span className="hover:text-primary cursor-pointer">Knowledge Base</span></Link></li>
                  <li><Link href="/timeline-calculator"><span className="hover:text-primary cursor-pointer">Timeline Calculator</span></Link></li>
                  <li><Link href="/resources"><span className="hover:text-primary cursor-pointer">Free Resources</span></Link></li>
                  <li><Link href="/faq"><span className="hover:text-primary cursor-pointer">FAQ</span></Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/about"><span className="hover:text-primary cursor-pointer">About Us</span></Link></li>
                  <li><Link href="/success-stories"><span className="hover:text-primary cursor-pointer">Success Stories</span></Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>(832) 346-9569</li>
                  <li>info@enteractdfw.com</li>
                  <li>4400 State Hwy 121, Suite 300</li>
                  <li>Lewisville, TX 75056</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>

        {/* Booking Modal */}
        <BookingModal 
          open={showBookingModal} 
          onOpenChange={setShowBookingModal}
        />
      </div>
    </>
  );
}
