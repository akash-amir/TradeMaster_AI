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

function AdminApp() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route index element={
            <ProtectedRoute>
              <Navigate to="/admin/overview" replace />
            </ProtectedRoute>
          } />
          <Route
            path="overview"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <OverviewPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UsersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="subscriptions"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SubscriptionsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="payments"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PaymentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="api-keys"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <APIKeysPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="feedback"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FeedbackPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsPage />
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

export default AdminApp
