import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Search } from 'lucide-react'
import { format } from 'date-fns'

type SubscriptionRow = {
  id: string
  user_id: string
  email?: string | null
  amount: number | null
  status: string | null
  plan: string | null
  subscription_start: string | null
  subscription_end: string | null
  created_at: string | null
}

const formatDate = (d?: string | null) => (d ? format(new Date(d), 'yyyy-MM-dd HH:mm') : '—')
const formatMoney = (cents?: number | null) =>
  cents == null ? '—' : new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(cents / 100)

export default function SubscriptionsPage() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  // Try known sources in order: view with email, then base table
  const candidateSources = ['subscriptions_with_email', 'subscriptions'] as const
  const [resolvedSource, setResolvedSource] = useState<string | null>(null)

  const queryKey = useMemo(() => ['subscriptions_supabase', { search, page, limit }], [search, page, limit])

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const from = (page - 1) * limit
      const to = from + limit - 1
      const raw = search.trim()
      // PostgREST .or() expects '*' wildcards for ilike
      const term = raw ? `*${raw}*` : null
      const isUuidLike = !!raw && /^[0-9a-fA-F-]{32,36}$/.test(raw)

      // Try each source until one succeeds
      let lastErr: any = null
      for (const src of candidateSources) {
        try {
          let q = (supabase as any)
            .from(src)
            .select(
              src === 'subscriptions_with_email'
                ? 'id,user_id,email,amount,status,plan,subscription_start,subscription_end,created_at'
                : 'id,user_id,amount,status,plan,subscription_start,subscription_end,created_at',
              { count: 'exact' }
            )
            .order('created_at', { ascending: false })

          if (term) {
            if (src === 'subscriptions_with_email') {
              // Email, plan, status via ilike; user_id exact when uuid-like
              const clauses = [`email.ilike.${term}`, `plan.ilike.${term}`, `status.ilike.${term}`]
              if (isUuidLike) clauses.push(`user_id.eq.${raw}`)
              q = q.or(clauses.join(',')) as any
            } else {
              // Base table: plan/status via ilike; user_id exact when uuid-like
              const clauses = [`plan.ilike.${term}`, `status.ilike.${term}`]
              if (isUuidLike) clauses.push(`user_id.eq.${raw}`)
              q = q.or(clauses.join(',')) as any
            }
          }

          const { data, error, count, status } = await q.range(from, to)
          if (error) {
            // If 404/not found or relation missing, try next source
            const notFound = (error as any)?.code === 'PGRST302' || (error as any)?.status === 404 || /relation .* does not exist/i.test((error as any)?.message || '')
            if (notFound) {
              lastErr = error
              continue
            }
            throw error
          }
          // Success
          if (resolvedSource !== src) setResolvedSource(src)
          return { items: (data as SubscriptionRow[]) || [], totalCount: count || 0 }
        } catch (e: any) {
          const notFound = e?.code === 'PGRST302' || e?.status === 404 || /relation .* does not exist/i.test(e?.message || '')
          if (notFound) {
            lastErr = e
            continue
          }
          throw e
        }
      }
      // If none worked, throw the last not-found error with a clearer message
      const msg = 'No subscriptions source found. Tried: ' + candidateSources.join(', ')
      throw Object.assign(new Error(msg), { cause: lastErr })
    },
    staleTime: 30_000,
  })

  const total = data?.totalCount || 0
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)
  const usingEmail = resolvedSource === 'subscriptions_with_email'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-sm text-muted-foreground">Live subscription records from Supabase</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>
            {usingEmail ? 'Search by email, user_id, plan, or status' : 'Search by user_id, plan, or status'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={usingEmail ? 'Search by email or user_id...' : 'Search by user_id...'}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription List</CardTitle>
          <CardDescription>{total} total</CardDescription>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="p-4 text-sm text-destructive bg-destructive/10 rounded">{(error as any)?.message || 'Failed to load subscriptions'}</div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 w-40 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-5 w-16 bg-muted rounded-full animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-28 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-28 bg-muted rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-4 w-28 bg-muted rounded animate-pulse" /></TableCell>
                    </TableRow>
                  ))
                : (data?.items || []).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-sm text-muted-foreground">{usingEmail ? s.email || s.user_id : s.user_id}</TableCell>
                      <TableCell className="text-sm">{formatMoney(s.amount ?? null)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{s.status || 'unknown'}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{s.plan || '—'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(s.subscription_start)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(s.subscription_end)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(s.created_at)}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {total === 0 ? 'No subscriptions' : `Showing ${start} to ${end} of ${total} subscriptions`}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page * limit >= total}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}