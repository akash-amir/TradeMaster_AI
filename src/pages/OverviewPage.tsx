import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Users, Crown, CreditCard, TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'

export default function OverviewPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: adminApi.getDashboardStats,
  })

  const { data: userGrowth, isLoading: userGrowthLoading } = useQuery({
    queryKey: ['user-growth', '30d'],
    queryFn: () => adminApi.getUserGrowthData('30d'),
  })

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-data', '30d'],
    queryFn: () => adminApi.getRevenueData('30d'),
  })

  // Payment success percentage: (successful / total) * 100
  const { data: paymentSuccessStats } = useQuery({
    queryKey: ['supabase', 'payments', 'success_percentage'],
    queryFn: async () => {
      const SUCCESS_STATUSES = ['success', 'succeeded', 'paid']
      const CANDIDATE_SOURCES = ['payments_with_email', 'payments']

      // Try each candidate source until one works
      let lastErr: any = null
      for (const src of CANDIDATE_SOURCES) {
        try {
          const totalQ = (supabase as any)
            .from(src)
            .select('id', { count: 'exact' })
            .limit(1)
          const succQ = (supabase as any)
            .from(src)
            .select('id', { count: 'exact' })
            .in('status', SUCCESS_STATUSES)
            .limit(1)
          const [totalRes, succRes] = await Promise.all([totalQ, succQ])
          const total = totalRes.count || 0
          const success = succRes.count || 0
          const percentage = total > 0 ? (success / total) * 100 : 0
          const failed = Math.max(total - success, 0)
          return { total, success, failed, percentage }
        } catch (e: any) {
          const notFound = e?.code === 'PGRST302' || e?.status === 404 || /relation .* does not exist/i.test(e?.message || '')
          if (notFound) {
            lastErr = e
            continue
          }
          throw e
        }
      }
      // If none worked, throw a helpful error
      const msg = 'No payments source found for dashboard. Tried: ' + CANDIDATE_SOURCES.join(', ')
      throw Object.assign(new Error(msg), { cause: lastErr })
    },
    staleTime: 60_000,
  })

  // Active API keys (RPC preferred, fallback to SELECT count)
  const { data: activeApiKeysCount } = useQuery({
    queryKey: ['supabase', 'user_api_keys', 'active_count'],
    queryFn: async () => {
      // Preferred: SECURITY DEFINER RPC get_active_api_keys_count()
      try {
        const { data, error } = await (supabase as any).rpc('get_active_api_keys_count')
        if (error) throw error
        return Number(data ?? 0)
      } catch (e) {
        // Fallback: HEAD select with exact count
        const { count, error: e2 } = await (supabase as any)
          .from('user_api_keys')
          .select('id', { count: 'exact' })
          .eq('is_active', true)
          .limit(1)
        if (e2) throw e2
        return count ?? 0
      }
    },
    staleTime: 60_000,
  })

  // Total revenue from Supabase (RPC with fallback to client-side sum)
  const { data: totalRevenue, isLoading: totalRevenueLoading } = useQuery({
    queryKey: ['supabase', 'subscription', 'total_revenue'],
    queryFn: async () => {
      // Preferred: RPC get_total_revenue()
      try {
        const { data, error } = await (supabase as any).rpc('get_total_revenue')
        if (error) throw error
        return Number(data ?? 0)
      } catch (e) {
        // Fallback: fetch rows and sum in JS
        const { data: rows, error: e2 } = await (supabase as any)
          .from('subscription')
          .select('amount')
        if (e2) throw e2
        const total = (rows ?? []).reduce((acc: number, r: any) => {
          return acc + Number(r?.amount ?? 0)
        }, 0)
        return total
      }
    },
    staleTime: 60_000,
  })

  // Real total users from Supabase (counts rows in public.profiles)
  const { data: totalUsersCount, isLoading: totalUsersLoading } = useQuery({
    queryKey: ['supabase', 'profiles', 'count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      if (error) {
        // Surface in console for easier debugging
        console.error('profiles count error', error)
        throw error
      }
      return count ?? 0
    },
  })

  // Prefer secure RPC if available: public.get_profiles_count() counts public.profiles
  // Create in Supabase SQL editor:
  // create or replace function public.get_profiles_count()
  // returns bigint language sql security definer set search_path = public, extensions as $$
  //   select count(*)::bigint from public.profiles;
  // $$;
  const { data: profilesCountRpc } = useQuery({
    queryKey: ['supabase', 'rpc', 'get_profiles_count'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc('get_profiles_count')
      if (error) throw error
      return (data as number) ?? 0
    },
    retry: 1,
  })

  // Optional: counts auth.users via a SECURITY DEFINER RPC (requires you to create it in Supabase):
  // create or replace function public.get_auth_users_count()
  // returns bigint language sql security definer set search_path = public, auth as $$
  //   select count(*)::bigint from auth.users;
  // $$;
  const { data: authUsersCountRpc } = useQuery({
    queryKey: ['supabase', 'rpc', 'get_auth_users_count'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc('get_auth_users_count')
      if (error) throw error
      return (data as number) ?? 0
    },
    retry: 1,
  })

  // Prefer admin-side total (auth.users) when available; otherwise fall back to profiles count
  const totalUsersEffective = ((authUsersCountRpc ?? 0) > 0)
    ? authUsersCountRpc
    : ((profilesCountRpc ?? totalUsersCount) ?? 0)

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    trend, 
    trendValue 
  }: {
    title: string
    value: string | number
    description: string
    icon: any
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{description}</span>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-muted-foreground'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : trend === 'down' ? (
                <TrendingDown className="h-3 w-3" />
              ) : null}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const subscriptionColors = {
    free: '#94a3b8',
    premium: '#00C896',
    professional: '#3b82f6',
  }

  if (statsLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor your platform's performance and key metrics</p>
      </div>

      {/* Key Stats */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={formatNumber(totalUsersEffective ?? 0)}
          description={`Total registered users`}
          icon={Users}
        />
        
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(totalRevenue || 0)}
          description="Total revenue from subscriptions"
          icon={DollarSign}
          trend={undefined}
          trendValue={undefined}
        />
        
        <StatCard
          title="Active API Keys"
          value={formatNumber(activeApiKeysCount || 0)}
          description="Keys currently active"
          icon={Activity}
        />
        
        <StatCard
          title="Payment Success"
          value={`${(paymentSuccessStats?.percentage ?? 0).toFixed(1)}%`}
          description={`${paymentSuccessStats?.failed ?? 0} failed payments`}
          icon={CreditCard}
          trend={undefined}
          trendValue={undefined}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            {userGrowthLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly recurring revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription Distribution & Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Subscription Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>Distribution of user plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="text-sm">Free</span>
                </div>
                <span className="text-sm font-medium">{stats?.subscriptions.free || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">Premium</span>
                </div>
                <span className="text-sm font-medium">{stats?.subscriptions.premium || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Professional</span>
                </div>
                <span className="text-sm font-medium">{stats?.subscriptions.professional || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top API Users */}
        <Card>
          <CardHeader>
            <CardTitle>Top API Users</CardTitle>
            <CardDescription>Most active API consumers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.apiUsage.topUsers?.slice(0, 5).map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </div>
                    <span className="text-sm truncate max-w-[120px]">{user.email}</span>
                  </div>
                  <span className="text-sm font-medium">{formatNumber(user.requests)}</span>
                </div>
              )) || (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No API usage data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment System</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Services</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-sm text-yellow-600">Degraded</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform events and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: 'user',
                message: 'New user registration: john.doe@example.com',
                time: '2 minutes ago',
                icon: Users,
                color: 'text-blue-600',
              },
              {
                type: 'payment',
                message: 'Payment succeeded: $79.00 from Premium subscription',
                time: '15 minutes ago',
                icon: CreditCard,
                color: 'text-green-600',
              },
              {
                type: 'alert',
                message: 'High API usage detected for user alex@trader.com',
                time: '1 hour ago',
                icon: AlertTriangle,
                color: 'text-yellow-600',
              },
              {
                type: 'subscription',
                message: 'Subscription upgraded: Free → Premium',
                time: '2 hours ago',
                icon: Crown,
                color: 'text-primary',
              },
            ].map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Icon className={`h-4 w-4 mt-0.5 ${activity.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}