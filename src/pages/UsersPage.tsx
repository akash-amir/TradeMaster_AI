import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
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
import { MoreHorizontal, Search, UserCheck, UserX, RotateCcw, Eye, Download } from 'lucide-react'
import { formatDate, getInitials } from '@/lib/utils'
import type { User } from '@/types'

export default function UsersPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', { search, statusFilter, planFilter, page }],
    queryFn: () => adminApi.getUsers({
      search: search || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      plan: planFilter !== 'all' ? planFilter : undefined,
      page,
      limit: 20,
    }),
  })

  const suspendUserMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) =>
      adminApi.suspendUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'User suspended',
        description: 'User has been successfully suspended.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to suspend user',
        variant: 'destructive',
      })
    },
  })

  const activateUserMutation = useMutation({
    mutationFn: adminApi.activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'User activated',
        description: 'User has been successfully activated.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to activate user',
        variant: 'destructive',
      })
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: adminApi.resetUserPassword,
    onSuccess: () => {
      toast({
        title: 'Password reset',
        description: 'Password reset email has been sent to the user.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reset password',
        variant: 'destructive',
      })
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free':
        return <Badge variant="outline">Free</Badge>
      case 'premium':
        return <Badge className="bg-primary text-primary-foreground">Premium</Badge>
      case 'professional':
        return <Badge className="bg-blue-600 text-white">Professional</Badge>
      default:
        return <Badge variant="outline">{plan}</Badge>
    }
  }

  const handleExport = async () => {
    try {
      const blob = await adminApi.exportData('users', 'csv')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: 'Export successful',
        description: 'Users data has been exported to CSV.',
      })
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export users data.',
        variant: 'destructive',
      })
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
                placeholder="Search users by email or name..."
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
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            {usersData?.pagination.totalCount || 0} total users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-1">
                          <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                          <div className="w-32 h-3 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-20 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-20 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-8 h-4 bg-muted rounded animate-pulse ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                usersData?.users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(user.subscription.plan)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.metadata?.totalTrades || 0} trades</div>
                        <div className="text-muted-foreground">
                          {user.lastLogin ? `Active ${formatDate(user.lastLogin)}` : 'Never logged in'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
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
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend User
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Suspend User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to suspend {user.displayName}? They will lose access to their account.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => suspendUserMutation.mutate({ userId: user.id })}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Suspend
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => activateUserMutation.mutate(user.id)}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => resetPasswordMutation.mutate(user.id)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {usersData?.pagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, usersData.pagination.totalCount)} of {usersData.pagination.totalCount} users
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
                  disabled={page >= usersData.pagination.totalPages}
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