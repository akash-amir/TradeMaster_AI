import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Search, Download } from 'lucide-react'
import { formatDate, getInitials } from '@/lib/utils'

type ProfileRow = {
  id: string
  email: string | null
  display_name: string | null
  full_name: string | null
  avatar_url: string | null
  created_at?: string | null
}

export default function UsersPage() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  const queryKey = useMemo(() => ['users_supabase', { search, page, limit }], [search, page])

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const from = (page - 1) * limit
      const to = from + limit - 1

      let query = supabase
        .from('profiles_with_email')
        .select('id,email,display_name,full_name,avatar_url,created_at', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (search?.trim()) {
        const term = `%${search.trim()}%`
        // Use or() to search multiple columns
        query = query.or(
          `email.ilike.${term},display_name.ilike.${term},full_name.ilike.${term}`
        ) as any
      }

      const { data, error, count } = await query.range(from, to)
      if (error) throw error
      return { users: (data as ProfileRow[]) || [], totalCount: count || 0 }
    },
    keepPreviousData: true,
    staleTime: 30_000,
  })

  // Note: status/plan not part of profiles_with_email by default; we focus on identity fields as requested

  const handleExport = async () => {
    try {
      // Export current filtered page as CSV from client
      const from = (page - 1) * limit
      const to = from + limit - 1
      let query = supabase
        .from('profiles_with_email')
        .select('id,email,display_name,full_name,avatar_url,created_at')
        .order('created_at', { ascending: false })
        .range(from, to)

      if (search?.trim()) {
        const term = `%${search.trim()}%`
        query = query.or(`email.ilike.${term},display_name.ilike.${term},full_name.ilike.${term}`) as any
      }
      const { data: rows, error } = await query
      if (error) throw error

      const header = ['id','email','display_name','full_name','avatar_url','created_at']
      const lines = [header.join(','), ...(rows || []).map(r => header.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))]
      const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({ title: 'Export successful', description: 'Users exported.' })
    } catch (err: any) {
      toast({ title: 'Export failed', description: err.message || 'Failed to export', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Users
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, display name, or full name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            {data?.totalCount || 0} total users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="p-4 text-sm text-destructive bg-destructive/10 rounded">{(error as any)?.message || 'Failed to load users'}</div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Identity</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {/* User */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-1">
                          <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                          <div className="w-32 h-3 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    {/* Identity */}
                    <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    {/* Activity */}
                    <TableCell><div className="w-28 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    {/* Joined */}
                    <TableCell><div className="w-20 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    {/* Actions */}
                    <TableCell><div className="w-8 h-4 bg-muted rounded animate-pulse ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                (data?.users || []).map((user: ProfileRow) => (
                  <TableRow key={user.id}>
                    {/* User */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(user.display_name || user.full_name || user.email || '')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.display_name || user.full_name || '—'}</div>
                          <div className="text-sm text-muted-foreground">{user.email || '—'}</div>
                        </div>
                      </div>
                    </TableCell>
                    {/* Identity */}
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {user.full_name || user.display_name || '—'}
                      </div>
                    </TableCell>
                    {/* Activity */}
                    <TableCell className="text-sm text-muted-foreground">—</TableCell>
                    {/* Joined */}
                    <TableCell className="text-sm text-muted-foreground">
                      {user.created_at ? formatDate(user.created_at) : '—'}
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="text-right">
                      {/* Placeholder for future actions */}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {data && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {(() => {
                  const total = data.totalCount
                  const start = total === 0 ? 0 : (page - 1) * limit + 1
                  const end = Math.min(page * limit, total)
                  return `Showing ${start} to ${end} of ${total} users`
                })()}
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
                  disabled={page * limit >= (data.totalCount || 0)}
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