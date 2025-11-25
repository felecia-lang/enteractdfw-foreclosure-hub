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
import { Loader2, Download, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ResourceLeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceName: string;
  resourceFile: string;
}

export function ResourceLeadCaptureDialog({
  open,
  onOpenChange,
  resourceName,
  resourceFile,
}: ResourceLeadCaptureDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [, setLocation] = useLocation();

  const downloadMutation = trpc.resources.downloadWithCapture.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      toast.success(data.message);
      
      // Redirect to Thank You page after 1.5 seconds
      setTimeout(() => {
        onOpenChange(false);
        setName("");
        setEmail("");
        setSubmitted(false);
        
        // Convert resource file to URL parameter format
        const resourceParam = resourceFile
          .replace(/\.pdf$/i, '')
          .replace(/[_\s]+/g, '-')
          .toLowerCase();
        setLocation(`/thank-you?resource=${resourceParam}`);
      }, 1500);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to process your request");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    downloadMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      resourceName,
      resourceFile,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Download {resourceName}
              </DialogTitle>
              <DialogDescription>
                Enter your information to receive this guide via email.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={downloadMutation.isPending}
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
                  disabled={downloadMutation.isPending}
                  required
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">What you'll receive:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Instant email with PDF attachment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>No spam - only valuable foreclosure resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Free consultation offer (no obligation)</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={downloadMutation.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={downloadMutation.isPending}
                  className="flex-1"
                >
                  {downloadMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Send Me the Guide
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to receive emails from EnterActDFW. Unsubscribe anytime.
              </p>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Check Your Email!</h3>
              <p className="text-sm text-muted-foreground">
                We've sent <strong>{resourceName}</strong> to <strong>{email}</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                (This dialog will close automatically)
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
