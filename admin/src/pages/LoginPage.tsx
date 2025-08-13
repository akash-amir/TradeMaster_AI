import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Brain, Loader2, Mail, Lock, Shield } from 'lucide-react'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  if (isAuthenticated) {
    return <Navigate to="/overview" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged into admin panel.',
      })
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground">TradeMaster AI</h1>
              <p className="text-sm text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">Admin Access</CardTitle>
            </div>
            <CardDescription>
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@trademaster.ai"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            This is a secure admin area. All actions are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  )
}