import { useState, useEffect } from "react";
import { X, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const POPUP_SHOWN_KEY = "exitIntentPopupShown";
const POPUP_DISMISSED_KEY = "exitIntentPopupDismissed";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const downloadResourceMutation = trpc.resources.downloadWithCapture.useMutation();

  useEffect(() => {
    // Check if popup was already shown or dismissed in this session
    const hasShown = sessionStorage.getItem(POPUP_SHOWN_KEY);
    const hasDismissed = localStorage.getItem(POPUP_DISMISSED_KEY);
    
    if (hasShown || hasDismissed) {
      return;
    }

    let exitIntentTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the viewport
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true;
        setIsOpen(true);
        sessionStorage.setItem(POPUP_SHOWN_KEY, "true");
      }
    };

    // Add event listener after a short delay to avoid immediate triggers
    const timeoutId = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 3000); // Wait 3 seconds before activating exit intent

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(POPUP_DISMISSED_KEY, "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await downloadResourceMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        resourceName: "Texas Foreclosure Survival Guide",
        resourceFile: "/pdfs/Foreclosure_Survival_Guide.pdf",
      });

      toast.success("Success! Check your email for the guide.");
      setIsOpen(false);
      localStorage.setItem(POPUP_DISMISSED_KEY, "true");
      
      // Redirect to thank you page
      window.location.href = "/thank-you?resource=texas-foreclosure-survival-guide";
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Wait! Don't Leave Empty-Handed</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Get your FREE Foreclosure Survival Guide before you go. Learn your rights, explore your options, and take control of your situation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="exit-name">Full Name *</Label>
            <Input
              id="exit-name"
              type="text"
              placeholder="John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exit-email">Email Address *</Label>
            <Input
              id="exit-email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="font-medium text-sm">What you'll get:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Complete guide to the Texas foreclosure process</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Know your legal rights and protections</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Explore all your options to avoid foreclosure</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Free consultation offer (no obligation)</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              No Thanks
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Me the Guide"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to receive emails from EnterActDFW. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
