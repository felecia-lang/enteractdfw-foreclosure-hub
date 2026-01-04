import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Loader2, Send } from "lucide-react";
import { RECAPTCHA_SITE_KEY } from "@/const";
import { useEffect } from "react";

// Declare grecaptcha type
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function LeadConnectorContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "", // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Auto-dismiss success banner after 10 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 10000); // 10 seconds

      // Cleanup timer on unmount or when isSubmitted changes
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  // Analytics tracking
  const trackEvent = trpc.formAnalytics.trackEvent.useMutation();
  const trackInteraction = trpc.formHeatmap.trackInteraction.useMutation();
  
  // Track field focus times for heatmap
  const [fieldFocusTimes, setFieldFocusTimes] = useState<Record<string, number>>({});

  // Track form view on mount
  useEffect(() => {
    trackEvent.mutate({
      eventType: "view",
      formName: "contact_form",
      sessionId,
      pagePath: window.location.pathname,
      userAgent: navigator.userAgent,
    });
  }, []);

  // Track form start when user begins typing
  const handleFormStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent.mutate({
        eventType: "start",
        formName: "contact_form",
        sessionId,
        pagePath: window.location.pathname,
        userAgent: navigator.userAgent,
      });
    }
  };

  const submitWebhook = trpc.webhook.submitLeadConnector.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      });
      // Show success state
      setIsSubmitted(true);
      // Track completion
      trackEvent.mutate({
        eventType: "complete",
        formName: "contact_form",
        sessionId,
        userEmail: formData.email,
        pagePath: window.location.pathname,
        userAgent: navigator.userAgent,
      });
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        website: "",
      });
      setErrors({});
      setHasStarted(false);
    },
    onError: (error) => {
      toast.error("Failed to send message", {
        description: error.message || "Please try again later.",
      });
      // Track error
      trackEvent.mutate({
        eventType: "error",
        formName: "contact_form",
        sessionId,
        userEmail: formData.email,
        errorType: "submission",
        errorMessage: error.message || "Unknown error",
        pagePath: window.location.pathname,
        userAgent: navigator.userAgent,
      });
    },
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check honeypot field - if filled, it's likely a bot
    if (formData.website) {
      toast.error("Spam detected");
      return false;
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Generate reCAPTCHA token
    try {
      if (!window.grecaptcha || !RECAPTCHA_SITE_KEY) {
        console.warn("[reCAPTCHA] Not loaded or site key missing");
        // Proceed without reCAPTCHA if not available
        submitWebhook.mutate({ ...formData, recaptchaToken: undefined });
        return;
      }

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
            action: 'contact_form',
          });
          
          // Submit with reCAPTCHA token
          submitWebhook.mutate({ ...formData, recaptchaToken: token });
        } catch (error) {
          console.error("[reCAPTCHA] Token generation failed:", error);
          toast.error("Security verification failed. Please try again.");
        }
      });
    } catch (error) {
      console.error("[reCAPTCHA] Error:", error);
      // Proceed without reCAPTCHA on error
      submitWebhook.mutate({ ...formData, recaptchaToken: undefined });
    }
  };

  // Handle field focus for heatmap tracking
  const handleFieldFocus = (fieldName: string) => {
    // Record focus time
    setFieldFocusTimes((prev) => ({
      ...prev,
      [fieldName]: Date.now(),
    }));

    // Track focus event
    trackInteraction.mutate({
      formName: "contact_form",
      fieldName,
      sessionId,
      interactionType: "focus",
      pagePath: window.location.pathname,
      userAgent: navigator.userAgent,
    });

    // Trigger form start tracking
    handleFormStart();
  };

  // Handle field blur for heatmap tracking
  const handleFieldBlur = (fieldName: string) => {
    const focusTime = fieldFocusTimes[fieldName];
    if (focusTime) {
      const timeSpentMs = Date.now() - focusTime;
      const fieldValue = formData[fieldName as keyof typeof formData];
      const fieldCompleted = fieldValue && fieldValue.trim().length > 0 ? 1 : 0;

      // Track blur event with time spent
      trackInteraction.mutate({
        formName: "contact_form",
        fieldName,
        sessionId,
        interactionType: "blur",
        timeSpentMs,
        fieldCompleted,
        pagePath: window.location.pathname,
        userAgent: navigator.userAgent,
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Track change event for heatmap
    trackInteraction.mutate({
      formName: "contact_form",
      fieldName: field,
      sessionId,
      interactionType: "change",
      pagePath: window.location.pathname,
      userAgent: navigator.userAgent,
    });
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Track form start on first input
    handleFormStart();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Get in Touch</CardTitle>
        <CardDescription>
          Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">
                  Message Sent Successfully!
                </h3>
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                  Thank you for reaching out. We've received your message and will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                >
                  Send another message
                </button>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onFocus={() => handleFieldFocus("name")}
              onBlur={() => handleFieldBlur("name")}
              className={errors.name ? "border-red-500" : ""}
              disabled={submitWebhook.isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onFocus={() => handleFieldFocus("email")}
              onBlur={() => handleFieldBlur("email")}
              className={errors.email ? "border-red-500" : ""}
              disabled={submitWebhook.isPending}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onFocus={() => handleFieldFocus("phone")}
              onBlur={() => handleFieldBlur("phone")}
              className={errors.phone ? "border-red-500" : ""}
              disabled={submitWebhook.isPending}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Honeypot Field - Hidden from users, visible to bots */}
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us about your situation and how we can help..."
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              onFocus={() => handleFieldFocus("message")}
              onBlur={() => handleFieldBlur("message")}
              className={errors.message ? "border-red-500" : ""}
              disabled={submitWebhook.isPending}
              rows={5}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={submitWebhook.isPending}
          >
            {submitWebhook.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
