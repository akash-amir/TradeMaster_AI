import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useScrollToTop } from "./hooks/use-scroll-to-top";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Demo from "./pages/Demo";
import API from "./pages/API";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import HelpCenter from "./pages/HelpCenter";
import Documentation from "./pages/Documentation";
import Community from "./pages/Community";
import Status from "./pages/Status";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import GDPR from "./pages/GDPR";
import DashboardWrapper from "./dashboard/DashboardWrapper";
import AdminApp from "./components/AdminApp";

const queryClient = new QueryClient();



const AppRoutes = () => {
  useScrollToTop();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/api" element={<API />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/community" element={<Community />} />
      <Route path="/status" element={<Status />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="/gdpr" element={<GDPR />} />
      <Route path="/dashboard/*" element={<DashboardWrapper />} />
      {/* Admin Panel - Integrated directly into main app */}
      <Route path="/admin/*" element={<AdminApp />} />
      {/* Catch-all 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppRoutes />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
