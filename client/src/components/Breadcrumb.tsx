import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {/* Home link */}
        <li className="flex items-center">
          <Link href="/">
            <span className="flex items-center hover:text-blue-600 transition-colors cursor-pointer">
              <Home className="w-4 h-4" />
            </span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
              {item.href && !isLast ? (
                <Link href={item.href}>
                  <span className="hover:text-blue-600 transition-colors cursor-pointer">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-gray-900" : ""}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
