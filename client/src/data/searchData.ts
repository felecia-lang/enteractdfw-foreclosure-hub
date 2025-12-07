/**
 * Searchable content index for the Knowledge Base
 * This file contains all searchable content with metadata for filtering and display
 */

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  content: string; // Full searchable content
  category: "article" | "faq" | "glossary" | "tool";
  href: string;
  breadcrumb: string[];
  keywords: string[]; // Additional keywords for matching
}

export const searchableContent: SearchResult[] = [
  // Knowledge Base Articles
  {
    id: "understanding-foreclosure",
    title: "Understanding Foreclosure in Texas",
    description: "Learn the basics of the foreclosure process, key terms, timelines, and what makes Texas different from other states.",
    content: "foreclosure process texas non-judicial power of sale deed of trust trustee mortgage lender borrower default timeline 20 days notice of default notice of sale cure period reinstatement equity deficiency judgment",
    category: "article",
    href: "/knowledge-base/understanding-foreclosure",
    breadcrumb: ["Knowledge Base", "Understanding Foreclosure"],
    keywords: ["foreclosure", "texas", "process", "timeline", "non-judicial", "deed of trust"]
  },
  {
    id: "homeowner-rights",
    title: "Your Rights as a Homeowner",
    description: "Understand your federal and Texas-specific legal rights and protections during the foreclosure process.",
    content: "homeowner rights protections federal law texas law RESPA FDCPA SCRA servicemembers civil relief act loss mitigation dual tracking foreclosure defense attorney housing counselor HUD",
    category: "article",
    href: "/knowledge-base/homeowner-rights",
    breadcrumb: ["Knowledge Base", "Homeowner Rights"],
    keywords: ["rights", "protections", "legal", "federal", "texas", "RESPA", "FDCPA"]
  },
  {
    id: "options-to-avoid",
    title: "Options to Avoid Foreclosure",
    description: "Explore alternatives including loan modifications, repayment plans, short sales, and selling options.",
    content: "loan modification repayment plan forbearance refinance short sale deed in lieu bankruptcy chapter 13 cash buyer sell home reinstatement loss mitigation hardship letter",
    category: "article",
    href: "/knowledge-base/options",
    breadcrumb: ["Knowledge Base", "Options to Avoid Foreclosure"],
    keywords: ["options", "alternatives", "loan modification", "short sale", "bankruptcy", "sell"]
  },
  {
    id: "notice-of-default",
    title: "Navigating the Notice of Default",
    description: "Step-by-step action guide to respond quickly and effectively after receiving a Notice of Default.",
    content: "notice of default NOD action checklist timeline cure period reinstatement amount deadline lender contact financial documents hardship letter loss mitigation application",
    category: "article",
    href: "/knowledge-base/notice-of-default",
    breadcrumb: ["Knowledge Base", "Notice of Default Guide"],
    keywords: ["notice of default", "NOD", "action plan", "checklist", "cure period"]
  },
  {
    id: "contact-lender",
    title: "Strategic Communication with Your Lender",
    description: "Professional strategies, proven scripts, and templates for effective communication with your mortgage servicer.",
    content: "lender communication mortgage servicer phone scripts call log hardship letter loss mitigation application documentation representative contact information account number",
    category: "article",
    href: "/knowledge-base/contact-lender",
    breadcrumb: ["Knowledge Base", "Contacting Your Lender"],
    keywords: ["lender", "servicer", "communication", "phone script", "hardship letter"]
  },
  {
    id: "avoiding-scams",
    title: "Spotting Foreclosure Scams",
    description: "Protect yourself from foreclosure rescue scams, fraud, and predatory schemes targeting distressed homeowners.",
    content: "foreclosure scams fraud rescue scam upfront fees deed transfer equity stripping phantom help forensic loan audit mass joinder HUD approved counselor legitimate help",
    category: "article",
    href: "/knowledge-base/avoiding-scams",
    breadcrumb: ["Knowledge Base", "Avoiding Scams"],
    keywords: ["scams", "fraud", "rescue scam", "upfront fees", "protect yourself"]
  },

  // Tools
  {
    id: "timeline-calculator",
    title: "Foreclosure Timeline Calculator",
    description: "Calculate your personalized foreclosure timeline and key deadlines based on Texas law.",
    content: "timeline calculator foreclosure dates deadlines notice of default notice of sale cure period reinstatement deadline sale date 20 days 21 days personalized timeline",
    category: "tool",
    href: "/tools/timeline-calculator",
    breadcrumb: ["Tools", "Timeline Calculator"],
    keywords: ["calculator", "timeline", "deadlines", "dates", "foreclosure timeline"]
  },
  {
    id: "property-estimator",
    title: "Property Value Estimator",
    description: "Get an instant estimate of your home's value and explore your selling options.",
    content: "property value estimator home value equity calculator market value DFW real estate appraisal selling options cash offer traditional sale",
    category: "tool",
    href: "/tools/property-estimator",
    breadcrumb: ["Tools", "Property Value Estimator"],
    keywords: ["property value", "home value", "estimator", "equity", "appraisal"]
  },

  // Common FAQ topics
  {
    id: "faq-timeline",
    title: "How long does foreclosure take in Texas?",
    description: "Texas foreclosure timeline from first missed payment to sale can take 4-6 months minimum.",
    content: "foreclosure timeline texas how long 4 months 6 months missed payment default notice of sale 21 days fast non-judicial",
    category: "faq",
    href: "/knowledge-base/faq#timeline",
    breadcrumb: ["Knowledge Base", "FAQ"],
    keywords: ["how long", "timeline", "duration", "months"]
  },
  {
    id: "faq-stop-foreclosure",
    title: "Can I stop a foreclosure?",
    description: "Yes, you can stop foreclosure through reinstatement, loan modification, bankruptcy, or selling your home.",
    content: "stop foreclosure prevent halt reinstatement loan modification bankruptcy chapter 13 automatic stay sell home pay off debt",
    category: "faq",
    href: "/knowledge-base/faq#stop",
    breadcrumb: ["Knowledge Base", "FAQ"],
    keywords: ["stop", "prevent", "halt", "avoid foreclosure"]
  },
  {
    id: "faq-redemption",
    title: "Do I have a right of redemption in Texas?",
    description: "No, Texas does not allow right of redemption for standard mortgage foreclosures.",
    content: "right of redemption texas no redemption period buy back home after sale foreclosure sale final",
    category: "faq",
    href: "/knowledge-base/faq#redemption",
    breadcrumb: ["Knowledge Base", "FAQ"],
    keywords: ["redemption", "buy back", "after sale"]
  },

  // Common Glossary terms
  {
    id: "glossary-foreclosure",
    title: "Foreclosure",
    description: "Legal process by which a lender takes possession of a property when the borrower fails to make mortgage payments.",
    content: "foreclosure definition legal process lender repossession default missed payments mortgage",
    category: "glossary",
    href: "/knowledge-base/glossary#foreclosure",
    breadcrumb: ["Knowledge Base", "Glossary"],
    keywords: ["foreclosure", "definition", "what is"]
  },
  {
    id: "glossary-deed-of-trust",
    title: "Deed of Trust",
    description: "Document that gives the lender a security interest in your property, used instead of a mortgage in Texas.",
    content: "deed of trust definition security interest trustee beneficiary texas mortgage alternative three party",
    category: "glossary",
    href: "/knowledge-base/glossary#deed-of-trust",
    breadcrumb: ["Knowledge Base", "Glossary"],
    keywords: ["deed of trust", "definition", "what is", "security interest"]
  },
  {
    id: "glossary-default",
    title: "Default",
    description: "Failure to meet the legal obligations of a loan, typically by missing mortgage payments.",
    content: "default definition missed payment failure to pay breach of contract loan obligation delinquent",
    category: "glossary",
    href: "/knowledge-base/glossary#default",
    breadcrumb: ["Knowledge Base", "Glossary"],
    keywords: ["default", "definition", "missed payment", "what is"]
  },
  {
    id: "glossary-reinstatement",
    title: "Reinstatement",
    description: "Bringing a delinquent loan current by paying all past-due amounts, fees, and costs.",
    content: "reinstatement definition cure default pay past due bring current catch up payments fees costs",
    category: "glossary",
    href: "/knowledge-base/glossary#reinstatement",
    breadcrumb: ["Knowledge Base", "Glossary"],
    keywords: ["reinstatement", "definition", "cure", "catch up", "what is"]
  },
  {
    id: "glossary-short-sale",
    title: "Short Sale",
    description: "Sale of property for less than the amount owed on the mortgage, with lender approval.",
    content: "short sale definition sell less than owed underwater negative equity lender approval forgive difference",
    category: "glossary",
    href: "/knowledge-base/glossary#short-sale",
    breadcrumb: ["Knowledge Base", "Glossary"],
    keywords: ["short sale", "definition", "underwater", "what is"]
  }
];

