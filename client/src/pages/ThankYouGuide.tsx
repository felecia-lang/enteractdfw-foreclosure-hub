import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle, Download, Phone, BookOpen, Calculator, Home as HomeIcon } from "lucide-react";
import { APP_LOGO } from "@/const";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";

export default function ThankYouGuide() {
  const pdfUrl = "/pdfs/texas-foreclosure-survival-guide.pdf";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src={APP_LOGO} alt="EnterActDFW" className="h-10" />
            </a>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/knowledge-base">
                <span>
                  <BookOpen className="h-4 w-4 mr-2 inline" />
                  Knowledge Base
                </span>
              </Link>
            </Button>
            <Button size="sm" asChild>
              <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>
                Call Now
              </TrackablePhoneLink>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Success! Check Your Email
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've sent your <strong>FREE Texas Foreclosure Survival Guide</strong> to your email inbox. 
            You should receive it within the next few minutes.
          </p>
        </div>

        {/* Download Button */}
        <Card className="mb-8 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Can't wait? Download your guide now:
            </h2>
            <Button size="lg" asChild className="text-lg px-8">
              <a href={pdfUrl} download="Texas-Foreclosure-Survival-Guide.pdf">
                <Download className="mr-2 h-5 w-5" />
                Download PDF Guide
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              PDF • 32 pages • Comprehensive Texas foreclosure resource
            </p>
          </CardContent>
        </Card>

        {/* What's Next Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">What's Next?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Read Your Guide</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start with Chapter 1 to understand the Texas foreclosure timeline and your rights.
                </p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href={pdfUrl} download>
                    Open Guide
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="p-3 bg-teal-100 rounded-lg w-fit mb-4">
                  <Calculator className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Calculate Your Timeline</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use our free calculator to see your personalized foreclosure timeline and key deadlines.
                </p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/tools/timeline-calculator">
                    <span>Use Calculator</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="p-3 bg-orange-100 rounded-lg w-fit mb-4">
                  <Phone className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Talk to an Expert</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get personalized guidance from Felecia Fair, a licensed Texas real estate broker.
                </p>
                <Button size="sm" asChild className="w-full">
                  <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>
                    Call Now
                  </TrackablePhoneLink>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <Card className="bg-gradient-to-br from-primary/5 to-teal-50 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              📧 Watch Your Inbox
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Over the next 7 days, we'll send you additional free resources to help you navigate this situation:
            </p>
            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <p className="font-semibold">Today: Your Survival Guide</p>
                  <p className="text-sm text-muted-foreground">Comprehensive 32-page PDF with everything you need to know</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <p className="font-semibold">Day 2: Timeline Calculator</p>
                  <p className="text-sm text-muted-foreground">Calculate your personalized foreclosure timeline and key deadlines</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <p className="font-semibold">Day 5: Property Value Estimator</p>
                  <p className="text-sm text-muted-foreground">Find out what your home is worth and explore your selling options</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  4
                </div>
                <div>
                  <p className="font-semibold">Day 7: Lender Communication Scripts</p>
                  <p className="text-sm text-muted-foreground">Proven phone scripts and templates for effective communication</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12 p-8 bg-card rounded-lg border shadow-sm">
          <h2 className="text-2xl font-bold mb-3">
            Need Help Right Now?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Don't face this alone. I'm here to answer your questions and discuss your specific situation—with no pressure and no judgment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>
                Call (832) 932-7585
              </TrackablePhoneLink>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/knowledge-base">
                <span>
                  <BookOpen className="h-5 w-5 mr-2 inline" />
                  Browse Knowledge Base
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Button variant="ghost" asChild>
            <Link href="/">
              <span>
                <HomeIcon className="h-4 w-4 mr-2 inline" />
                Back to Home
              </span>
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-2">EnterActDFW Real Estate Brokerage</p>
          <p>4400 State Hwy 121, Suite 300 | Lewisville, Texas 75056</p>
          <p>Phone: (832) 932-7585 | Email: info@enteractdfw.com</p>
          <p className="mt-4 text-xs">
            <strong>Legal Disclaimer:</strong> This information is for educational purposes only and does not constitute legal or financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
