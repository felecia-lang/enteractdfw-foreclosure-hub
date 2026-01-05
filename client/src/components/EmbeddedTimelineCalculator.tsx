import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Download,
  ArrowRight,
  Mail
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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

export default function EmbeddedTimelineCalculator() {
  const [noticeDate, setNoticeDate] = useState<string>("");
  const [timeline, setTimeline] = useState<TimelineMilestone[] | null>(null);
  const [daysUntilSale, setDaysUntilSale] = useState<number | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  
  const emailTimelineMutation = trpc.timeline.emailPDF.useMutation();

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
          "Gather financial documents",
          "Contact your mortgage servicer immediately"
        ],
        urgency: "warning",
        status: getStatus(notice)
      },
      {
        id: "cure-period",
        title: "20-Day Cure Period Ends",
        date: addDays(notice, 20),
        daysFromNotice: 20,
        description: "This is your deadline to cure the default by paying all past-due amounts.",
        actionItems: [
          "Pay all past-due amounts to reinstate loan",
          "Contact lender to confirm reinstatement amount",
          "If unable to pay, explore other options immediately",
          "Document all payments and communications"
        ],
        urgency: "critical",
        status: getStatus(addDays(notice, 20))
      },
      {
        id: "notice-acceleration",
        title: "Notice of Acceleration (Approx. Day 60-90)",
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
        title: "Notice of Sale Posted (Approx. Day 90-120)",
        date: addDays(notice, 105),
        daysFromNotice: 105,
        description: "Property is officially posted for foreclosure auction (21 days' notice required in Texas).",
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
        title: "Foreclosure Sale Date (Approx. Day 120+)",
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
    if (!noticeDate) {
      toast.error("Please enter your Notice of Default date");
      return;
    }

    const milestones = calculateTimeline(noticeDate);
    console.log('[EmbeddedTimeline] Calculated milestones:', milestones);
    setTimeline(milestones);
    console.log('[EmbeddedTimeline] Timeline state updated');

    // Calculate days until foreclosure sale
    const saleDate = milestones.find(m => m.id === "foreclosure-sale")?.date;
    if (saleDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = saleDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilSale(diffDays);
    }

    toast.success("Timeline calculated successfully");
  };

  const handleEmailTimeline = async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!timeline || !noticeDate) {
      toast.error("Please calculate your timeline first");
      return;
    }

    try {
      await emailTimelineMutation.mutateAsync({
        email: emailAddress,
        noticeDate,
        milestones: timeline.map(m => ({
          ...m,
          date: m.date.toISOString(),
        })),
      });
      
      toast.success(`Timeline sent to ${emailAddress}`);
      setShowEmailDialog(false);
      setEmailAddress("");
    } catch (error) {
      console.error('Error emailing timeline:', error);
      toast.error('Failed to send email. Please try again.');
    }
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
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  const getUrgencyColor = (urgency: "critical" | "warning" | "safe") => {
    switch (urgency) {
      case "critical":
        return "border-l-4 border-l-red-500 bg-red-50/50";
      case "warning":
        return "border-l-4 border-l-orange-500 bg-orange-50/50";
      case "safe":
        return "border-l-4 border-l-green-500 bg-green-50/50";
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
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Completed</span>;
      case "current":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#00A6A6] text-white">Action Required Now</span>;
      case "upcoming":
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Upcoming</span>;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Calculator Input */}
      <Card className="border-[#00A6A6]/20">
        <CardHeader className="bg-[#00A6A6]/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00A6A6]/10 rounded-lg">
              <Calendar className="h-6 w-6 text-[#00A6A6]" />
            </div>
            <div>
              <CardTitle className="text-xl">Calculate Your Timeline</CardTitle>
              <CardDescription>
                Enter the date you received your Notice of Default to generate your personalized foreclosure timeline.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="noticeDate" className="text-base font-semibold">
                Notice of Default Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="noticeDate"
                type="date"
                value={noticeDate}
                onChange={(e) => setNoticeDate(e.target.value)}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  setNoticeDate(target.value);
                }}
                className="text-base"
                max={new Date().toISOString().split('T')[0]}
                required
              />
              <p className="text-sm text-muted-foreground">
                This is the date on your Notice of Default <strong>letter</strong>, not the date you received it.
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#00A6A6] hover:bg-[#008888] text-white"
              size="lg"
            >
              Calculate Timeline
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Timeline Results */}
      {timeline && (
        <div className="space-y-6">
          {/* Summary Alert */}
          {daysUntilSale !== null && (
            <Alert className={`border-2 ${daysUntilSale <= 30 ? 'border-red-500 bg-red-50' : daysUntilSale <= 60 ? 'border-orange-500 bg-orange-50' : 'border-blue-500 bg-blue-50'}`}>
              <AlertTriangle className={`h-5 w-5 ${daysUntilSale <= 30 ? 'text-red-600' : daysUntilSale <= 60 ? 'text-orange-600' : 'text-blue-600'}`} />
              <AlertDescription className="text-base font-medium">
                {daysUntilSale > 0 ? (
                  <>
                    You have approximately <strong>{daysUntilSale} days</strong> until the foreclosure sale date. 
                    {daysUntilSale <= 30 && " Time is critical—take action immediately!"}
                    {daysUntilSale > 30 && daysUntilSale <= 60 && " Act now to explore your options."}
                    {daysUntilSale > 60 && " You still have time, but don't delay."}
                  </>
                ) : (
                  "The foreclosure sale date may have passed. Contact us immediately for your options."
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowEmailDialog(true)}
              variant="outline"
              className="border-[#00A6A6] text-[#00A6A6] hover:bg-[#00A6A6] hover:text-white"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email to Me
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="border-[#00A6A6] text-[#00A6A6] hover:bg-[#00A6A6] hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Your Personalized Timeline</h3>
            {timeline.map((milestone, index) => (
              <Card key={milestone.id} className={`${getUrgencyColor(milestone.urgency)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getUrgencyIcon(milestone.urgency)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          {getStatusBadge(milestone.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-semibold">{formatDate(milestone.date)}</span>
                          <span>•</span>
                          <span>Day {milestone.daysFromNotice}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-sm mb-2">Action Items:</h4>
                  <ul className="space-y-1.5">
                    {milestone.actionItems.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-[#00A6A6] mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Help CTA */}
          <Card className="bg-[#00A6A6]/5 border-[#00A6A6]/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-foreground">Need Help Understanding Your Timeline?</h3>
                <p className="text-muted-foreground">
                  Our team can help you understand your options and take action before it's too late.
                </p>
                <Button 
                  className="bg-[#00A6A6] hover:bg-[#008888] text-white"
                  size="lg"
                  asChild
                >
                  <a href="tel:832-932-7585">
                    Call Us Now: (832) 932-7585
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Your Timeline</DialogTitle>
            <DialogDescription>
              Enter your email address to receive your personalized foreclosure timeline as a PDF attachment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailTimeline();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEmailDialog(false);
                setEmailAddress("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEmailTimeline}
              disabled={emailTimelineMutation.isPending}
              className="bg-[#00A6A6] hover:bg-[#008888] text-white"
            >
              {emailTimelineMutation.isPending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
