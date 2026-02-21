import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, FileText, CheckCircle2, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CalculatorEmailGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timelineData: {
    noticeDate: string;
    saleDate: string;
    daysUntilSale: number;
    keyDates: Array<{
      date: string;
      event: string;
      description: string;
    }>;
  };
}

export function CalculatorEmailGate({ open, onOpenChange, timelineData }: CalculatorEmailGateProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const requestPdfMutation = trpc.calculator.requestActionPlanPdf.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Success! Check your email for your personalized action plan.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send action plan. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    requestPdfMutation.mutate({
      email,
      timelineData,
    });
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">Check Your Email!</DialogTitle>
            <DialogDescription className="text-center">
              We've sent your Personalized 21-Day Action Plan to <strong>{email}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">What's included in your action plan:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Your complete foreclosure timeline with key dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Day-by-day action steps to protect your home</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Legal rights and options specific to Texas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Direct contact information for immediate help</span>
                </li>
              </ul>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Need immediate assistance?
              </p>
              <Button asChild className="w-full">
                <a href="tel:832-346-9569">
                  Call Now: (832) 346-9569
                </a>
              </Button>
            </div>
          </div>

          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Get Your Personalized 21-Day Action Plan
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Based on your timeline, we've created a customized step-by-step plan to help you protect your home.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg space-y-3">
            <p className="font-semibold text-sm flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              Your free PDF includes:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Day-by-day action steps</strong> tailored to your {timelineData.daysUntilSale}-day timeline</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Legal deadlines</strong> you cannot afford to miss</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Negotiation strategies</strong> to stop or delay foreclosure</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Resources and contacts</strong> for immediate help in Dallas-Fort Worth</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 text-base"
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">
                We'll email your action plan instantly. No spam, ever.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base"
              disabled={requestPdfMutation.isPending}
            >
              {requestPdfMutation.isPending ? (
                "Sending..."
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Email My Free Action Plan
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            By requesting this plan, you agree to receive helpful foreclosure prevention tips from EnterActDFW. Unsubscribe anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
