import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Home, MapPin, Ruler, Calendar, Wrench } from "lucide-react";

interface CashOfferRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CashOfferRequestModal({ open, onOpenChange }: CashOfferRequestModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "TX",
    zipCode: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    yearBuilt: "",
    condition: "",
    additionalNotes: "",
  });

  const submitMutation = trpc.cashOffers.submit.useMutation({
    onSuccess: () => {
      toast.success("Request Submitted!", {
        description: "We'll review your property and contact you within 24 hours with a fair cash offer.",
      });
      onOpenChange(false);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "TX",
        zipCode: "",
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
        yearBuilt: "",
        condition: "",
        additionalNotes: "",
      });
    },
    onError: (error: any) => {
      toast.error("Submission Failed", {
        description: error.message || "Please check your information and try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Missing Required Fields", {
        description: "Please fill in your name, email, and phone number.",
      });
      return;
    }

    if (!formData.street || !formData.city || !formData.zipCode) {
      toast.error("Missing Property Address", {
        description: "Please provide the complete property address.",
      });
      return;
    }

    if (!formData.bedrooms || !formData.bathrooms || !formData.squareFeet || !formData.yearBuilt || !formData.condition) {
      toast.error("Missing Property Details", {
        description: "Please provide all property specifications.",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      toast.error("Invalid Phone Number", {
        description: "Please enter a valid 10-digit phone number.",
      });
      return;
    }

    // Submit the form
    submitMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      squareFeet: parseInt(formData.squareFeet),
      yearBuilt: parseInt(formData.yearBuilt),
      condition: formData.condition as "excellent" | "good" | "fair" | "poor" | "needs_major_repairs",
      additionalNotes: formData.additionalNotes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Request Your Cash Offer</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll provide you with a fair, no-obligation cash offer for your property within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(832) 555-1234"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Property Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Property Address
            </h3>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                placeholder="123 Main Street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Dallas"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value="TX"
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  placeholder="75001"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Ruler className="h-5 w-5 text-primary" />
              Property Specifications
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="3"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  placeholder="2"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="squareFeet">Square Footage *</Label>
                <Input
                  id="squareFeet"
                  type="number"
                  min="500"
                  max="10000"
                  placeholder="1500"
                  value={formData.squareFeet}
                  onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Year Built *</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2000"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Property Condition *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
                required
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - Move-in ready, recently updated</SelectItem>
                  <SelectItem value="good">Good - Well-maintained, minor cosmetic updates needed</SelectItem>
                  <SelectItem value="fair">Fair - Some repairs needed, functional</SelectItem>
                  <SelectItem value="poor">Poor - Significant repairs needed</SelectItem>
                  <SelectItem value="needs_major_repairs">Needs Major Repairs - Extensive work required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Additional Details (Optional)
            </h3>
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">
                Tell us more about your property or situation
              </Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any additional information that might help us provide an accurate offer (e.g., recent upgrades, known issues, timeline needs)..."
                rows={4}
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitMutation.isPending}
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By submitting this form, you agree to be contacted by EnterActDFW regarding your cash offer request.
            We respect your privacy and will never share your information with third parties.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
