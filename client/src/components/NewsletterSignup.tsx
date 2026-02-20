import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface NewsletterSignupProps {
  variant?: "sidebar" | "footer" | "inline";
}

export function NewsletterSignup({ variant = "sidebar" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Success! Check your email to confirm your subscription.");
      setEmail("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    subscribe.mutate({ email });
  };

  if (variant === "footer") {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Stay Informed</h3>
        <p className="text-sm text-gray-300">
          Get weekly foreclosure prevention tips and Texas homeowner resources delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={subscribe.isPending}
          />
          <Button
            type="submit"
            disabled={subscribe.isPending}
            className="bg-[#00A6A6] hover:bg-[#008888] text-white whitespace-nowrap"
          >
            {subscribe.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        <p className="text-xs text-gray-400">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-gradient-to-br from-[#0A2342] to-[#00A6A6] rounded-lg p-8 text-white my-12">
        <div className="flex items-start gap-4">
          <div className="bg-white/10 p-3 rounded-lg">
            <Mail className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Don't Miss Critical Updates</h3>
            <p className="text-white/90 mb-4">
              Join 2,000+ Texas homeowners receiving weekly foreclosure prevention strategies, legal updates, and exclusive resources.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-gray-900 border-0 flex-1"
                disabled={subscribe.isPending}
              />
              <Button
                type="submit"
                disabled={subscribe.isPending}
                className="bg-white text-[#0A2342] hover:bg-gray-100 font-semibold whitespace-nowrap"
              >
                {subscribe.isPending ? "Subscribing..." : "Get Free Tips"}
              </Button>
            </form>
            <p className="text-xs text-white/70 mt-2">
              No spam. Unsubscribe anytime. Your privacy is protected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default sidebar variant
  return (
    <div className="bg-gradient-to-br from-[#0A2342] to-[#00A6A6] rounded-lg p-6 text-white sticky top-4">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-5 w-5" />
        <h3 className="text-lg font-bold">Free Weekly Tips</h3>
      </div>
      <p className="text-sm text-white/90 mb-4">
        Get foreclosure prevention strategies and Texas homeowner resources delivered to your inbox every week.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white text-gray-900 border-0"
          disabled={subscribe.isPending}
        />
        <Button
          type="submit"
          disabled={subscribe.isPending}
          className="w-full bg-white text-[#0A2342] hover:bg-gray-100 font-semibold"
        >
          {subscribe.isPending ? "Subscribing..." : "Subscribe Free"}
        </Button>
      </form>
      <p className="text-xs text-white/70 mt-3">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
