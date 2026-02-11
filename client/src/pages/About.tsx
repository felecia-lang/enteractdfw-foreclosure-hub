import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Award, Users, Heart, Shield, Home as HomeIcon, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import BookingModal from "@/components/BookingModal";

export default function About() {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10" />
            </a>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Home
              </span>
            </Link>
            <Link href="/knowledge-base/understanding-foreclosure">
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
              <TrackablePhoneLink phoneNumber="844-981-2937" showIcon>
                Call Now
              </TrackablePhoneLink>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Meet Felecia Fair
              </h1>
              <p className="text-xl text-primary font-semibold mb-4">
                Licensed Real Estate Broker | Foreclosure Prevention Specialist
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Helping Dallas-Fort Worth homeowners navigate foreclosure with dignity, transparency, and compassion.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <TrackablePhoneLink phoneNumber="844-981-2937" showIcon>
                    Call Felecia Today
                  </TrackablePhoneLink>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:info@enteractdfw.com">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Felecia
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-card border-2">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Office Location</p>
                        <p className="text-sm text-muted-foreground">4400 State Hwy 121, Suite 300</p>
                        <p className="text-sm text-muted-foreground">Lewisville, Texas 75056</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Direct Line</p>
                        <p className="text-sm text-muted-foreground">(844) 981-2937</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Email</p>
                        <p className="text-sm text-muted-foreground">info@enteractdfw.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Bio */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">About Felecia</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Felecia Fair is a licensed real estate broker and the founder of EnterActDFW, a brokerage dedicated to helping homeowners in the Dallas-Fort Worth area navigate the challenging foreclosure process with dignity and fairness. With years of experience in real estate and a deep understanding of Texas foreclosure law, Felecia has built her practice on the principles of transparency, empathy, and ethical service.
            </p>
            <p>
              Unlike many in the industry who view foreclosure as simply a transaction, Felecia understands that behind every property is a family facing one of the most stressful situations of their lives. Her approach is rooted in education first—ensuring homeowners understand their rights, their options, and the timeline they're working with before making any decisions.
            </p>
            <p>
              Felecia specializes in working with homeowners who are behind on payments, facing foreclosure notices, or dealing with financial hardship. She provides honest assessments, fair cash offers, and connects clients with HUD-approved housing counselors and legal resources when needed. Her goal is not just to close deals, but to help families find the best path forward for their unique situation.
            </p>
            <p>
              As a Texas native and longtime DFW resident, Felecia is deeply committed to her community. She regularly provides free foreclosure prevention workshops, partners with local housing counseling agencies, and advocates for homeowner rights at the state level. Her work has helped hundreds of families avoid foreclosure, negotiate with lenders, or sell their homes quickly and fairly when that's the best option.
            </p>
          </div>
        </div>
      </section>

      {/* Credentials & Certifications */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Credentials & Expertise</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Licensed TX Broker</h3>
                <p className="text-sm text-muted-foreground">
                  Verified by Texas Real Estate Commission (TREC)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">200+ Families Helped</h3>
                <p className="text-sm text-muted-foreground">
                  Successfully assisted homeowners facing foreclosure
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Foreclosure Specialist</h3>
                <p className="text-sm text-muted-foreground">
                  Expert in Texas foreclosure law and homeowner rights
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <HomeIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">DFW Local Expert</h3>
                <p className="text-sm text-muted-foreground">
                  Serving Dallas-Fort Worth since 2015
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">My Commitment to You</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Transparency First</h3>
                    <p className="text-sm text-muted-foreground">
                      No hidden fees, no pressure tactics, no misleading promises. You'll know exactly what to expect at every step.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Heart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Empathy & Respect</h3>
                    <p className="text-sm text-muted-foreground">
                      I understand this is a difficult time. You'll be treated with dignity and compassion, never judgment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Education & Advocacy</h3>
                    <p className="text-sm text-muted-foreground">
                      I'll help you understand your rights and options before making any decisions about your home.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Fair & Ethical</h3>
                    <p className="text-sm text-muted-foreground">
                      Fair market offers, ethical practices, and a commitment to doing what's right—not just what's profitable.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Discuss Your Options?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Schedule a free, no-obligation consultation. I'll review your situation, explain your options, and help you make the best decision for your family.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => setShowBookingModal(true)}>
              Schedule Your Free Consultation
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">
                <span>Get Free Guide</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal open={showBookingModal} onOpenChange={setShowBookingModal} />

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
                <li><Link href="/knowledge-base/understanding-foreclosure"><span className="text-muted-foreground hover:text-primary cursor-pointer">Knowledge Base</span></Link></li>
                <li><Link href="/resources"><span className="text-muted-foreground hover:text-primary cursor-pointer">Support Directory</span></Link></li>
                <li><Link href="/faq"><span className="text-muted-foreground hover:text-primary cursor-pointer">FAQ</span></Link></li>
                <li><Link href="/about"><span className="text-muted-foreground hover:text-primary cursor-pointer">About Felecia Fair</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Phone: (844) 981-2937</li>
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
            <p>© 2025 EnterActDFW. All rights reserved. | <Link href="/privacy"><span className="hover:text-primary cursor-pointer">Privacy Policy</span></Link> | <Link href="/terms"><span className="hover:text-primary cursor-pointer">Terms of Service</span></Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
