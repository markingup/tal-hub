/**
 * Edit Deadline Dialog Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Handle editing existing deadlines
 * - Work together: Composes with hooks and form components
 * - Simple over complex: Clean form interface with validation
 * 
 * Features:
 * - Form to edit existing deadline
 * - Pre-populated with current values
 * - Title and due date inputs
 * - Form validation
 * - Error handling
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { useUpdateDeadline } from '@/lib/hooks/useDeadlines'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { logger } from '@/lib/utils/logger'
import type { Deadline } from '@/lib/supabase/types'

interface EditDeadlineDialogProps {
  deadlineId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDeadlineDialog({ deadlineId, open, onOpenChange }: EditDeadlineDialogProps) {
  const [deadline, setDeadline] = useState<Deadline | null>(null)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  
  const updateDeadline = useUpdateDeadline()
  const supabase = createClient()

  useEffect(() => {
    if (open && deadlineId) {
      fetchDeadline()
    }
  }, [open, deadlineId])

  const fetchDeadline = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('deadlines')
        .select('*')
        .eq('id', deadlineId)
        .single()

      if (error) {
        throw error
      }

      setDeadline(data)
      setTitle(data.title)
      setDueDate(data.due_date.split('T')[0]) // Convert to date input format
    } catch (error) {
      toast.error('Failed to load deadline')
      logger.componentError('EditDeadlineDialog', 'fetchDeadline', error)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !dueDate) {
      toast.error('Please fill in all fields')
      return
    }

    if (!deadline) {
      toast.error('Deadline not found')
      return
    }

    try {
      await updateDeadline.mutateAsync({
        id: deadline.id,
        updates: {
          title: title.trim(),
          due_date: dueDate
        }
      })
      
      toast.success('Deadline updated successfully')
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to update deadline')
      logger.componentError('EditDeadlineDialog', 'updateDeadline', error)
    }
  }

  const handleCancel = () => {
    if (deadline) {
      setTitle(deadline.title)
      setDueDate(deadline.due_date.split('T')[0])
    }
    onOpenChange(false)
  }

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Deadline</DialogTitle>
          <DialogDescription>
            Update the deadline title and due date.
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
              disabled={!title.trim() || !dueDate || updateDeadline.isPending}
            >
              {updateDeadline.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Deadline
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
