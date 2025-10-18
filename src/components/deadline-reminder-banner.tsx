/**
 * Deadline Reminder Banner Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display upcoming deadline reminders
 * - Work together: Composes with hooks and UI components
 * - Simple over complex: Clean banner interface with focused functionality
 * 
 * Features:
 * - Shows deadlines due within 48 hours
 * - Visual indicators for urgency
 * - Click to navigate to case detail
 * - Dismissible banner
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  Calendar, 
  X, 
  Clock,
  ChevronRight
} from 'lucide-react'
import { useUpcomingDeadlines, getDeadlineStatus } from '@/lib/hooks/useDeadlines'
import { toast } from 'sonner'

export function DeadlineReminderBanner() {
  const router = useRouter()
  const [dismissed, setDismissed] = useState(false)
  const { data: upcomingDeadlines = [], isLoading } = useUpcomingDeadlines()

  if (isLoading || dismissed || upcomingDeadlines.length === 0) {
    return null
  }

  const handleViewCase = (caseId: string) => {
    router.push(`/dashboard/cases/${caseId}`)
  }

  const formatTimeRemaining = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffHours = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffHours <= 0) return 'Overdue'
    if (diffHours === 1) return '1 hour'
    if (diffHours < 24) return `${diffHours} hours`
    
    const diffDays = Math.ceil(diffHours / 24)
    if (diffDays === 1) return '1 day'
    return `${diffDays} days`
  }

  const getUrgencyColor = (deadline: { due_date: string; is_done: boolean }) => {
    const status = getDeadlineStatus(deadline.due_date, deadline.is_done)
    switch (status) {
      case 'overdue':
        return 'border-red-200 bg-red-50'
      case 'due-soon':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  const getUrgencyIcon = (deadline: { due_date: string; is_done: boolean }) => {
    const status = getDeadlineStatus(deadline.due_date, deadline.is_done)
    switch (status) {
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'due-soon':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <Card className="border-l-4 border-l-yellow-500 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-yellow-800">Upcoming Deadlines</h3>
                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                  {upcomingDeadlines.length} due soon
                </Badge>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                You have deadlines approaching within the next 48 hours.
              </p>
              
              <div className="space-y-2">
                {upcomingDeadlines.slice(0, 3).map((deadline) => (
                  <div
                    key={deadline.id}
                    className={`flex items-center justify-between p-2 rounded border ${getUrgencyColor(deadline)}`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getUrgencyIcon(deadline)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {deadline.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {deadline.case?.title} • Due in {formatTimeRemaining(deadline.due_date)}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewCase(deadline.case_id)}
                      className="flex-shrink-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {upcomingDeadlines.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{upcomingDeadlines.length - 3} more deadlines
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}