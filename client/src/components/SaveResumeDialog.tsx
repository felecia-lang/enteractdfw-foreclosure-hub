import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Save, Loader2, CheckCircle2 } from "lucide-react";

interface SaveResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string) => Promise<void>;
}

export default function SaveResumeDialog({
  open,
  onOpenChange,
  onSubmit,
}: SaveResumeDialogProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(email);
      setIsSuccess(true);
      
      // Auto-close after 3 seconds on success
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setIsSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Save className="h-5 w-5 text-blue-600" />
                <DialogTitle>Save & Resume Later</DialogTitle>
              </div>
              <DialogDescription>
                We'll email you a unique link to return to this calculation anytime within the next 30 days.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="save-email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="save-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    required
                    className={error ? "border-red-500" : ""}
                  />
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Benefits */}
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    What you'll receive:
                  </p>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• A unique link to resume your calculation</li>
                    <li>• All your property details pre-filled</li>
                    <li>• Valid for 30 days from today</li>
                    <li>• No obligation to complete</li>
                  </ul>
                </div>

                {/* Privacy Notice */}
                <p className="text-xs text-muted-foreground">
                  By saving, you agree to receive an email from EnterActDFW with your resume link. 
                  We respect your privacy and will never share your information.
                </p>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !email}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save & Email Link
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                </div>
                <DialogTitle className="text-center text-xl">
                  Calculation Saved Successfully!
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800 text-center">
                <p className="text-sm text-green-900 dark:text-green-200">
                  Check your inbox at <strong>{email}</strong>
                </p>
                <p className="text-sm text-green-800 dark:text-green-300 mt-2">
                  We've sent you a link to resume this calculation anytime within the next 30 days.
                </p>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                This dialog will close automatically...
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Got It
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
