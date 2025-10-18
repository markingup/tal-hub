/**
 * Add Deadline Dialog Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Handle adding new deadlines
 * - Work together: Composes with hooks and form components
 * - Simple over complex: Clean form interface with validation
 * 
 * Features:
 * - Form to add new deadline
 * - Title and due date inputs
 * - Form validation
 * - Error handling
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { useAddDeadline } from '@/lib/hooks/useDeadlines'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { logger } from '@/lib/utils/logger'

interface AddDeadlineDialogProps {
  caseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddDeadlineDialog({ caseId, open, onOpenChange }: AddDeadlineDialogProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  
  const addDeadline = useAddDeadline()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !dueDate) {
      toast.error('Please fill in all fields')
      return
    }

    if (!user) {
      toast.error('You must be logged in to add deadlines')
      return
    }

    try {
      await addDeadline.mutateAsync({
        case_id: caseId,
        title: title.trim(),
        due_date: dueDate,
        created_by: user.id,
        is_done: false
      })
      
      toast.success('Deadline added successfully')
      setTitle('')
      setDueDate('')
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to add deadline')
      logger.componentError('AddDeadlineDialog', 'addDeadline', error)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setDueDate('')
    onOpenChange(false)
  }

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Deadline</DialogTitle>
          <DialogDescription>
            Add a new deadline for this case. Set a title and due date.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Submit evidence, Court hearing, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim() || !dueDate || addDeadline.isPending}
            >
              {addDeadline.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Deadline
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}