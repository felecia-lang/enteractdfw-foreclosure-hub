import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { 
  Clock, 
  Shield, 
  BookOpen, 
  Phone, 
  FileText, 
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Home as HomeIcon,
  Users,
  Scale
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    propertyZip: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitLead = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Thank you! We'll be in touch soon.");
      // Reset form
      setFormData({
        firstName: "",
        email: "",
        phone: "",
        propertyZip: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10" />
          </div>
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
            <Link href="/about">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                About
              </span>
            </Link>
            <Button variant="outline" size="sm" asChild>
              <a href="tel:+18329327585">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Headline */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  Received a Notice of Default?
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                You Have Options.
                <br />
                <span className="text-primary">We Can Help.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Facing foreclosure is overwhelming, but you're not alone. Get your free guide to understand your rights, explore your options, and find a path forward—with no pressure and no judgment.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>200+ Families Helped</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Licensed Texas Brokerage</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>100% Free Consultation</span>
                </div>
              </div>
            </div>

            {/* Right Column - Lead Capture Form */}
            <Card className="shadow-xl border-2">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-2xl">Get Your FREE Foreclosure Survival Guide</CardTitle>
                <CardDescription className="text-base">
                  Download our comprehensive guide and learn how to protect your home and your rights in Texas.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {submitted ? (
                  <Alert className="bg-primary/10 border-primary">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <AlertDescription className="text-foreground">
                      <strong>Thank you!</strong> Check your email for the guide. We'll also reach out within 24 hours to answer any questions.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(832) 932-7585"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="propertyZip">Property ZIP Code *</Label>
                      <Input
                        id="propertyZip"
                        type="text"
                        placeholder="75001"
                        value={formData.propertyZip}
                        onChange={(e) => setFormData({ ...formData, propertyZip: e.target.value })}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
                      size="lg"
                      disabled={submitLead.isPending}
                    >
                      {submitLead.isPending ? "Submitting..." : "Download Free Guide Now →"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      ✓ No spam ✓ Unsubscribe anytime ✓ 100% free
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              <Clock className="inline-block h-8 w-8 mr-2 text-primary" />
              Time Is Critical—But You're Not Alone
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In Texas, you have at least 20 days to act after receiving a Notice of Default. Our free guide walks you through every step.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { day: "Day 1-2", title: "Read Notice", desc: "Understand what you received" },
              { day: "Day 3-7", title: "Call Lender", desc: "Discuss your options" },
              { day: "Day 8-20", title: "Apply for Help", desc: "Submit loss mitigation" },
              { day: "Day 21+", title: "Decide Your Option", desc: "Take action to protect your home" },
            ].map((step, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">{idx + 1}</span>
                  </div>
                  <CardTitle className="text-lg">{step.day}</CardTitle>
                  <CardDescription className="font-semibold text-foreground">{step.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Inside Your FREE Foreclosure Survival Guide
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Understand the Texas Foreclosure Process", desc: "Learn the timeline, your rights, and what to expect at each stage." },
              { icon: Shield, title: "Know Your Legal Rights & Protections", desc: "Federal and Texas laws that protect homeowners facing foreclosure." },
              { icon: FileText, title: "Explore All Your Options", desc: "From loan modifications to short sales—see every path forward." },
              { icon: FileText, title: "What to Do: Notice of Default", desc: "Step-by-step action guide when you receive a Notice of Default.", link: "/guides/notice-of-default" },
              { icon: AlertCircle, title: "Avoid Common Foreclosure Scams", desc: "Protect yourself from predatory companies and fraud." },
              { icon: DollarSign, title: "Get Fair Cash Offer Info", desc: "Learn how selling quickly can help you avoid foreclosure." },
            ].map((item, idx) => {
              const cardContent = (
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <item.icon className="h-10 w-10 text-primary mb-3" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              );
              
              if (item.link) {
                return (
                  <Link key={idx} href={item.link}>
                    {cardContent}
                  </Link>
                );
              }
              
              return <div key={idx}>{cardContent}</div>;
            })}
          </div>
        </div>
      </section>

      {/* How EnterActDFW Can Help */}
      <section className="py-16 bg-primary/5">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How EnterActDFW Can Help You
              </h2>
              <p className="text-lg text-muted-foreground">
                We're a licensed Texas real estate brokerage specializing in helping homeowners facing foreclosure. Our approach:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                "Fair, Transparent Cash Offers",
                "Close in as Little as 7-10 Days",
                "No Repairs, No Fees, No Commissions",
                "Free Consultation with Zero Obligation",
                "We Buy Homes in Any Condition",
                "Local DFW Team You Can Trust",
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Schedule Free Consultation →
              </Button>
            </div>
            <Card className="mt-8 bg-card/50 border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <p className="text-muted-foreground italic">
                  "EnterActDFW gave us a fair offer and closed in 9 days. We avoided foreclosure and moved on with dignity."
                </p>
                <p className="text-sm text-foreground font-semibold mt-2">— Maria T., Dallas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y bg-card">
        <div className="container">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-8">Why Trust EnterActDFW?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Scale className="h-12 w-12 text-primary mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Licensed TX Brokerage</h4>
                <p className="text-sm text-muted-foreground">Verified by Texas Real Estate Commission</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-12 w-12 text-primary mb-3" />
                <h4 className="font-semibold text-foreground mb-2">200+ Families Helped</h4>
                <p className="text-sm text-muted-foreground">⭐⭐⭐⭐⭐ 4.9/5 stars from clients</p>
              </div>
              <div className="flex flex-col items-center">
                <HomeIcon className="h-12 w-12 text-primary mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Local DFW Team</h4>
                <p className="text-sm text-muted-foreground">Serving Dallas-Fort Worth since 2015</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-8 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Licensed real estate brokerage helping Texas homeowners navigate foreclosure with dignity and fairness.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/knowledge-base"><span className="text-muted-foreground hover:text-primary cursor-pointer">Knowledge Base</span></Link></li>
                <li><Link href="/resources"><span className="text-muted-foreground hover:text-primary cursor-pointer">Support Directory</span></Link></li>
                <li><Link href="/faq"><span className="text-muted-foreground hover:text-primary cursor-pointer">FAQ</span></Link></li>
                <li><Link href="/glossary"><span className="text-muted-foreground hover:text-primary cursor-pointer">Glossary</span></Link></li>
                <li><Link href="/about"><span className="text-muted-foreground hover:text-primary cursor-pointer">About Felecia Fair</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Phone: (832) 932-7585</li>
                <li>Email: info@enteractdfw.com</li>
                <li>4400 State Hwy 121, Suite 300</li>
                <li>Lewisville, Texas 75056</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Legal Disclaimer:</strong> This information is for educational purposes only and is not legal advice. 
              EnterActDFW is a licensed real estate brokerage in Texas. For legal guidance, consult an attorney or HUD-approved housing counselor.
            </p>
            <p>© 2025 EnterActDFW. All rights reserved. | <a href="#" className="hover:text-primary">Privacy Policy</a> | <a href="#" className="hover:text-primary">Terms of Service</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
