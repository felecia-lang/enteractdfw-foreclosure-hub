import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackStickyCTAClick } from "@/lib/analytics";

interface StickyCTAProps {
  onCtaClick?: () => void;
}

export default function StickyCTA({ onCtaClick }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Show after scrolling down a bit
    const handleScroll = () => {
      const scrollThreshold = 300;
      setIsVisible(window.scrollY > scrollThreshold);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Only show on mobile
  if (!isMobile || !isVisible) {
    return null;
  }

  const handleClick = () => {
    // Track GA4 event for sticky CTA click
    trackStickyCTAClick();
    
    if (onCtaClick) {
      onCtaClick();
    } else {
      // Scroll to the email capture form on the homepage
      const heroForm = document.getElementById("hero-email-form");
      if (heroForm) {
        heroForm.scrollIntoView({ behavior: "smooth", block: "center" });
        // Focus the email input after scrolling
        setTimeout(() => {
          const emailInput = document.getElementById("hero-email-input");
          if (emailInput) {
            emailInput.focus();
          }
        }, 500);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background with blur effect */}
      <div className="bg-background/95 backdrop-blur-sm border-t shadow-lg px-4 py-3">
        <Button
          onClick={handleClick}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-base"
          size="lg"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Schedule Free Consultation
        </Button>
      </div>
    </div>
  );
}
