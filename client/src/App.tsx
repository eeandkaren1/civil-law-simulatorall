import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider } from "./contexts/GameContext";
import Home from "./pages/Home";
import VillagePage from "./pages/VillagePage";
import ScenarioPage from "./pages/ScenarioPage";
import KnowledgePage from "./pages/KnowledgePage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import PrivacyPage from "./pages/PrivacyPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import TermsPage from "./pages/TermsPage";
import DailyChallengePage from "./pages/DailyChallengePage";
import WrongNotebookPage from "./pages/WrongNotebookPage";
import QuestionExplorerPage from "./pages/QuestionExplorerPage";
import LineFloatButton from "./components/LineFloatButton";
import { GAME_ROUTES } from "../../shared/gameRoutes";
import { getSeoForPath } from "../../shared/siteSeo";
import { useEffect } from "react";

// SPA 路由切換時觸發 Google Analytics pageview
function AnalyticsTracker() {
  const [location] = useLocation();
  useEffect(() => {
    const seo = getSeoForPath(location);
    document.title = seo.title;
    const setMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    setMeta('meta[name="description"]', "name", "description", seo.description);
    setMeta('meta[property="og:title"]', "property", "og:title", seo.title);
    setMeta('meta[property="og:description"]', "property", "og:description", seo.description);
    setMeta('meta[property="og:type"]', "property", "og:type", seo.ogType ?? "website");
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${seo.canonicalPath ?? location}`;
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (seo.noindex || seo.notFound) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        document.head.appendChild(robots);
      }
      robots.content = "noindex, follow";
    } else if (robots) {
      robots.remove();
    }
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", "G-MFXSFT8HY7", {
        page_path: location,
      });
    }
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path={GAME_ROUTES.village} component={VillagePage} />
      <Route path={GAME_ROUTES.scenario} component={ScenarioPage} />
      <Route path="/knowledge" component={KnowledgePage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/articles" component={ArticlesPage} />
      <Route path="/articles/:id" component={ArticleDetailPage} />
      <Route path="/daily-challenge" component={DailyChallengePage} />
      <Route path="/wrong-notebook" component={WrongNotebookPage} />
      <Route path="/question-explorer" component={QuestionExplorerPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <GameProvider>
            <Toaster richColors position="top-center" />
            <AnalyticsTracker />
            <Router />
            <LineFloatButton />
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
