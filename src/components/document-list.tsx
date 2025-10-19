/**
 * Document List Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display and manage document list
 * - Work together: Composes with useDocuments hook and server actions
 * - Simple over complex: Clean table interface with clear actions
 * 
 * Features:
 * - List documents with metadata
 * - Download via signed URLs
 * - Delete documents
 * - Upload date and size display
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Trash2, 
  Calendar,
  User,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useDocuments, formatFileSize } from '@/lib/hooks/useDocuments'
import { generateDownloadUrl, deleteDocument } from '@/lib/actions/documents'
import { EmptyState } from '@/components/empty-state'
import { DocumentListSkeleton } from '@/components/ui/skeleton-list'
import { logger } from '@/lib/utils/logger'
import { toast } from 'sonner'
import type { Document } from '@/lib/supabase/types'

interface DocumentListProps {
  caseId: string
}

interface DocumentWithProfile extends Document {
  profile: {
    id: string
    email: string
    full_name: string | null
  }
}

export function DocumentList({ caseId }: DocumentListProps) {
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  
  const { data: documents = [], isLoading, error } = useDocuments(caseId)

  const handleDownload = async (document: DocumentWithProfile) => {
    setDownloadingIds(prev => new Set(prev).add(document.id))
    
    try {
      const result = await generateDownloadUrl(document.id)
      
      if (result.success && result.url) {
        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.href = result.url
        link.download = result.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success(`Downloaded ${result.filename}`)
      } else {
        throw new Error(result.error || 'Failed to generate download URL')
      }
    } catch (error) {
      logger.componentError('DocumentList', 'downloadDocument', error, { documentId: document.id })
      toast.error(`Failed to download ${document.name}`)
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(document.id)
        return newSet
      })
    }
  }

  const handleDelete = async (document: DocumentWithProfile) => {
    if (!confirm(`Are you sure you want to delete "${document.name}"?`)) {
      return
    }

    setDeletingIds(prev => new Set(prev).add(document.id))
    
    try {
      const result = await deleteDocument(document.id)
      
      if (result.success) {
        toast.success(`Deleted ${document.name}`)
      } else {
        throw new Error(result.error || 'Failed to delete document')
      }
    } catch (error) {
      logger.componentError('DocumentList', 'deleteDocument', error, { documentId: document.id })
      toast.error(`Failed to delete ${document.name}`)
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(document.id)
        return newSet
      })
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4 text-accent" />
      case 'image':
        return <FileText className="h-4 w-4 text-success" />
      case 'audio':
        return <FileText className="h-4 w-4 text-purple-500" />
      case 'video':
        return <FileText className="h-4 w-4 text-error" />
      case 'archive':
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <FileText className="h-4 w-4 text-text-secondary" />
    }
  }

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      document: 'Document',
      image: 'Image',
      audio: 'Audio',
      video: 'Video',
      archive: 'Archive',
      other: 'Other',
    }
    return typeLabels[type] || 'Other'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentListSkeleton count={4} />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Documents</h3>
          <p className="text-text-secondary text-center mb-4">
            {error instanceof Error ? error.message : 'Failed to load documents'}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No Documents"
        description="Upload documents to get started with managing your case files."
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((document) => (
            <div key={document.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              {/* File Icon */}
              <div className="flex-shrink-0">
                {getFileIcon(document.type)}
              </div>

              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{document.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(document.type)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(document.created_at)}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {document.profile.full_name || document.profile.email}
                  </div>
                  
                  <span>{formatFileSize(document.size_bytes)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(document)}
                  disabled={downloadingIds.has(document.id)}
                  aria-label={`Download ${document.name}`}
                  className="min-h-[44px] min-w-[44px]"
                >
                  {downloadingIds.has(document.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(document)}
                  disabled={deletingIds.has(document.id)}
                  aria-label={`Delete ${document.name}`}
                  className="min-h-[44px] min-w-[44px]"
                >
                  {deletingIds.has(document.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
