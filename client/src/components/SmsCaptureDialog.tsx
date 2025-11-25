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
import { MessageSquare, Loader2 } from "lucide-react";

interface SmsCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (phone: string) => Promise<void>;
  title?: string;
  description?: string;
}

/**
 * Format phone number as user types (XXX) XXX-XXXX
 */
function formatPhoneInput(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  
  // Format based on length
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
}

/**
 * Validate US phone number (10 digits)
 */
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10;
}

export default function SmsCaptureDialog({
  open,
  onOpenChange,
  onSubmit,
  title = "Text Me This Report",
  description = "Get a concise comparison summary sent directly to your phone.",
}: SmsCaptureDialogProps) {
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhone(formatted);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidPhone(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(phone);
      // Reset form on success
      setPhone("");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send SMS. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setPhone("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(832) 932-7585"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={14} // (XXX) XXX-XXXX = 14 chars
                required
                className={error ? "border-red-500" : ""}
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* What You'll Receive */}
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                What you'll receive:
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Your property value and equity summary</li>
                <li>• Net proceeds for all three sale options</li>
                <li>• Recommended option based on your situation</li>
                <li>• Direct link to schedule a free consultation</li>
              </ul>
            </div>

            {/* Privacy Notice */}
            <p className="text-xs text-muted-foreground">
              By submitting, you agree to receive SMS communications from EnterActDFW. 
              We respect your privacy and will never share your information. 
              Message and data rates may apply. Reply STOP to opt out.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !phone}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
