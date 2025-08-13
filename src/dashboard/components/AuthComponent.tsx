import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Mail, Lock, User, Eye, EyeOff, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthComponent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to TradeMaster AI.",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (error) throw error;

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            display_name: formData.fullName,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      toast({
        title: "Account Created!",
        description: "Welcome to TradeMaster AI. You can now start trading.",
      });
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="h-7 w-7 text-background" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">TradeMaster AI</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Professional Trading Analytics Platform
          </p>
        </div>

        {/* Auth Card */}
        <Card className="glass-card animate-reveal animate-reveal-delay-1">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">
              Access Your Dashboard
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-sm font-medium">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-sm font-medium">
                  Create Account
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="alex@trademaster.ai"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 bg-input border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10 bg-input border-border"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-premium w-full"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Sign In to Dashboard
                      </div>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                    Forgot your password?
                  </button>
                </div>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Alex Thompson"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="pl-10 bg-input border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="alex@trademaster.ai"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 bg-input border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10 bg-input border-border"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 bg-input border-border"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-premium w-full"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Create Account
                      </div>
                    )}
                  </Button>
                </form>

                <div className="text-center text-xs text-muted-foreground">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 text-center animate-reveal animate-reveal-delay-2">
          <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <span>AI Analysis</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-secondary" />
              </div>
              <span>Live Charts</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span>Trade Logs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}