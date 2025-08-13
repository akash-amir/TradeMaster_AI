import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import DashboardLayout from '@/components/DashboardLayout'
import OverviewPage from '@/pages/OverviewPage'
import UsersPage from '@/pages/UsersPage'
import SubscriptionsPage from '@/pages/SubscriptionsPage'
import PaymentsPage from '@/pages/PaymentsPage'
import APIKeysPage from '@/pages/APIKeysPage'
import FeedbackPage from '@/pages/FeedbackPage'
import SettingsPage from '@/pages/SettingsPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/overview" replace />} />
                    <Route path="/overview" element={<OverviewPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/subscriptions" element={<SubscriptionsPage />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/api-keys" element={<APIKeysPage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App