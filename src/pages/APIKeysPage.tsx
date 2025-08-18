import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Key, Search, Activity, Shield, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'

type ApiKeyRow = {
  id: string
  user_id: string
  provider: string | null
  usage_count: number | null
  last_used: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
}

const formatDate = (d?: string | null) => (d ? format(new Date(d), 'yyyy-MM-dd HH:mm') : '—')
const formatNumber = (n?: number | null) =>
  typeof n === 'number' ? new Intl.NumberFormat(undefined).format(n) : '0'

// Supabase table backing the API keys admin page
const TABLE = 'user_api_keys'
const USE_RPC_STATS = false

export default function APIKeysPage() {
  const { toast } = useToast()
  const [searchUserId, setSearchUserId] = useState('')
  const [providerFilter, setProviderFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [highUsageOnly, setHighUsageOnly] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 20

  const highUsageThreshold = 1000

  const listQueryKey = useMemo(
    () => [
      'api_keys_list',
      { searchUserId, providerFilter, statusFilter, highUsageOnly, page, limit },
    ],
    [searchUserId, providerFilter, statusFilter, highUsageOnly, page, limit]
  )

  const { data: listData, isLoading, isError, error } = useQuery({
    queryKey: listQueryKey,
    queryFn: async () => {
      const from = (page - 1) * limit
      const to = from + limit - 1
      let q = (supabase as any)
        .from(TABLE)
        .select('id,user_id,provider,usage_count,last_used,is_active,created_at,updated_at', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (searchUserId.trim()) {
        const raw = searchUserId.trim()
        const isUuidLike = /^[0-9a-fA-F-]{32,36}$/.test(raw)
        if (isUuidLike) q = q.eq('user_id', raw)
      }
      if (providerFilter !== 'all') {
        q = q.ilike('provider', `%${providerFilter}%`)
      }
      if (statusFilter !== 'all') {
        q = q.eq('is_active', statusFilter === 'active')
      }
      if (highUsageOnly) {
        q = q.gte('usage_count', highUsageThreshold)
      }

      const { data, error, count } = await q.range(from, to)
      if (error) throw error
      return { items: (data as ApiKeyRow[]) || [], totalCount: count || 0 }
    },
    staleTime: 30_000,
  })

  const statsQueryKey = useMemo(
    () => ['api_keys_stats', { highUsageThreshold }],
    [highUsageThreshold]
  )

  const { data: statsData } = useQuery({
    queryKey: statsQueryKey,
    queryFn: async () => {
      // Optionally try RPC, but default to direct aggregates to ensure correct TABLE usage
      if (USE_RPC_STATS) {
        try {
          const { data: rpc, error: rpcErr } = await (supabase as any).rpc('admin_api_keys_stats', {
            high_usage_threshold: highUsageThreshold,
          })
          if (!rpcErr && rpc) return rpc
        } catch {}
      }

      // Fallback: compute via lightweight queries (avoid head:true to dodge policy-count quirks)
      const totalPromise = (supabase as any)
        .from(TABLE)
        .select('id', { count: 'exact' })
        .limit(1)
      const activePromise = (supabase as any)
        .from(TABLE)
        .select('id', { count: 'exact' })
        .eq('is_active', true)
        .limit(1)
      const highUsagePromise = (supabase as any)
        .from(TABLE)
        .select('id', { count: 'exact' })
        .gte('usage_count', highUsageThreshold)
        .limit(1)
      const sumPromise = (supabase as any)
        .from(TABLE)
        .select('usage_count')

      const [totalRes, activeRes, highRes, sumRes] = await Promise.all([
        totalPromise, activePromise, highUsagePromise, sumPromise,
      ])
      const total_keys = totalRes.count || 0
      const active_keys = activeRes.count || 0
      const high_usage_keys = highRes.count || 0
      const total_requests = Array.isArray(sumRes.data)
        ? (sumRes.data as any[]).reduce((acc, r) => acc + (r.usage_count ?? 0), 0)
        : 0
      return { total_keys, active_keys, total_requests, high_usage_keys }
    },
    staleTime: 30_000,
  })

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
    ) : (
      <Badge variant="destructive">Inactive</Badge>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">API Keys</h1>
        <p className="text-muted-foreground">Monitor API usage and manage access keys</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.total_keys ?? 0}</div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.active_keys ?? 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(statsData?.total_requests ?? 0)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Usage Keys</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.high_usage_keys ?? 0}</div>
            <p className="text-xs text-muted-foreground">Require monitoring</p>
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user_id (paste full UUID)"
                value={searchUserId}
                onChange={(e) => {
                  setSearchUserId(e.target.value)
                  setPage(1)
                }}
                className="pl-10"
              />
            </div>
            <Select value={providerFilter} onValueChange={(v) => { setProviderFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <input id="highUsage" type="checkbox" className="h-4 w-4" checked={highUsageOnly} onChange={(e) => { setHighUsageOnly(e.target.checked); setPage(1) }} />
              <label htmlFor="highUsage" className="text-sm text-muted-foreground">High usage only (&gt;{highUsageThreshold})</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>{listData?.totalCount || 0} total API keys</CardDescription>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded">
              {(error as any)?.message || 'Failed to load API keys'}
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="w-20 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-40 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-5 bg-muted rounded-full animate-pulse" /></TableCell>
                    <TableCell><div className="w-28 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-28 h-4 bg-muted rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : (
                (listData?.items || []).map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="text-sm font-mono">{k.id}</TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">{k.user_id}</TableCell>
                    <TableCell className="text-sm">{k.provider || '—'}</TableCell>
                    <TableCell className="text-sm">{formatNumber(k.usage_count ?? 0)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(k.last_used)}</TableCell>
                    <TableCell>
                      {getStatusBadge(k.is_active)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(k.created_at)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(k.updated_at)}</TableCell>
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
                  ? 'No API keys'
                  : `Showing ${((page - 1) * limit) + 1} to ${Math.min(page * limit, listData.totalCount)} of ${listData.totalCount} API keys`}
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