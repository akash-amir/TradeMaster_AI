import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthComponent from "./components/AuthComponent";
import Home from "../pages/dashboard/Home";
import LogTrades from "../pages/dashboard/LogTrades";
import Records from "../pages/dashboard/Records";
import Charts from "../pages/dashboard/Charts";
import AIAnalysis from "../pages/dashboard/AIAnalysis";
import Profile from "../pages/dashboard/Profile";
import TradeDetails from "../pages/dashboard/TradeDetails";
import TradingDashboard from "./components/TradingDashboard";
import { DashboardProvider } from "./context/DashboardContext";

const queryClient = new QueryClient();

const DashboardWrapper = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-foreground font-medium">Loading TradeMaster AI...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthComponent />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DashboardProvider>
          <Routes>
            <Route path="/" element={<TradingDashboard />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="log-trades" element={<LogTrades />} />
              <Route path="records" element={<Records />} />
              {/** Legacy path support: redirect old trade-details URLs to new trade path */}
              <Route path="trade-details/:id" element={<Navigate to="../trade/:id" replace />} />
              <Route path="trade/:id" element={<TradeDetails />} />
              <Route path="charts" element={<Charts />} />
              <Route path="ai-analysis" element={<AIAnalysis />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </DashboardProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default DashboardWrapper; 