import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Clock, 
  Phone, 
  FileText,
  CheckCircle2,
  Calendar,
  Mail,
  DollarSign
} from "lucide-react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import BookingModal from "@/components/BookingModal";
import SocialShareButtons from "@/components/SocialShareButtons";

const actionPlanData = [
  {
    day: "Day 1-2",
    title: "Read and Understand Your Notice",
    icon: FileText,
    priority: "critical",
    tasks: [
      "Read the entire Notice of Default carefully—don't skip any sections",
      "Identify the exact amount you owe (arrears + fees)",
      "Note the 'cure date'—the deadline to bring your loan current",
      "Confirm the foreclosure sale date (if listed)",
      "Check if the notice includes loss mitigation options"
    ],
    keyTakeaway: "You typically have 20 days from the Notice of Default to cure the default in Texas. Mark this date on your calendar immediately."
  },
  {
    day: "Day 3-5",
    title: "Contact Your Mortgage Servicer",
    icon: Phone,
    priority: "critical",
    tasks: [
      "Call your servicer's loss mitigation department (not customer service)",
      "Ask for a complete payoff statement and reinstatement quote",
      "Request information about all available loss mitigation options",
      "Ask if you qualify for a forbearance, repayment plan, or loan modification",
      "Document the call: date, time, representative name, and what was discussed"
    ],
    keyTakeaway: "Do NOT avoid your servicer's calls. Engaging early gives you the most options and strongest negotiating position."
  },
  {
    day: "Day 6-8",
    title: "Gather Financial Documentation",
    icon: FileText,
    priority: "high",
    tasks: [
      "Collect 2 most recent pay stubs or proof of income",
      "Gather 2 most recent bank statements (all accounts)",
      "Prepare tax returns from the past 2 years",
      "Document all monthly expenses (utilities, insurance, food, etc.)",
      "Write a hardship letter explaining why you fell behind"
    ],
    keyTakeaway: "Most loss mitigation applications require complete financial documentation. Missing documents delay processing and waste precious time."
  },
  {
    day: "Day 9-12",
    title: "Explore Your Options",
    icon: DollarSign,
    priority: "high",
    tasks: [
      "Evaluate reinstatement: Can you pay the full arrears by the cure date?",
      "Consider forbearance: Temporary payment suspension while you recover financially",
      "Explore loan modification: Permanently reduce your monthly payment",
      "Research short sale: Sell your home for less than you owe (with lender approval)",
      "Assess cash sale: Sell quickly to a cash buyer and avoid foreclosure"
    ],
    keyTakeaway: "You have multiple options. The right choice depends on your financial situation, equity position, and long-term goals."
  },
  {
    day: "Day 13-16",
    title: "Submit Loss Mitigation Application",
    icon: Mail,
    priority: "critical",
    tasks: [
      "Complete your servicer's loss mitigation application in full",
      "Attach all required financial documents",
      "Include your hardship letter explaining your situation",
      "Submit via certified mail OR upload through servicer's online portal",
      "Keep copies of everything you submit"
    ],
    keyTakeaway: "Federal law requires servicers to review complete applications submitted more than 37 days before foreclosure sale. Submit ASAP."
  },
  {
    day: "Day 17-20",
    title: "Follow Up and Make a Decision",
    icon: CheckCircle2,
    priority: "critical",
    tasks: [
      "Call your servicer to confirm they received your application",
      "Ask for a timeline: when will you receive a decision?",
      "If approved for a plan, review terms carefully before accepting",
      "If denied, ask why and whether you can appeal",
      "If no solution is reached, decide: fight foreclosure, sell, or walk away"
    ],
    keyTakeaway: "If you can't cure the default or secure a modification, selling your home (traditional or cash sale) may be your best option to avoid foreclosure."
  },
  {
    day: "Day 21+",
    title: "Take Action",
    icon: AlertTriangle,
    priority: "critical",
    tasks: [
      "If you secured a modification or repayment plan: make your first payment on time",
      "If selling: list your home immediately or contact a cash buyer",
      "If fighting foreclosure: consult a foreclosure defense attorney",
      "If walking away: understand deficiency judgment risks in Texas",
      "Continue communicating with your servicer—don't go silent"
    ],
    keyTakeaway: "After Day 20, foreclosure can accelerate quickly. Whatever path you choose, act decisively and document everything."
  }
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Received a Notice of Default in Texas? Your 21-Day Action Plan",
  "description": "Complete day-by-day action plan for Texas homeowners who received a Notice of Default. Learn what to do in each of the critical 21 days to maximize your chances of saving your home.",
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
  "datePublished": "2026-02-20",
  "dateModified": "2026-02-20"
};

