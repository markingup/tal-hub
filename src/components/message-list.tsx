/**
 * MessageList Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display list of messages with auto-scroll
 * - Work together: Composes with useMessages hook
 * - Simple over complex: Clean message display with minimal features
 * 
 * Features:
 * - Auto-scroll to bottom when new messages arrive
 * - Display sender name and timestamp
 * - Responsive design
 * - Loading and empty states
 */

'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useAutoAnimate } from '@/lib/hooks/useAutoAnimate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, MessageSquare, RefreshCw } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { MessageListSkeleton } from '@/components/ui/skeleton-list'
import { useMessages, type MessageWithSender } from '@/lib/hooks/useMessages'

interface MessageListProps {
  caseId: string
  currentUserId?: string
}

export function MessageList({ caseId, currentUserId }: MessageListProps) {
  const { data: messages = [], isLoading, error } = useMessages(caseId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [parent] = useAutoAnimate()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Loading state
  if (isLoading) {
    return (
      <Card className="flex-1">
        <CardContent className="p-4">
          <MessageListSkeleton count={5} />
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className="flex-1">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <MessageSquare className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to Load Messages</h3>
          <p className="text-text-secondary text-center mb-4">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No Messages Yet"
        description="Start the conversation by sending a message below."
        className="flex-1"
      />
    )
  }

  return (
    <Card className="flex-1 flex flex-col">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <div ref={parent} className="space-y-4">
          {messages.map((message) => (
            <MessageItem 
              key={message.id} 
              message={message} 
              isOwn={message.sender_id === currentUserId}
            />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </CardContent>
    </Card>
  )
}

interface MessageItemProps {
  message: MessageWithSender
  isOwn: boolean
}

function MessageItem({ message, isOwn }: MessageItemProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    }
  }

  const senderName = message.sender.full_name || message.sender.email
  const isSystemMessage = message.type === 'system'

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] space-y-1`}>
        {/* Sender name and timestamp */}
        {!isOwn && !isSystemMessage && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="font-medium">{senderName}</span>
            <span>•</span>
            <span>{formatTime(message.created_at)}</span>
          </div>
        )}
        
        {/* System message */}
        {isSystemMessage && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-xs">
              {message.content}
            </Badge>
          </div>
        )}
        
        {/* Regular message */}
        {!isSystemMessage && (
          <div
            className={`
              rounded-lg px-3 py-2 text-sm
              ${isOwn 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : 'bg-muted'
              }
            `}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
        
        {/* Timestamp for own messages */}
        {isOwn && !isSystemMessage && (
          <div className="text-right text-xs text-text-secondary">
            {formatTime(message.created_at)}
          </div>
        )}
      </div>
    </div>
  )
}
