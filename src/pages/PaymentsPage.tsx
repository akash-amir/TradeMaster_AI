import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Download, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'
import { format as formatDateFns } from 'date-fns'

type PaymentRow = {
  id: string
  user_id: string
  email?: string | null
  subscription_id: string | null
  amount: number
  currency: string | null
  status: string
  payment_method: string | null
  created_at: string
}

const formatDate = (d?: string | null) => (d ? formatDateFns(new Date(d), 'yyyy-MM-dd HH:mm') : '—')
const formatCurrency = (amount?: number | null, currency?: string | null) => {
  const curr = (currency || 'USD').toUpperCase()
  const n = typeof amount === 'number' ? amount : 0
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: curr }).format(n / 100)
}


const CANDIDATE_SOURCES = ['payments_with_email', 'payments'] as const

export default function PaymentsPage() {
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 20

  const listQueryKey = useMemo(
    () => ['payments_list', { statusFilter, methodFilter, page, limit }],
    [statusFilter, methodFilter, page, limit]
  )

  const { data: listData, isLoading, isError, error } = useQuery({
    queryKey: listQueryKey,
    queryFn: async () => {
      const from = (page - 1) * limit
      const to = from + limit - 1
      let lastErr: any = null
      for (const src of CANDIDATE_SOURCES) {
        try {
          let q = (supabase as any)
            .from(src)
            .select(
              src === 'payments_with_email'
                ? 'id,user_id,email,subscription_id,amount,currency,status,payment_method,created_at'
                : 'id,user_id,subscription_id,amount,currency,status,payment_method,created_at',
              { count: 'exact' }
            )
            .order('created_at', { ascending: false })
          if (statusFilter !== 'all') {
            q = q.eq('status', statusFilter)
          }
          if (methodFilter !== 'all') {
            q = q.ilike('payment_method', `%${methodFilter}%`)
          }
          // Date filtering removed per request
          const { data, error, count } = await q.range(from, to)
          if (error) throw error
          const items = (data as PaymentRow[]) || []
          return { items, totalCount: count || 0, source: src }
        } catch (e: any) {
          const notFound = e?.code === 'PGRST302' || e?.status === 404 || /relation .* does not exist/i.test(e?.message || '')
          if (notFound) {
            lastErr = e
            continue
          }
          throw e
        }
      }
      const msg = 'No payments source found. Tried: ' + CANDIDATE_SOURCES.join(', ')
      throw Object.assign(new Error(msg), { cause: lastErr })
    },
    staleTime: 30_000,
  })

  const statsQueryKey = useMemo(
    () => ['payments_stats'],
    []
  )

  const { data: statsData } = useQuery({
    queryKey: statsQueryKey,
    queryFn: async () => {
      // compute aggregates from the base table `payments`
      // If you created a view, these still work since they only need aggregates.
      const base = (supabase as any).from('payments')
      const SUCCESS_STATUSES = ['success', 'succeeded', 'paid']
      const FAILED_STATUSES = ['failed', 'error', 'canceled']
      const totalPromise = base.select('id', { count: 'exact' }).limit(1)
      const revenuePromise = (supabase as any).from('payments').select('amount', { count: 'none' }).in('status', SUCCESS_STATUSES)
      const succCountPromise = (supabase as any).from('payments').select('id', { count: 'exact' }).in('status', SUCCESS_STATUSES).limit(1)
      const failCountPromise = (supabase as any).from('payments').select('id', { count: 'exact' }).in('status', FAILED_STATUSES).limit(1)
      const latestPromise = (supabase as any).from('payments').select('created_at').order('created_at', { ascending: false }).limit(1)

      const [totalRes, revenueRes, succRes, failRes, latestRes] = await Promise.all([
        totalPromise, revenuePromise, succCountPromise, failCountPromise, latestPromise,
      ])

      const totalPayments = totalRes.count || 0
      const revenue = Array.isArray(revenueRes.data)
        ? (revenueRes.data as any[]).reduce((acc, r) => acc + (r.amount ?? 0), 0)
        : 0
      const successCount = succRes.count || 0
      const failedCount = failRes.count || 0
      const latestDate = Array.isArray(latestRes.data) && latestRes.data.length > 0
        ? (latestRes.data[0] as any).created_at as string
        : null
      const successPct = totalPayments > 0 ? Math.round((successCount / totalPayments) * 100) : 0
      return { totalPayments, revenue, successCount, failedCount, successPct, latestDate }
    },
    staleTime: 30_000,
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Success</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">Monitor transactions and process refunds</p>
        </div>
        {/* Optional: add export later via RPC */}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.totalPayments ?? 0}</div>
            <p className="text-xs text-muted-foreground">All time count</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statsData?.revenue ?? 0, 'USD')}</div>
            <p className="text-xs text-muted-foreground">Sum of successful payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success vs Failed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.successPct ?? 0}%</div>
            <p className="text-xs text-muted-foreground">{statsData?.successCount ?? 0} success / {statsData?.failedCount ?? 0} failed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.latestDate ? formatDate(statsData.latestDate) : '—'}</div>
            <p className="text-xs text-muted-foreground">Most recent transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={(v) => { setMethodFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
              </SelectContent>
            </Select>
            {/* Date filters removed per request */}
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>{listData?.totalCount || 0} total payments</CardDescription>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded">
              {(error as any)?.message || 'Failed to load payments'}
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="w-32 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-28 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-20 h-4 bg-muted rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : (
                (listData?.items || []).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="text-sm font-mono">{p.email ? p.email : p.user_id}</div>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">{p.subscription_id || '—'}</TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(p.amount, p.currency || 'USD')}</div>
                      <div className="text-xs text-muted-foreground uppercase">{(p.currency || 'USD').toUpperCase()}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(p.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(p.created_at)}</TableCell>
                    <TableCell className="text-sm">{p.payment_method || '—'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {listData && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {listData.totalCount === 0
                  ? 'No payments'
                  : `Showing ${((page - 1) * limit) + 1} to ${Math.min(page * limit, listData.totalCount)} of ${listData.totalCount} payments`}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * limit >= (listData?.totalCount || 0)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}