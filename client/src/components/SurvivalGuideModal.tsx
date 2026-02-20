import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Download } from "lucide-react";
import { useLocation } from "wouter";

interface SurvivalGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SurvivalGuideModal({ open, onOpenChange }: SurvivalGuideModalProps) {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    zipCode: "",
    consentToContact: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMutation = trpc.leads.submitSurvivalGuideRequest.useMutation({
    onSuccess: () => {
      toast.success("Success! Check your email for the download link.");
      onOpenChange(false);
      // Redirect to thank you page
      setLocation("/thank-you-guide");
      // Reset form
      setFormData({
        firstName: "",
        email: "",
        phone: "",
        zipCode: "",
        consentToContact: false,
      });
      setErrors({});
    },
    onError: (error) => {
      console.error("Failed to submit survival guide request:", error);
      toast.error("Failed to submit your request. Please try again.");
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Optional phone validation
    if (formData.phone && !/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    submitMutation.mutate({
      firstName: formData.firstName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      zipCode: formData.zipCode.trim() || undefined,
      consentToContact: formData.consentToContact,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Get Your FREE Texas Foreclosure Survival Guide</DialogTitle>
          </div>
          <DialogDescription>
            Download our comprehensive guide and learn how to protect your home and your rights in Texas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* First Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>

          {/* Email - Required */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Phone - Optional */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(832) 346-9569"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Property ZIP Code - Optional */}
          <div className="space-y-2">
            <Label htmlFor="zipCode">Property ZIP Code (Optional)</Label>
            <Input
              id="zipCode"
              type="text"
              placeholder="75001"
              maxLength={5}
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            />
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <Checkbox
              id="consent"
              checked={formData.consentToContact}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, consentToContact: checked === true })
              }
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
              By checking this box and providing my phone number, I consent to receive calls and text messages
              (including via automated technology and/or prerecorded messages) from EnterActDFW about foreclosure
              assistance services. Consent is not a condition of purchase. View our{" "}
              <a
                href="https://foreclosurehub-ljpdyh45.manus.space/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                Privacy Policy
              </a>
              .
            </Label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={submitMutation.isPending}>
            {submitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Send My Free Guide Now
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            We respect your privacy. Your information will never be shared with third parties.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
