/**
 * Deadline List Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display and manage deadlines for a case
 * - Work together: Composes with hooks and UI components
 * - Simple over complex: Clean list interface with focused functionality
 * 
 * Features:
 * - List deadlines sorted by due date
 * - Visual indicators (red overdue, yellow due soon, gray completed)
 * - Checkbox to mark complete/incomplete
 * - Edit/delete actions
 * - Add deadline button
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAutoAnimate } from '@/lib/hooks/useAutoAnimate'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useDeadlines, useUpdateDeadline, useDeleteDeadline, getDeadlineStatus, getDeadlineStatusColor } from '@/lib/hooks/useDeadlines'
import { AddDeadlineDialog } from '@/components/add-deadline-dialog'
import { EditDeadlineDialog } from '@/components/edit-deadline-dialog'
import { EmptyState } from '@/components/empty-state'
import { DeadlineListSkeleton } from '@/components/ui/skeleton-list'
import { toast } from 'sonner'
import { logger } from '@/lib/utils/logger'

interface DeadlineListProps {
  caseId: string
}

export function DeadlineList({ caseId }: DeadlineListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDeadline, setEditingDeadline] = useState<string | null>(null)
  const [parent] = useAutoAnimate()

  const { data: deadlines = [], isLoading, error } = useDeadlines(caseId)
  const updateDeadline = useUpdateDeadline()
  const deleteDeadline = useDeleteDeadline()

  const handleToggleComplete = async (deadlineId: string, isDone: boolean) => {
    try {
      await updateDeadline.mutateAsync({
        id: deadlineId,
        updates: { is_done: !isDone }
      })
      toast.success(isDone ? 'Deadline marked as incomplete' : 'Deadline marked as complete')
    } catch (error) {
      toast.error('Failed to update deadline')
      logger.componentError('DeadlineList', 'toggleDeadline', error)
    }
  }

  const handleDeleteDeadline = async (deadlineId: string) => {
    if (!confirm('Are you sure you want to delete this deadline?')) return

    try {
      await deleteDeadline.mutateAsync({ id: deadlineId, caseId })
      toast.success('Deadline deleted successfully')
    } catch (error) {
      toast.error('Failed to delete deadline')
      logger.componentError('DeadlineList', 'deleteDeadline', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    if (diffDays <= 7) return `In ${diffDays} days`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const getStatusIcon = (status: 'overdue' | 'due-soon' | 'completed' | 'upcoming') => {
    switch (status) {
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-error" />
      case 'due-soon':
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-text-secondary" />
      case 'upcoming':
        return <Clock className="h-4 w-4 text-accent" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Deadlines
          </CardTitle>
          <CardDescription>
            Important dates and deadlines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeadlineListSkeleton count={3} />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Deadlines
          </CardTitle>
          <CardDescription>
            Important dates and deadlines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to Load Deadlines</h3>
            <p className="text-text-secondary text-center mb-4">
              {error instanceof Error ? error.message : 'Failed to load deadlines'}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Deadlines
              </CardTitle>
              <CardDescription>
                Important dates and deadlines
              </CardDescription>
            </div>
            
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Deadline
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={parent} className="space-y-3">
            {deadlines.map((deadline) => {
              const status = getDeadlineStatus(deadline.due_date, deadline.is_done)
              const statusColor = getDeadlineStatusColor(status)
              
              return (
                <div
                  key={deadline.id}
                  className={`flex items-center gap-3 p-4 border rounded-lg ${statusColor}`}
                >
                  <Checkbox
                    checked={deadline.is_done}
                    onCheckedChange={() => handleToggleComplete(deadline.id, deadline.is_done)}
                    className="flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(status)}
                      <h4 className={`font-medium ${deadline.is_done ? 'line-through text-text-secondary' : ''}`}>
                        {deadline.title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {status}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Due: {formatDate(deadline.due_date)}
                    </p>
                    {deadline.profile && (
                      <p className="text-xs text-text-secondary">
                        Created by: {deadline.profile.full_name || deadline.profile.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingDeadline(deadline.id)}
                      aria-label={`Edit deadline: ${deadline.title}`}
                      className="min-h-[44px] min-w-[44px]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDeadline(deadline.id)}
                      disabled={deleteDeadline.isPending}
                      aria-label={`Delete deadline: ${deadline.title}`}
                      className="min-h-[44px] min-w-[44px]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            
            {deadlines.length === 0 && (
              <EmptyState
                icon={Calendar}
                title="No Deadlines Yet"
                description="Add deadlines to track important dates and milestones for this case."
                actionLabel="Add Deadline"
                onAction={() => setIsAddDialogOpen(true)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <AddDeadlineDialog
        caseId={caseId}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {editingDeadline && (
        <EditDeadlineDialog
          deadlineId={editingDeadline}
          open={!!editingDeadline}
          onOpenChange={(open) => !open && setEditingDeadline(null)}
        />
      )}
    </>
  )
}