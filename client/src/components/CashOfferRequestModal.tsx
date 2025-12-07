import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Home, MapPin, Ruler, Calendar, Wrench, Upload, X, Image as ImageIcon } from "lucide-react";

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

  const [photos, setPhotos] = useState<{ file: File; preview: string; url?: string }[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadPhotoMutation = trpc.cashOffers.uploadPhoto.useMutation();

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
      // Reset photos
      photos.forEach(photo => URL.revokeObjectURL(photo.preview));
      setPhotos([]);
    },
    onError: (error: any) => {
      toast.error("Submission Failed", {
        description: error.message || "Please check your information and try again.",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    // Validate file count
    if (photos.length + files.length > 5) {
      toast.error("Too Many Photos", {
        description: "You can upload a maximum of 5 photos.",
      });
      return;
    }

    // Validate each file
    const validFiles = files.filter((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid File Type", {
          description: `${file.name} is not an image file.`,
        });
        return false;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File Too Large", {
          description: `${file.name} exceeds 10MB limit.`,
        });
        return false;
      }

      return true;
    });

    // Create preview URLs
    const newPhotos = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Upload photos first if any
    let photoUrls: string[] = [];
    if (photos.length > 0) {
      setUploadingPhotos(true);
      try {
        const uploadPromises = photos.map(async (photo) => {
          // Convert file to base64
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const base64 = reader.result as string;
              // Remove data URL prefix
              const base64Data = base64.split(',')[1];
              resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(photo.file);
          });

          const base64Data = await base64Promise;
          const result = await uploadPhotoMutation.mutateAsync({
            fileName: photo.file.name,
            fileData: base64Data,
            contentType: photo.file.type,
          });
          return result.url;
        });

        photoUrls = await Promise.all(uploadPromises);
      } catch (error) {
        toast.error("Photo Upload Failed", {
          description: "Failed to upload photos. Please try again.",
        });
        setUploadingPhotos(false);
        return;
      }
      setUploadingPhotos(false);
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
      photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
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

          {/* Property Photos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Property Photos (Optional)
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload 3-5 photos of your property to help us provide a more accurate valuation. Include exterior, interior, and any areas needing attention.
            </p>
            
            {/* Photo Upload Area */}
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              
              {photos.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-dashed border-2 h-24 hover:bg-accent/50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload photos ({photos.length}/5)
                    </span>
                  </div>
                </Button>
              )}

              {/* Photo Previews */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.preview}
                        alt={`Property photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={submitMutation.isPending || uploadingPhotos}
            >
              {uploadingPhotos ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading Photos...
                </>
              ) : submitMutation.isPending ? (
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
              disabled={submitMutation.isPending || uploadingPhotos}
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
