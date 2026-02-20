import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10" />
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/knowledge-base">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Knowledge Base
              </span>
            </Link>
            <Link href="/resources">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Resources
              </span>
            </Link>
            <Link href="/faq">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                FAQ
              </span>
            </Link>
            <Button variant="outline" size="sm" asChild>
              <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>Call Now
              </TrackablePhoneLink>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last Updated: November 23, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="mb-4">
              Welcome to EnterActDFW Real Estate Brokerage ("EnterActDFW," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our website, educational resources, and real estate services. By accessing or using our website and services, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> Please read these Terms carefully before using our services. If you do not agree to these Terms, you may not access or use our website or services.
            </p>
          </CardContent>
        </Card>

        {/* 1. Acceptance of Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By accessing or using the EnterActDFW website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws and regulations. If you are using our services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
            </p>
            <p className="text-sm text-muted-foreground">
              We reserve the right to modify these Terms at any time. Your continued use of our website and services after any changes constitutes your acceptance of the modified Terms. We will notify you of material changes by updating the "Last Updated" date at the top of this page.
            </p>
          </CardContent>
        </Card>

        {/* 2. Description of Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">2. Description of Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              EnterActDFW is a licensed Texas real estate brokerage specializing in helping homeowners facing foreclosure. Our services include:
            </p>
            
            <div>
              <h3 className="font-semibold mb-2">Educational Resources</h3>
              <p className="text-muted-foreground">
                We provide free educational content, guides, and resources to help homeowners understand the foreclosure process, their legal rights, and available options. This information is for educational purposes only and does not constitute legal, financial, or professional advice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Real Estate Services</h3>
              <p className="text-muted-foreground">
                We offer licensed real estate brokerage services, including property evaluations, cash offers, assistance with short sales, and other foreclosure prevention solutions. All real estate transactions are subject to separate written agreements and are governed by Texas real estate law.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Consultation Services</h3>
              <p className="text-muted-foreground">
                We provide free consultations to assess your foreclosure situation and discuss potential solutions. These consultations are informational in nature and do not create an attorney-client relationship or guarantee any specific outcome.
              </p>
            </div>

            <p className="text-sm mt-4">
              <strong>No Attorney-Client Relationship:</strong> EnterActDFW is a real estate brokerage, not a law firm. Nothing on this website or in our communications creates an attorney-client relationship. For legal advice specific to your situation, please consult a licensed attorney.
            </p>
          </CardContent>
        </Card>

        {/* 3. User Responsibilities */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">3. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              When using our website and services, you agree to:
            </p>

            <div>
              <h3 className="font-semibold mb-2">Provide Accurate Information</h3>
              <p className="text-muted-foreground">
                You agree to provide true, accurate, current, and complete information when submitting forms, contacting us, or engaging with our services. Providing false or misleading information may result in termination of services and could have legal consequences.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Use Services Lawfully</h3>
              <p className="text-muted-foreground">
                You agree to use our website and services only for lawful purposes and in accordance with these Terms. You may not use our services in any way that violates applicable federal, state, or local laws or regulations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Respect Intellectual Property</h3>
              <p className="text-muted-foreground">
                All content on this website, including text, graphics, logos, images, and software, is the property of EnterActDFW or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Prohibited Uses</h3>
              <p className="text-muted-foreground mb-2">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground text-sm">
                <li>Use our website to transmit viruses, malware, or other harmful code</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Interfere with or disrupt the operation of our website or services</li>
                <li>Use automated systems (bots, scrapers) to access our website without permission</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Harass, threaten, or harm others through our website or services</li>
                <li>Use our services for any fraudulent or illegal purpose</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 4. Disclaimers */}
        <Card className="mb-6 border-orange-200">
          <CardHeader>
            <CardTitle className="text-2xl">4. Disclaimers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">No Legal or Financial Advice</h3>
              <p className="text-muted-foreground">
                <strong>IMPORTANT:</strong> The information provided on this website is for educational and informational purposes only and does not constitute legal, financial, tax, or professional advice. Every foreclosure situation is unique, and the information on this website may not apply to your specific circumstances. You should consult with a licensed attorney, financial advisor, or HUD-approved housing counselor for advice tailored to your situation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">No Guarantees or Warranties</h3>
              <p className="text-muted-foreground">
                We make no guarantees, representations, or warranties regarding the outcome of any foreclosure situation or real estate transaction. While we strive to provide accurate and helpful information, we cannot guarantee that our services will prevent foreclosure, result in a specific sale price, or achieve any particular result.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">"As-Is" Service Provision</h3>
              <p className="text-muted-foreground">
                Our website and services are provided on an "as-is" and "as-available" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that our website will be uninterrupted, error-free, or free of viruses or other harmful components.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Third-Party Content and Links</h3>
              <p className="text-muted-foreground">
                Our website may contain links to third-party websites, resources, or references to third-party services. We do not endorse and are not responsible for the content, accuracy, or practices of any third-party websites or services. Your use of third-party websites is at your own risk and subject to their terms and conditions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Time-Sensitive Information</h3>
              <p className="text-muted-foreground">
                Foreclosure timelines and legal requirements are time-sensitive and vary by jurisdiction. The information on this website may not reflect the most current legal developments or deadlines applicable to your situation. <strong>Do not delay in seeking professional advice.</strong> Missing critical deadlines can result in the loss of important rights and options.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 5. Limitation of Liability */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">5. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
            </p>
            
            <p className="text-muted-foreground">
              EnterActDFW, its officers, directors, employees, agents, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
              <li>Your access to or use of (or inability to access or use) our website or services</li>
              <li>Any conduct or content of any third party on or through our website</li>
              <li>Any content obtained from our website, including errors or omissions in content</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              <li>Reliance on information provided on our website</li>
              <li>Any foreclosure, property loss, or financial loss you may experience</li>
            </ul>

            <p className="mt-4 text-muted-foreground">
              In no event shall our total liability to you for all damages, losses, and causes of action exceed the amount you paid us, if any, for accessing or using our services, or one hundred dollars ($100), whichever is greater.
            </p>

            <p className="text-sm mt-4">
              Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you. In such cases, our liability will be limited to the fullest extent permitted by applicable law.
            </p>
          </CardContent>
        </Card>

        {/* 6. Indemnification */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">6. Indemnification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">
              You agree to defend, indemnify, and hold harmless EnterActDFW, its officers, directors, employees, agents, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
              <li>Your violation of these Terms of Service</li>
              <li>Your use of our website or services</li>
              <li>Your violation of any rights of another person or entity</li>
              <li>Your violation of any applicable laws or regulations</li>
              <li>Any false or misleading information you provide to us</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              We reserve the right to assume the exclusive defense and control of any matter subject to indemnification by you, and you agree to cooperate with our defense of such claims.
            </p>
          </CardContent>
        </Card>

        {/* 7. Intellectual Property Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">7. Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Ownership</h3>
              <p className="text-muted-foreground">
                All content on this website, including but not limited to text, graphics, logos, images, videos, software, and compilations, is the exclusive property of EnterActDFW or its licensors and is protected by United States and international copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Limited License</h3>
              <p className="text-muted-foreground">
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use our website and download or print materials for your personal, non-commercial use only. This license does not include any right to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-muted-foreground text-sm">
                <li>Modify, reproduce, or distribute content without our written permission</li>
                <li>Use content for commercial purposes or public display</li>
                <li>Remove copyright, trademark, or other proprietary notices</li>
                <li>Transfer content to another person or "mirror" content on any other server</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Trademarks</h3>
              <p className="text-muted-foreground">
                "EnterActDFW" and our logo are trademarks or registered trademarks of EnterActDFW Real Estate Brokerage. You may not use these trademarks without our prior written permission. All other trademarks, service marks, and logos used on this website are the property of their respective owners.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">User-Generated Content</h3>
              <p className="text-muted-foreground">
                If you submit testimonials, reviews, comments, or other content to our website, you grant us a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, modify, publish, and distribute such content in any media. You represent and warrant that you own or have the necessary rights to grant this license.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 8. Dispute Resolution and Governing Law */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">8. Dispute Resolution and Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Governing Law</h3>
              <p className="text-muted-foreground">
                These Terms of Service and any disputes arising out of or related to these Terms or our services shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Jurisdiction and Venue</h3>
              <p className="text-muted-foreground">
                You agree that any legal action or proceeding arising out of or related to these Terms or our services shall be brought exclusively in the state or federal courts located in Denton County, Texas. You consent to the personal jurisdiction of such courts and waive any objection to venue in such courts.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Informal Resolution</h3>
              <p className="text-muted-foreground">
                Before filing any formal legal action, you agree to first contact us at info@enteractdfw.com to attempt to resolve the dispute informally. We are committed to working with you in good faith to resolve any concerns.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Time Limitation</h3>
              <p className="text-muted-foreground">
                Any claim or cause of action arising out of or related to these Terms or our services must be filed within one (1) year after the claim or cause of action arose, or it will be permanently barred.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 9. Termination */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">9. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Termination by Us</h3>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate your access to our website and services at any time, with or without cause, with or without notice, and without liability. Grounds for termination may include, but are not limited to, violation of these Terms, fraudulent or illegal activity, or conduct that we deem harmful to our business or other users.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Termination by You</h3>
              <p className="text-muted-foreground">
                You may stop using our website and services at any time. If you wish to terminate any ongoing service agreements or opt out of communications, please contact us at info@enteractdfw.com or (832) 346-9569.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Effect of Termination</h3>
              <p className="text-muted-foreground">
                Upon termination, your right to use our website and services will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including but not limited to disclaimers, limitations of liability, indemnification, and dispute resolution provisions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 10. Modifications to Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">10. Modifications to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">
              We reserve the right to modify or replace these Terms of Service at any time at our sole discretion. When we make changes, we will update the "Last Updated" date at the top of this page. Material changes will be communicated through:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
              <li>A prominent notice on our website homepage</li>
              <li>Email notification to registered users (if applicable)</li>
              <li>Other reasonable means of notification</li>
            </ul>
            <p className="mt-4">
              Your continued use of our website and services after any modifications to these Terms constitutes your acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using our website and services.
            </p>
          </CardContent>
        </Card>

        {/* 11. Severability */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">11. Severability and Entire Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Severability</h3>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be unlawful, void, or unenforceable by a court of competent jurisdiction, that provision shall be deemed severable from these Terms and shall not affect the validity and enforceability of the remaining provisions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Entire Agreement</h3>
              <p className="text-muted-foreground">
                These Terms of Service, together with our Privacy Policy and any other written agreements between you and EnterActDFW, constitute the entire agreement between you and EnterActDFW regarding your use of our website and services, and supersede all prior or contemporaneous communications and proposals, whether oral or written.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">No Waiver</h3>
              <p className="text-muted-foreground">
                Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such right or provision. No waiver of any term shall be deemed a further or continuing waiver of such term or any other term.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 12. Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">12. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have any questions, concerns, or requests regarding these Terms of Service, please contact us:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:info@enteractdfw.com" className="text-primary hover:underline">
                    info@enteractdfw.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <TrackablePhoneLink phoneNumber="832-346-9569" className="text-primary hover:underline">
                    (832) 346-9569
                  </TrackablePhoneLink>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Mailing Address</p>
                  <p className="text-muted-foreground">
                    EnterActDFW Real Estate Brokerage<br />
                    4400 State Hwy 121, Suite 300<br />
                    Lewisville, Texas 75056
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home CTA */}
        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Licensed real estate brokerage helping Texas homeowners navigate foreclosure with dignity and fairness.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/knowledge-base">
                    <span className="text-muted-foreground hover:text-primary cursor-pointer">Knowledge Base</span>
                  </Link>
                </li>
                <li>
                  <Link href="/faq">
                    <span className="text-muted-foreground hover:text-primary cursor-pointer">FAQ</span>
                  </Link>
                </li>
                <li>
                  <Link href="/glossary">
                    <span className="text-muted-foreground hover:text-primary cursor-pointer">Glossary</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <span className="text-muted-foreground hover:text-primary cursor-pointer">About Felecia Fair</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Phone: (832) 346-9569</li>
                <li>Email: info@enteractdfw.com</li>
                <li>4400 State Hwy 121, Suite 300</li>
                <li>Lewisville, Texas 75056</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p className="mb-2">
              © 2025 EnterActDFW. All rights reserved. | <Link href="/privacy-policy"><span className="underline cursor-pointer">Privacy Policy</span></Link> | <Link href="/terms-of-service"><span className="underline cursor-pointer">Terms of Service</span></Link>
            </p>
            <p className="text-xs">
              <strong>Legal Disclaimer:</strong> This information is for educational purposes only and is not legal or financial advice. For guidance specific to your situation, consult an attorney or HUD-approved housing counselor. EnterActDFW is a licensed Texas real estate brokerage helping homeowners facing foreclosure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
