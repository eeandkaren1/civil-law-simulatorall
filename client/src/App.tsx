import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider } from "./contexts/GameContext";
import Home from "./pages/Home";
import VillagePage from "./pages/VillagePage";
import ScenarioPage from "./pages/ScenarioPage";
import KnowledgePage from "./pages/KnowledgePage";
import ProgressPage from "./pages/ProgressPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/village/:villageId" component={VillagePage} />
      <Route path="/scenario/:scenarioId" component={ScenarioPage} />
      <Route path="/knowledge" component={KnowledgePage} />
      <Route path="/progress" component={ProgressPage} />
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
            <Router />
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
