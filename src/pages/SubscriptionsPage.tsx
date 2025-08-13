import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
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
import { MoreHorizontal, Crown, X, TrendingUp, Calendar, Download } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Subscription } from '@/types'

export default function SubscriptionsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data: subscriptionsData, isLoading } = useQuery({
    queryKey: ['subscriptions', { statusFilter, planFilter, page }],
    queryFn: () => adminApi.getSubscriptions({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      plan: planFilter !== 'all' ? planFilter : undefined,
      page,
      limit: 20,
    }),
  })

  const cancelSubscriptionMutation = useMutation({
    mutationFn: ({ subscriptionId, immediate }: { subscriptionId: string; immediate: boolean }) =>
      adminApi.cancelSubscription(subscriptionId, immediate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      toast({
        title: 'Subscription cancelled',
        description: 'Subscription has been successfully cancelled.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel subscription',
        variant: 'destructive',
      })
    },
  })

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ subscriptionId, data }: { subscriptionId: string; data: any }) =>
      adminApi.updateSubscription(subscriptionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      toast({
        title: 'Subscription updated',
        description: 'Subscription has been successfully updated.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update subscription',
        variant: 'destructive',
      })
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      case 'past_due':
        return <Badge variant="secondary">Past Due</Badge>
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Trial</Badge>
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

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case 'premium':
        return '$79/month'
      case 'professional':
        return '$199/month'
      default:
        return 'Free'
    }
  }

  const handleExport = async () => {
    try {
      const blob = await adminApi.exportData('subscriptions', 'csv')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `subscriptions-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: 'Export successful',
        description: 'Subscriptions data has been exported to CSV.',
      })
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export subscriptions data.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-sm text-muted-foreground">Manage user subscription plans and billing</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionsData?.pagination.totalCount || 0}</div>
            <p className="text-xs text-muted-foreground">Active subscriptions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3%</div>
            <p className="text-xs text-muted-foreground">-0.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. LTV</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$890</div>
            <p className="text-xs text-muted-foreground">Customer lifetime value</p>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="trialing">Trialing</SelectItem>
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

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>
            {subscriptionsData?.pagination.totalCount || 0} total subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Period</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="w-32 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-8 h-4 bg-muted rounded animate-pulse ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                subscriptionsData?.subscriptions.map((subscription: Subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subscription.user.displayName}</div>
                        <div className="text-sm text-muted-foreground">{subscription.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getPlanBadge(subscription.plan)}
                        <div className="text-xs text-muted-foreground">
                          {getPlanPrice(subscription.plan)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(subscription.currentPeriodStart)}</div>
                        <div className="text-muted-foreground">
                          to {formatDate(subscription.currentPeriodEnd)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {subscription.plan === 'premium' ? '$79' : 
                         subscription.plan === 'professional' ? '$199' : '$0'}
                      </div>
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
                          <DropdownMenuItem
                            onClick={() => updateSubscriptionMutation.mutate({
                              subscriptionId: subscription.id,
                              data: { plan: 'premium' }
                            })}
                            disabled={subscription.plan === 'premium'}
                          >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Upgrade to Premium
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateSubscriptionMutation.mutate({
                              subscriptionId: subscription.id,
                              data: { plan: 'professional' }
                            })}
                            disabled={subscription.plan === 'professional'}
                          >
                            <Crown className="mr-2 h-4 w-4" />
                            Upgrade to Professional
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {subscription.status === 'active' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <X className="mr-2 h-4 w-4" />
                                  Cancel Subscription
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this subscription? The user will lose access at the end of their current billing period.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => cancelSubscriptionMutation.mutate({ 
                                      subscriptionId: subscription.id, 
                                      immediate: false 
                                    })}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Cancel Subscription
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
          {subscriptionsData?.pagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, subscriptionsData.pagination.totalCount)} of {subscriptionsData.pagination.totalCount} subscriptions
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
                  disabled={page >= subscriptionsData.pagination.totalPages}
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