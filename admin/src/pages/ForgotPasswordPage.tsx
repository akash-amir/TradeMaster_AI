import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Brain, Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setEmailSent(true)
      toast({
        title: 'Reset email sent',
        description: 'Check your email for password reset instructions.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send reset email',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
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

        {/* Reset Card */}
        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold">
              {emailSent ? 'Check Your Email' : 'Reset Password'}
            </CardTitle>
            <CardDescription>
              {emailSent
                ? 'We\'ve sent password reset instructions to your email address.'
                : 'Enter your email address and we\'ll send you a link to reset your password.'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {emailSent ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    If an admin account with that email exists, you'll receive reset instructions shortly.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEmailSent(false)
                    setEmail('')
                  }}
                  className="w-full"
                >
                  Try Different Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@trademaster.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}