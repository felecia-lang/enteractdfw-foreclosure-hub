import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Scale, Home as HomeIcon, FileText, Shield, HelpCircle } from "lucide-react";

interface RelatedArticle {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  title?: string;
}

/**
 * Displays 3-4 related knowledge base articles at the bottom of guide pages
 * to encourage deeper engagement and help users discover relevant content.
 * 
 * @example
 * <RelatedArticles 
 *   articles={[
 *     {
 *       title: "Your Rights as a Homeowner",
 *       description: "Learn about your legal protections during foreclosure",
 *       href: "/knowledge-base/homeowner-rights",
 *       icon: Scale
 *     }
 *   ]}
 * />
 */
export default function RelatedArticles({ articles, title = "Related Resources" }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article, index) => {
            const IconComponent = article.icon;
            return (
              <Link key={index} href={article.href}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {article.description}
                          </CardDescription>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Pre-defined related articles for each page
export const relatedArticlesMap = {
  "understanding-foreclosure": [
    {
      title: "Your Rights as a Homeowner",
      description: "Learn about your legal protections and rights during the foreclosure process in Texas",
      href: "/knowledge-base/homeowner-rights",
      icon: Scale
    },
    {
      title: "Options to Avoid Foreclosure",
      description: "Explore alternatives including loan modifications, repayment plans, and selling options",
      href: "/knowledge-base/options",
      icon: HomeIcon
    },
    {
      title: "Foreclosure Timeline Calculator",
      description: "Calculate your personalized foreclosure timeline and key deadlines",
      href: "/tools/timeline-calculator",
      icon: FileText
    },
    {
      title: "Spotting Foreclosure Scams",
      description: "Protect yourself from foreclosure rescue scams and fraudulent schemes",
      href: "/knowledge-base/avoiding-scams",
      icon: Shield
    }
  ],
  "homeowner-rights": [
    {
      title: "Understanding Foreclosure in Texas",
      description: "Learn the basics of the foreclosure process, timelines, and what makes Texas different",
      href: "/knowledge-base/understanding-foreclosure",
      icon: BookOpen
    },
    {
      title: "Navigating the Notice of Default",
      description: "Step-by-step action guide to respond quickly after receiving a Notice of Default",
      href: "/knowledge-base/notice-of-default",
      icon: FileText
    },
    {
      title: "Strategic Communication with Your Lender",
      description: "Professional strategies and scripts for effective communication with your mortgage servicer",
      href: "/knowledge-base/contact-lender",
      icon: FileText
    },
    {
      title: "FAQ: Common Questions",
      description: "Get answers to frequently asked questions about foreclosure in Texas",
      href: "/knowledge-base/faq",
      icon: HelpCircle
    }
  ],
  "options": [
    {
      title: "Understanding Foreclosure in Texas",
      description: "Learn the basics of the foreclosure process before exploring your options",
      href: "/knowledge-base/understanding-foreclosure",
      icon: BookOpen
    },
    {
      title: "Property Value Estimator",
      description: "Get an instant estimate of your home's value and explore your selling options",
      href: "/tools/property-estimator",
      icon: HomeIcon
    },
    {
      title: "Strategic Communication with Your Lender",
      description: "Learn how to effectively communicate with your lender about loss mitigation options",
      href: "/knowledge-base/contact-lender",
      icon: FileText
    },
    {
      title: "Spotting Foreclosure Scams",
      description: "Protect yourself from scams while exploring foreclosure alternatives",
      href: "/knowledge-base/avoiding-scams",
      icon: Shield
    }
  ],
  "notice-of-default": [
    {
      title: "Understanding Foreclosure in Texas",
      description: "Learn about the foreclosure process and timeline in Texas",
      href: "/knowledge-base/understanding-foreclosure",
      icon: BookOpen
    },
    {
      title: "Your Rights as a Homeowner",
      description: "Understand your legal protections and rights during foreclosure",
      href: "/knowledge-base/homeowner-rights",
      icon: Scale
    },
    {
      title: "Strategic Communication with Your Lender",
      description: "Get scripts and templates for calling your mortgage servicer",
      href: "/knowledge-base/contact-lender",
      icon: FileText
    },
    {
      title: "Foreclosure Timeline Calculator",
      description: "Calculate your personalized timeline and key deadlines",
      href: "/tools/timeline-calculator",
      icon: FileText
    }
  ],
  "contact-lender": [
    {
      title: "Navigating the Notice of Default",
      description: "Step-by-step guide for responding to a Notice of Default",
      href: "/knowledge-base/notice-of-default",
      icon: FileText
    },
    {
      title: "Options to Avoid Foreclosure",
      description: "Explore loan modifications, repayment plans, and other alternatives",
      href: "/knowledge-base/options",
      icon: HomeIcon
    },
    {
      title: "Your Rights as a Homeowner",
      description: "Know your rights when communicating with your lender",
      href: "/knowledge-base/homeowner-rights",
      icon: Scale
    },
    {
      title: "Spotting Foreclosure Scams",
      description: "Avoid scams while working with your lender",
      href: "/knowledge-base/avoiding-scams",
      icon: Shield
    }
  ],
  "avoiding-scams": [
    {
      title: "Your Rights as a Homeowner",
      description: "Understand your legal protections against foreclosure scams",
      href: "/knowledge-base/homeowner-rights",
      icon: Scale
    },
    {
      title: "Options to Avoid Foreclosure",
      description: "Learn about legitimate alternatives to foreclosure",
      href: "/knowledge-base/options",
      icon: HomeIcon
    },
    {
      title: "Resources & Support Directory",
      description: "Find trusted HUD-approved counselors and legal aid organizations",
      href: "/knowledge-base/resources",
      icon: BookOpen
    },
    {
      title: "FAQ: Common Questions",
      description: "Get answers about legitimate foreclosure assistance",
      href: "/knowledge-base/faq",
      icon: HelpCircle
    }
  ]
};
