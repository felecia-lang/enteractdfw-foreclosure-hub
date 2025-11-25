import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Phone, Download, AlertTriangle, Clock, CheckCircle2, FileText, Users, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";

const actionSteps = [
  {
    step: 1,
    title: "Don't Panic—Read the Notice Carefully",
    timeframe: "Day 1",
    icon: FileText,
    description: "Take a deep breath. Receiving a Notice of Default is serious, but you still have time and options. Read the entire notice carefully to understand exactly what it says.",
    actions: [
      "Locate the date the notice was sent or posted",
      "Find the total amount needed to cure the default (reinstatement amount)",
      "Note the deadline to cure the default (typically 20-30 days in Texas)",
      "Identify who sent the notice (lender name and contact information)",
      "Check if there are any specific instructions or requirements",
      "Make copies of the notice for your records"
    ]
  },
  {
    step: 2,
    title: "Calculate Your Timeline",
    timeframe: "Day 1",
    icon: Clock,
    description: "Understanding your timeline is critical. In Texas, you typically have at least 20 days from receiving the notice to take action before the foreclosure process advances.",
    actions: [
      "Mark the notice date on your calendar",
      "Calculate your deadline to cure (usually 20 days from notice)",
      "Note that after this period, a Notice of Sale can be posted",
      "Remember: You have until 20 days before the foreclosure sale to reinstate",
      "Set reminders for key dates to ensure you don't miss deadlines"
    ]
  },
  {
    step: 3,
    title: "Gather Your Financial Documents",
    timeframe: "Days 1-2",
    icon: FileText,
    description: "Collect all relevant financial documents. You'll need these whether you're negotiating with your lender, seeking counseling, or exploring options to sell.",
    actions: [
      "Recent pay stubs or proof of income (last 2-3 months)",
      "Bank statements (last 2-3 months)",
      "Tax returns (last 2 years)",
      "Current mortgage statement showing balance and payment history",
      "List of monthly expenses and debts",
      "Hardship letter explaining why you fell behind (job loss, medical emergency, etc.)",
      "Any other financial documents (retirement accounts, assets, other debts)"
    ]
  },
  {
    step: 4,
    title: "Contact Your Mortgage Servicer Immediately",
    timeframe: "Days 2-3",
    icon: Phone,
    description: "Call your mortgage servicer's loss mitigation department as soon as possible. The earlier you contact them, the more options you may have available.",
    actions: [
      "Call the phone number on your Notice of Default",
      "Ask to speak with the Loss Mitigation or Foreclosure Prevention department",
      "Have your loan number and financial documents ready",
      "Ask about available options: loan modification, repayment plan, forbearance",
      "Request a complete breakdown of what you owe (principal, interest, fees, costs)",
      "Ask for the deadline to submit a loss mitigation application",
      "Take detailed notes: date, time, representative name, and what was discussed",
      "Request written confirmation of any agreements or next steps"
    ]
  },
  {
    step: 5,
    title: "Contact a HUD-Approved Housing Counselor",
    timeframe: "Days 3-5",
    icon: Users,
    description: "HUD-approved housing counselors provide free or low-cost advice and can help you understand your options and negotiate with your lender.",
    actions: [
      "Find a HUD-approved counselor at www.consumerfinance.gov/find-a-housing-counselor",
      "Schedule an appointment as soon as possible (many offer phone/video consultations)",
      "Bring all your financial documents to the appointment",
      "Discuss your situation honestly and explore all available options",
      "Ask the counselor to help you create an action plan",
      "Request assistance with completing loss mitigation applications if needed"
    ]
  },
  {
    step: 6,
    title: "Explore All Your Options",
    timeframe: "Days 5-10",
    icon: Home,
    description: "Based on your financial situation and goals, evaluate which option is best for you. Each has different requirements, timelines, and impacts.",
    actions: [
      "Reinstatement: Pay all past-due amounts to bring loan current (if you have funds)",
      "Loan Modification: Permanently change loan terms to make payments affordable",
      "Repayment Plan: Add extra to monthly payments to catch up over 3-6 months",
      "Forbearance: Temporarily reduce or pause payments (3-12 months)",
      "Refinance: Get a new loan with better terms (requires good credit and equity)",
      "Short Sale: Sell for less than owed with lender approval",
      "Deed in Lieu: Voluntarily transfer property to lender",
      "Sell to a cash buyer: Quick sale to avoid foreclosure (like EnterActDFW)",
      "Bankruptcy: Chapter 13 can stop foreclosure and allow catch-up over 3-5 years"
    ]
  },
  {
    step: 7,
    title: "Submit a Complete Loss Mitigation Application",
    timeframe: "Days 7-14",
    icon: FileText,
    description: "If you're pursuing a loan modification, repayment plan, or other lender assistance, submit a complete application as soon as possible.",
    actions: [
      "Request the application package from your servicer",
      "Complete all forms accurately and thoroughly",
      "Include all required documentation (income proof, bank statements, hardship letter)",
      "Make copies of everything before submitting",
      "Submit via certified mail or online portal (keep tracking confirmation)",
      "Follow up within 3-5 days to confirm receipt",
      "Respond promptly to any requests for additional information",
      "Know your rights: Servicers must review complete applications submitted more than 37 days before sale"
    ]
  },
  {
    step: 8,
    title: "Consider Selling Your Home Quickly",
    timeframe: "Days 10-20",
    icon: Home,
    description: "If you have equity or want to avoid foreclosure's credit impact, selling quickly may be your best option. EnterActDFW specializes in helping homeowners in this situation.",
    actions: [
      "Get a professional market analysis to understand your home's value",
      "Calculate your equity (market value minus what you owe)",
      "If you have equity: List with a realtor or sell to a cash buyer",
      "If underwater: Discuss short sale option with your lender",
      "Contact EnterActDFW for a fair, no-obligation cash offer",
      "Understand that selling stops foreclosure and may preserve your credit",
      "Move quickly—you need time to close before the foreclosure sale date"
    ]
  },
  {
    step: 9,
    title: "Know Your Rights and Protections",
    timeframe: "Ongoing",
    icon: CheckCircle2,
    description: "Federal and Texas laws provide important protections during the foreclosure process. Understanding your rights helps you make informed decisions.",
    actions: [
      "You have the right to reinstate your loan up to 20 days before the foreclosure sale",
      "Servicers must review you for loss mitigation if you apply more than 37 days before sale",
      "You cannot be foreclosed on while a complete loss mitigation application is pending",
      "You have the right to request information about your loan and foreclosure timeline",
      "You can dispute errors in your account or foreclosure process",
      "Scammers cannot charge upfront fees for foreclosure assistance",
      "You have the right to live in your home until the foreclosure sale is complete"
    ]
  },
  {
    step: 10,
    title: "Take Action—Don't Wait",
    timeframe: "Immediately",
    icon: AlertTriangle,
    description: "The worst thing you can do is ignore the notice. Every day that passes reduces your options. Take action now to protect your home and your future.",
    actions: [
      "Don't ignore letters or calls from your lender",
      "Don't pay anyone upfront fees for foreclosure help",
      "Don't sign over your deed to anyone promising to \"save\" your home",
      "Don't assume you have no options—you do",
      "Do act quickly—time is your most valuable resource",
      "Do seek help from legitimate sources (HUD counselors, attorneys, licensed real estate professionals)",
      "Do stay in your home—leaving doesn't stop foreclosure and may limit your options"
    ]
  }
];

