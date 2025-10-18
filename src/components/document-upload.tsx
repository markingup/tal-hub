/**
 * Document Upload Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Handle file uploads with drag-and-drop
 * - Work together: Composes with useUploadDocument hook
 * - Simple over complex: Clean UI with clear feedback
 * 
 * Features:
 * - Drag-and-drop file upload
 * - File type validation
 * - Upload progress indication
 * - Error handling
 */

'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react'
import { useUploadDocument } from '@/lib/hooks/useDocuments'
import { EmptyState } from '@/components/empty-state'
import { toast } from 'sonner'

interface DocumentUploadProps {
  caseId: string
  onUploadComplete?: () => void
}

interface UploadFile {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export function DocumentUpload({ caseId, onUploadComplete }: DocumentUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const uploadDocument = useUploadDocument()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending',
    }))

    setUploadFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4', '.avi', '.mov'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true,
  })

  const handleUpload = async (uploadFile: UploadFile) => {
    setUploadFiles(prev => 
      prev.map(f => f.id === uploadFile.id ? { ...f, status: 'uploading' } : f)
    )

    try {
      await uploadDocument.mutateAsync({
        caseId,
        file: uploadFile.file,
        onProgress: (progress) => {
          setUploadFiles(prev => 
            prev.map(f => f.id === uploadFile.id ? { ...f, progress } : f)
          )
        },
      })

      setUploadFiles(prev => 
        prev.map(f => f.id === uploadFile.id ? { ...f, status: 'success', progress: 100 } : f)
      )

      toast.success(`Uploaded ${uploadFile.file.name}`)
      onUploadComplete?.()
    } catch (error) {
      setUploadFiles(prev => 
        prev.map(f => f.id === uploadFile.id ? { 
          ...f, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Upload failed' 
        } : f)
      )

      toast.error(`Failed to upload ${uploadFile.file.name}`)
    }
  }

  const handleUploadAll = async () => {
    const pendingFiles = uploadFiles.filter(f => f.status === 'pending')
    
    for (const file of pendingFiles) {
      await handleUpload(file)
    }
  }

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (filename: string) => {
    const extension = filename.toLowerCase().split('.').pop()
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) {
      return <FileText className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const pendingCount = uploadFiles.filter(f => f.status === 'pending').length
  const uploadingCount = uploadFiles.filter(f => f.status === 'uploading').length

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
              }
            `}
            role="button"
            tabIndex={0}
            aria-label="Upload files by dragging and dropping or clicking to select"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                getRootProps().onClick?.()
              }
            }}
          >
            <input {...getInputProps()} aria-label="File input" />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to select files
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, DOCX, TXT, Images, Audio, Video, Archives (max 50MB each)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadFiles.length > 0 ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Files to Upload</h3>
              {pendingCount > 0 && (
                <Button 
                  onClick={handleUploadAll}
                  disabled={uploadingCount > 0}
                  size="sm"
                >
                  {uploadingCount > 0 && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Upload All ({pendingCount})
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(uploadFile.file.name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadFile.file.size)}
                    </p>
                    
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="mt-2 h-1" />
                    )}
                    
                    {uploadFile.status === 'error' && uploadFile.error && (
                      <p className="text-xs text-destructive mt-1">
                        {uploadFile.error}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {uploadFile.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpload(uploadFile)}
                        disabled={uploadingCount > 0}
                        aria-label={`Upload ${uploadFile.file.name}`}
                        className="min-h-[44px] min-w-[44px]"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {uploadFile.status === 'uploading' && (
                      <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    )}
                    
                    {uploadFile.status === 'success' && (
                      <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                    
                    {uploadFile.status === 'error' && (
                      <div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      </div>
                    )}
                    
                    {uploadFile.status !== 'uploading' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        aria-label={`Remove ${uploadFile.file.name}`}
                        className="min-h-[44px] min-w-[44px]"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Upload}
          title="No Files Selected"
          description="Drag and drop files here or click to select files to upload."
        />
      )}
    </div>
  )
}
