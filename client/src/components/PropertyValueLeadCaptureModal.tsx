import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PropertyValueLeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyValueLeadCaptureModal({
  open,
  onOpenChange,
}: PropertyValueLeadCaptureModalProps) {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const captureLeadMutation = trpc.propertyValue.captureLead.useMutation({
    onSuccess: () => {
      toast.success("Access granted! Redirecting to calculator...");
      // Close modal and redirect to property value estimator
      onOpenChange(false);
      setLocation("/property-value-estimator");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Submit the lead
    captureLeadMutation.mutate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Get Your Property Value Estimate</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Enter your information below to access our free property value estimator tool.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={captureLeadMutation.isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={captureLeadMutation.isPending}
              required
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={captureLeadMutation.isPending}
            >
              {captureLeadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Access Calculator →"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By continuing, you agree to receive information about our foreclosure prevention services.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
