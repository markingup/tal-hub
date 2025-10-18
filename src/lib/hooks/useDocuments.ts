/**
 * Documents Hook
 * 
 * Follows UNIX principles:
 * - Single responsibility: Document CRUD operations
 * - Work together: Composes with React Query for caching
 * - Text as interface: JSON responses
 * - Simple over complex: Clean API surface
 * 
 * Features:
 * - List documents for a case
 * - Upload documents to Supabase Storage
 * - Delete documents
 * - Generate signed URLs for downloads
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Document, DocumentInsert } from '@/lib/supabase/types'

// Query keys
const DOCUMENTS_QUERY_KEY = 'documents'

// Hook to list documents for a case
export function useDocuments(caseId: string) {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          profile:profiles!documents_user_id_fkey (
            id,
            email,
            full_name
          )
        `)
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as (Document & { profile: { id: string; email: string; full_name: string | null } })[]
    },
    enabled: !!caseId,
  })
}

// Hook to upload a document
export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      caseId, 
      file, 
      onProgress 
    }: { 
      caseId: string
      file: File
      onProgress?: (progress: number) => void
    }) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Generate storage path: {caseId}/{userId}/{timestamp}_{filename}
      const timestamp = Date.now()
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_') // Sanitize filename
      const storagePath = `${caseId}/${user.id}/${timestamp}_${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('talhub-docs')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Save metadata to documents table
      const documentData: DocumentInsert = {
        case_id: caseId,
        user_id: user.id,
        name: file.name,
        type: getFileType(file.name),
        storage_path: storagePath,
        size_bytes: file.size,
      }

      const { data: document, error: documentError } = await supabase
        .from('documents')
        .insert(documentData)
        .select(`
          *,
          profile:profiles!documents_user_id_fkey (
            id,
            email,
            full_name
          )
        `)
        .single()

      if (documentError) throw documentError

      return document as Document & { profile: { id: string; email: string; full_name: string | null } }
    },
    onSuccess: (data) => {
      // Invalidate and refetch documents for this case
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY, data.case_id] })
    },
  })
}

// Hook to delete a document
export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ documentId, caseId }: { documentId: string; caseId: string }) => {
      // Get document to find storage path
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('storage_path')
        .eq('id', documentId)
        .single()

      if (fetchError) throw fetchError

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('talhub-docs')
        .remove([document.storage_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)

      if (dbError) throw dbError

      return { documentId, caseId }
    },
    onSuccess: (data) => {
      // Invalidate and refetch documents for this case
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY, data.caseId] })
    },
  })
}

// Utility function to determine file type from filename
function getFileType(filename: string): 'lease' | 'notice' | 'photo' | 'invoice' | 'email' | 'audio' | 'video' | 'other' {
  // Handle edge cases: empty filename, no extension, or just a dot
  if (!filename || filename.trim() === '' || filename === '.') {
    return 'other'
  }
  
  const parts = filename.toLowerCase().split('.')
  const extension = parts.length > 1 ? parts.pop() : ''
  
  // Handle case where extension is empty or undefined
  if (!extension) {
    return 'other'
  }
  
  const typeMap: Record<string, 'lease' | 'notice' | 'photo' | 'invoice' | 'email' | 'audio' | 'video' | 'other'> = {
    // Legal documents
    'pdf': 'notice',
    'doc': 'notice',
    'docx': 'notice',
    'txt': 'notice',
    'rtf': 'notice',
    
    // Images
    'jpg': 'photo',
    'jpeg': 'photo',
    'png': 'photo',
    'gif': 'photo',
    'webp': 'photo',
    'svg': 'photo',
    
    // Audio
    'mp3': 'audio',
    'wav': 'audio',
    'm4a': 'audio',
    'aac': 'audio',
    
    // Video
    'mp4': 'video',
    'avi': 'video',
    'mov': 'video',
    'wmv': 'video',
    
    // Email files
    'eml': 'email',
    'msg': 'email',
    
    // Invoice/billing documents
    'xls': 'invoice',
    'xlsx': 'invoice',
    'csv': 'invoice',
  }
  
  return typeMap[extension] || 'other'
}

// Utility function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
