import { Helmet } from "react-helmet-async";

/**
 * LocalBusiness Schema Markup Component
 * Implements structured data for EnterActDFW to improve local SEO
 * Based on schema.org/LocalBusiness specification
 */
export default function LocalBusinessSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "EnterActDFW",
    "description": "Licensed Texas real estate brokerage specializing in foreclosure prevention and distressed property solutions in the Dallas-Fort Worth metroplex.",
    "url": "https://www.enteractdfw.com",
    "logo": "https://www.enteractdfw.com/enteractdfw-logo.png",
    "image": "https://www.enteractdfw.com/enteractdfw-logo.png",
    "telephone": "+18449812937",
    "email": "info@enteractdfw.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4400 State Hwy 121, Suite 300",
      "addressLocality": "Lewisville",
      "addressRegion": "TX",
      "postalCode": "75056",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.0462,
      "longitude": -96.9942
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Dallas",
        "sameAs": "https://en.wikipedia.org/wiki/Dallas"
      },
      {
        "@type": "City",
        "name": "Fort Worth",
        "sameAs": "https://en.wikipedia.org/wiki/Fort_Worth,_Texas"
      },
      {
        "@type": "City",
        "name": "Plano",
        "sameAs": "https://en.wikipedia.org/wiki/Plano,_Texas"
      },
      {
        "@type": "City",
        "name": "Arlington",
        "sameAs": "https://en.wikipedia.org/wiki/Arlington,_Texas"
      },
      {
        "@type": "City",
        "name": "Irving",
        "sameAs": "https://en.wikipedia.org/wiki/Irving,_Texas"
      }
    ],
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/enteractdfw",
      "https://www.linkedin.com/company/enteractdfw"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Foreclosure Prevention Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Foreclosure Timeline Calculator",
            "description": "Free Texas foreclosure timeline calculator to determine key dates and deadlines"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cash Home Offers",
            "description": "Fast cash offers for homes facing foreclosure in Dallas-Fort Worth"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Foreclosure Consultation",
            "description": "Free consultation for Texas homeowners facing foreclosure"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
