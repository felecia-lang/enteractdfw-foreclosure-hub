import { Home, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Standalone breadcrumb navigation component that can be used in any page layout.
 * Displays a hierarchical navigation path with home icon and chevron separators.
 * 
 * @example
 * <BreadcrumbNavigation 
 *   items={[
 *     { label: "Knowledge Base", href: "/knowledge-base" },
 *     { label: "Current Page" }
 *   ]} 
 * />
 */
export default function BreadcrumbNavigation({ items, className = "" }: BreadcrumbNavigationProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
      <Link href="/">
        <a className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
        </a>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {item.href ? (
            <Link href={item.href}>
              <a className="text-muted-foreground hover:text-foreground transition-colors">
                {item.label}
              </a>
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
