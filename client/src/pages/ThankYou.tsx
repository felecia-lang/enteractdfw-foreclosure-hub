import { useState } from "react";
import { CheckCircle2, Mail, Calendar, FileText, ArrowRight, Phone, MapPin } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO } from "@/const";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const RESOURCE_TITLES: Record<string, string> = {
  "texas-foreclosure-survival-guide": "Texas Foreclosure Survival Guide",
  "action-guide-contacting-lender": "Strategic Communication with Your Lender",
  "action-guide-notice-of-default": "Navigating the Notice of Default",
  "avoiding-foreclosure-scams": "Spotting the Red Flags: Foreclosure Scams Guide",
};

export default function ThankYou() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const resource = params.get("resource") || "guide";
  const email = params.get("email") || "";
  const resourceTitle = RESOURCE_TITLES[resource] || "Foreclosure Resource Guide";
  
  const [formData, setFormData] = useState({
    phone: "",
    propertyZip: "",
    smsConsent: false,
  });
  const [step2Completed, setStep2Completed] = useState(false);

  const updateLead = trpc.leads.updateContact.useMutation({
    onSuccess: () => {
      setStep2Completed(true);
      toast.success("Thank you! Your information has been saved.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLead.mutate({
      email,
      phone: formData.phone,
      propertyZip: formData.propertyZip,
      smsConsent: formData.smsConsent,
    });
  };

  const handleSkip = () => {
    setStep2Completed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <img src={APP_LOGO} alt="EnterActDFW" className="h-10" />
          </Link>
          <Button variant="default" asChild>
            <TrackablePhoneLink phoneNumber="832-346-9569">
              Call Now
            </TrackablePhoneLink>
          </Button>
        </div>
      </header>

      <main className="container py-12 md:py-20">
        {/* Success Message */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Your <span className="font-semibold text-foreground">{resourceTitle}</span> is on its way
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="w-5 h-5" />
            <p>Check your email inbox in the next few minutes</p>
          </div>
        </div>

        {/* Step 2: Optional Contact Info (only show if email param exists and not completed) */}
        {email && !step2Completed && (
          <Card className="mx-auto max-w-2xl p-8 mb-12 border-2 border-accent/30">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-3">Get Personalized Help (Optional)</h2>
              <p className="text-muted-foreground">
                Provide your phone and ZIP code for location-specific foreclosure timelines and local resources.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(832) 346-9569"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyZip" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Property ZIP Code (Optional)
                </Label>
                <Input
                  id="propertyZip"
                  type="text"
                  placeholder="75001"
                  maxLength={5}
                  value={formData.propertyZip}
                  onChange={(e) => setFormData({ ...formData, propertyZip: e.target.value })}
                  className="text-base"
                />
              </div>

              {formData.phone && (
                <div className="flex items-start space-x-2 p-3 bg-muted/30 rounded-md border">
                  <input
                    type="checkbox"
                    id="smsConsent"
                    checked={formData.smsConsent}
                    onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="smsConsent" className="text-xs text-muted-foreground leading-tight">
                    I consent to receive calls and text messages from EnterActDFW about foreclosure assistance. Reply STOP to unsubscribe.
                  </label>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground" 
                  size="lg"
                  disabled={updateLead.isPending || (!!formData.phone && !formData.smsConsent)}
                >
                  {updateLead.isPending ? "Saving..." : "Save My Info"}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleSkip}
                >
                  Skip
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                ✓ 100% Optional ✓ Secure & Confidential
              </p>
            </form>
          </Card>
        )}

        {/* What Happens Next */}
        <Card className="mx-auto max-w-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">What Happens Next?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Check Your Email</h3>
              <p className="text-sm text-muted-foreground">
                Your guide will arrive within 5 minutes. Check your spam folder if you don't see it.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Review the Guide</h3>
              <p className="text-sm text-muted-foreground">
                Read through the strategies and action steps specific to your situation.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Take Action</h3>
              <p className="text-sm text-muted-foreground">
                Schedule a free consultation to discuss your specific options and next steps.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="mx-auto max-w-3xl mb-12">
          <Card className="p-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3">Ready to Discuss Your Options?</h2>
              <p className="mb-6 text-primary-foreground/90">
                Schedule a free, no-obligation consultation with our foreclosure specialists. We'll review your situation and help you find the best path forward.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://calendar.app.google/PuDvUNJmjx7LzXeY7" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Schedule Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/20 text-white" asChild>
                  <TrackablePhoneLink phoneNumber="832-346-9569">
                    Call (832) 346-9569
                  </TrackablePhoneLink>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="mx-auto max-w-3xl mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">What Homeowners Are Saying</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    M
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3 italic">
                    "EnterActDFW gave us a fair offer and closed in 9 days. We avoided foreclosure and moved on with dignity."
                  </p>
                  <p className="font-semibold text-sm">— Maria T., Dallas</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    J
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3 italic">
                    "They explained all my options clearly and helped me make the best decision for my family. No pressure, just honest advice."
                  </p>
                  <p className="font-semibold text-sm">— James R., Fort Worth</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <FileText className="w-5 h-5" />
            <p>Need more information?</p>
          </div>
          <Link href="/#resources">
            <Button variant="outline">
              Download Another Guide
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 EnterActDFW. All rights reserved.</p>
          <p className="mt-2">
            Licensed real estate brokerage helping Texas homeowners navigate foreclosure with dignity and fairness.
          </p>
        </div>
      </footer>
    </div>
  );
}
