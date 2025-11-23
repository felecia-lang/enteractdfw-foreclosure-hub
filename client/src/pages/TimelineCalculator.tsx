import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Download,
  Home as HomeIcon,
  ArrowRight
} from "lucide-react";

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

export default function TimelineCalculator() {
  const [noticeDate, setNoticeDate] = useState<string>("");
  const [timeline, setTimeline] = useState<TimelineMilestone[] | null>(null);
  const [daysUntilSale, setDaysUntilSale] = useState<number | null>(null);

  const calculateTimeline = (noticeDateStr: string): TimelineMilestone[] => {
    const notice = new Date(noticeDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    notice.setHours(0, 0, 0, 0);

    const addDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const getStatus = (milestoneDate: Date): "past" | "current" | "upcoming" => {
      const diffDays = Math.floor((milestoneDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return "past";
      if (diffDays <= 3) return "current";
      return "upcoming";
    };

    const milestones: TimelineMilestone[] = [
      {
        id: "notice-received",
        title: "Notice of Default Received",
        date: notice,
        daysFromNotice: 0,
        description: "You received your first official notice that your mortgage is in default.",
        actionItems: [
          "Read the entire notice carefully",
          "Note all important dates and deadlines",
          "Gather financial documents (pay stubs, bank statements, tax returns)",
          "Contact your mortgage servicer immediately"
        ],
        urgency: "warning",
        status: getStatus(notice)
      },
      {
        id: "contact-lender",
        title: "Contact Your Lender (Days 1-7)",
        date: addDays(notice, 7),
        daysFromNotice: 7,
        description: "Critical window to discuss options with your mortgage servicer.",
        actionItems: [
          "Call your servicer's loss mitigation department",
          "Ask about forbearance and loan modification programs",
          "Request a repayment plan if you can catch up",
          "Document all conversations (date, time, representative name)"
        ],
        urgency: "critical",
        status: getStatus(addDays(notice, 7))
      },
      {
        id: "seek-counseling",
        title: "Seek Professional Help (Days 7-14)",
        date: addDays(notice, 14),
        daysFromNotice: 14,
        description: "Get free advice from HUD-approved housing counselors.",
        actionItems: [
          "Contact HUD-approved housing counselor (1-800-569-4287)",
          "Consult with a foreclosure attorney",
          "Review all your options (modification, short sale, cash sale)",
          "Create a hardship letter explaining your situation"
        ],
        urgency: "warning",
        status: getStatus(addDays(notice, 14))
      },
      {
        id: "apply-assistance",
        title: "Apply for Loss Mitigation (Days 14-30)",
        date: addDays(notice, 30),
        daysFromNotice: 30,
        description: "Submit applications for loan modification or other assistance programs.",
        actionItems: [
          "Complete loss mitigation application",
          "Submit all required financial documents",
          "Follow up weekly on application status",
          "Consider backup options if application is denied"
        ],
        urgency: "warning",
        status: getStatus(addDays(notice, 30))
      },
      {
        id: "notice-acceleration",
        title: "Notice of Acceleration (Days 60-90)",
        date: addDays(notice, 75),
        daysFromNotice: 75,
        description: "Lender demands full loan balance be paid immediately.",
        actionItems: [
          "Evaluate if you can pay off the loan or reinstate",
          "If not, seriously consider selling your home",
          "Contact EnterActDFW for a fast cash offer",
          "Explore short sale with your lender's approval"
        ],
        urgency: "critical",
        status: getStatus(addDays(notice, 75))
      },
      {
        id: "notice-sale-posted",
        title: "Notice of Sale Posted (Day 90-120)",
        date: addDays(notice, 105),
        daysFromNotice: 105,
        description: "Property is officially posted for foreclosure auction (21 days' notice required).",
        actionItems: [
          "You still have time to sell or reinstate",
          "Contact EnterActDFW for immediate cash offer (close in 7-10 days)",
          "File for bankruptcy only as last resort (consult attorney)",
          "Start planning for relocation if necessary"
        ],
        urgency: "critical",
        status: getStatus(addDays(notice, 105))
      },
      {
        id: "foreclosure-sale",
        title: "Foreclosure Sale Date (Day 120+)",
        date: addDays(notice, 126),
        daysFromNotice: 126,
        description: "Property will be sold at public auction at the county courthouse.",
        actionItems: [
          "Last chance to reinstate by paying past-due amounts",
          "Property sold to highest bidder at auction",
          "You may still be able to negotiate with new owner",
          "Prepare to vacate the property"
        ],
        urgency: "critical",
        status: getStatus(addDays(notice, 126))
      }
    ];

    return milestones;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeDate) return;

    const milestones = calculateTimeline(noticeDate);
    setTimeline(milestones);

    // Calculate days until foreclosure sale
    const saleDate = milestones.find(m => m.id === "foreclosure-sale")?.date;
    if (saleDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = saleDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilSale(diffDays);
    }
  };

  const handleReset = () => {
    setNoticeDate("");
    setTimeline(null);
    setDaysUntilSale(null);
  };

  const handleDownloadPDF = async () => {
    if (!timeline || !noticeDate) return;

    try {
      const response = await fetch('/api/pdf/personalized-timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noticeDate,
          milestones: timeline
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'My_Foreclosure_Timeline.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const getUrgencyColor = (urgency: "critical" | "warning" | "safe") => {
    switch (urgency) {
      case "critical":
        return "border-red-500 bg-red-50";
      case "warning":
        return "border-orange-500 bg-orange-50";
      case "safe":
        return "border-green-500 bg-green-50";
    }
  };

  const getUrgencyIcon = (urgency: "critical" | "warning" | "safe") => {
    switch (urgency) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "safe":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
  };

  const getStatusBadge = (status: "past" | "current" | "upcoming") => {
    switch (status) {
      case "past":
        return <span className="text-xs font-medium text-muted-foreground">Completed</span>;
      case "current":
        return <span className="text-xs font-medium text-primary">Action Required Now</span>;
      case "upcoming":
        return <span className="text-xs font-medium text-muted-foreground">Upcoming</span>;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
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
              <a href="tel:+18329327585">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Calendar className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Foreclosure Timeline Calculator</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Enter your Notice of Default date to see your personalized timeline with key deadlines and action items.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="py-12">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your Timeline</CardTitle>
              <CardDescription>
                Enter the date you received your Notice of Default to generate your personalized foreclosure timeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="noticeDate">Notice of Default Date *</Label>
                  <Input
                    id="noticeDate"
                    type="date"
                    value={noticeDate}
                    onChange={(e) => setNoticeDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    This is the date on your Notice of Default letter, not the date you received it.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Calculate Timeline
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {timeline && (
                    <>
                      <Button type="button" variant="outline" onClick={handleDownloadPDF}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" onClick={handleReset}>
                        Reset
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline Results */}
      {timeline && daysUntilSale !== null && (
        <>
          {/* Urgency Alert */}
          <section className="py-8 bg-muted/30">
            <div className="container max-w-4xl">
              {daysUntilSale > 60 ? (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-900">
                    <strong>You have time to act.</strong> You have approximately <strong>{daysUntilSale} days</strong> until the foreclosure sale. 
                    Use this time wisely to explore all your options and take action.
                  </AlertDescription>
                </Alert>
              ) : daysUntilSale > 30 ? (
                <Alert className="border-orange-500 bg-orange-50">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <AlertDescription className="text-orange-900">
                    <strong>Time is running out.</strong> You have approximately <strong>{daysUntilSale} days</strong> until the foreclosure sale. 
                    Contact us immediately for a fast cash offer.
                  </AlertDescription>
                </Alert>
              ) : daysUntilSale > 0 ? (
                <Alert className="border-red-500 bg-red-50">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-900">
                    <strong>URGENT: Act now!</strong> You have only <strong>{daysUntilSale} days</strong> until the foreclosure sale. 
                    Call us today at (832) 932-7585 for immediate assistance.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-500 bg-red-50">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-900">
                    <strong>CRITICAL:</strong> Your foreclosure sale date has passed or is imminent. 
                    Contact us immediately at (832) 932-7585.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </section>

          {/* Timeline Milestones */}
          <section className="py-12">
            <div className="container max-w-4xl">
              <h2 className="text-3xl font-bold mb-8 text-center">Your Personalized Timeline</h2>
              
              <div className="space-y-6">
                {timeline.map((milestone, index) => (
                  <Card 
                    key={milestone.id} 
                    className={`border-l-4 ${getUrgencyColor(milestone.urgency)} ${
                      milestone.status === "current" ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {getUrgencyIcon(milestone.urgency)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg">{milestone.title}</CardTitle>
                              {getStatusBadge(milestone.status)}
                            </div>
                            <CardDescription className="text-sm font-medium">
                              {formatDate(milestone.date)}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-muted-foreground">
                            Day {milestone.daysFromNotice}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {milestone.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Action Items:</h4>
                        <ul className="space-y-1.5">
                          {milestone.actionItems.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 bg-primary text-primary-foreground">
            <div className="container max-w-3xl text-center">
              <h2 className="text-3xl font-bold mb-4">Need Help Right Now?</h2>
              <p className="text-lg mb-8 opacity-90">
                EnterActDFW can provide a fair cash offer and close in as little as 7-10 days. 
                Let us help you avoid foreclosure and move forward with dignity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <a href="tel:+18329327585">
                    <Phone className="mr-2 h-5 w-5" />
                    Call (832) 932-7585
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link href="/">
                    <HomeIcon className="mr-2 h-5 w-5" />
                    Get Free Guide
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10 mb-4" />
              <p className="text-sm text-muted-foreground">
                Licensed real estate brokerage helping Texas homeowners navigate foreclosure with dignity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/knowledge-base">
                    <span className="text-muted-foreground hover:text-primary cursor-pointer">Knowledge Base</span>
                  </Link>
                </li>
                <li>
                  <Link href="/resources">
                    <span className="text-muted-foreground hover:text-primary cursor-pointer">Resources</span>
                  </Link>
                </li>
                <li>
                  <Link href="/faq">
                    <span className="text-muted-foreground hover:text-primary cursor-pointer">FAQ</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Phone: (832) 932-7585</li>
                <li>Email: info@enteractdfw.com</li>
                <li>Lewisville, Texas 75056</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 EnterActDFW. All rights reserved. | <Link href="/privacy-policy"><span className="hover:text-primary cursor-pointer">Privacy Policy</span></Link> | <Link href="/terms-of-service"><span className="hover:text-primary cursor-pointer">Terms of Service</span></Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
