import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

/**
 * Social Share Buttons Component
 * Provides sharing functionality for Facebook, Twitter, and LinkedIn
 * 
 * @param url - The URL to share (should be absolute URL)
 * @param title - The title of the content being shared
 * @param description - Optional description for the shared content
 */
export default function SocialShareButtons({ url, title, description }: SocialShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : "";

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const width = 600;
    const height = 400;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open(
      shareLinks[platform],
      `${platform}-share`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0`
    );
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="gap-2"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="gap-2"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin')}
        className="gap-2"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>
    </div>
  );
}
