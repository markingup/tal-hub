/**
 * Case Detail Page
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display and manage individual case details
 * - Work together: Composes with hooks and components
 * - Simple over complex: Clean tabbed interface with focused functionality
 * 
 * Features:
 * - Tab navigation for different case views
 * - Overview tab with case info and participants
 * - Participant management with role-based permissions
 * - Email invitation system
 * - Responsive design
 */

'use client'

import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import { useCase } from '@/lib/hooks/useCases'
import { useCaseParticipants } from '@/lib/hooks/useCaseParticipants'
import { DocumentUpload } from '@/components/document-upload'
import { DocumentList } from '@/components/document-list'
import { MessagesTab } from '@/components/messages-tab'
import { DeadlineList } from '@/components/deadline-list'
import { CaseHeader } from '@/components/case-detail/case-header'
import { CaseOverview } from '@/components/case-detail/case-overview'
import { ParticipantManagement } from '@/components/case-detail/participant-management'


export default function CaseDetailPage() {
  const params = useParams()
  const caseId = params.caseId as string

  // Data hooks
  const { data: caseData, isLoading: caseLoading, error: caseError } = useCase(caseId)
  const { data: participants = [], isLoading: participantsLoading } = useCaseParticipants(caseId)

  // Loading state
  if (caseLoading || participantsLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
            </div>
          </div>
          
          <div className="border rounded-lg p-6">
            <div className="space-y-2 mb-4">
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-16 w-full bg-muted animate-pulse rounded" />
              <div className="h-16 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (caseError || !caseData) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Case Not Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The case you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }


  return (
    <div className="max-w-6xl mx-auto">
      <CaseHeader caseData={caseData} />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs sm:text-sm">Documents</TabsTrigger>
          <TabsTrigger value="messages" className="text-xs sm:text-sm">Messages</TabsTrigger>
          <TabsTrigger value="deadlines" className="text-xs sm:text-sm">Deadlines</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <CaseOverview caseData={caseData} />
            <ParticipantManagement 
              caseId={caseId} 
              participants={participants} 
              isLoading={participantsLoading} 
            />
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <DocumentUpload caseId={caseId} />
          <DocumentList caseId={caseId} />
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <MessagesTab caseId={caseId} />
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-6">
          <DeadlineList caseId={caseId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
