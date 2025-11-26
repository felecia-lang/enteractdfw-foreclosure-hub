import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import UnderstandingForeclosure from "./pages/UnderstandingForeclosure";
import FAQ from "./pages/FAQ";
import Resources from "./pages/Resources";
import OptionsToAvoidForeclosure from "./pages/OptionsToAvoidForeclosure";
import HomeownerRights from "./pages/HomeownerRights";
import About from "./pages/About";
import Glossary from "./pages/Glossary";
import NoticeOfDefaultGuide from "./pages/NoticeOfDefaultGuide";
import NoticeOfDefaultChecklist from "@/pages/NoticeOfDefaultChecklist";
import ContactingYourLenderGuide from "@/pages/ContactingYourLenderGuide";
import KnowledgeBase from "@/pages/KnowledgeBase";
import Admin from "@/pages/Admin";
import AvoidingScams from "@/pages/AvoidingScams";
import SuccessStories from "@/pages/SuccessStories";
import AdminTestimonials from "@/pages/AdminTestimonials";
import AdminAnalytics from "@/pages/AdminAnalytics";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import TimelineCalculator from "@/pages/TimelineCalculator";
import PropertyValueEstimator from "@/pages/PropertyValueEstimator";
import ThankYou from "@/pages/ThankYou";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ChatEngagementTracker } from "@/components/ChatEngagementTracker";
import ConversionFunnel from "@/pages/ConversionFunnel";
import AdminLinks from "@/pages/AdminLinks";
import AdminLinkAnalytics from "@/pages/AdminLinkAnalytics";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/knowledge-base" component={KnowledgeBase} />
      <Route path="/knowledge-base/understanding-foreclosure" component={UnderstandingForeclosure} />
      <Route path="/knowledge-base/homeowner-rights" component={HomeownerRights} />
      <Route path="/knowledge-base/options" component={OptionsToAvoidForeclosure} />
      <Route path="/faq" component={FAQ} />
      <Route path="/resources" component={Resources} />
      <Route path="/about" component={About} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/guides/notice-of-default" component={NoticeOfDefaultGuide} />
      <Route path="/notice-of-default-checklist" component={NoticeOfDefaultChecklist} />
      <Route path="/contacting-lender-guide" component={ContactingYourLenderGuide} />
      <Route path="/knowledge-base/avoiding-scams" component={AvoidingScams} />
      <Route path="/success-stories" component={SuccessStories} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/testimonials" component={AdminTestimonials} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/funnel" component={ConversionFunnel} />
      <Route path="/admin/links" component={AdminLinks} />
      <Route path="/admin/link-analytics" component={AdminLinkAnalytics} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/timeline-calculator" component={TimelineCalculator} />
      <Route path="/property-value-estimator" component={PropertyValueEstimator} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <PageViewTracker />
          <ChatEngagementTracker />
          <Toaster position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
