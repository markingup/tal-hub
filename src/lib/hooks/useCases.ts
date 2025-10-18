/**
 * React Query Hooks for Cases Management
 * 
 * Follows UNIX principles:
 * - Single responsibility: Each hook handles one specific case operation
 * - Work together: Hooks compose cleanly via React Query
 * - Simple over complex: Clean, focused hooks with proper error handling
 * 
 * Features:
 * - Fetch user's cases with RLS filtering
 * - Create new cases with automatic participant addition
 * - Update existing cases
 * - Proper loading states and error handling
 * - Cache invalidation for real-time updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Case, CaseInsert, CaseUpdate, CaseParticipantInsert } from '@/lib/supabase/types'

// Query keys for React Query cache management
const CASE_QUERY_KEYS = {
  all: ['cases'] as const,
  userCases: () => [...CASE_QUERY_KEYS.all, 'user'] as const,
  caseById: (id: string) => [...CASE_QUERY_KEYS.all, 'detail', id] as const,
}

/**
 * Hook to fetch all cases for the current user
 * Uses RLS to filter cases where user is a participant
 */
export function useCases() {
  return useQuery({
    queryKey: CASE_QUERY_KEYS.userCases(),
    queryFn: async (): Promise<Case[]> => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch cases: ${error.message}`)
      }

      return data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single case by ID
 * Includes participant information
 */
export function useCase(id: string) {
  return useQuery({
    queryKey: CASE_QUERY_KEYS.caseById(id),
    queryFn: async (): Promise<Case | null> => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Case not found or no access
        }
        throw new Error(`Failed to fetch case: ${error.message}`)
      }

      return data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create a new case
 * Automatically adds the creator as a participant
 */
export function useCreateCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (caseData: Omit<CaseInsert, 'created_by'>): Promise<Case> => {
      const supabase = createClient()
      
      // Get current user with session refresh
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Verify user session is valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        throw new Error('Invalid session')
      }

      // Create the case
      const { data: newCase, error: caseError } = await supabase
        .from('cases')
        .insert({
          ...caseData,
          created_by: user.id,
        })
        .select()
        .single()

      if (caseError) {
        throw new Error(`Failed to create case: ${caseError.message}`)
      }

      // Add creator as participant
      const participantData: CaseParticipantInsert = {
        case_id: newCase.id,
        user_id: user.id,
        role: 'tenant', // Default role for case creator
        added_by: user.id,
      }

      const { error: participantError } = await supabase
        .from('case_participants')
        .insert(participantData)

      if (participantError) {
        // Clean up the case if participant creation fails
        await supabase.from('cases').delete().eq('id', newCase.id)
        throw new Error(`Failed to add participant: ${participantError.message}`)
      }

      return newCase
    },
    onSuccess: () => {
      // Invalidate and refetch cases list
      queryClient.invalidateQueries({ queryKey: CASE_QUERY_KEYS.userCases() })
    },
  })
}

/**
 * Hook to update an existing case
 * Only allows updates by case participants
 */
export function useUpdateCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string
      updates: CaseUpdate 
    }): Promise<Case> => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('cases')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update case: ${error.message}`)
      }

      return data
    },
    onSuccess: (updatedCase) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: CASE_QUERY_KEYS.userCases() })
      queryClient.invalidateQueries({ queryKey: CASE_QUERY_KEYS.caseById(updatedCase.id) })
    },
  })
}

/**
 * Hook to delete a case
 * Only allows deletion by case creator or admin
 */
export function useDeleteCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to delete case: ${error.message}`)
      }
    },
    onSuccess: () => {
      // Invalidate cases list
      queryClient.invalidateQueries({ queryKey: CASE_QUERY_KEYS.userCases() })
    },
  })
}

/**
 * Utility hook to get case statistics
 * Returns counts by status for dashboard overview
 */
export function useCaseStats() {
  return useQuery({
    queryKey: [...CASE_QUERY_KEYS.userCases(), 'stats'],
    queryFn: async () => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('cases')
        .select('status')

      if (error) {
        throw new Error(`Failed to fetch case stats: ${error.message}`)
      }

      // Count cases by status
      const validStatuses = ['active', 'draft', 'closed', 'archived'] as const
      const stats = data?.reduce((acc, caseItem) => {
        // Validate that caseItem has a valid status before incrementing
        if (caseItem && typeof caseItem.status === 'string' && caseItem.status.trim() !== '') {
          // Only count valid status values
          if (validStatuses.includes(caseItem.status as any)) {
            acc[caseItem.status] = (acc[caseItem.status] || 0) + 1
          }
        }
        return acc
      }, {} as Record<string, number>) || {}

      return {
        total: data?.length || 0,
        active: stats.active || 0,
        draft: stats.draft || 0,
        closed: stats.closed || 0,
        archived: stats.archived || 0,
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
