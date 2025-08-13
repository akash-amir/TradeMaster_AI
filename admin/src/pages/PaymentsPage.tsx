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
import { MoreHorizontal, CreditCard, RefreshCw, Download, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Payment } from '@/types'

export default function PaymentsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ['payments', { statusFilter, dateFrom, dateTo, page }],
    queryFn: () => adminApi.getPayments({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page,
      limit: 20,
    }),
  })

  const refundPaymentMutation = useMutation({
    mutationFn: ({ paymentId, amount, reason }: { paymentId: string; amount?: number; reason?: string }) =>
      adminApi.refundPayment(paymentId, amount, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      toast({
        title: 'Refund processed',
        description: 'Payment has been successfully refunded.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to process refund',
        variant: 'destructive',
      })
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Succeeded</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'refunded':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleExport = async () => {
    try {
      const blob = await adminApi.exportData('payments', 'csv')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: 'Export successful',
        description: 'Payments data has been exported to CSV.',
      })
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export payments data.',
        variant: 'destructive',
      })
    }
  }

  // Calculate stats from payments data
  const stats = paymentsData?.payments.reduce((acc, payment: Payment) => {
    acc.total += payment.amount
    if (payment.status === 'succeeded') acc.succeeded += payment.amount
    if (payment.status === 'failed') acc.failed += 1
    if (payment.status === 'refunded') acc.refunded += payment.amount
    return acc
  }, { total: 0, succeeded: 0, failed: 0, refunded: 0 }) || { total: 0, succeeded: 0, failed: 0, refunded: 0 }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Monitor transactions and process refunds</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Payments
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.succeeded)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentsData?.payments.filter((p: Payment) => p.status === 'succeeded').length || 0} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.refunded)}</div>
            <p className="text-xs text-muted-foreground">
              {paymentsData?.payments.filter((p: Payment) => p.status === 'refunded').length || 0} refunds
            </p>
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
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="From date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[180px]"
            />
            <Input
              type="date"
              placeholder="To date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[180px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            {paymentsData?.pagination.totalCount || 0} total payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
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
                    <TableCell><div className="w-20 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-8 h-4 bg-muted rounded animate-pulse ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                paymentsData?.payments.map((payment: Payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.user.displayName}</div>
                        <div className="text-sm text-muted-foreground">{payment.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(payment.amount)}</div>
                      <div className="text-xs text-muted-foreground uppercase">{payment.currency}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">{payment.description}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(payment.createdAt)}
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
                          {payment.status === 'succeeded' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Refund Payment
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Refund Payment</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to refund {formatCurrency(payment.amount)} to {payment.user.displayName}?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => refundPaymentMutation.mutate({ 
                                      paymentId: payment.id,
                                      reason: 'Admin refund'
                                    })}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Process Refund
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          <DropdownMenuItem>
                            View in Stripe
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
          {paymentsData?.pagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, paymentsData.pagination.totalCount)} of {paymentsData.pagination.totalCount} payments
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
                  disabled={page >= paymentsData.pagination.totalPages}
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