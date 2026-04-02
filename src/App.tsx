import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { initAnalytics, usePageTracking } from "@/analytics";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/common/ScrollToTop";
import AppRouter from "@/routes/AppRouter";
import { ThemeProvider } from "@/theme";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const queryClient = new QueryClient();

/**
 * GA4 bootstrap: single init + SPA page views. Lives inside `BrowserRouter` so `usePageTracking` has context.
 *
 * @example UI code should still use `analyticsService` from `@/analytics` for product events, not this component.
 */
function AnalyticsBootstrap() {
  useEffect(() => {
    initAnalytics();
  }, []);
  usePageTracking();
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ThemeToggle />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsBootstrap />
          <ScrollToTop />
          <AppRouter />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
