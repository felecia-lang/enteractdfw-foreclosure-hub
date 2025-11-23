import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  BookOpen, 
  Scale, 
  TrendingUp, 
  FileText, 
  Phone, 
  LifeBuoy, 
  HelpCircle, 
  Shield,
  BookMarked,
  Home as HomeIcon,
  MessageCircle
} from "lucide-react";
import { APP_LOGO } from "@/const";
import { cn } from "@/lib/utils";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SUGGESTED_QUESTIONS = [
  "What is the foreclosure timeline in Texas?",
  "What are my rights as a homeowner facing foreclosure?",
  "What options do I have to avoid foreclosure?",
  "How does a short sale work?",
  "Can EnterActDFW help me sell my home quickly?",
  "What happens if I ignore the foreclosure notices?",
];

const knowledgeBaseCategories = [
  {
    icon: BookOpen,
    title: "Understanding Foreclosure in Texas",
    description: "Learn about the foreclosure process, timeline, and what to expect at each stage.",
    href: "/knowledge-base/understanding-foreclosure",
    color: "text-blue-600",
  },
  {
    icon: Scale,
    title: "Your Rights as a Homeowner",
    description: "Federal and Texas-specific protections, reinstatement rights, and what lenders cannot do.",
    href: "/knowledge-base/homeowner-rights",
    color: "text-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Options to Avoid Foreclosure",
    description: "Explore loan modifications, short sales, repayment plans, and other alternatives.",
    href: "/knowledge-base/options",
    color: "text-green-600",
  },
  {
    icon: FileText,
    title: "Action Guide: Notice of Default",
    description: "Step-by-step checklist for what to do when you receive a Notice of Default.",
    href: "/guides/notice-of-default",
    color: "text-orange-600",
  },
  {
    icon: Phone,
    title: "Action Guide: Contacting Your Lender",
    description: "Phone scripts, questions to ask, call log template, and hardship letter samples.",
    href: "/contacting-lender-guide",
    color: "text-teal-600",
  },
  {
    icon: LifeBuoy,
    title: "Resources & Support Directory",
    description: "National hotlines, Texas resources, legal aid, and housing counseling agencies.",
    href: "/resources",
    color: "text-indigo-600",
  },
  {
    icon: HelpCircle,
    title: "Frequently Asked Questions",
    description: "Get answers to 21 common questions about foreclosure, timelines, and your options.",
    href: "/faq",
    color: "text-pink-600",
  },
  {
    icon: Shield,
    title: "Avoiding Foreclosure Scams",
    description: "Warning signs, red flags, and how to protect yourself from predatory companies.",
    href: "/knowledge-base/avoiding-scams",
    color: "text-red-600",
  },
  {
    icon: BookMarked,
    title: "Foreclosure Glossary",
    description: "Searchable definitions of 32 key foreclosure terms in plain language.",
    href: "/glossary",
    color: "text-amber-600",
  },
];

export default function KnowledgeBase() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hello! I'm here to help answer your questions about foreclosure in Texas. I can explain the process, your rights, and the options available to you.\n\n**Please note**: I provide educational information only, not legal or financial advice. For personalized guidance, please consult with an attorney or call our team at **(832) 932-7585**.\n\nWhat would you like to know?",
    },
  ]);

  const chatbotMutation = trpc.chatbot.sendMessage.useMutation();

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send message to backend with conversation history
      const conversationHistory = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));

      const response = await chatbotMutation.mutateAsync({
        message: content,
        conversationHistory,
      });

      // Add assistant response to chat
      const assistantMessage: Message = {
        role: "assistant",
        content: String(response.message || ""),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
      
      // Add error message to chat
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble responding right now. Please call us at **(832) 932-7585** for immediate assistance.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src={APP_LOGO} alt="EnterActDFW" className="h-10" />
            </a>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Home
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
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Foreclosure Knowledge Base
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive guides, resources, and step-by-step instructions to help you understand your rights, explore your options, and take action to protect your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="tel:+18329327585">
                <Phone className="h-5 w-5 mr-2" />
                Get Free Consultation
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">
                <span>
                  <HomeIcon className="h-5 w-5 mr-2 inline" />
                  Back to Home
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Chatbot Section */}
      <section className="py-12 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container max-w-5xl">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">AI Foreclosure Assistant</CardTitle>
                  <CardDescription>
                    Ask me anything about the Texas foreclosure process, your rights, and available options
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Suggested Questions */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Chatbot */}
              <AIChatBox
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={chatbotMutation.isPending}
                placeholder="Ask a question about foreclosure..."
                height={500}
              />

              {/* Disclaimer */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Disclaimer:</strong> This AI assistant provides educational information only and is not legal or financial advice. 
                  For personalized guidance, please consult with an attorney or financial advisor.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Knowledge Base Grid */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {knowledgeBaseCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group relative"
                >
                  <Link href={category.href}>
                    <a className="block">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors",
                            category.color
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {category.title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </CardContent>
                    </a>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Need Immediate Help?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            If you're facing foreclosure and need personalized guidance, our team is here to help you understand your options and take action.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Speak with Agent Felecia Fair
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="tel:+18329327585">(832) 932-7585</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Get Free Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Download survival guide
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/#guide-form">
                    <span>Download Now</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Browse FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Find quick answers
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/faq">
                    <span>View FAQ</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src={APP_LOGO} alt="EnterActDFW" className="h-10 mb-4" />
              <p className="text-sm text-muted-foreground">
                Licensed real estate brokerage helping Texas homeowners navigate foreclosure with dignity and fairness.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Knowledge Base</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/knowledge-base/understanding-foreclosure"><span className="text-muted-foreground hover:text-primary cursor-pointer">Understanding Foreclosure</span></Link></li>
                <li><Link href="/knowledge-base/homeowner-rights"><span className="text-muted-foreground hover:text-primary cursor-pointer">Your Rights</span></Link></li>
                <li><Link href="/knowledge-base/options"><span className="text-muted-foreground hover:text-primary cursor-pointer">Your Options</span></Link></li>
                <li><Link href="/glossary"><span className="text-muted-foreground hover:text-primary cursor-pointer">Glossary</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Action Guides</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/guides/notice-of-default"><span className="text-muted-foreground hover:text-primary cursor-pointer">Notice of Default</span></Link></li>
                <li><Link href="/contacting-lender-guide"><span className="text-muted-foreground hover:text-primary cursor-pointer">Contacting Lender</span></Link></li>
                <li><Link href="/resources"><span className="text-muted-foreground hover:text-primary cursor-pointer">Resources</span></Link></li>
                <li><Link href="/faq"><span className="text-muted-foreground hover:text-primary cursor-pointer">FAQ</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Phone: <a href="tel:+18329327585" className="hover:text-primary">(832) 932-7585</a></li>
                <li>Email: <a href="mailto:info@enteractdfw.com" className="hover:text-primary">info@enteractdfw.com</a></li>
                <li>4400 State Hwy 121, Suite 300</li>
                <li>Lewisville, Texas 75056</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              <strong>Legal Disclaimer:</strong> This information is for educational purposes only and is not legal or financial advice. 
              For legal guidance, consult an attorney. For financial advice, consult a licensed advisor.
            </p>
            <p className="mt-4">© 2025 EnterActDFW. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