export default function NoticeOfDefaultActionPlan() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <Helmet>
        <title>Received a Notice of Default in Texas? Your 21-Day Action Plan</title>
        <meta name="description" content="Complete day-by-day action plan for Texas homeowners who received a Notice of Default. Learn what to do in each of the critical 21 days to save your home or exit with dignity." />
        <meta property="og:title" content="Notice of Default in Texas: Your 21-Day Action Plan" />
        <meta property="og:description" content="Day-by-day guide for Texas homeowners facing foreclosure. Expert strategies to maximize your options in the critical 21-day cure period." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Notice of Default in Texas: Your 21-Day Action Plan" />
        <meta name="twitter:description" content="Complete action plan for the 21-day cure period after receiving a Notice of Default in Texas." />
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
              Received a Notice of Default in Texas? Your 21-Day Action Plan
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              The clock is ticking—you have 21 days to cure the default before foreclosure proceedings accelerate. This comprehensive action plan shows you exactly what to do in each of those 21 days to maximize your chances of saving your home or exiting with dignity.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Published: February 20, 2026</span>
                <span>•</span>
                <span>15 min read</span>
              </div>
              <SocialShareButtons 
                url={typeof window !== 'undefined' ? window.location.href : 'https://enteractdfw.com/blog/notice-of-default-action-plan'}
                title="Received a Notice of Default in Texas? Your 21-Day Action Plan"
                description="Complete day-by-day action plan for the critical 21-day cure period after receiving a Notice of Default in Texas."
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
                <strong>URGENT:</strong> In Texas, you typically have only 20 days from the Notice of Default to cure the default and stop foreclosure. Every day counts. If you're reading this on Day 15 or later, call EnterActDFW immediately at <strong>(832) 346-9569</strong> for emergency assistance.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-foreground">
                Receiving a Notice of Default is terrifying. Your heart sinks. Your stomach drops. You feel like you're losing control. But here's the truth: <strong>you still have options</strong>—if you act fast.
              </p>
              <p className="text-lg text-foreground">
                This guide breaks down exactly what to do in each phase of the 21-day cure period. Follow this plan, and you'll maximize your chances of saving your home, securing a loan modification, or selling before foreclosure damages your credit.
              </p>
            </div>
          </div>
        </section>

        {/* Day-by-Day Action Plan */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-8">Your 21-Day Action Plan</h2>
            <div className="space-y-8">
              {actionPlanData.map((phase, index) => {
                const Icon = phase.icon;
                return (
                  <Card key={index} className={`border-2 ${phase.priority === 'critical' ? 'border-destructive' : 'border-primary'}`}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${phase.priority === 'critical' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                          <Icon className={`h-6 w-6 ${phase.priority === 'critical' ? 'text-destructive' : 'text-primary'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${phase.priority === 'critical' ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}`}>
                              {phase.day}
                            </span>
                          </div>
                          <CardTitle className="text-2xl">{phase.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Action Steps:</h4>
                          <ul className="space-y-2">
                            {phase.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-foreground">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Alert className="bg-muted">
                          <AlertDescription>
                            <strong>Key Takeaway:</strong> {phase.keyTakeaway}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-primary/5">
          <div className="container max-w-4xl">
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Running Out of Time?</h3>
                  <p className="text-lg text-muted-foreground">
                    If you're past Day 15 or overwhelmed by the process, EnterActDFW can help. We specialize in fast cash offers that close in 7-10 days—giving you a clean exit before foreclosure hits your credit.
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
                    <Link href="/blog/warning-signs-foreclosure-texas">
                      <span className="hover:text-primary cursor-pointer">10 Warning Signs You're Heading Toward Foreclosure</span>
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
                  <li><Link href="/resources"><span className="text-muted-foreground hover:text-primary cursor-pointer">Free Resources</span></Link></li>
                  <li><Link href="/faq"><span className="text-muted-foreground hover:text-primary cursor-pointer">FAQ</span></Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Phone: (832) 346-9569</li>
                  <li>Email: info@enteractdfw.com</li>
                  <li>4400 State Hwy 121, Suite 300</li>
                  <li>Lewisville, Texas 75056</li>
                </ul>
              </div>
            </div>
            <div className="border-t pt-8 text-center text-sm text-muted-foreground">
              <p className="mb-4">
                Legal Disclaimer: This information is for educational purposes only and is not legal advice. EnterActDFW is a licensed real estate brokerage in Texas. For legal guidance, consult an attorney or HUD-approved housing counselor.
              </p>
              <p>© 2025 EnterActDFW. All rights reserved. | <Link href="/privacy"><span className="hover:text-primary cursor-pointer">Privacy Policy</span></Link> | <Link href="/terms"><span className="hover:text-primary cursor-pointer">Terms of Service</span></Link></p>
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
