/**
 * Deadlines Hooks
 * 
 * Follows UNIX principles:
 * - Single responsibility: Each hook handles one specific deadline operation
 * - Work together: Hooks compose cleanly via React Query
 * - Simple over complex: Clean CRUD operations with proper error handling
 * 
 * Features:
 * - Fetch deadlines for a case
 * - Add new deadlines
 * - Update deadline completion status
 * - Delete deadlines
 * - Fetch upcoming deadlines for dashboard banner
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Deadline, DeadlineInsert, DeadlineUpdate } from '@/lib/supabase/types'

const supabase = createClient()

// Query keys
const deadlineKeys = {
  all: ['deadlines'] as const,
  byCase: (caseId: string) => [...deadlineKeys.all, 'case', caseId] as const,
  upcoming: () => [...deadlineKeys.all, 'upcoming'] as const,
}

/**
 * Hook to fetch deadlines for a specific case
 */
export function useDeadlines(caseId: string) {
  return useQuery({
    queryKey: deadlineKeys.byCase(caseId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deadlines')
        .select(`
          *,
          profile:profiles!deadlines_created_by_fkey(full_name, email)
        `)
        .eq('case_id', caseId)
        .order('due_date', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch deadlines: ${error.message}`)
      }

      return data as (Deadline & { profile: { full_name: string | null; email: string } })[]
    },
    enabled: !!caseId,
  })
}

/**
 * Hook to add a new deadline
 */
export function useAddDeadline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (deadline: DeadlineInsert) => {
      const { data, error } = await supabase
        .from('deadlines')
        .insert(deadline)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to add deadline: ${error.message}`)
      }

      return data
    },
    onSuccess: (data) => {
      // Invalidate and refetch deadlines for this case
      queryClient.invalidateQueries({
        queryKey: deadlineKeys.byCase(data.case_id),
      })
      // Also invalidate upcoming deadlines for dashboard banner
      queryClient.invalidateQueries({
        queryKey: deadlineKeys.upcoming(),
      })
    },
  })
}

/**
 * Hook to update a deadline
 */
export function useUpdateDeadline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DeadlineUpdate }) => {
      const { data, error } = await supabase
        .from('deadlines')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update deadline: ${error.message}`)
      }

      return data
    },
    onSuccess: (data) => {
      // Invalidate and refetch deadlines for this case
      queryClient.invalidateQueries({
        queryKey: deadlineKeys.byCase(data.case_id),
      })
      // Also invalidate upcoming deadlines for dashboard banner
      queryClient.invalidateQueries({
        queryKey: deadlineKeys.upcoming(),
      })
    },
  })
}

/**
 * Hook to delete a deadline
 */
export function useDeleteDeadline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, caseId }: { id: string; caseId: string }) => {
      const { error } = await supabase
        .from('deadlines')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to delete deadline: ${error.message}`)
      }

      return { id, caseId }
    },
    onSuccess: ({ caseId }) => {
      // Invalidate and refetch deadlines for this case
      queryClient.invalidateQueries({
        queryKey: deadlineKeys.byCase(caseId),
      })
      // Also invalidate upcoming deadlines for dashboard banner
      queryClient.invalidateQueries({
        queryKey: deadlineKeys.upcoming(),
      })
    },
  })
}

/**
 * Hook to fetch upcoming deadlines (within 48 hours) for dashboard banner
 */
export function useUpcomingDeadlines() {
  return useQuery({
    queryKey: deadlineKeys.upcoming(),
    queryFn: async () => {
      const now = new Date()
      const fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000)

      const { data, error } = await supabase
        .from('deadlines')
        .select(`
          *,
          case:cases!deadlines_case_id_fkey(title, id),
          profile:profiles!deadlines_created_by_fkey(full_name, email)
        `)
        .eq('is_done', false)
        .gte('due_date', now.toISOString())
        .lt('due_date', fortyEightHoursFromNow.toISOString())
        .order('due_date', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch upcoming deadlines: ${error.message}`)
      }

      return data as (Deadline & { 
        case: { title: string; id: string }
        profile: { full_name: string | null; email: string }
      })[]
    },
  })
}

/**
 * Utility function to get deadline status based on due date
 */
export function getDeadlineStatus(dueDate: string, isDone: boolean): 'overdue' | 'due-soon' | 'completed' | 'upcoming' {
  if (isDone) return 'completed'
  
  const now = new Date()
  const due = new Date(dueDate)
  const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (diffHours < 0) return 'overdue'
  if (diffHours <= 48) return 'due-soon'
  return 'upcoming'
}

/**
 * Utility function to get deadline status color
 */
export function getDeadlineStatusColor(status: 'overdue' | 'due-soon' | 'completed' | 'upcoming'): string {
  switch (status) {
    case 'overdue':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'due-soon':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'completed':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'upcoming':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}
