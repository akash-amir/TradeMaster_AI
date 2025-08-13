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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { MoreHorizontal, MessageSquare, Flag, Trash2, Eye, Search, Brain, Target, Lightbulb } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { FeedbackLog } from '@/types'

export default function FeedbackPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackLog | null>(null)

  const { data: feedbackData, isLoading } = useQuery({
    queryKey: ['feedback', { search, typeFilter, statusFilter, page }],
    queryFn: () => adminApi.getFeedbackLogs({
      userId: search || undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page,
      limit: 20,
    }),
  })

  const flagFeedbackMutation = useMutation({
    mutationFn: ({ feedbackId, reason }: { feedbackId: string; reason: string }) =>
      adminApi.flagFeedback(feedbackId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] })
      toast({
        title: 'Feedback flagged',
        description: 'Feedback has been flagged for review.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to flag feedback',
        variant: 'destructive',
      })
    },
  })

  const deleteFeedbackMutation = useMutation({
    mutationFn: adminApi.deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] })
      toast({
        title: 'Feedback deleted',
        description: 'Feedback has been permanently deleted.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete feedback',
        variant: 'destructive',
      })
    },
  })

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ai_analysis':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">AI Analysis</Badge>
      case 'trade_feedback':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Trade Feedback</Badge>
      case 'strategy_suggestion':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Strategy</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Processed</Badge>
      case 'flagged':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Flagged</Badge>
      case 'deleted':
        return <Badge variant="destructive">Deleted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai_analysis':
        return <Brain className="h-4 w-4" />
      case 'trade_feedback':
        return <Target className="h-4 w-4" />
      case 'strategy_suggestion':
        return <Lightbulb className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Feedback & Logs</h1>
        <p className="text-muted-foreground">Monitor AI-generated feedback and user interactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackData?.pagination.totalCount || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbackData?.feedback.filter((f: FeedbackLog) => f.type === 'ai_analysis').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Items</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbackData?.feedback.filter((f: FeedbackLog) => f.status === 'flagged').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbackData?.feedback.length > 0 
                ? Math.round(feedbackData.feedback.reduce((sum: number, f: FeedbackLog) => sum + f.confidence, 0) / feedbackData.feedback.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">AI confidence score</p>
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ai_analysis">AI Analysis</SelectItem>
                <SelectItem value="trade_feedback">Trade Feedback</SelectItem>
                <SelectItem value="strategy_suggestion">Strategy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Logs</CardTitle>
          <CardDescription>
            {feedbackData?.pagination.totalCount || 0} total feedback entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="w-32 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-24 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-40 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-16 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-20 h-4 bg-muted rounded animate-pulse" /></TableCell>
                    <TableCell><div className="w-8 h-4 bg-muted rounded animate-pulse ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                feedbackData?.feedback.map((feedback: FeedbackLog) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{feedback.user.displayName}</div>
                        <div className="text-sm text-muted-foreground">{feedback.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(feedback.type)}
                        {getTypeBadge(feedback.type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate text-sm">
                        {feedback.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{Math.round(feedback.confidence * 100)}%</div>
                        <div className={`w-2 h-2 rounded-full ${
                          feedback.confidence > 0.8 ? 'bg-green-500' :
                          feedback.confidence > 0.6 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(feedback.createdAt)}
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Full Content
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  {getTypeIcon(feedback.type)}
                                  Feedback Details
                                </DialogTitle>
                                <DialogDescription>
                                  {feedback.type.replace('_', ' ')} from {feedback.user.displayName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Content</h4>
                                  <div className="p-4 bg-muted/50 rounded-lg text-sm">
                                    {feedback.content}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-1">Confidence Score</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {Math.round(feedback.confidence * 100)}%
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-1">Trade ID</h4>
                                    <p className="text-sm text-muted-foreground font-mono">
                                      {feedback.tradeId}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuSeparator />
                          {feedback.status !== 'flagged' && (
                            <DropdownMenuItem
                              onClick={() => flagFeedbackMutation.mutate({ 
                                feedbackId: feedback.id, 
                                reason: 'Admin review' 
                              })}
                            >
                              <Flag className="mr-2 h-4 w-4" />
                              Flag for Review
                            </DropdownMenuItem>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Feedback
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to permanently delete this feedback? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteFeedbackMutation.mutate(feedback.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {feedbackData?.pagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, feedbackData.pagination.totalCount)} of {feedbackData.pagination.totalCount} feedback entries
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
                  disabled={page >= feedbackData.pagination.totalPages}
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