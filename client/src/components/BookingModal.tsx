import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, Shield } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const [bookingComplete, setBookingComplete] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // GHL calendar URL
  const calendarUrl = "https://links.enteractai.com/widget/booking/4H1QKftQ8nG2hkZesjUM";

  // Listen for booking completion message from GHL iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // GHL sends messages when booking is complete
      if (event.data && typeof event.data === "string") {
        if (event.data.includes("booking_completed") || event.data.includes("appointment_scheduled")) {
          setBookingComplete(true);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      // Delay reset to allow smooth transition
      const timer = setTimeout(() => {
        setBookingComplete(false);
        setIframeLoaded(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {!bookingComplete ? (
          <>
            <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-[#0A2342] to-[#00A6A6] text-white">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Schedule Your Free Consultation
              </DialogTitle>
              <DialogDescription className="text-gray-100 mt-2">
                Book a confidential consultation with our foreclosure prevention specialists. 
                We'll review your situation and explore all available options to protect your home.
              </DialogDescription>
            </DialogHeader>

            {/* Trust Indicators */}
            <div className="px-6 py-3 bg-gray-50 border-y flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4 text-[#00A6A6]" />
                <span>30-minute session</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Shield className="h-4 w-4 text-[#00A6A6]" />
                <span>100% confidential</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-[#00A6A6]" />
                <span>No obligation</span>
              </div>
            </div>

            {/* Calendar iframe */}
            <div className="relative w-full" style={{ height: "600px" }}>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A6A6] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading calendar...</p>
                  </div>
                </div>
              )}
              <iframe
                src={calendarUrl}
                className="w-full h-full border-0"
                onLoad={() => setIframeLoaded(true)}
                title="Schedule Consultation"
                allow="camera; microphone; autoplay; encrypted-media;"
              />
            </div>
          </>
        ) : (
          // Confirmation screen
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Consultation Scheduled!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Thank you for scheduling your free consultation with EnterActDFW. 
                We've sent a confirmation email with all the details.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#0A2342]/5 to-[#00A6A6]/5 rounded-lg p-6 mb-6 max-w-lg mx-auto">
              <h4 className="font-semibold text-gray-900 mb-3">What happens next?</h4>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00A6A6] flex-shrink-0 mt-0.5" />
                  <span>You'll receive a confirmation email with calendar invite</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00A6A6] flex-shrink-0 mt-0.5" />
                  <span>We'll call you at your scheduled time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00A6A6] flex-shrink-0 mt-0.5" />
                  <span>Bring any questions or documents you'd like to discuss</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                onClick={() => onOpenChange(false)}
                className="bg-[#00A6A6] hover:bg-[#00A6A6]/90 text-white"
              >
                Got It, Thanks!
              </Button>
              <p className="text-sm text-gray-500">
                Need to reschedule? Check your confirmation email for instructions.
              </p>
            </div>

            {/* Contact info */}
            <div className="mt-6 pt-6 border-t text-sm text-gray-600">
              <p>Questions? Call us at <strong>(844) 981-2937</strong></p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
