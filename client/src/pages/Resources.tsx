import KnowledgeBaseLayout from "@/components/KnowledgeBaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone, Globe, Mail } from "lucide-react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";

const resourceCategories = [
  {
    title: "National Foreclosure Prevention Hotlines",
    resources: [
      {
        name: "Homeowner's HOPE™ Hotline",
        phone: "1-888-995-HOPE (4673)",
        website: "https://995hope.org",
        description: "Free foreclosure prevention counseling, personalized action plans, connection to HUD-approved housing counselors, multilingual support.",
        hours: "24/7",
      },
      {
        name: "HUD Housing Counseling",
        phone: "1-800-569-4287",
        website: "https://www.hud.gov/counseling",
        description: "Find HUD-approved housing counseling agencies near you, free or low-cost foreclosure counseling, homebuyer education, rental counseling.",
      },
      {
        name: "Consumer Financial Protection Bureau (CFPB)",
        phone: "1-855-411-2372",
        website: "https://www.consumerfinance.gov",
        description: "File complaints against mortgage servicers, access consumer protection resources, find housing counselors.",
      },
    ],
  },
  {
    title: "Texas-Specific Resources",
    resources: [
      {
        name: "Texas Department of Housing and Community Affairs",
        website: "https://www.tdhca.texas.gov",
        description: "State housing resources, foreclosure prevention information, homeownership assistance programs.",
      },
      {
        name: "Texas Attorney General - Consumer Protection",
        phone: "1-800-621-0508",
        website: "https://www.texasattorneygeneral.gov/consumer-protection",
        description: "Report foreclosure scams, mortgage fraud, and unfair business practices.",
      },
      {
        name: "Texas State Law Library",
        website: "https://guides.sll.texas.gov/foreclosure",
        description: "Comprehensive legal information on Texas foreclosure laws, process, and homeowner rights.",
      },
      {
        name: "TexasLawHelp.org",
        website: "https://www.texaslawhelp.org",
        description: "Free legal information, self-help guides, forms, and legal aid referrals.",
      },
    ],
  },
  {
    title: "Free Legal Aid Organizations in Texas",
    resources: [
      {
        name: "Lone Star Legal Aid",
        phone: "1-800-733-8394",
        website: "https://www.lonestarlegal.org",
        description: "Provides free legal services to eligible low-income Texans facing foreclosure, including help with property tax issues, HOA disputes, and mortgage challenges.",
      },
      {
        name: "Texas RioGrande Legal Aid (TRLA)",
        phone: "1-888-988-9996",
        website: "https://www.trla.org",
        description: "Free civil legal services for low-income residents, including foreclosure defense and housing counseling.",
      },
      {
        name: "Legal Aid of NorthWest Texas (LANWT)",
        phone: "1-888-529-5277",
        website: "https://www.lanwt.org",
        description: "Free legal assistance for eligible residents in North Texas, including foreclosure prevention.",
      },
    ],
  },
  {
    title: "Credit Counseling & Financial Assistance",
    resources: [
      {
        name: "National Foundation for Credit Counseling (NFCC)",
        phone: "1-800-388-2227",
        website: "https://www.nfcc.org",
        description: "Find certified credit counselors, budget assistance, debt management plans.",
      },
      {
        name: "Financial Counseling Association of America (FCAA)",
        website: "https://www.fcaa.org",
        description: "Financial education, credit counseling, debt management.",
      },
    ],
  },
  {
    title: "Emotional Support & Mental Health Resources",
    resources: [
      {
        name: "National Suicide Prevention Lifeline",
        phone: "988",
        website: "https://988lifeline.org",
        description: "Free and confidential emotional support for people in distress.",
        hours: "24/7",
      },
      {
        name: "SAMHSA National Helpline",
        phone: "1-800-662-HELP (4357)",
        website: "https://www.samhsa.gov/find-help/national-helpline",
        description: "Free, confidential treatment referral and information service for mental health and substance use disorders.",
        hours: "24/7",
      },
      {
        name: "Crisis Text Line",
        phone: "Text HOME to 741741",
        website: "https://www.crisistextline.org",
        description: "Free, confidential crisis support via text message.",
        hours: "24/7",
      },
    ],
  },
  {
    title: "Community Assistance Programs",
    resources: [
      {
        name: "211 Texas",
        phone: "Dial 2-1-1 or 1-877-541-7905",
        website: "https://www.211texas.org",
        description: "Connects Texans to local community resources including food assistance, utility assistance, housing programs, and emergency services.",
      },
      {
        name: "Salvation Army",
        website: "https://www.salvationarmyusa.org",
        description: "Emergency financial assistance, food pantries, utility assistance, and housing programs.",
      },
      {
        name: "Catholic Charities",
        website: "https://www.catholiccharitiesusa.org",
        description: "Emergency financial assistance, food, housing, and counseling services.",
      },
    ],
  },
];

export default function Resources() {
  return (
    <KnowledgeBaseLayout
      title="Resources & Support Directory"
      description="A comprehensive list of national and Texas-specific resources, including hotlines, legal aid, housing counselors, and community support."
    >
      <div className="space-y-12">
        {resourceCategories.map((category, idx) => (
          <section key={idx}>
            <h2 className="text-2xl font-bold text-foreground mb-6">{category.title}</h2>
            <div className="grid gap-6">
              {category.resources.map((resource, resourceIdx) => (
                <Card key={resourceIdx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start justify-between gap-4">
                      <span>{resource.name}</span>
                      {resource.website && (
                        <a
                          href={resource.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </CardTitle>
                    <CardDescription className="space-y-2">
                      {resource.phone && (
                        <div className="flex items-center gap-2 text-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          <a href={`tel:${resource.phone.replace(/[^0-9]/g, "")}`} className="hover:underline">
                            {resource.phone}
                          </a>
                        </div>
                      )}
                      {resource.website && (
                        <div className="flex items-center gap-2 text-foreground">
                          <Globe className="h-4 w-4 text-primary" />
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline break-all"
                          >
                            {resource.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                      {"hours" in resource && resource.hours && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Hours:</strong> {resource.hours}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">EnterActDFW Contact Information</h2>
          <p className="text-muted-foreground mb-4">
            If you are considering selling your home to avoid foreclosure, EnterActDFW is here to help with a fair, transparent, and compassionate approach.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <TrackablePhoneLink phoneNumber="832-346-9569" className="font-semibold text-foreground hover:text-primary">
                  (832) 346-9569
                </TrackablePhoneLink>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a href="mailto:info@enteractdfw.com" className="font-semibold text-foreground hover:text-primary">
                  info@enteractdfw.com
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Services:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Free, no-obligation consultation</li>
              <li>Fair cash offers for distressed properties</li>
              <li>Fast closings (as quick as 7-10 days)</li>
              <li>No commissions or hidden fees</li>
              <li>Buy homes in as-is condition</li>
            </ul>
          </div>
        </section>

        <div className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg">
          <p>
            <strong>Disclaimer:</strong> This directory is provided for informational purposes only. EnterActDFW is not affiliated with any of the organizations listed above and does not endorse any specific service. We encourage you to research and verify any organization before sharing personal information.
          </p>
        </div>
      </div>
    </KnowledgeBaseLayout>
  );
}
