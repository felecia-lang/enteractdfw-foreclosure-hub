import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb";

const navigationItems = [
  {
    title: "Understanding Foreclosure",
    href: "/knowledge-base/understanding-foreclosure",
  },
  {
    title: "Your Rights as a Homeowner",
    href: "/knowledge-base/homeowner-rights",
  },
  {
    title: "Options to Avoid Foreclosure",
    href: "/knowledge-base/options",
  },
  {
    title: "Navigating the Notice of Default",
    href: "/knowledge-base/notice-of-default",
  },
  {
    title: "Strategic Communication with Your Lender",
    href: "/knowledge-base/contact-lender",
  },
  {
    title: "Resources & Support Directory",
    href: "/resources",
  },
  {
    title: "FAQ",
    href: "/faq",
  },
  {
    title: "Spotting the Red Flags: Foreclosure Scams",
    href: "/knowledge-base/avoiding-scams",
  },
  {
    title: "Glossary",
    href: "/glossary",
  },
];

interface KnowledgeBaseLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function KnowledgeBaseLayout({ children, title, description, breadcrumbs }: KnowledgeBaseLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3">
              <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10" />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <TrackablePhoneLink phoneNumber="844-981-2937" showIcon>
                Call Now
              </TrackablePhoneLink>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-2">
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-2">Knowledge Base</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive guides to help you navigate foreclosure in Texas.
                </p>
              </div>
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm transition-colors",
                        location === item.href
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.title}
                    </div>
                  </Link>
                ))}
              </nav>
              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2 text-sm">Need Help Now?</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Talk to our team for a free, no-obligation consultation.
                </p>
                <Button size="sm" className="w-full" asChild>
                  <TrackablePhoneLink phoneNumber="844-981-2937">
                    <span>Call Now</span>
                  </TrackablePhoneLink>
                </Button>
              </div>
            </div>
          </aside>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-sm">
              <nav className="container py-6 space-y-1">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "block px-4 py-3 rounded-md text-sm transition-colors",
                        location === item.href
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.title}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* Main Content */}
          <main className="min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb items={breadcrumbs} />
            )}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{title}</h1>
              {description && (
                <p className="text-lg text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="prose prose-slate max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t py-8 mt-16">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Legal Disclaimer:</strong> This information is for educational purposes only and is not legal advice. 
              EnterActDFW is a licensed real estate brokerage in Texas.
            </p>
            <p>© 2025 EnterActDFW. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
