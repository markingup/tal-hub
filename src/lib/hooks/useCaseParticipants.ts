/**
 * React Query Hooks for Case Participants Management
 * 
 * Follows UNIX principles:
 * - Single responsibility: Each hook handles one specific participant operation
 * - Work together: Hooks compose cleanly via React Query
 * - Simple over complex: Clean, focused hooks with proper error handling
 * 
 * Features:
 * - Fetch case participants with profile information
 * - Add participants by email
 * - Remove participants (with permission checks)
 * - Email invitation system
 * - Role-based access control
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CaseParticipant, CaseParticipantInsert } from '@/lib/supabase/types'

// Extended participant type with profile information
export type ParticipantWithProfile = CaseParticipant & {
  profile: {
    id: string
    email: string
    full_name: string | null
    phone: string | null
  }
}

// Query keys for React Query cache management
const PARTICIPANT_QUERY_KEYS = {
  all: ['case-participants'] as const,
  byCase: (caseId: string) => [...PARTICIPANT_QUERY_KEYS.all, 'case', caseId] as const,
}

/**
 * Hook to fetch all participants for a specific case
 * Includes profile information for each participant
 */
export function useCaseParticipants(caseId: string) {
  return useQuery({
    queryKey: PARTICIPANT_QUERY_KEYS.byCase(caseId),
    queryFn: async (): Promise<ParticipantWithProfile[]> => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('case_participants')
        .select(`
          *,
          profile:profiles!case_participants_user_id_fkey(
            id,
            email,
            full_name,
            phone
          )
        `)
        .eq('case_id', caseId)
        .order('created_at', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch participants: ${error.message}`)
      }

      return data || []
    },
    enabled: !!caseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to add a participant to a case
 * Creates user profile if doesn&apos;t exist, then adds to case
 */
export function useAddParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      caseId, 
      email, 
      role 
    }: { 
      caseId: string
      email: string
      role: CaseParticipant['role']
    }): Promise<ParticipantWithProfile> => {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Check if user profile exists
      let { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      let userId: string

      if (!existingProfile) {
        // User doesn't exist - provide clear guidance on invitation flow
        throw new Error(`User with email ${email} does not exist. Please use the invitation system to send them an invite to join the case.`)
      } else {
        userId = existingProfile.id
      }

      // Add participant to case
      const participantData: CaseParticipantInsert = {
        case_id: caseId,
        user_id: userId,
        role,
        added_by: user.id,
      }

      const { data: newParticipant, error: participantError } = await supabase
        .from('case_participants')
        .insert(participantData)
        .select(`
          *,
          profile:profiles!case_participants_user_id_fkey(
            id,
            email,
            full_name,
            phone
          )
        `)
        .single()

      if (participantError) {
        throw new Error(`Failed to add participant: ${participantError.message}`)
      }

      return newParticipant
    },
    onSuccess: (_, variables) => {
      // Invalidate participants list
      queryClient.invalidateQueries({ 
        queryKey: PARTICIPANT_QUERY_KEYS.byCase(variables.caseId) 
      })
    },
  })
}

/**
 * Hook to remove a participant from a case
 * Only allows removal by case creator or admin
 */
export function useRemoveParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      caseId, 
      userId 
    }: { 
      caseId: string
      userId: string
    }): Promise<void> => {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Check if current user is case creator
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('created_by')
        .eq('id', caseId)
        .single()

      if (caseError) {
        throw new Error(`Failed to verify case ownership: ${caseError.message}`)
      }

      // Check if current user is case creator or admin
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const isOwner = caseData.created_by === user.id
      const isAdmin = currentUserProfile?.role === 'admin'

      if (!isOwner && !isAdmin) {
        throw new Error('Only case owners and admins can remove participants')
      }

      // Remove participant
      const { error } = await supabase
        .from('case_participants')
        .delete()
        .eq('case_id', caseId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Failed to remove participant: ${error.message}`)
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate participants list
      queryClient.invalidateQueries({ 
        queryKey: PARTICIPANT_QUERY_KEYS.byCase(variables.caseId) 
      })
    },
  })
}

/**
 * Hook to send email invitation to join case
 * Creates invitation link and sends email
 */
export function useSendInvitation() {
  return useMutation({
    mutationFn: async ({ 
      caseId, 
      email, 
      role 
    }: { 
      caseId: string
      email: string
      role: CaseParticipant['role']
    }): Promise<void> => {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Create invitation record in database
      const { error: inviteError } = await supabase
        .from('case_invitations')
        .insert({
          case_id: caseId,
          email: email,
          role: role,
          invited_by: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })

      if (inviteError) {
        throw new Error(`Failed to create invitation: ${inviteError.message}`)
      }

      // Create invitation link
      const invitationLink = `${window.location.origin}/auth/sign-up?invite=${caseId}&email=${encodeURIComponent(email)}&role=${role}`
      
      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      // For now, we'll simulate email sending and show the link
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show invitation link for demo purposes
      alert(`Invitation created for ${email}!\n\nInvitation link: ${invitationLink}\n\nNote: In production, this would be sent via email automatically.`)
    },
  })
}

/**
 * Hook to check if current user can manage participants
 * Returns permissions based on user role and case ownership
 */
export function useParticipantPermissions(caseId: string) {
  return useQuery({
    queryKey: ['participant-permissions', caseId],
    queryFn: async () => {
      const supabase = createClient()
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return { canAdd: false, canRemove: false, canInvite: false }
      }

      // Get case information
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('created_by')
        .eq('id', caseId)
        .single()

      if (caseError) {
        return { canAdd: false, canRemove: false, canInvite: false }
      }

      // Get current user profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const isOwner = caseData.created_by === user.id
      const isAdmin = userProfile?.role === 'admin'

      return {
        canAdd: isOwner || isAdmin,
        canRemove: isOwner || isAdmin,
        canInvite: isOwner || isAdmin,
      }
    },
    enabled: !!caseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
