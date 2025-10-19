/**
 * Deadline Item Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display and manage individual deadline
 * - Work together: Composes with hooks for CRUD operations
 * - Simple over complex: Clean item interface with essential actions
 * 
 * Features:
 * - Display deadline information with status indicators
 * - Toggle completion status
 * - Edit deadline functionality
 * - Delete deadline with confirmation
 * - Visual status indicators
 */

'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Calendar as CalendarIcon, 
  Edit, 
  Trash2, 
  Loader2,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useUpdateDeadline, useDeleteDeadline, getDeadlineStatus, getDeadlineStatusColor } from '@/lib/hooks/useDeadlines'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/utils/logger'
import type { Deadline } from '@/lib/supabase/types'

interface DeadlineItemProps {
  deadline: Deadline & { profile: { full_name: string | null; email: string } }
}

export function DeadlineItem({ deadline }: DeadlineItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(deadline.title)
  const [editDueDate, setEditDueDate] = useState<Date>(new Date(deadline.due_date))
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(deadline.due_date))

  const updateDeadline = useUpdateDeadline()
  const deleteDeadline = useDeleteDeadline()

  const status = getDeadlineStatus(deadline.due_date, deadline.is_done)
  const statusColor = getDeadlineStatusColor(status)

  const handleToggleComplete = async () => {
    try {
      await updateDeadline.mutateAsync({
        id: deadline.id,
        updates: { is_done: !deadline.is_done },
      })
    } catch (error) {
      logger.componentError('DeadlineItem', 'updateDeadline', error)
    }
  }

  const handleEdit = async () => {
    try {
      await updateDeadline.mutateAsync({
        id: deadline.id,
        updates: {
          title: editTitle,
          due_date: editDueDate.toISOString(),
        },
      })
      setIsEditDialogOpen(false)
    } catch (error) {
      logger.componentError('DeadlineItem', 'updateDeadline', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteDeadline.mutateAsync({
        id: deadline.id,
        caseId: deadline.case_id,
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      logger.componentError('DeadlineItem', 'deleteDeadline', error)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setEditDueDate(date)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-error" />
      case 'due-soon':
        return <Clock className="h-4 w-4 text-warning" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-text-secondary" />
      default:
        return <CalendarIcon className="h-4 w-4 text-accent" />
    }
  }

  return (
    <>
      <div className={cn(
        'flex items-center justify-between p-3 border rounded-lg transition-colors',
        statusColor,
        deadline.is_done && 'opacity-75'
      )}>
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            checked={deadline.is_done}
            onCheckedChange={handleToggleComplete}
            disabled={updateDeadline.isPending}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <h4 className={cn(
                'font-medium truncate',
                deadline.is_done && 'line-through text-text-secondary'
              )}>
                {deadline.title}
              </h4>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-text-secondary">
                Due: {format(new Date(deadline.due_date), 'MMM d, yyyy')}
              </p>
              <Badge variant="outline" className="text-xs">
                {status === 'overdue' ? 'Overdue' : 
                 status === 'due-soon' ? 'Due Soon' :
                 status === 'completed' ? 'Completed' : 'Upcoming'}
              </Badge>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Created by {deadline.profile.full_name || deadline.profile.email}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            disabled={updateDeadline.isPending || deleteDeadline.isPending}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={updateDeadline.isPending || deleteDeadline.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Deadline</DialogTitle>
            <DialogDescription>
              Update the deadline details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Deadline title"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDate && 'text-text-secondary'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updateDeadline.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEdit}
              disabled={updateDeadline.isPending || !editTitle.trim()}
            >
              {updateDeadline.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Deadline</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deadline.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteDeadline.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteDeadline.isPending}
            >
              {deleteDeadline.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Deadline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
