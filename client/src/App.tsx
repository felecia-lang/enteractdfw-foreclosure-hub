import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ChatEngagementTracker } from "@/components/ChatEngagementTracker";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

// Lazy load all pages except Home for better initial load performance
const NotFound = lazy(() => import("@/pages/NotFound"));
const UnderstandingForeclosure = lazy(() => import("./pages/UnderstandingForeclosure"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Resources = lazy(() => import("./pages/Resources"));
const OptionsToAvoidForeclosure = lazy(() => import("./pages/OptionsToAvoidForeclosure"));
const HomeownerRights = lazy(() => import("./pages/HomeownerRights"));
const About = lazy(() => import("./pages/About"));
const Glossary = lazy(() => import("./pages/Glossary"));
const NoticeOfDefaultGuide = lazy(() => import("./pages/NoticeOfDefaultGuide"));
const NoticeOfDefaultChecklist = lazy(() => import("@/pages/NoticeOfDefaultChecklist"));
const ContactingYourLenderGuide = lazy(() => import("@/pages/ContactingYourLenderGuide"));
const KnowledgeBase = lazy(() => import("@/pages/KnowledgeBase"));
const Admin = lazy(() => import("@/pages/Admin"));
const AvoidingScams = lazy(() => import("@/pages/AvoidingScams"));
const SuccessStories = lazy(() => import("@/pages/SuccessStories"));
const AdminTestimonials = lazy(() => import("@/pages/AdminTestimonials"));
const AdminAnalytics = lazy(() => import("@/pages/AdminAnalytics"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const TimelineCalculator = lazy(() => import("@/pages/TimelineCalculator"));
const PropertyValueEstimator = lazy(() => import("@/pages/PropertyValueEstimator"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));
const ThankYouGuide = lazy(() => import("@/pages/ThankYouGuide"));
const ConversionFunnel = lazy(() => import("@/pages/ConversionFunnel"));
const AdminLinks = lazy(() => import("@/pages/AdminLinks"));
const AdminLinkAnalytics = lazy(() => import("@/pages/AdminLinkAnalytics"));
const AdminCampaigns = lazy(() => import("@/pages/AdminCampaigns"));
const AdminExpiringLinks = lazy(() => import("@/pages/AdminExpiringLinks"));
const ComparisonHistory = lazy(() => import("@/pages/ComparisonHistory"));
const AdminCashOffers = lazy(() => import("@/pages/AdminCashOffers"));
const FormAnalytics = lazy(() => import("@/pages/FormAnalytics"));
const FormHeatmap = lazy(() => import("@/pages/FormHeatmap"));
const ABTestingDashboard = lazy(() => import("@/pages/admin/ABTestingDashboard"));
const MyTimeline = lazy(() => import("@/pages/MyTimeline"));
const GHLTest = lazy(() => import("@/pages/admin/GHLTest"));
const WarningSignsForeclosure = lazy(() => import("@/pages/WarningSignsForeclosure"));
const Blog = lazy(() => import("@/pages/Blog"));
const NoticeOfDefaultActionPlan = lazy(() => import("@/pages/NoticeOfDefaultActionPlan"));
const LoanModificationGuide = lazy(() => import("@/pages/LoanModificationGuide"));
const ShortSaleGuide = lazy(() => import("@/pages/ShortSaleGuide"));
const ForeclosureAuctionGuide = lazy(() => import("@/pages/ForeclosureAuctionGuide"));
const TexasForeclosureRights = lazy(() => import("@/pages/TexasForeclosureRights"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/knowledge-base" component={KnowledgeBase} />
      <Route path="/knowledge-base/understanding-foreclosure" component={UnderstandingForeclosure} />
      <Route path="/knowledge-base/homeowner-rights" component={HomeownerRights} />
      <Route path="/knowledge-base/options" component={OptionsToAvoidForeclosure} />
      <Route path="/knowledge-base/options-to-avoid-foreclosure" component={OptionsToAvoidForeclosure} />
      <Route path="/options-to-avoid-foreclosure" component={OptionsToAvoidForeclosure} />
      <Route path="/knowledge-base/notice-of-default" component={NoticeOfDefaultGuide} />
      <Route path="/faq" component={FAQ} />
      <Route path="/resources" component={Resources} />
      <Route path="/about" component={About} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/guides/notice-of-default" component={NoticeOfDefaultGuide} />
      <Route path="/notice-of-default-checklist" component={NoticeOfDefaultChecklist} />
      <Route path="/contacting-lender-guide" component={ContactingYourLenderGuide} />
      <Route path="/knowledge-base/contact-lender" component={ContactingYourLenderGuide} />
      <Route path="/knowledge-base/avoiding-scams" component={AvoidingScams} />
      <Route path="/success-stories" component={SuccessStories} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/testimonials" component={AdminTestimonials} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/funnel" component={ConversionFunnel} />
      <Route path="/admin/links" component={AdminLinks} />
      <Route path="/admin/link-analytics" component={AdminLinkAnalytics} />
      <Route path="/admin/campaigns" component={AdminCampaigns} />
      <Route path="/admin/expiring-links" component={AdminExpiringLinks} />
      <Route path="/admin/cash-offers" component={AdminCashOffers} />
      <Route path="/admin/form-analytics" component={FormAnalytics} />
      <Route path="/admin/form-heatmap" component={FormHeatmap} />
      <Route path="/admin/ab-testing" component={ABTestingDashboard} />
      <Route path="/admin/ghl-test" component={GHLTest} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/timeline-calculator" component={TimelineCalculator} />
      <Route path="/property-value-estimator" component={PropertyValueEstimator} />
      <Route path="/my-timeline" component={MyTimeline} />
      <Route path="/comparison-history" component={ComparisonHistory} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/thank-you-guide" component={ThankYouGuide} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/warning-signs-foreclosure-texas" component={WarningSignsForeclosure} />
      <Route path="/blog/notice-of-default-action-plan" component={NoticeOfDefaultActionPlan} />
      <Route path="/blog/texas-loan-modification-guide" component={LoanModificationGuide} />
      <Route path="/blog/texas-short-sale-guide" component={ShortSaleGuide} />
      <Route path="/blog/texas-foreclosure-auction-guide" component={ForeclosureAuctionGuide} />
      <Route path="/blog/texas-foreclosure-rights" component={TexasForeclosureRights} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GoogleAnalytics />
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <PageViewTracker />
          <ChatEngagementTracker />
          <Toaster position="top-right" />
          <Suspense fallback={<PageLoader />}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
