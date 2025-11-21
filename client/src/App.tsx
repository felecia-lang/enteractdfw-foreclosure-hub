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

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
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
          <Toaster position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
