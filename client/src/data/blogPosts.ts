export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: "Pre-Foreclosure" | "Notice of Default" | "Foreclosure Prevention" | "Legal Rights" | "Post-Foreclosure";
  author: string;
  publishedDate: string;
  readTime: string;
  featuredImage: string;
  tags: string[];
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Warning Signs You're Heading Toward Foreclosure in Texas",
    slug: "warning-signs-foreclosure-texas",
    excerpt: "Recognize the early warning signs before it's too late. Most homeowners don't realize they're in foreclosure danger until they receive the Notice of Default—but by then, your options are limited. Learn what to watch for and what action steps to take now.",
    category: "Pre-Foreclosure",
    author: "EnterActDFW Team",
    publishedDate: "2026-02-19",
    readTime: "12 min read",
    featuredImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663057293703/bmHDgUJBkkVgHoZW.jpg",
    tags: ["Warning Signs", "Foreclosure Prevention", "Early Detection", "Financial Hardship"],
    featured: true
  },
  {
    id: "2",
    title: "Received a Notice of Default in Texas? Your 21-Day Action Plan",
    slug: "notice-of-default-action-plan",
    excerpt: "You've received a Notice of Default. The clock is ticking—you have 21 days to cure the default before foreclosure proceedings accelerate. This comprehensive action plan shows you exactly what to do in each of those 21 days to maximize your chances of saving your home or exiting with dignity.",
    category: "Notice of Default",
    author: "EnterActDFW Team",
    publishedDate: "2026-02-20",
    readTime: "15 min read",
    featuredImage: "/blog-images/notice-of-default-action-plan.jpg",
    tags: ["Notice of Default", "Action Plan", "Timeline", "Cure Period"],
    featured: false
  },
  {
    id: "3",
    title: "Texas Loan Modification Guide: How to Negotiate with Your Lender",
    slug: "texas-loan-modification-guide",
    excerpt: "A loan modification can reduce your monthly payment, lower your interest rate, or extend your loan term—making your mortgage affordable again. This guide walks you through the entire loan modification process in Texas, from application to approval, with scripts and templates included.",
    category: "Foreclosure Prevention",
    author: "EnterActDFW Team",
    publishedDate: "2026-02-21",
    readTime: "18 min read",
    featuredImage: "/blog-images/loan-modification-guide.jpg",
    tags: ["Loan Modification", "Negotiation", "Loss Mitigation", "Hardship Letter"],
    featured: false
  },
  {
    id: "4",
    title: "Texas Short Sale Guide: Sell Your Home and Avoid Foreclosure",
    slug: "texas-short-sale-guide",
    excerpt: "A short sale allows you to sell your home for less than you owe on your mortgage—with your lender's approval. It's a powerful foreclosure alternative that protects your credit and lets you walk away with dignity. Learn how short sales work in Texas and whether it's the right option for you.",
    category: "Foreclosure Prevention",
    author: "EnterActDFW Team",
    publishedDate: "2026-02-22",
    readTime: "14 min read",
    featuredImage: "/blog-images/short-sale-guide.jpg",
    tags: ["Short Sale", "Foreclosure Alternative", "Credit Protection", "Lender Approval"],
    featured: false
  },
  {
    id: "5",
    title: "Texas Foreclosure Auction: What Happens on Sale Day",
    slug: "texas-foreclosure-auction-guide",
    excerpt: "The foreclosure auction is the final stage—the day your home is sold on the courthouse steps. Understanding what happens on sale day can help you make informed decisions about redemption rights, deficiency judgments, and your post-foreclosure options. This guide demystifies the Texas foreclosure auction process.",
    category: "Post-Foreclosure",
    author: "EnterActDFW Team",
    publishedDate: "2026-02-23",
    readTime: "10 min read",
    featuredImage: "/blog-images/foreclosure-auction.jpg",
    tags: ["Foreclosure Auction", "Sale Day", "Redemption Rights", "Deficiency Judgment"],
    featured: false
  }
];

export const categories = [
  "All Posts",
  "Pre-Foreclosure",
  "Notice of Default",
  "Foreclosure Prevention",
  "Legal Rights",
  "Post-Foreclosure"
] as const;

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  if (category === "All Posts") {
    return blogPosts;
  }
  return blogPosts.filter(post => post.category === category);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

export function searchBlogPosts(query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt.toLowerCase().includes(lowerQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
