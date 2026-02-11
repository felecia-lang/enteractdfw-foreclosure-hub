import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Phone, Printer, Download, AlertTriangle, Mail, Save } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";

export default function NoticeOfDefaultChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  
  const emailMutation = trpc.checklist.emailToUser.useMutation({
    onSuccess: () => {
      toast.success("Checklist sent to your email!");
      setEmailDialogOpen(false);
      setEmail("");
    },
    onError: (error) => {
      toast.error("Failed to send email. Please try again.");
      console.error(error);
    },
  });

  const handlePrint = () => {
    window.print();
  };
  
  const handleSaveAsPDF = () => {
    // Use browser's print to PDF functionality
    window.print();
    toast.info("Use your browser's print dialog to save as PDF");
  };
  
  const handleCheckboxChange = (itemText: string, checked: boolean) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemText);
      } else {
        newSet.delete(itemText);
      }
      return newSet;
    });
  };
  
  const handleEmailChecklist = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    emailMutation.mutate({
      email,
      checklistData: {
        checkedItems: Array.from(checkedItems),
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden in print */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm print:hidden">
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
            <Link href="/guides/notice-of-default">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Full Guide
              </span>
            </Link>
            <Button variant="outline" size="sm" asChild>
              <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>Call Now
              </TrackablePhoneLink>
            </Button>
          </nav>
        </div>
      </header>

      {/* Print Actions - Hidden in print */}
      <section className="py-6 bg-muted/30 print:hidden">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Notice of Default Action Checklist</h1>
              <p className="text-muted-foreground">Print or save this checklist to track your progress</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handlePrint} size="lg" variant="outline">
                <Printer className="h-5 w-5 mr-2" />
                Print
              </Button>
              <Button onClick={handleSaveAsPDF} size="lg" variant="outline">
                <Save className="h-5 w-5 mr-2" />
                Save as PDF
              </Button>
              <Button onClick={() => setEmailDialogOpen(true)} size="lg">
                <Mail className="h-5 w-5 mr-2" />
                Email to Me
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Printable Checklist Content */}
      <section className="py-8 print:py-4">
        <div className="container max-w-4xl">
          {/* Print Header - Only visible in print */}
          <div className="hidden print:block mb-6 pb-4 border-b-2 border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-12" />
              <div className="text-right">
                <p className="text-sm font-semibold">EnterActDFW Real Estate Brokerage</p>
                <p className="text-xs">Phone: (832) 932-7585</p>
                <p className="text-xs">info@enteractdfw.com</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">Notice of Default Action Checklist</h1>
            <p className="text-center text-sm text-gray-600">Your step-by-step guide to responding to foreclosure</p>
          </div>

          {/* Urgent Notice */}
          <Card className="mb-6 border-destructive print:border-2">
            <CardContent className="p-4 print:p-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-destructive mb-1">TIME-SENSITIVE: Act Within 20-30 Days</p>
                  <p className="text-sm text-muted-foreground">
                    In Texas, you typically have 20-30 days from receiving a Notice of Default to take action before foreclosure proceedings advance. Check your notice for the exact deadline and mark it on your calendar immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist Sections */}
          <div className="space-y-6 print:space-y-4">
            {/* Day 1: Read Notice */}
            <Card className="print:break-inside-avoid">
              <CardContent className="p-6 print:p-4">
                <div className="flex items-center gap-3 mb-4 print:mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold print:w-8 print:h-8 print:text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground print:text-lg">Day 1: Read Notice Carefully</h2>
                    <p className="text-sm text-muted-foreground">Understand what you received</p>
                  </div>
                </div>
                <div className="space-y-2 ml-13 print:ml-11">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4 print:h-3 print:w-3" 
                      onChange={(e) => handleCheckboxChange("Locate the date the notice was sent or posted", e.target.checked)}
                    />
                    <span className="text-sm">Locate the date the notice was sent or posted</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4 print:h-3 print:w-3" 
                      onChange={(e) => handleCheckboxChange("Find the total amount needed to cure the default (reinstatement amount)", e.target.checked)}
                    />
                    <span className="text-sm">Find total amount needed to cure default (reinstatement amount)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4 print:h-3 print:w-3" 
                      onChange={(e) => handleCheckboxChange("Note the deadline to cure the default (typically 20-30 days in Texas)", e.target.checked)}
                    />
                    <span className="text-sm">Note deadline to cure (typically 20-30 days in Texas)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Identify who sent notice (lender name and contact info)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Make copies of the notice for your records</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Day 1: Calculate Timeline */}
            <Card className="print:break-inside-avoid">
              <CardContent className="p-6 print:p-4">
                <div className="flex items-center gap-3 mb-4 print:mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold print:w-8 print:h-8 print:text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground print:text-lg">Day 1: Calculate Your Timeline</h2>
                    <p className="text-sm text-muted-foreground">Mark critical dates</p>
                  </div>
                </div>
                <div className="space-y-2 ml-13 print:ml-11">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Mark the notice date on your calendar</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Calculate your deadline to cure (usually 20 days from notice)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Set reminders for key dates to avoid missing deadlines</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Days 1-2: Gather Documents */}
            <Card className="print:break-inside-avoid">
              <CardContent className="p-6 print:p-4">
                <div className="flex items-center gap-3 mb-4 print:mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold print:w-8 print:h-8 print:text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground print:text-lg">Days 1-2: Gather Financial Documents</h2>
                    <p className="text-sm text-muted-foreground">Collect everything you'll need</p>
                  </div>
                </div>
                <div className="space-y-2 ml-13 print:ml-11">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Recent pay stubs or proof of income (last 2-3 months)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Bank statements (last 2-3 months)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Tax returns (last 2 years)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Current mortgage statement with balance and payment history</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">List of monthly expenses and debts</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Write hardship letter explaining why you fell behind</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Days 2-3: Contact Servicer */}
            <Card className="print:break-inside-avoid">
              <CardContent className="p-6 print:p-4">
                <div className="flex items-center gap-3 mb-4 print:mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold print:w-8 print:h-8 print:text-sm">
                    4
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground print:text-lg">Days 2-3: Contact Your Mortgage Servicer</h2>
                    <p className="text-sm text-muted-foreground">Call immediately</p>
                  </div>
                </div>
                <div className="space-y-2 ml-13 print:ml-11">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Call the phone number on your Notice of Default</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Ask for Loss Mitigation or Foreclosure Prevention dept</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Have your loan number and financial documents ready</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Ask about options (modification, repayment plan, forbearance)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Request complete breakdown of what you owe</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Take notes (date, time, rep name, discussion)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Request written confirmation of agreements/next steps</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Days 3-5: Contact Counselor */}
            <Card className="print:break-inside-avoid">
              <CardContent className="p-6 print:p-4">
                <div className="flex items-center gap-3 mb-4 print:mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold print:w-8 print:h-8 print:text-sm">
                    5
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground print:text-lg">Days 3-5: Contact HUD-Approved Counselor</h2>
                    <p className="text-sm text-muted-foreground">Get free expert advice</p>
                  </div>
                </div>
                <div className="space-y-2 ml-13 print:ml-11">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Find HUD counselor at consumerfinance.gov/find-a-housing-counselor</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Schedule an appointment as soon as possible</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Bring all your financial documents to the appointment</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Ask the counselor to help you create an action plan</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Days 5-10: Explore Options */}
            <Card className="print:break-inside-avoid">
              <CardContent className="p-6 print:p-4">
                <div className="flex items-center gap-3 mb-4 print:mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold print:w-8 print:h-8 print:text-sm">
                    6
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground print:text-lg">Days 5-10: Explore All Your Options</h2>
                    <p className="text-sm text-muted-foreground">Evaluate what's best for you</p>
                  </div>
                </div>
                <div className="space-y-2 ml-13 print:ml-11">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Consider reinstatement (pay past-due amounts if funds available)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Explore loan modification (change loan terms)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Discuss repayment plan (catch up over 3-6 months)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Consider selling home (especially if you have equity)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Evaluate short sale option (if underwater)</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Days 7-14: Submit Application */}
            <Card className="print:break-inside-avoid">
              <CardContent className="p-6 print:p-4">
                <div className="flex items-center gap-3 mb-4 print:mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold print:w-8 print:h-8 print:text-sm">
                    7
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground print:text-lg">Days 7-14: Submit Loss Mitigation Application</h2>
                    <p className="text-sm text-muted-foreground">If pursuing lender assistance</p>
                  </div>
                </div>
                <div className="space-y-2 ml-13 print:ml-11">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Request the application package from your servicer</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Complete all forms accurately and thoroughly</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Include all required documentation</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Make copies of everything before submitting</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Submit via certified mail or online (keep tracking)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Follow up within 3-5 days to confirm receipt</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Days 10-20: Consider Selling */}
            <Card className="print:break-inside-avoid">
              <CardContent className="p-6 print:p-4">
                <div className="flex items-center gap-3 mb-4 print:mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold print:w-8 print:h-8 print:text-sm">
                    8
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground print:text-lg">Days 10-20: Consider Selling Quickly</h2>
                    <p className="text-sm text-muted-foreground">If you have equity or want to avoid foreclosure</p>
                  </div>
                </div>
                <div className="space-y-2 ml-13 print:ml-11">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Get professional market analysis of home value</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Calculate equity (market value minus amount owed)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Contact EnterActDFW for no-obligation cash offer: (832) 932-7585</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm">Note: Selling stops foreclosure and may preserve credit</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Important Reminders */}
            <Card className="bg-primary/5 print:break-inside-avoid">
              <CardContent className="p-6 print:p-4">
                <h2 className="text-xl font-bold text-foreground mb-4 print:text-lg">Important Reminders</h2>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm font-semibold">Don't ignore letters or calls from your lender</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm font-semibold">Don't pay anyone upfront fees for foreclosure help</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm font-semibold">Don't sign over your deed to anyone promising to "save" your home</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded print:p-1">
                    <input type="checkbox" className="mt-1 h-4 w-4 print:h-3 print:w-3" />
                    <span className="text-sm font-semibold">Do stay in your home—leaving doesn't stop foreclosure</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Print Footer - Only visible in print */}
          <div className="hidden print:block mt-6 pt-4 border-t-2 border-gray-300 text-center text-xs text-gray-600">
            <p className="mb-1">
              <strong>EnterActDFW Real Estate Brokerage</strong> | Licensed Texas Broker
            </p>
            <p className="mb-1">
              4400 State Hwy 121, Suite 300, Lewisville, Texas 75056
            </p>
            <p className="mb-2">
              Phone: (832) 932-7585 | Email: info@enteractdfw.com
            </p>
            <p className="text-xs">
              <strong>Legal Disclaimer:</strong> This information is for educational purposes only and is not legal advice. 
              For legal guidance, consult an attorney or HUD-approved housing counselor.
            </p>
          </div>
        </div>
      </section>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Checklist to Yourself</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a summary of your completed checklist items.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailChecklist();
                  }
                }}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {checkedItems.size > 0 ? (
                <p>You have completed {checkedItems.size} action item{checkedItems.size !== 1 ? 's' : ''}.</p>
              ) : (
                <p className="text-amber-600">You haven't checked any items yet. Check items as you complete them to track your progress.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEmailChecklist} disabled={emailMutation.isPending}>
              {emailMutation.isPending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CTA Section - Hidden in print */}
      <section className="py-12 bg-primary/5 print:hidden">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need Help? We're Here for You
          </h2>
          <p className="text-muted-foreground mb-6">
            Contact EnterActDFW for a free consultation and fair cash offer. We've helped over 200 Texas families navigate foreclosure with dignity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>Call (832) 932-7585
              </TrackablePhoneLink>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/guides/notice-of-default">
                View Full Guide
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Hidden in print */}
      <footer className="bg-card border-t py-12 print:hidden">
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

      {/* Print-specific CSS */}
      <style>{`
        @media print {
          @page {
            margin: 0.6in 0.5in;
            size: letter;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            font-size: 11pt;
            line-height: 1.3;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          .print\\:break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .print\\:py-4 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          
          .print\\:p-4 {
            padding: 0.5rem !important;
          }
          
          .print\\:p-3 {
            padding: 0.4rem !important;
          }
          
          .print\\:p-1 {
            padding: 0.15rem !important;
          }
          
          .print\\:mb-2 {
            margin-bottom: 0.3rem !important;
          }
          
          .print\\:mb-4 {
            margin-bottom: 0.5rem !important;
          }
          
          .print\\:space-y-4 > * + * {
            margin-top: 0.5rem !important;
          }
          
          .print\\:ml-11 {
            margin-left: 2.5rem !important;
          }
          
          .print\\:text-lg {
            font-size: 1.05rem !important;
            line-height: 1.4 !important;
          }
          
          .print\\:text-sm {
            font-size: 0.8rem !important;
          }
          
          .print\\:w-8 {
            width: 1.8rem !important;
          }
          
          .print\\:h-8 {
            height: 1.8rem !important;
          }
          
          .print\\:h-3 {
            height: 0.65rem !important;
          }
          
          .print\\:w-3 {
            width: 0.65rem !important;
          }
          
          .print\\:border-2 {
            border-width: 1.5px !important;
          }
          
          /* Optimize text for printing */
          h1, h2, h3 {
            page-break-after: avoid;
          }
          
          /* Reduce spacing between checklist items */
          label {
            margin-bottom: 0.15rem !important;
          }
          
          /* Ensure checkboxes print properly */
          input[type="checkbox"] {
            -webkit-appearance: checkbox;
            appearance: checkbox;
            flex-shrink: 0;
          }
          
          /* Tighter card spacing */
          .space-y-6 > * + * {
            margin-top: 0.6rem !important;
          }
          
          /* Optimize urgent notice box */
          .border-destructive {
            border-width: 1.5px !important;
          }
        }
      `}</style>
    </div>
  );
}
