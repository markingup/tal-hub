/**
 * MessageInput Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Handle message input and sending
 * - Work together: Composes with useSendMessage hook
 * - Simple over complex: Clean input with essential features
 * 
 * Features:
 * - Text input with send button
 * - File attachment support (reuses document upload)
 * - Enter key to send
 * - Loading states
 * - Input validation
 */

'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Paperclip, Send, Loader2, X } from 'lucide-react'
import { useSendMessage } from '@/lib/hooks/useMessages'
import { logger } from '@/lib/utils/logger'

interface MessageInputProps {
  caseId: string
  onFileUpload?: (file: File) => Promise<void>
}

export function MessageInput({ caseId, onFileUpload }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const sendMessage = useSendMessage()

  const handleSend = async () => {
    if (!message.trim() && !selectedFile) return

    try {
      // Send text message if there's text
      if (message.trim()) {
        await sendMessage.mutateAsync({
          caseId,
          content: message.trim(),
          type: 'text',
        })
        setMessage('')
      }

      // Upload file if there's a file
      if (selectedFile && onFileUpload) {
        await onFileUpload(selectedFile)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      logger.componentError('MessageInput', 'sendMessage', error, { caseId })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isDisabled = (!message.trim() && !selectedFile) || sendMessage.isPending

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Selected file preview */}
        {selectedFile && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Paperclip className="h-4 w-4 text-text-secondary" />
            <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeSelectedFile}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Input area */}
        <div className="flex gap-2">
          {/* File attachment button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={sendMessage.isPending}
            className="shrink-0 min-h-[44px] min-w-[44px]"
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
          />

          {/* Message input */}
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={sendMessage.isPending}
            className="flex-1 min-h-[44px]"
            aria-label="Message input"
          />

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={isDisabled}
            size="sm"
            className="shrink-0 min-h-[44px] min-w-[44px]"
            aria-label="Send message"
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Help text */}
        <p className="text-xs text-text-secondary">
          Press Enter to send • Attach files using the paperclip icon
        </p>
      </CardContent>
    </Card>
  )
}
