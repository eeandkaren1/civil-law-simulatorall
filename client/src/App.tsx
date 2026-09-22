import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import { APP_BASE_PATH } from "@shared/siteConfig";
import { GAME_ROUTES } from "../../shared/gameRoutes";
import { getSeoForPath } from "../../shared/siteSeo";
import ErrorBoundary from "./components/ErrorBoundary";
import LineFloatButton from "./components/LineFloatButton";
import { GameProvider } from "./contexts/GameContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AboutPage from "./pages/AboutPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ArticlesPage from "./pages/ArticlesPage";
import ContactPage from "./pages/ContactPage";
import DailyChallengePage from "./pages/DailyChallengePage";
import Home from "./pages/Home";
import KnowledgePage from "./pages/KnowledgePage";
import PrivacyPage from "./pages/PrivacyPage";
import ProgressPage from "./pages/ProgressPage";
import QuestionExplorerPage from "./pages/QuestionExplorerPage";
import ScenarioPage from "./pages/ScenarioPage";
import SettingsPage from "./pages/SettingsPage";
import TermsPage from "./pages/TermsPage";
import VillagePage from "./pages/VillagePage";
import WrongNotebookPage from "./pages/WrongNotebookPage";

function AnalyticsTracker() {
  const [location] = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(location);
    document.title = seo.title;

    const setMeta = (
      selector: string,
      attribute: "name" | "property",
      key: string,
      content: string,
    ) => {
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
    canonical.href = `${window.location.origin}${APP_BASE_PATH}${seo.canonicalPath ?? location}`;

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

    const analyticsWindow = window as Window & typeof globalThis & {
      gtag?: (...args: unknown[]) => void;
    };
    if (analyticsWindow.gtag) {
      analyticsWindow.gtag("config", "G-MFXSFT8HY7", {
        page_path: `${APP_BASE_PATH}${location}`,
      });
    }
  }, [location]);

  return null;
}

function AppRoutes() {
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

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <GameProvider>
            <Toaster richColors position="top-center" />
            <AnalyticsTracker />
            <AppRoutes />
            <LineFloatButton />
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
