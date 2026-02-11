import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "wouter";
import { Phone, CheckCircle, ArrowRight, Quote, Home, Heart, Briefcase, TrendingUp, Send } from "lucide-react";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import BookingModal from "@/components/BookingModal";

// Component to display approved user-submitted testimonials
function UserTestimonials() {
  const { data: approvedTestimonials = [] } = trpc.testimonials.list.useQuery({ status: "approved" });

  if (approvedTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">More Success Stories from Our Community</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real homeowners who avoided foreclosure and moved forward with their lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {approvedTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <span>{testimonial.location}</span>
                    </CardDescription>
                  </div>
                  <Quote className="h-8 w-8 text-primary/20" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-sm font-semibold text-primary">{testimonial.situation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground italic line-clamp-4">
                      "{testimonial.story}"
                    </p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">Outcome:</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">{testimonial.outcome}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const successStories = [
  {
    id: 1,
    name: "Maria T.",
    location: "Dallas, TX",
    situation: "Job Loss During Pandemic",
    icon: Briefcase,
    before: {
      title: "The Crisis",
      description: "Maria lost her job as a restaurant manager when COVID-19 hit. After missing three mortgage payments, she received a Notice of Default and was 45 days away from foreclosure. With two young children and mounting medical bills, she felt overwhelmed and didn't know where to turn.",
      challenges: [
        "3 months behind on mortgage ($4,200 in arrears)",
        "Unemployment benefits barely covering basic expenses",
        "Lender refused modification due to insufficient income",
        "Credit score dropped from 720 to 580"
      ]
    },
    after: {
      title: "The Solution",
      description: "EnterActDFW provided Maria with a fair cash offer within 24 hours. We closed in 9 days, giving her enough time to find affordable housing and walk away with $18,000 in equity. She avoided foreclosure entirely and preserved her ability to buy again in the future.",
      outcomes: [
        "Avoided foreclosure and protected credit from further damage",
        "Received $18,000 cash at closing to restart her life",
        "Found a smaller rental home near her children's school",
        "Started new job two weeks after closing stress-free"
      ]
    },
    quote: "EnterActDFW gave us a fair offer and closed in 9 days. We avoided foreclosure and moved on with dignity. I'm forever grateful.",
    timeline: "9 days from first call to closing"
  },
  {
    id: 2,
    name: "Robert & Linda K.",
    location: "Fort Worth, TX",
    situation: "Medical Emergency & Mounting Debt",
    icon: Heart,
    before: {
      title: "The Crisis",
      description: "Robert suffered a heart attack that left him unable to work for six months. Medical bills piled up to $47,000, and the couple fell behind on their mortgage. Their lender started foreclosure proceedings, and they were facing a sale date in just 30 days.",
      challenges: [
        "5 months behind on mortgage ($8,500 in arrears)",
        "$47,000 in medical debt from emergency surgery",
        "Foreclosure sale scheduled in 30 days",
        "Too much debt to qualify for loan modification"
      ]
    },
    after: {
      title: "The Solution",
      description: "We purchased their home for a fair price, paid off their mortgage and medical liens, and closed in 7 days—well before the foreclosure sale. Robert and Linda walked away with enough cash to pay down their medical debt and start fresh in a more affordable home.",
      outcomes: [
        "Stopped foreclosure sale with 23 days to spare",
        "Paid off $47,000 in medical liens at closing",
        "Received additional $12,000 cash for fresh start",
        "Moved to affordable senior community debt-free"
      ]
    },
    quote: "We thought we'd lose everything. EnterActDFW stepped in, handled all the paperwork, and gave us our lives back. We're debt-free and starting over.",
    timeline: "7 days from offer to closing"
  },
  {
    id: 3,
    name: "James D.",
    location: "Arlington, TX",
    situation: "Divorce & Property Division",
    icon: Home,
    before: {
      title: "The Crisis",
      description: "James was going through a difficult divorce, and neither he nor his ex-wife could afford to keep the house or buy out the other's share. The mortgage was underwater, and they were both facing credit damage if the home went to foreclosure. The divorce couldn't be finalized until the property was resolved.",
      challenges: [
        "Home worth $185,000, owed $195,000 (underwater)",
        "Neither party could afford to buy out the other",
        "Divorce proceedings stalled due to property dispute",
        "Foreclosure notice received after 4 missed payments"
      ]
    },
    after: {
      title: "The Solution",
      description: "EnterActDFW negotiated a short sale with the lender and purchased the property, allowing both parties to walk away without owing anything. We handled all negotiations with the bank, and the divorce was finalized within weeks. James and his ex-wife both avoided foreclosure and credit damage.",
      outcomes: [
        "Negotiated successful short sale with lender",
        "Both parties released from mortgage obligation",
        "Divorce finalized without property complications",
        "No deficiency judgment or credit damage"
      ]
    },
    quote: "EnterActDFW handled everything with the bank so we didn't have to. They made a terrible situation bearable and helped us both move on.",
    timeline: "21 days from agreement to short sale approval"
  },
  {
    id: 4,
    name: "Sandra M.",
    location: "Lewisville, TX",
    situation: "Income Reduction & Adjustable Rate Shock",
    icon: TrendingUp,
    before: {
      title: "The Crisis",
      description: "Sandra's adjustable-rate mortgage reset, increasing her payment from $1,200 to $1,850 per month—right as her employer cut her hours. She couldn't afford the new payment and fell behind quickly. Her lender denied her modification request, and she was facing foreclosure in 60 days.",
      challenges: [
        "Monthly payment jumped $650 due to ARM reset",
        "Income reduced by 30% due to hour cuts at work",
        "Lender denied modification (insufficient income)",
        "2 months behind with foreclosure notice received"
      ]
    },
    after: {
      title: "The Solution",
      description: "We purchased Sandra's home at a fair market price, paid off her mortgage, and gave her enough cash to secure a smaller home with a fixed-rate mortgage she could afford. She avoided foreclosure, preserved her credit, and now has stable housing with predictable payments.",
      outcomes: [
        "Sold home before foreclosure proceedings advanced",
        "Received $22,000 cash after mortgage payoff",
        "Purchased smaller home with fixed-rate mortgage",
        "Monthly payment reduced to $950 (affordable on new income)"
      ]
    },
    quote: "I was drowning in a mortgage I couldn't afford. EnterActDFW helped me sell quickly and find a home that fits my budget. I can breathe again.",
    timeline: "12 days from consultation to closing"
  },
  {
    id: 5,
    name: "Carlos & Ana R.",
    location: "Garland, TX",
    situation: "Business Failure & Tax Liens",
    icon: Briefcase,
    before: {
      title: "The Crisis",
      description: "Carlos's small business failed during the economic downturn, leaving the family with $65,000 in business debt and IRS tax liens on their home. They fell behind on the mortgage, and the combination of liens made it impossible to refinance or sell traditionally. Foreclosure was imminent.",
      challenges: [
        "4 months behind on mortgage ($6,800 in arrears)",
        "$65,000 in business debt and IRS tax liens on property",
        "Unable to sell traditionally due to lien complications",
        "Foreclosure sale scheduled in 45 days"
      ]
    },
    after: {
      title: "The Solution",
      description: "EnterActDFW worked with the IRS and lender to negotiate lien releases and purchased the property despite the complex title issues. We handled all negotiations and paperwork, paid off the liens at closing, and gave Carlos and Ana a fresh start with cash in hand to rebuild their lives.",
      outcomes: [
        "Negotiated IRS lien release and mortgage payoff",
        "Avoided foreclosure with 38 days to spare",
        "Received $8,500 cash after all liens satisfied",
        "Carlos started new stable job without foreclosure stress"
      ]
    },
    quote: "The liens made our situation impossible. EnterActDFW handled everything—the IRS, the bank, all of it. They gave us hope when we had none.",
    timeline: "18 days from first contact to closing"
  },
  {
    id: 6,
    name: "Patricia W.",
    location: "Plano, TX",
    situation: "Inherited Property & Overwhelming Repairs",
    icon: Home,
    before: {
      title: "The Crisis",
      description: "Patricia inherited her mother's home but couldn't afford the $35,000 in needed repairs (roof, foundation, HVAC). The mortgage was current but barely, and she was juggling two house payments. She tried to sell but received no offers due to the property's condition. Foreclosure seemed inevitable.",
      challenges: [
        "Inherited home needing $35,000 in major repairs",
        "Carrying two mortgages (inherited home + her own)",
        "No offers from traditional buyers due to condition",
        "Falling behind on both mortgages ($3,200/month total)"
      ]
    },
    after: {
      title: "The Solution",
      description: "We purchased the inherited property as-is, requiring no repairs. Patricia didn't have to invest a single dollar in fixing the home. We closed in 10 days, relieving her of the financial burden and allowing her to focus on her own home and family without the stress of two mortgages.",
      outcomes: [
        "Sold inherited home as-is (no repair costs)",
        "Eliminated second mortgage payment burden",
        "Received $16,000 cash after mortgage payoff",
        "Focused on own home and family stress-free"
      ]
    },
    quote: "I couldn't afford to fix mom's house, and I couldn't sell it. EnterActDFW bought it as-is and lifted a huge weight off my shoulders.",
    timeline: "10 days from offer to closing"
  }
];

const stats = [
  { number: "200+", label: "Families Helped", icon: Home },
  { number: "100%", label: "Foreclosures Avoided", icon: CheckCircle },
  { number: "9 Days", label: "Average Closing Time", icon: TrendingUp },
  { number: "$2.1M+", label: "Cash Provided to Homeowners", icon: TrendingUp }
];

export default function SuccessStories() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    situation: "",
    story: "",
    outcome: "",
    permissionToPublish: "no" as "yes" | "no",
    email: "",
    phone: "",
  });

  const submitTestimonial = trpc.testimonials.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you for sharing your story! We'll review it and may feature it on this page.");
      // Reset form
      setFormData({
        name: "",
        location: "",
        situation: "",
        story: "",
        outcome: "",
        permissionToPublish: "no",
        email: "",
        phone: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit testimonial. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTestimonial.mutate(formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <span className="text-xl font-bold text-primary cursor-pointer">{APP_TITLE}</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/knowledge-base">
              <span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">Knowledge Base</span>
            </Link>
            <Link href="/resources">
              <span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">Resources</span>
            </Link>
            <Button asChild variant="default">
              <TrackablePhoneLink phoneNumber="844-981-2937" showIcon>
                Call Now
              </TrackablePhoneLink>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Real Stories. Real Results.
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              These are real homeowners who faced foreclosure and found a path forward with EnterActDFW. Every situation is unique, but one thing remains constant: we help families avoid foreclosure and move forward with dignity.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="container max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-3">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="container max-w-6xl">
            <div className="space-y-16">
              {successStories.map((story, index) => {
                const IconComponent = story.icon;
                return (
                  <Card key={story.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 border-b">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{story.name}</CardTitle>
                          <p className="text-muted-foreground">{story.location} • {story.situation}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Before */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-destructive flex items-center gap-2">
                            <span className="inline-block w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-sm font-bold">
                              ✕
                            </span>
                            {story.before.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {story.before.description}
                          </p>
                          <div className="space-y-2">
                            {story.before.challenges.map((challenge, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-destructive mt-1">•</span>
                                <span className="text-muted-foreground">{challenge}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* After */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                            <CheckCircle className="h-6 w-6" />
                            {story.after.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {story.after.description}
                          </p>
                          <div className="space-y-2">
                            {story.after.outcomes.map((outcome, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-foreground font-medium">{outcome}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                        <Quote className="h-8 w-8 text-primary/40 mb-3" />
                        <p className="text-lg italic text-foreground mb-3 leading-relaxed">
                          "{story.quote}"
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground">
                          — {story.name}
                        </p>
                      </div>

                      {/* Timeline */}
                      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span className="font-medium">Timeline: {story.timeline}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Success Story Starts Here
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Every homeowner's situation is unique, but you don't have to face foreclosure alone. Let us help you find the best path forward—whether that's selling quickly, negotiating with your lender, or exploring other options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => setShowBookingModal(true)}>
                Schedule Free Consultation
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <TrackablePhoneLink phoneNumber="844-981-2937" showIcon>
                  Call (844) 981-2937
                </TrackablePhoneLink>
              </Button>
            </div>
          </div>
        </section>

        {/* Share Your Story Form */}
        {/* User-Submitted Testimonials */}
        <UserTestimonials />

        <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Share Your Success Story</h2>
              <p className="text-lg text-muted-foreground">
                Did EnterActDFW help you avoid foreclosure? We'd love to hear about your experience.
                Your story could inspire and help other homeowners facing similar challenges.
              </p>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., John D."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Dallas, TX"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="situation">Your Situation *</Label>
                  <Input
                    id="situation"
                    value={formData.situation}
                    onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                    placeholder="e.g., Job Loss, Medical Emergency, Divorce"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="story">Your Story *</Label>
                  <Textarea
                    id="story"
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    placeholder="Tell us about your situation before working with EnterActDFW. What challenges were you facing? How did you feel?"
                    rows={6}
                    required
                    minLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 50 characters. Share details about your challenges and how you found us.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outcome">The Outcome *</Label>
                  <Textarea
                    id="outcome"
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    placeholder="How did EnterActDFW help you? What was the result? How do you feel now?"
                    rows={4}
                    required
                    minLength={20}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 20 characters. Describe the solution and how your life changed.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(844) 981-2937"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Permission to Publish *</Label>
                  <RadioGroup
                    value={formData.permissionToPublish}
                    onValueChange={(value) => setFormData({ ...formData, permissionToPublish: value as "yes" | "no" })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="permission-yes" />
                      <Label htmlFor="permission-yes" className="font-normal cursor-pointer">
                        Yes, you may publish my story on this website (we may edit for length/clarity)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="permission-no" />
                      <Label htmlFor="permission-no" className="font-normal cursor-pointer">
                        No, this is for internal feedback only
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitTestimonial.isPending}
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {submitTestimonial.isPending ? "Submitting..." : "Submit Your Story"}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you acknowledge that your information will be reviewed by EnterActDFW.
                  We respect your privacy and will only publish stories with explicit permission.
                </p>
              </form>
            </Card>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <section className="py-8 bg-muted/30">
          <div className="container max-w-4xl">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              <strong>Legal Disclaimer:</strong> These testimonials represent individual experiences and outcomes. Results may vary based on individual circumstances, property condition, market conditions, and lender cooperation. EnterActDFW does not guarantee specific outcomes or timelines. All names have been changed to protect privacy. For educational purposes only and not a substitute for professional legal or financial advice.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 {APP_TITLE}. All rights reserved.</p>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal open={showBookingModal} onOpenChange={setShowBookingModal} />
    </div>
  );
}
