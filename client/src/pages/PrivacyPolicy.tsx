import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last Updated: November 23, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="mb-4">
              EnterActDFW Real Estate Brokerage ("EnterActDFW," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. By accessing or using our website, you agree to the terms of this Privacy Policy.
            </p>
            <p className="text-sm text-muted-foreground">
              If you do not agree with the terms of this Privacy Policy, please do not access or use our website or services.
            </p>
          </CardContent>
        </Card>

        {/* 1. Information We Collect */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Personal Information You Provide</h3>
              <p className="mb-3">
                We collect personal information that you voluntarily provide to us when you submit forms on our website, contact us, or engage with our services. The types of personal information we may collect include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                <li>Full name (first and last name)</li>
                <li>Email address</li>
                <li>Phone number (mobile or landline)</li>
                <li>Property ZIP code or address</li>
                <li>Information about your foreclosure situation or financial circumstances</li>
                <li>Any other information you choose to provide in forms, emails, or phone conversations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
              <p className="mb-3">
                When you visit our website, we may automatically collect certain information about your device and browsing activity, including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                <li>IP address and general geographic location</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on each page</li>
                <li>Referring website or source</li>
                <li>Date and time of visit</li>
              </ul>
              <p className="mt-3 text-sm">
                We collect this information through cookies, web beacons, and similar tracking technologies to improve our website functionality and user experience.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2. How We Use Your Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use the information we collect for the following purposes:
            </p>
            
            <div>
              <h3 className="font-semibold mb-2">To Provide Services and Support</h3>
              <p className="text-muted-foreground">
                We use your contact information to respond to your inquiries, provide foreclosure assistance consultations, evaluate your property situation, and deliver educational resources and guides you request.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">To Communicate With You</h3>
              <p className="text-muted-foreground">
                We may contact you via email, phone calls, or text messages (SMS) to provide information about your foreclosure options, schedule consultations, follow up on your inquiries, and send educational content related to foreclosure prevention. All SMS communications are subject to your explicit consent as described in Section 3 below.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">To Improve Our Website and Services</h3>
              <p className="text-muted-foreground">
                We analyze website usage data to understand how visitors interact with our content, identify areas for improvement, optimize user experience, and develop new educational resources.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">To Comply With Legal Obligations</h3>
              <p className="text-muted-foreground">
                We may use your information to comply with applicable laws, regulations, legal processes, or governmental requests, and to protect our rights, property, and safety.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. SMS/Text Messaging Consent */}
        <Card className="mb-6 border-primary/50">
          <CardHeader>
            <CardTitle className="text-2xl">3. SMS/Text Messaging Consent and Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Consent to Receive Text Messages</h3>
              <p className="mb-3">
                By checking the SMS consent box on our contact forms and providing your mobile phone number, you expressly consent to receive calls and text messages (including via automated technology and/or prerecorded messages) from EnterActDFW at the number you provided. These messages may include information about foreclosure assistance services, appointment reminders, educational content, and follow-up communications.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> Your consent to receive text messages is not a condition of purchasing any goods or services from EnterActDFW. You may still contact us and receive our services without providing SMS consent.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Message Frequency and Charges</h3>
              <p className="text-muted-foreground">
                Message frequency varies depending on your inquiry and the services you request. You may receive approximately 2-5 messages per week during active engagement. Message and data rates may apply based on your mobile carrier's plan. Please contact your wireless carrier for details about your messaging plan.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How to Opt Out</h3>
              <p className="mb-2 text-muted-foreground">
                You can opt out of receiving text messages at any time by using one of the following methods:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                <li>Reply <strong>STOP</strong> to any text message you receive from us</li>
                <li>Email us at info@enteractdfw.com with your phone number and request to unsubscribe</li>
                <li>Call us at (844) 981-2937 and request to be removed from SMS communications</li>
              </ul>
              <p className="mt-3 text-sm">
                After you opt out, you will receive one final confirmation message, and then no further messages will be sent unless you re-subscribe.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Help and Support</h3>
              <p className="text-muted-foreground">
                For help or questions about text messages, reply <strong>HELP</strong> to any message or contact us at (844) 981-2937 or info@enteractdfw.com.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">TCPA Compliance</h3>
              <p className="text-muted-foreground">
                EnterActDFW complies with the Telephone Consumer Protection Act (TCPA) and all applicable federal and state regulations regarding telemarketing and text messaging. We will only send text messages to phone numbers for which we have received explicit prior written consent.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 4. How We Share Your Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">4. How We Share Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="mb-4">
              We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share your information in the following limited circumstances:
            </p>

            <div>
              <h3 className="font-semibold mb-2">Service Providers</h3>
              <p className="text-muted-foreground">
                We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, and providing services to you. These service providers include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-muted-foreground">
                <li><strong>Go HighLevel CRM:</strong> Customer relationship management platform for managing leads, communications, and follow-up workflows</li>
                <li><strong>Email Service Providers:</strong> For sending automated emails and newsletters</li>
                <li><strong>Analytics Services:</strong> For tracking website usage and improving user experience</li>
                <li><strong>Cloud Hosting Providers:</strong> For secure data storage and website hosting</li>
              </ul>
              <p className="mt-3 text-sm">
                All service providers are contractually obligated to keep your information confidential and use it only for the purposes for which we disclose it to them.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Legal Requirements</h3>
              <p className="text-muted-foreground">
                We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders, subpoenas, or government agencies).
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Business Transfers</h3>
              <p className="text-muted-foreground">
                In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website of any change in ownership or use of your personal information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 5. Data Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">5. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement reasonable administrative, technical, and physical security measures to protect your personal information from unauthorized access, use, disclosure, alteration, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
              <li>Secure Socket Layer (SSL) encryption for data transmission</li>
              <li>Secure cloud storage with access controls</li>
              <li>Regular security assessments and updates</li>
              <li>Limited access to personal information by authorized personnel only</li>
              <li>Employee training on data privacy and security practices</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security. You are responsible for maintaining the confidentiality of any passwords or account credentials.
            </p>
          </CardContent>
        </Card>

        {/* 6. Data Retention */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">6. Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
              <li>Lead contact information is retained for up to 7 years to comply with real estate transaction record-keeping requirements</li>
              <li>Communication records (emails, call logs, text messages) are retained for up to 3 years for quality assurance and legal compliance</li>
              <li>Website analytics data is retained for up to 2 years</li>
              <li>Marketing consent records are retained indefinitely to demonstrate compliance with TCPA and other regulations</li>
            </ul>
            <p className="mt-4">
              When your information is no longer needed, we will securely delete or anonymize it in accordance with our data retention policies.
            </p>
          </CardContent>
        </Card>

        {/* 7. Your Privacy Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">7. Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>

            <div>
              <h3 className="font-semibold mb-2">Right to Access</h3>
              <p className="text-muted-foreground">
                You have the right to request a copy of the personal information we hold about you.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Right to Correction</h3>
              <p className="text-muted-foreground">
                You have the right to request that we correct any inaccurate or incomplete personal information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Right to Deletion</h3>
              <p className="text-muted-foreground">
                You have the right to request that we delete your personal information, subject to certain legal exceptions (e.g., record-keeping requirements, ongoing transactions, legal claims).
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Right to Opt Out</h3>
              <p className="text-muted-foreground">
                You have the right to opt out of receiving marketing communications from us at any time by following the unsubscribe instructions in our emails or replying STOP to text messages.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Right to Withdraw Consent</h3>
              <p className="text-muted-foreground">
                If we rely on your consent to process your personal information, you have the right to withdraw that consent at any time.
              </p>
            </div>

            <p className="mt-4 text-sm">
              To exercise any of these rights, please contact us using the contact information provided in Section 10 below. We will respond to your request within 30 days.
            </p>
          </CardContent>
        </Card>

        {/* 8. Cookies and Tracking Technologies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">8. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to collect information about your browsing activity on our website. Cookies are small text files stored on your device that help us improve website functionality and analyze usage patterns.
            </p>

            <div>
              <h3 className="font-semibold mb-2">Types of Cookies We Use</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality, such as page navigation and access to secure areas</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website by collecting anonymous usage data</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings to enhance your experience</li>
                <li><strong>Local Storage:</strong> Used to save your progress on interactive checklists and forms</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Managing Cookies</h3>
              <p className="text-muted-foreground">
                Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or alert you when cookies are being sent. However, if you disable cookies, some features of our website may not function properly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 9. Children's Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">9. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">
              Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.
            </p>
            <p className="text-sm text-muted-foreground">
              If we become aware that we have collected personal information from a child under 18 without parental consent, we will take steps to delete that information as soon as possible.
            </p>
          </CardContent>
        </Card>

        {/* 10. Contact Us */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">10. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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
                    (844) 981-2937
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

        {/* 11. Changes to This Privacy Policy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">11. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will update the "Last Updated" date at the top of this page.
            </p>
            <p className="text-sm text-muted-foreground">
              We encourage you to review this Privacy Policy periodically. If we make material changes that significantly affect your rights, we will provide additional notice (such as via email or a prominent notice on our website) prior to the changes taking effect.
            </p>
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
                <li>Phone: (844) 981-2937</li>
                <li>Email: info@enteractdfw.com</li>
                <li>4400 State Hwy 121, Suite 300</li>
                <li>Lewisville, Texas 75056</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p className="mb-2">
              © 2025 EnterActDFW. All rights reserved. | <Link href="/privacy-policy"><span className="underline cursor-pointer">Privacy Policy</span></Link> | Terms of Service
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
