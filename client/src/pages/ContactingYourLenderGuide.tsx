import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Phone, FileText, CheckCircle2, AlertCircle, Download, Printer, Save, Trash2 } from "lucide-react";
import { APP_LOGO } from "@/const";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";

interface CallLogData {
  dateOfCall: string;
  time: string;
  representativeName: string;
  employeeId: string;
  department: string;
  referenceNumber: string;
  summaryOfDiscussion: string;
  optionsDiscussed: string;
  documentsRequested: string;
  submissionDeadline: string;
  followUpDate: string;
  nextSteps: string;
}

export default function ContactingYourLenderGuide() {
  const [callLog, setCallLog] = useState<CallLogData>({
    dateOfCall: '',
    time: '',
    representativeName: '',
    employeeId: '',
    department: '',
    referenceNumber: '',
    summaryOfDiscussion: '',
    optionsDiscussed: '',
    documentsRequested: '',
    submissionDeadline: '',
    followUpDate: '',
    nextSteps: '',
  });

  // Load saved notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lender-call-log');
    if (saved) {
      try {
        setCallLog(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved call log:', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('lender-call-log', JSON.stringify(callLog));
    toast.success('Call log saved successfully!');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all saved notes? This cannot be undone.')) {
      const emptyLog: CallLogData = {
        dateOfCall: '',
        time: '',
        representativeName: '',
        employeeId: '',
        department: '',
        referenceNumber: '',
        summaryOfDiscussion: '',
        optionsDiscussed: '',
        documentsRequested: '',
        submissionDeadline: '',
        followUpDate: '',
        nextSteps: '',
      };
      setCallLog(emptyLog);
      localStorage.removeItem('lender-call-log');
      toast.success('Call log cleared');
    }
  };

  const handlePrint = () => {
    window.print();
  };
  
  const downloadPDF = () => {
    window.open('/api/pdf/contacting-lender-guide', '_blank');
    toast.success('PDF download started');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden in print */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm print:hidden">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src={APP_LOGO} alt="EnterActDFW" className="h-10" />
            </a>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Home
              </span>
            </Link>
            <Link href="/knowledge-base">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Knowledge Base
              </span>
            </Link>
            <Button variant="outline" size="sm" asChild>
              <TrackablePhoneLink phoneNumber="832-932-7585" showIcon>Call Now
              </TrackablePhoneLink>
            </Button>
          </nav>
        </div>
      </header>

      {/* Print Header - Only visible in print */}
      <div className="hidden print:block py-6 border-b">
        <div className="container">
          <div className="flex items-center justify-between">
            <img src={APP_LOGO} alt="EnterActDFW" className="h-12" />
            <div className="text-right text-sm">
              <p className="font-semibold">EnterActDFW Real Estate Brokerage</p>
              <p>Phone: (832) 932-7585</p>
              <p>Email: info@enteractdfw.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-background print:py-6">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 print:text-3xl">
              Guide: Contacting Your Lender
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Phone scripts, questions to ask, and templates to help you communicate effectively with your mortgage servicer
            </p>
          </div>
          
          <div className="flex justify-center gap-4 print:hidden">
            <Button onClick={downloadPDF} size="lg" variant="outline" className="border-[#00A6A6] text-[#00A6A6] hover:bg-[#00A6A6] hover:text-white">
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint} size="lg" variant="outline">
              <Printer className="h-5 w-5 mr-2" />
              Print Guide
            </Button>
            <Button size="lg" asChild>
              <TrackablePhoneLink phoneNumber="832-932-7585" showIcon>Get Help: (832) 932-7585
              </TrackablePhoneLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      <section className="py-6 bg-amber-50 dark:bg-amber-950/20 border-y border-amber-200 dark:border-amber-900">
        <div className="container max-w-4xl">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Important: Document Everything
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Keep detailed records of every conversation with your lender. Note the date, time, representative's name, and what was discussed. This documentation can be crucial if disputes arise later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 print:py-6">
        <div className="container max-w-4xl space-y-8">
          
          {/* Before You Call */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Before You Call: What to Have Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Being prepared will make your conversation more productive and help you get the information you need.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Documents to Gather:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Your loan number (from mortgage statement)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Notice of Default letter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Recent pay stubs or income proof</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Bank statements (last 2-3 months)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>List of monthly expenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Hardship explanation (written or notes)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Information to Know:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Your current monthly income</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>How many payments you've missed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Total amount you're behind</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Why you fell behind (job loss, medical, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Whether your situation has improved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>What you can afford to pay monthly</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phone Script */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-primary" />
                Phone Conversation Script
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Opening */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <h4 className="font-semibold text-lg">Opening the Call</h4>
                </div>
                <div className="ml-10 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-sm italic mb-2">Say this:</p>
                  <p className="text-sm">
                    "Hello, my name is [YOUR NAME]. I'm calling about my mortgage loan, account number [LOAN NUMBER]. I recently received a Notice of Default, and I'd like to speak with someone in the Loss Mitigation or Foreclosure Prevention department about my options to avoid foreclosure."
                  </p>
                </div>
                <div className="ml-10 text-sm text-muted-foreground">
                  <p><strong>Tip:</strong> Be polite but firm. You may need to be transferred to the right department. Write down the name of every person you speak with.</p>
                </div>
              </div>

              {/* Explaining Your Situation */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <h4 className="font-semibold text-lg">Explaining Your Situation</h4>
                </div>
                <div className="ml-10 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-sm italic mb-2">Say this:</p>
                  <p className="text-sm">
                    "I fell behind on my payments due to [REASON: job loss, medical emergency, divorce, etc.]. I'm currently [NUMBER] months behind. My situation has [improved/is improving], and I want to work with you to find a solution. I can now afford to pay [AMOUNT] per month. What options are available to help me keep my home?"
                  </p>
                </div>
                <div className="ml-10 text-sm text-muted-foreground">
                  <p><strong>Tip:</strong> Be honest about your hardship and your current financial situation. Lenders are more willing to work with homeowners who communicate openly.</p>
                </div>
              </div>

              {/* Asking About Options */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <h4 className="font-semibold text-lg">Asking About Your Options</h4>
                </div>
                <div className="ml-10 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-sm italic mb-2">Ask these questions:</p>
                  <ul className="space-y-2 text-sm">
                    <li>"Am I eligible for a loan modification to lower my monthly payment?"</li>
                    <li>"Can I set up a repayment plan to catch up on missed payments over time?"</li>
                    <li>"Do you offer forbearance or a temporary payment reduction?"</li>
                    <li>"What is the total amount I need to pay to reinstate my loan?"</li>
                    <li>"How much time do I have before the foreclosure sale?"</li>
                    <li>"What documents do I need to submit to apply for assistance?"</li>
                    <li>"Is there a deadline for submitting my application?"</li>
                  </ul>
                </div>
              </div>

              {/* Taking Notes */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <h4 className="font-semibold text-lg">Document the Conversation</h4>
                </div>
                <div className="ml-10 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-sm italic mb-2">Write down:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Date and time of call</li>
                    <li>• Representative's name and ID number</li>
                    <li>• Department (Loss Mitigation, Foreclosure Prevention, etc.)</li>
                    <li>• Options discussed and eligibility requirements</li>
                    <li>• Documents requested and where to send them</li>
                    <li>• Deadlines for submission</li>
                    <li>• Next steps and follow-up date</li>
                    <li>• Reference number or case number (if provided)</li>
                  </ul>
                </div>
              </div>

              {/* Closing */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    5
                  </div>
                  <h4 className="font-semibold text-lg">Closing the Call</h4>
                </div>
                <div className="ml-10 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-sm italic mb-2">Say this:</p>
                  <p className="text-sm">
                    "Thank you for your help. Just to confirm, I need to submit [DOCUMENTS] by [DATE] to [EMAIL/ADDRESS]. I'll receive a response within [TIMEFRAME]. Can you provide me with a reference number for this call? And can I have a direct phone number to follow up if needed?"
                  </p>
                </div>
                <div className="ml-10 text-sm text-muted-foreground">
                  <p><strong>Tip:</strong> Always ask for written confirmation of what was discussed. Request that they email or mail you a summary of your conversation and next steps.</p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Important Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                Critical Questions to Ask Your Servicer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                <div>
                  <h4 className="font-semibold mb-3">About Your Account:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"What is the exact amount I'm behind, including late fees and other charges?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"Can you provide an itemized breakdown of what I owe?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"What is my current interest rate and remaining loan balance?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"Have any fees been added to my account since I received the Notice of Default?"</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">About Foreclosure Timeline:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"What is the deadline to cure my default and avoid foreclosure?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"Has a foreclosure sale date been scheduled? If so, when?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"If I apply for loss mitigation, will the foreclosure process be paused?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"What protections do I have under federal law while my application is being reviewed?"</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">About Loss Mitigation Options:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"What loss mitigation programs am I eligible for based on my situation?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"What would my new monthly payment be under a loan modification?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"How long would a repayment plan last, and what would the payments be?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"If I'm approved for forbearance, how will the missed payments be handled afterward?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"Will any of these options negatively impact my credit score?"</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">About the Application Process:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"What documents do I need to submit, and in what format?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"Where should I send my application—online portal, email, fax, or mail?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"How long does the review process typically take?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"Will I receive written confirmation once my application is received?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">Q:</span>
                      <span>"Who can I contact if I have questions or need to check the status?"</span>
                    </li>
                  </ul>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Interactive Call Log */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  Interactive Call Log
                </CardTitle>
                <div className="flex gap-2 print:hidden">
                  <Button onClick={handleSave} size="sm" variant="default">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </Button>
                  <Button onClick={handleClear} size="sm" variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your notes are saved automatically to your browser and will persist across sessions.
              </p>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-muted/30 rounded-lg border space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Date of Call:</label>
                    <Input
                      type="date"
                      value={callLog.dateOfCall}
                      onChange={(e) => setCallLog({ ...callLog, dateOfCall: e.target.value })}
                      className="print:border-0 print:p-0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Time:</label>
                    <Input
                      type="time"
                      value={callLog.time}
                      onChange={(e) => setCallLog({ ...callLog, time: e.target.value })}
                      className="print:border-0 print:p-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Representative Name:</label>
                  <Input
                    type="text"
                    value={callLog.representativeName}
                    onChange={(e) => setCallLog({ ...callLog, representativeName: e.target.value })}
                    placeholder="Enter representative's name"
                    className="print:border-0 print:p-0"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Employee/ID Number:</label>
                    <Input
                      type="text"
                      value={callLog.employeeId}
                      onChange={(e) => setCallLog({ ...callLog, employeeId: e.target.value })}
                      placeholder="Enter employee ID"
                      className="print:border-0 print:p-0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Department:</label>
                    <Input
                      type="text"
                      value={callLog.department}
                      onChange={(e) => setCallLog({ ...callLog, department: e.target.value })}
                      placeholder="e.g., Loss Mitigation"
                      className="print:border-0 print:p-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Reference/Case Number:</label>
                  <Input
                    type="text"
                    value={callLog.referenceNumber}
                    onChange={(e) => setCallLog({ ...callLog, referenceNumber: e.target.value })}
                    placeholder="Enter reference or case number"
                    className="print:border-0 print:p-0"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Summary of Discussion:</label>
                  <Textarea
                    value={callLog.summaryOfDiscussion}
                    onChange={(e) => setCallLog({ ...callLog, summaryOfDiscussion: e.target.value })}
                    placeholder="Document what was discussed during the call..."
                    rows={5}
                    className="print:border-0 print:p-0 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Options Discussed:</label>
                  <Textarea
                    value={callLog.optionsDiscussed}
                    onChange={(e) => setCallLog({ ...callLog, optionsDiscussed: e.target.value })}
                    placeholder="List the options or solutions discussed..."
                    rows={3}
                    className="print:border-0 print:p-0 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Documents Requested:</label>
                  <Textarea
                    value={callLog.documentsRequested}
                    onChange={(e) => setCallLog({ ...callLog, documentsRequested: e.target.value })}
                    placeholder="List any documents you need to submit..."
                    rows={2}
                    className="print:border-0 print:p-0 resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Submission Deadline:</label>
                    <Input
                      type="date"
                      value={callLog.submissionDeadline}
                      onChange={(e) => setCallLog({ ...callLog, submissionDeadline: e.target.value })}
                      className="print:border-0 print:p-0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Follow-up Date:</label>
                    <Input
                      type="date"
                      value={callLog.followUpDate}
                      onChange={(e) => setCallLog({ ...callLog, followUpDate: e.target.value })}
                      className="print:border-0 print:p-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Next Steps:</label>
                  <Textarea
                    value={callLog.nextSteps}
                    onChange={(e) => setCallLog({ ...callLog, nextSteps: e.target.value })}
                    placeholder="Document your next steps and action items..."
                    rows={3}
                    className="print:border-0 print:p-0 resize-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-3 print:hidden">
                <Button onClick={handleSave} variant="default">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Call Log
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hardship Letter Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                Sample Hardship Letter Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A hardship letter explains why you fell behind on payments and demonstrates your commitment to resolving the situation. Customize this template with your specific details.
              </p>

              <div className="p-6 bg-muted/30 rounded-lg border space-y-4 text-sm">
                <div className="text-right text-muted-foreground">
                  [Your Name]<br />
                  [Your Address]<br />
                  [City, State ZIP]<br />
                  [Phone Number]<br />
                  [Email Address]<br />
                  [Date]
                </div>

                <div>
                  [Lender/Servicer Name]<br />
                  [Loss Mitigation Department]<br />
                  [Address]<br />
                  [City, State ZIP]
                </div>

                <div>
                  <strong>RE: Request for Mortgage Assistance</strong><br />
                  <strong>Loan Number:</strong> [Your Loan Number]<br />
                  <strong>Property Address:</strong> [Property Address]
                </div>

                <div>
                  Dear Sir or Madam,
                </div>

                <div>
                  I am writing to request assistance with my mortgage loan. I am currently [NUMBER] months behind on my payments, and I received a Notice of Default on [DATE]. I am committed to keeping my home and would like to work with you to find a solution.
                </div>

                <div>
                  <strong>[Explain Your Hardship - Choose one or customize:]</strong>
                </div>

                <div className="pl-4 border-l-4 border-primary/30">
                  <p className="mb-2"><em>Option 1 - Job Loss:</em></p>
                  <p>
                    I fell behind on my mortgage payments due to unexpected job loss. I was employed as a [JOB TITLE] at [COMPANY NAME] for [NUMBER] years, but I was laid off on [DATE] due to [REASON]. During this period, I exhausted my savings to cover essential expenses and fell behind on my mortgage. I have since found new employment as a [NEW JOB TITLE] starting [DATE], and my monthly income is now [AMOUNT].
                  </p>
                </div>

                <div className="pl-4 border-l-4 border-primary/30">
                  <p className="mb-2"><em>Option 2 - Medical Emergency:</em></p>
                  <p>
                    I experienced a serious medical emergency in [MONTH/YEAR] that required [HOSPITALIZATION/SURGERY/TREATMENT]. The medical bills and time away from work created significant financial strain. I am now recovered and back to work full-time, but I accumulated debt during my recovery that made it impossible to keep up with my mortgage payments.
                  </p>
                </div>

                <div className="pl-4 border-l-4 border-primary/30">
                  <p className="mb-2"><em>Option 3 - Divorce/Separation:</em></p>
                  <p>
                    I recently went through a divorce/separation, which significantly impacted my financial situation. My household income was reduced from [PREVIOUS AMOUNT] to [CURRENT AMOUNT] when my spouse moved out in [MONTH/YEAR]. I am now the sole provider for [NUMBER] children and have been working to adjust my budget to my new circumstances.
                  </p>
                </div>

                <div>
                  My current financial situation has stabilized, and I am now able to make monthly mortgage payments. My current monthly income is [AMOUNT], and my monthly expenses total approximately [AMOUNT]. I can afford a monthly mortgage payment of [AMOUNT].
                </div>

                <div>
                  I am requesting consideration for the following assistance options:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Loan modification to reduce my monthly payment</li>
                    <li>Repayment plan to catch up on missed payments over time</li>
                    <li>Forbearance to temporarily reduce or suspend payments</li>
                    <li>[Any other option discussed with your servicer]</li>
                  </ul>
                </div>

                <div>
                  I have enclosed the following documents to support my request:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Pay stubs from the last [2-3] months</li>
                    <li>Bank statements</li>
                    <li>Tax returns</li>
                    <li>Proof of hardship [medical bills, termination letter, etc.]</li>
                    <li>Current budget/expense worksheet</li>
                  </ul>
                </div>

                <div>
                  I am committed to working with you to resolve this situation and keep my home. This property is my primary residence, and I have lived here for [NUMBER] years. I appreciate your consideration of my request and look forward to hearing from you soon.
                </div>

                <div>
                  Please contact me at [PHONE NUMBER] or [EMAIL ADDRESS] if you need any additional information.
                </div>

                <div>
                  Sincerely,
                </div>

                <div className="pt-8">
                  [Your Signature]<br />
                  [Your Printed Name]
                </div>

                <div className="pt-4 text-xs text-muted-foreground">
                  <strong>Enclosures:</strong> [List all documents you're including]
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-4 print:hidden">
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips for Success */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Tips for Successful Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700 dark:text-green-400">DO:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Be honest about your financial situation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Stay calm and professional, even if frustrated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Document every conversation in detail</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Follow up in writing after phone calls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Submit documents by the deadline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Keep copies of everything you send</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Ask for clarification if you don't understand</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Request written confirmation of agreements</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-red-700 dark:text-red-400">DON'T:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Ignore calls or letters from your lender</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Lie or exaggerate your financial situation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Make promises you can't keep</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Accept terms you can't afford long-term</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Miss application deadlines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Assume verbal agreements are binding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Pay anyone upfront fees for "foreclosure help"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Give up if your first request is denied</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary/5 print:hidden">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need Help Navigating the Process?
          </h2>
          <p className="text-muted-foreground mb-6">
            EnterActDFW can provide guidance and support as you work through your options. We're here to help you understand your choices and make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <TrackablePhoneLink phoneNumber="832-932-7585" showIcon>Call: (832) 932-7585
              </TrackablePhoneLink>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/knowledge-base">
                <span>Browse Knowledge Base</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section - Hidden in print */}
      <section className="py-16 bg-gradient-to-br from-[#00A6A6]/10 to-[#0A2342]/10 print:hidden">
        <div className="container max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A2342] mb-4">
              Ready to Talk to Your Lender?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Need help preparing for the call or want us to handle it for you? Schedule a free consultation and we'll guide you through every step.
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

      {/* Footer - Print version */}
      <footer className="hidden print:block py-6 border-t mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-2">EnterActDFW Real Estate Brokerage</p>
          <p>4400 State Hwy 121, Suite 300 | Lewisville, Texas 75056</p>
          <p>Phone: (832) 932-7585 | Email: info@enteractdfw.com</p>
          <p className="mt-4 text-xs">
            <strong>Legal Disclaimer:</strong> This guide is for educational purposes only and does not constitute legal or financial advice. 
            For legal guidance, consult an attorney. For financial advice, consult a licensed financial advisor.
          </p>
        </div>
      </footer>
    </div>
  );
}
