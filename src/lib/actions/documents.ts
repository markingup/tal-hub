/**
 * Document Server Actions
 * 
 * Follows UNIX principles:
 * - Single responsibility: Secure document operations
 * - Text as interface: JSON responses
 * - Simple over complex: Clean server-side API
 * 
 * Features:
 * - Generate signed URLs for secure downloads
 * - Server-side validation and security
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/utils/logger'

export async function generateDownloadUrl(documentId: string) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get document with case info to verify access
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select(`
        *,
        case:cases!documents_case_id_fkey (
          id
        )
      `)
      .eq('id', documentId)
      .single()

    if (documentError || !document) {
      throw new Error('Document not found')
    }

    // Check if user is admin first
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    // If not admin, verify user has access to this case
    if (!isAdmin) {
      const { data: participant, error: participantError } = await supabase
        .from('case_participants')
        .select('user_id')
        .eq('case_id', document.case_id)
        .eq('user_id', user.id)
        .single()

      if (participantError) {
        throw new Error('Access denied')
      }
    }

    // Generate signed URL (valid for 1 hour)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('talhub-docs')
      .createSignedUrl(document.storage_path, 3600)

    if (urlError) {
      throw new Error('Failed to generate download URL')
    }

    return {
      success: true,
      url: signedUrlData.signedUrl,
      filename: document.name,
    }
  } catch (error) {
    logger.error('Error generating download URL', error, { documentId })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function deleteDocument(documentId: string) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get document to verify ownership and get storage path
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('storage_path, case_id, user_id')
      .eq('id', documentId)
      .single()

    if (documentError || !document) {
      throw new Error('Document not found')
    }

    // Verify user owns the document or is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (document.user_id !== user.id && profile?.role !== 'admin') {
      throw new Error('Access denied')
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('talhub-docs')
      .remove([document.storage_path])

    if (storageError) {
      throw new Error('Failed to delete file from storage')
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)

    if (dbError) {
      throw new Error('Failed to delete document record')
    }

    // Revalidate the case page
    revalidatePath(`/dashboard/cases/${document.case_id}`)

    return {
      success: true,
      message: 'Document deleted successfully',
    }
  } catch (error) {
    logger.error('Error deleting document', error, { documentId })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
