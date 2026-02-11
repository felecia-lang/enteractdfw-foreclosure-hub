import { trpc } from "@/lib/trpc";
import { Phone } from "lucide-react";
import { useLocation } from "wouter";
import { getAttributionUTM } from "@/lib/utm";

interface TrackablePhoneLinkProps {
  phoneNumber: string;
  displayText?: string;
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

/**
 * TrackablePhoneLink - Wraps phone number links with click tracking
 * 
 * Usage:
 * <TrackablePhoneLink phoneNumber="844-981-2937" />
 * <TrackablePhoneLink phoneNumber="844-981-2937" displayText="Call Us Now" showIcon />
 * <TrackablePhoneLink phoneNumber="844-981-2937" className="custom-class">
 *   <span>Custom content</span>
 * </TrackablePhoneLink>
 */
export default function TrackablePhoneLink({
  phoneNumber,
  displayText,
  className = "hover:text-primary transition-colors",
  showIcon = false,
  children,
}: TrackablePhoneLinkProps) {
  const [location] = useLocation();
  const trackCallMutation = trpc.tracking.trackPhoneCall.useMutation();

  // Format phone number for tel: link (remove all non-digits)
  const telLink = `tel:+1${phoneNumber.replace(/\D/g, "")}`;
  
  // Display text: use children, displayText prop, or formatted phone number
  const display = children || displayText || phoneNumber;

  const handleClick = () => {
    // Get UTM attribution parameters
    const utm = getAttributionUTM();

    // Track the click asynchronously (don't block the call)
    trackCallMutation.mutate({
      phoneNumber,
      pagePath: location,
      pageTitle: document.title,
      ...utm,
    });
  };

  return (
    <a
      href={telLink}
      onClick={handleClick}
      className={className}
      aria-label={`Call ${phoneNumber}`}
    >
      {showIcon && <Phone className="h-4 w-4 inline mr-2" />}
      {display}
    </a>
  );
}
