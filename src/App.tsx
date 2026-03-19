import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Index from "./pages/common/Index.tsx";
import NotFound from "./pages/common/NotFound.tsx";
import ThisOrThatPage from "./pages/common/ThisOrThatPage.tsx";
import QuizzesPage from "./pages/common/QuizzesPage.tsx";
import QuizPlayPage from "./pages/common/QuizPlayPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz/:id" element={<QuizPlayPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/this-or-that" element={<ThisOrThatPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
