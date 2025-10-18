/**
 * React Query Hooks for Messages Management
 * 
 * Follows UNIX principles:
 * - Single responsibility: Each hook handles one specific messaging operation
 * - Work together: Hooks compose cleanly via React Query
 * - Simple over complex: Clean, focused hooks with proper error handling
 * 
 * Features:
 * - Fetch messages for a case with real-time subscriptions
 * - Send new messages
 * - Real-time updates via Supabase subscriptions
 * - Proper loading states and error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message, MessageInsert, Tables } from '@/lib/supabase/types'

// Extended message type with sender profile information
export type MessageWithSender = Message & {
  sender: {
    id: string
    email: string
    full_name: string | null
  }
}

// Query keys for React Query cache management
const MESSAGE_QUERY_KEYS = {
  all: ['messages'] as const,
  byCase: (caseId: string) => [...MESSAGE_QUERY_KEYS.all, 'case', caseId] as const,
}

/**
 * Hook to fetch all messages for a specific case
 * Includes real-time subscriptions for new messages
 */
export function useMessages(caseId: string) {
  const queryClient = useQueryClient()
  const subscriptionRef = useRef<any>(null)

  const query = useQuery({
    queryKey: MESSAGE_QUERY_KEYS.byCase(caseId),
    queryFn: async (): Promise<MessageWithSender[]> => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            id,
            email,
            full_name
          )
        `)
        .eq('case_id', caseId)
        .order('created_at', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch messages: ${error.message}`)
      }

      return data || []
    },
    enabled: !!caseId,
    staleTime: 30 * 1000, // 30 seconds
  })

  // Set up real-time subscription
  useEffect(() => {
    if (!caseId) return

    const supabase = createClient()
    
    // Subscribe to new messages for this case
    subscriptionRef.current = supabase
      .channel(`messages:${caseId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `case_id=eq.${caseId}`,
        },
        (payload) => {
          // Invalidate and refetch messages when new message is inserted
          queryClient.invalidateQueries({ 
            queryKey: MESSAGE_QUERY_KEYS.byCase(caseId) 
          })
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [caseId, queryClient])

  return query
}

/**
 * Hook to send a new message
 * Automatically updates the cache with optimistic updates
 */
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      caseId, 
      content, 
      type = 'text' as const 
    }: { 
      caseId: string
      content: string
      type?: Message['type']
    }): Promise<MessageWithSender> => {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Send the message
      const messageData: MessageInsert = {
        case_id: caseId,
        sender_id: user.id,
        type,
        content,
      }

      const { data: newMessage, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            id,
            email,
            full_name
          )
        `)
        .single()

      if (error) {
        throw new Error(`Failed to send message: ${error.message}`)
      }

      return newMessage
    },
    onSuccess: (newMessage, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        MESSAGE_QUERY_KEYS.byCase(variables.caseId),
        (oldData: MessageWithSender[] | undefined) => {
          if (!oldData) return [newMessage]
          return [...oldData, newMessage]
        }
      )
    },
    onError: (_, variables) => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ 
        queryKey: MESSAGE_QUERY_KEYS.byCase(variables.caseId) 
      })
    },
  })
}

/**
 * Hook to get message statistics for a case
 * Returns count of messages and last message info
 */
export function useMessageStats(caseId: string) {
  return useQuery({
    queryKey: [...MESSAGE_QUERY_KEYS.byCase(caseId), 'stats'],
    queryFn: async () => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('messages')
        .select('id, created_at')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch message stats: ${error.message}`)
      }

      return {
        totalMessages: data?.length || 0,
        lastMessageAt: data?.[0]?.created_at || null,
      }
    },
    enabled: !!caseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