export default function NoticeOfDefaultGuide() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Load checked items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notice-of-default-checklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load checklist progress:', e);
      }
    }
  }, []);

  // Save to localStorage whenever checkedItems changes
  useEffect(() => {
    if (Object.keys(checkedItems).length > 0) {
      localStorage.setItem('notice-of-default-checklist', JSON.stringify(checkedItems));
    }
  }, [checkedItems]);

  const handleCheckItem = (itemKey: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemKey]: checked
    }));
  };

  const clearProgress = () => {
    setCheckedItems({});
    localStorage.removeItem('notice-of-default-checklist');
    toast.success('Checklist progress cleared');
  };

  // Calculate progress
  const { totalItems, completedItems, progressPercentage } = useMemo(() => {
    const total = actionSteps.reduce((sum, step) => sum + step.actions.length, 0);
    const completed = Object.values(checkedItems).filter(Boolean).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      totalItems: total,
      completedItems: completed,
      progressPercentage: percentage
    };
  }, [checkedItems]);

  const downloadPDF = () => {
    window.open('/api/pdf/notice-of-default-checklist', '_blank');
    toast.success('PDF download started');
  };
  
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
            <Button variant="outline" size="sm" asChild>
              <TrackablePhoneLink phoneNumber="832-932-7585" showIcon>Call Now
              </TrackablePhoneLink>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-destructive/10 to-background border-b">
        <div className="container max-w-4xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  What to Do After Receiving a Notice of Default
                </h1>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <Button 
                    onClick={downloadPDF}
                    variant="outline"
                    className="flex items-center gap-2 border-[#00A6A6] text-[#00A6A6] hover:bg-[#00A6A6] hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button 
                    onClick={clearProgress}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Clear Progress
                  </Button>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                A step-by-step action guide to help you respond quickly, understand your options, and protect your home. Time is critical—follow these steps immediately.
              </p>
            </div>
          </div>

          <Alert className="border-destructive bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription className="text-base">
              <strong>Time-Sensitive:</strong> In Texas, you typically have 20-30 days from receiving this notice to take action before foreclosure proceedings advance. Don't wait—start with Step 1 today.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-8 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Action Summary</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Days 1-3</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Read notice, gather documents, contact your lender
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Days 3-10</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get counseling, explore options, submit applications
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Days 10-20</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Take decisive action: modify, sell, or reinstate
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="py-8 bg-muted/30">
        <div className="container max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Your Progress</h3>
                  <span className="text-sm font-medium text-muted-foreground">
                    {completedItems} of {totalItems} items completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {progressPercentage === 100 
                    ? "🎉 Congratulations! You've completed all action items." 
                    : progressPercentage >= 50
                    ? "Great progress! Keep going to complete your action plan."
                    : "Check off items as you complete them to track your progress."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            {actionSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.step} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className="h-6 w-6 text-primary" />
                          <span className="text-sm font-semibold text-primary">{step.timeframe}</span>
                        </div>
                        <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-3">Action Items:</h4>
                    <ul className="space-y-3">
                      {step.actions.map((action, index) => {
                        const itemKey = `step-${step.step}-action-${index}`;
                        const isChecked = checkedItems[itemKey] || false;
                        return (
                          <li key={index} className="flex items-start gap-3">
                            <Checkbox 
                              id={itemKey}
                              checked={isChecked}
                              onCheckedChange={(checked) => handleCheckItem(itemKey, checked as boolean)}
                              className="mt-0.5"
                            />
                            <label 
                              htmlFor={itemKey}
                              className={`text-muted-foreground cursor-pointer flex-1 ${isChecked ? 'line-through opacity-60' : ''}`}
                            >
                              {action}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Download Checklist CTA */}
      <section className="py-12 bg-primary/5">
        <div className="container max-w-3xl text-center">
          <Download className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Download Your Action Checklist
          </h2>
          <p className="text-muted-foreground mb-6">
            Get a printable PDF checklist to track your progress through each step. Stay organized and ensure you don't miss critical deadlines.
          </p>
          <Button size="lg" asChild>
            <Link href="/guides/notice-of-default/checklist">
              <Download className="h-5 w-5 mr-2" />
              <span>View Printable Checklist</span>
            </Link>
          </Button>
        </div>
      </section>

      {/* How EnterActDFW Can Help */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            How EnterActDFW Can Help You
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">Fast, Fair Cash Offers</h3>
                <p className="text-muted-foreground mb-4">
                  We can make you a no-obligation cash offer within 24 hours. If you have equity in your home or want to avoid foreclosure's credit damage, selling quickly may be your best option.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Close in as little as 7-10 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>No repairs, no fees, no commissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>We handle all paperwork and closing costs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">Expert Guidance & Support</h3>
                <p className="text-muted-foreground mb-4">
                  Agent Felecia Fair has helped over 200 Texas families navigate foreclosure. She'll walk you through your options with compassion and transparency—no pressure, just honest advice.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Free consultation to discuss your situation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Licensed Texas broker with foreclosure expertise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Local DFW team you can trust</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <TrackablePhoneLink phoneNumber="832-932-7585" showIcon>Call Felecia Fair: (832) 932-7585
              </TrackablePhoneLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">Your Rights as a Homeowner</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn about federal and Texas protections during foreclosure.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/knowledge-base/homeowner-rights">
                    <span>Read More</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">Options to Avoid Foreclosure</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore loan modifications, short sales, and other alternatives.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/knowledge-base/options">
                    <span>Read More</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">Support Directory</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find HUD counselors, legal aid, and hotlines in Texas.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/resources">
                    <span>View Resources</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-br from-[#00A6A6]/10 to-[#0A2342]/10">
        <div className="container max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A2342] mb-4">
              Don't Face Foreclosure Alone
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Get expert guidance and explore all your options. Schedule a free, no-obligation consultation with our team today.
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
                asChild
              >
                <a href="/#lead-form">
                  Schedule Free Consultation
                </a>
              </Button>
            </div>
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
                <li><Link href="/glossary"><span className="text-muted-foreground hover:text-primary cursor-pointer">Glossary</span></Link></li>
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
