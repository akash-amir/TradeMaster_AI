import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { MoreHorizontal, Key, X, BarChart3, Search, Activity, Shield, AlertTriangle } from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'
import type { APIKey } from '@/types'

export default function APIKeysPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data: apiKeysData, isLoading } = useQuery({
    queryKey: ['api-keys', { search, statusFilter, page }],
    queryFn: () => adminApi.getAPIKeys({
      userId: search || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page,
      limit: 20,
    }),
  })

  const revokeKeyMutation = useMutation({
    mutationFn: adminApi.revokeAPIKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
      toast({
        title: 'API key revoked',
        description: 'API key has been successfully revoked.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to revoke API key',
        variant: 'destructive',
      })
    },
  })

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
    ) : (
      <Badge variant="destructive">Revoked</Badge>
    )
  }

  const getUsageBadge = (count: number) => {
    if (count > 10000) {
      return <Badge variant="destructive">High Usage</Badge>
    } else if (count > 1000) {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium Usage</Badge>
    } else {
      return <Badge variant="outline">Low Usage</Badge>
    }
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
            <div className="text-2xl font-bold">{apiKeysData?.pagination.totalCount || 0}</div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiKeysData?.apiKeys.filter((key: APIKey) => key.isActive).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(apiKeysData?.apiKeys.reduce((sum: number, key: APIKey) => sum + key.usageCount, 0) || 0)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Usage Keys</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiKeysData?.apiKeys.filter((key: APIKey) => key.usageCount > 10000).length || 0}
            </div>
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
                placeholder="Search by user email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            {apiKeysData?.pagination.totalCount || 0} total API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Key Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="w-32 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-20 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-20 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-20 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-8 h-4 bg-muted rounded animate-pulse ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                apiKeysData?.apiKeys.map((apiKey: APIKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{apiKey.user.displayName}</div>
                        <div className="text-sm text-muted-foreground">{apiKey.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{apiKey.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {apiKey.keyId}...
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(apiKey.isActive)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatNumber(apiKey.usageCount)}</div>
                        {getUsageBadge(apiKey.usageCount)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(apiKey.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Usage Stats
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {apiKey.isActive && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <X className="mr-2 h-4 w-4" />
                                  Revoke Key
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to revoke this API key? The user will lose API access immediately.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => revokeKeyMutation.mutate(apiKey.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Revoke Key
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {apiKeysData?.pagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, apiKeysData.pagination.totalCount)} of {apiKeysData.pagination.totalCount} API keys
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
                  disabled={page >= apiKeysData.pagination.totalPages}
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