/**
 * MessagesTab Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Compose message list and input
 * - Work together: Combines MessageList and MessageInput components
 * - Simple over complex: Clean chat interface with focused functionality
 * 
 * Features:
 * - Complete messaging interface
 * - File upload integration
 * - Real-time updates
 * - Responsive design
 */

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageList } from '@/components/message-list'
import { MessageInput } from '@/components/message-input'
import { toast } from 'sonner'
import { logger } from '@/lib/utils/logger'

interface MessagesTabProps {
  caseId: string
}

export function MessagesTab({ caseId }: MessagesTabProps) {
  const [currentUserId, setCurrentUserId] = useState<string | undefined>()

  // Get current user ID on mount
  useState(() => {
    const getCurrentUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id)
    }
    getCurrentUser()
  })

  const handleFileUpload = async (file: File) => {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      // Generate unique filename
      const timestamp = Date.now()
      const fileName = `${timestamp}_${file.name}`
      const storagePath = `${caseId}/${user.id}/${fileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('talhub-docs')
        .upload(storagePath, file)

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`)
      }

      // Create document record
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          case_id: caseId,
          user_id: user.id,
          name: file.name,
          type: file.type || 'application/octet-stream',
          storage_path: storagePath,
          size_bytes: file.size,
        })

      if (docError) {
        // Clean up uploaded file if document record creation fails
        await supabase.storage.from('talhub-docs').remove([storagePath])
        throw new Error(`Failed to create document record: ${docError.message}`)
      }

      // Send system message about file upload
      await supabase
        .from('messages')
        .insert({
          case_id: caseId,
          sender_id: user.id,
          type: 'system',
          content: `📎 ${file.name} uploaded`,
        })

      toast.success('File uploaded successfully')
    } catch (error) {
      logger.componentError('MessagesTab', 'uploadFile', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload file')
      throw error
    }
  }

  return (
    <div className="space-y-4 h-[600px] flex flex-col">
      {/* Message list */}
      <div className="flex-1 min-h-0">
        <MessageList caseId={caseId} currentUserId={currentUserId} />
      </div>

      {/* Message input */}
      <MessageInput caseId={caseId} onFileUpload={handleFileUpload} />
    </div>
  )
}
