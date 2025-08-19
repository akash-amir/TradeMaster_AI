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

  // Top API users by usage_count (join user_api_keys -> auth.users to get email)
  type TopApiUser = { user_id: string; email: string; usage_count: number }
  const { data: topApiUsers, isLoading: topApiUsersLoading } = useQuery({
    queryKey: ['supabase', 'user_api_keys', 'top_api_users'],
    queryFn: async (): Promise<TopApiUser[]> => {
      // Preferred: SECURITY DEFINER RPC that joins auth.users
      // Example RPC:
      // create or replace function public.get_top_api_users(p_limit int default 5)
      // returns table(user_id uuid, email text, usage_count bigint)
      // language sql security definer set search_path = public, auth as $$
      //   select uak.user_id, au.email, sum(uak.usage_count)::bigint as usage_count
      //   from public.user_api_keys uak
      //   join auth.users au on au.id = uak.user_id
      //   group by uak.user_id, au.email
      //   order by usage_count desc
      //   limit p_limit;
      // $$;
      try {
        const { data, error } = await (supabase as any).rpc('get_top_api_users', { p_limit: 5 })
        if (error) throw error
        return (data || []).map((r: any) => ({
          user_id: String(r.user_id),
          email: String(r.email ?? ''),
          usage_count: Number(r.usage_count ?? 0),
        }))
      } catch (_) {
        // fall through to client-side fallback
      }

      // Fallback 1: Aggregate user_api_keys usage_count client-side and fetch emails via another RPC
      const { data: keysRows, error: e1 } = await (supabase as any)
        .from('user_api_keys')
        .select('user_id, usage_count')
      if (e1) throw e1
      const byUser = new Map<string, number>()
      ;(keysRows || []).forEach((r: any) => {
        const uid = String(r.user_id)
        const cnt = Number(r?.usage_count ?? 0)
        byUser.set(uid, (byUser.get(uid) ?? 0) + cnt)
      })
      const sorted = [...byUser.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      // Try to get emails via an RPC that can access auth.users; fallback to profiles.email; else show user_id
      const userIds = sorted.map(([uid]) => uid)
      let emails = new Map<string, string>()
      try {
        const { data: emailRows, error: e2 } = await (supabase as any).rpc('get_user_emails', { user_ids: userIds })
        if (e2) throw e2
        ;(emailRows || []).forEach((r: any) => emails.set(String(r.id), String(r.email ?? '')))
      } catch (_) {
        // fallback to profiles.email if present
        if (userIds.length > 0) {
          const { data: profRows } = await (supabase as any)
            .from('profiles')
            .select('id, email')
            .in('id', userIds)
          ;(profRows || []).forEach((r: any) => emails.set(String(r.id), String(r.email ?? '')))
        }
      }
      return sorted.map(([uid, cnt]) => ({ user_id: uid, email: emails.get(uid) || uid, usage_count: cnt }))
    },
    staleTime: 60_000,
    refetchInterval: 30_000,
  })

  // Subscription plan counts (Free, Premium, Professional)
  const { data: subscriptionPlanCounts, isLoading: planCountsLoading } = useQuery({
    queryKey: ['supabase', 'subscription', 'plan_counts'],
    queryFn: async (): Promise<{ free: number; premium: number; professional: number }> => {
      // Preferred: SECURITY DEFINER RPC get_subscription_plan_counts()
      // Should return rows like: [{ plan: 'free', count: 10 }, ...]
      try {
        const { data, error } = await (supabase as any).rpc('get_subscription_plan_counts')
        if (error) throw error
        const map = new Map<string, number>()
        ;(data || []).forEach((r: any) => {
          const key = String(r.plan ?? r.plan_type ?? '').toLowerCase()
          map.set(key, Number(r.count ?? r.total ?? 0))
        })
        return {
          free: map.get('free') ?? 0,
          premium: map.get('premium') ?? 0,
          professional: map.get('professional') ?? 0,
        }
      } catch (_) {
        // fall through to client-side aggregation
      }

      // Fallback: fetch plan column and aggregate in JS
      const { data: rows, error } = await (supabase as any)
        .from('subscription')
        .select('plan')
      if (error) throw error
      const counts = { free: 0, premium: 0, professional: 0 } as { [k: string]: number }
      ;(rows || []).forEach((r: any) => {
        const key = String(r?.plan ?? '').toLowerCase()
        if (key in counts) counts[key] += 1
      })
      return {
        free: counts.free ?? 0,
        premium: counts.premium ?? 0,
        professional: counts.professional ?? 0,
      }
    },
    staleTime: 60_000,
    refetchInterval: 30_000,
  })

  const { data: userGrowth, isLoading: userGrowthLoading } = useQuery({
    queryKey: ['supabase', 'profiles', 'monthly_growth'],
    queryFn: async () => {
      // Preferred: SECURITY DEFINER RPC get_monthly_user_growth()
      // Example SQL to create in Supabase:
      // create or replace function public.get_monthly_user_growth()
      // returns table(month date, count bigint)
      // language sql security definer set search_path = public as $$
      //   select date_trunc('month', created_at)::date as month, count(*)::bigint
      //   from public.profiles
      //   group by 1
      //   order by 1;
      // $$;
      try {
        const { data, error } = await (supabase as any).rpc('get_monthly_user_growth')
        if (error) throw error
        const mapped = (data || []).map((r: any) => ({
          date: (r.month instanceof Date ? r.month.toISOString() : new Date(r.month).toISOString()),
          users: Number(r.count ?? r.users ?? 0),
        }))
        if (mapped.length > 0) return mapped
      } catch (_) {
        // fall through to client-side aggregation
      }

      // Fallback: fetch last 12 months and aggregate client-side
      const start = new Date()
      start.setUTCFullYear(start.getUTCFullYear(), start.getUTCMonth() - 11, 1)
      start.setUTCHours(0, 0, 0, 0)
      const { data: rows, error: e2 } = await (supabase as any)
        .from('profiles')
        .select('created_at')
        .gte('created_at', start.toISOString())
      if (e2) throw e2

      // Build a map for the last 12 months
      const months: { date: Date; key: string; users: number }[] = []
      const now = new Date()
      for (let i = 11; i >= 0; i--) {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
        const key = d.toISOString().slice(0, 7) // YYYY-MM
        months.push({ date: d, key, users: 0 })
      }
      rows?.forEach((r: any) => {
        const dt = new Date(r.created_at)
        const key = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), 1)).toISOString().slice(0, 7)
        const bucket = months.find(m => m.key === key)
        if (bucket) bucket.users += 1
      })
      return months.map(m => ({ date: m.date.toISOString(), users: m.users }))
    },
    staleTime: 60_000,
  })

  const { data: monthlyRevenue, isLoading: monthlyRevenueLoading } = useQuery({
    queryKey: ['supabase', 'subscription', 'monthly_revenue'],
    queryFn: async () => {
      // Preferred: SECURITY DEFINER RPC get_monthly_revenue()
      // Should return rows like: { month: date, revenue: number }
      try {
        const { data, error } = await (supabase as any).rpc('get_monthly_revenue')
        if (error) throw error
        return (data || []).map((r: any) => ({
          date: (r.month instanceof Date ? r.month.toISOString() : new Date(r.month).toISOString()),
          revenue: Number(r.revenue ?? r.total ?? 0),
        }))
      } catch (_) {
        // fall through to client-side aggregation
      }

      // Fallback: fetch last 12 months from subscription and aggregate client-side
      const start = new Date()
      start.setUTCFullYear(start.getUTCFullYear(), start.getUTCMonth() - 11, 1)
      start.setUTCHours(0, 0, 0, 0)
      const { data: rows, error } = await (supabase as any)
        .from('subscription')
        .select('created_at, amount, status')
        .gte('created_at', start.toISOString())
        .in('status', ['completed', 'active'])
      if (error) throw error

      // Build a map for the last 12 months
      const months: { date: Date; key: string; revenue: number }[] = []
      const now = new Date()
      for (let i = 11; i >= 0; i--) {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
        const key = d.toISOString().slice(0, 7) // YYYY-MM
        months.push({ date: d, key, revenue: 0 })
      }
      ;(rows || []).forEach((r: any) => {
        const dt = new Date(r.created_at)
        const key = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), 1)).toISOString().slice(0, 7)
        const bucket = months.find(m => m.key === key)
        if (bucket) bucket.revenue += Number(r?.amount ?? 0)
      })
      return months.map(m => ({ date: m.date.toISOString(), revenue: m.revenue }))
    },
    staleTime: 60_000,
    refetchInterval: 30_000,
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

  // Unified Recent Activity: payments, new profiles, subscriptions updates, api usage updates
  type ActivityItem = {
    type: 'payment' | 'user' | 'subscription' | 'api_usage'
    ts: string // ISO
    message: string
    icon: any
    color: string
  }

  const timeAgo = (iso: string) => {
    const now = new Date()
    const t = new Date(iso)
    const diffMs = now.getTime() - t.getTime()
    const sec = Math.max(Math.floor(diffMs / 1000), 0)
    if (sec < 60) return `${sec}s ago`
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}h ago`
    const d = Math.floor(hr / 24)
    return `${d}d ago`
  }

  const { data: recentActivities, isLoading: recentActivitiesLoading } = useQuery({
    queryKey: ['supabase', 'recent_activities'],
    queryFn: async (): Promise<ActivityItem[]> => {
      const items: ActivityItem[] = []

      // Helper to fetch emails for user ids (prefers RPC, falls back to profiles)
      const fetchEmails = async (userIds: string[]) => {
        const map = new Map<string, string>()
        if (userIds.length === 0) return map
        try {
          const { data, error } = await (supabase as any).rpc('get_user_emails', { user_ids: userIds })
          if (error) throw error
          ;(data || []).forEach((r: any) => map.set(String(r.id), String(r.email ?? '')))
          return map
        } catch (_) {
          const { data } = await (supabase as any)
            .from('profiles')
            .select('id, email')
            .in('id', userIds)
          ;(data || []).forEach((r: any) => map.set(String(r.id), String(r.email ?? '')))
          return map
        }
      }

      // Payments (prefer payments_with_email if exists)
      let paymentRows: any[] = []
      try {
        const { data } = await (supabase as any)
          .from('payments_with_email')
          .select('created_at, amount, status, email')
          .order('created_at', { ascending: false })
          .limit(5)
        paymentRows = data || []
      } catch (_) {
        // fallback to payments + email via profiles
        const { data: rows } = await (supabase as any)
          .from('payments')
          .select('created_at, amount, status, user_id')
          .order('created_at', { ascending: false })
          .limit(5)
        const ids = Array.from(new Set((rows || []).map((r: any) => String(r.user_id))))
        const emails = await fetchEmails(ids)
        paymentRows = (rows || []).map((r: any) => ({ ...r, email: emails.get(String(r.user_id)) || '' }))
      }
      paymentRows.forEach((p: any) => {
        items.push({
          type: 'payment',
          ts: p.created_at,
          message: `Payment ${String(p.status || '').toLowerCase()}: ${formatCurrency(Number(p.amount || 0))}${p.email ? ` from ${p.email}` : ''}`,
          icon: CreditCard,
          color: 'text-green-600',
        })
      })

      // New profiles (registrations)
      const { data: profileRows } = await (supabase as any)
        .from('profiles')
        .select('created_at, email')
        .order('created_at', { ascending: false })
        .limit(5)
      ;(profileRows || []).forEach((r: any) => {
        items.push({
          type: 'user',
          ts: r.created_at,
          message: `New user registration: ${r.email || 'unknown'}`,
          icon: Users,
          color: 'text-blue-600',
        })
      })

      // Subscriptions (new or updates by updated_at)
      const { data: subRows } = await (supabase as any)
        .from('subscription')
        .select('updated_at, created_at, user_id, plan, status')
        .order('updated_at', { ascending: false, nullsFirst: false })
        .limit(5)
      {
        const ids = Array.from(new Set((subRows || []).map((r: any) => String(r.user_id))))
        const emails = await fetchEmails(ids)
        ;(subRows || []).forEach((s: any) => {
          const ts = s.updated_at || s.created_at
          items.push({
            type: 'subscription',
            ts,
            message: `Subscription ${String(s.status || '').toLowerCase()}: ${String(s.plan || '').toUpperCase()}${emails.get(String(s.user_id)) ? ` — ${emails.get(String(s.user_id))}` : ''}`,
            icon: Crown,
            color: 'text-primary',
          })
        })
      }

      // API usage updates (by updated_at)
      const { data: apiRows } = await (supabase as any)
        .from('user_api_keys')
        .select('updated_at, user_id, usage_count')
        .order('updated_at', { ascending: false })
        .limit(5)
      {
        const ids = Array.from(new Set((apiRows || []).map((r: any) => String(r.user_id))))
        const emails = await fetchEmails(ids)
        ;(apiRows || []).forEach((a: any) => {
          items.push({
            type: 'api_usage',
            ts: a.updated_at,
            message: `API usage update: ${(emails.get(String(a.user_id)) || a.user_id)} — ${formatNumber(Number(a.usage_count || 0))} calls`,
            icon: Activity,
            color: 'text-muted-foreground',
          })
        })
      }

      // Sort all by timestamp desc and limit
      items.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
      return items.slice(0, 20)
    },
    staleTime: 60_000,
    refetchInterval: 30_000,
  })

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
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
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
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Total revenue per month (active & completed)</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyRevenueLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenue || []}>
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
                <span className="text-sm font-medium">{planCountsLoading ? '—' : (subscriptionPlanCounts?.free ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">Premium</span>
                </div>
                <span className="text-sm font-medium">{planCountsLoading ? '—' : (subscriptionPlanCounts?.premium ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Professional</span>
                </div>
                <span className="text-sm font-medium">{planCountsLoading ? '—' : (subscriptionPlanCounts?.professional ?? 0)}</span>
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
              {topApiUsersLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-3/5" />
                </div>
              ) : topApiUsers && topApiUsers.length > 0 ? (
                topApiUsers.map((user, index) => (
                  <div key={user.user_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </div>
                      <span className="text-sm truncate max-w-[160px]">{user.email || user.user_id}</span>
                    </div>
                    <span className="text-sm font-medium">{formatNumber(user.usage_count)}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No API usage data</p>
                </div>
              )}
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
          {recentActivitiesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          ) : (recentActivities && recentActivities.length > 0) ? (
            <div className="space-y-3">
              {recentActivities.map((a, i) => {
                const Icon = a.icon
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Icon className={`h-4 w-4 mt-0.5 ${a.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{a.message}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(a.ts)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}