/**
 * Search function that returns results matching the query
 * @param query - Search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching search results with relevance score
 */
export function searchContent(query: string, limit: number = 10): (SearchResult & { score: number; matchedText: string })[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  const results = searchableContent.map(item => {
    let score = 0;
    let matchedText = "";

    // Check title (highest weight)
    const titleLower = item.title.toLowerCase();
    searchTerms.forEach(term => {
      if (titleLower.includes(term)) {
        score += 10;
        if (!matchedText) matchedText = item.title;
      }
    });

    // Check description (medium weight)
    const descLower = item.description.toLowerCase();
    searchTerms.forEach(term => {
      if (descLower.includes(term)) {
        score += 5;
        if (!matchedText) matchedText = item.description;
      }
    });

    // Check keywords (medium weight)
    item.keywords.forEach(keyword => {
      searchTerms.forEach(term => {
        if (keyword.toLowerCase().includes(term)) {
          score += 5;
        }
      });
    });

    // Check content (lower weight)
    const contentLower = item.content.toLowerCase();
    searchTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 2;
        if (!matchedText) matchedText = item.content.substring(0, 100);
      }
    });

    return {
      ...item,
      score,
      matchedText: matchedText || item.description
    };
  });

  // Filter out items with score 0 and sort by score descending
  return results
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
