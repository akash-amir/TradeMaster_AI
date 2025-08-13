import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Brain,
  Plus,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Wallet,
  Upload,
  Settings,
  BookOpen,
  LineChart,
  Zap,
  Home,
  User,
  Activity,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import DashboardHome from "./DashboardHome";
import ProfileSettings from "./ProfileSettings";
import TradeEntryForm from "./TradeEntryForm";
import TradeRecordsTable from "./TradeRecordsTable";
import TradingViewWidget from "./TradingViewWidget";
import AIAnalysisSection from "./AIAnalysisSection";
import { useDashboard } from "../context/DashboardContext";

const navItems = [
  { to: '/dashboard/home', label: 'Home', icon: Home },
  { to: '/dashboard/log-trades', label: 'Log Trade', icon: Plus },
  { to: '/dashboard/records', label: 'Records', icon: Activity },
  { to: '/dashboard/charts', label: 'Charts', icon: BarChart3 },
  { to: '/dashboard/ai-analysis', label: 'AI Analysis', icon: Brain },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function TradingDashboard() {
  const { toast } = useToast();
  const { loading } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-background" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">TradeMaster AI</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`px-3 py-2 text-sm font-medium transition-colors flex items-center ${
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2 inline" />
                    {item.label}
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-border bg-card/50 backdrop-blur-lg">
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={`block px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-foreground font-medium">Loading dashboard...</span>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}