/**
 * Case Card Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display case information in a card format
 * - Work together: Composes with other components via props
 * - Simple over complex: Clean, focused component
 * 
 * Features:
 * - Shows case title, type, status, and hearing date
 * - Quick actions for view/edit
 * - Responsive design
 * - Status indicators with colors
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Calendar, FileText } from 'lucide-react'
import type { Case, CaseStatus, CaseType } from '@/lib/supabase/types'

interface CaseCardProps {
  case: Case
  onView?: (caseId: string) => void
  onEdit?: (caseId: string) => void
}

const statusConfig: Record<CaseStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  active: { label: 'Active', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  closed: { label: 'Closed', color: 'text-green-600', bgColor: 'bg-green-100' },
  archived: { label: 'Archived', color: 'text-gray-500', bgColor: 'bg-gray-50' },
}

const typeConfig: Record<CaseType, { label: string; icon: typeof FileText }> = {
  non_payment: { label: 'Non-Payment', icon: FileText },
  repossession: { label: 'Repossession', icon: FileText },
  renovation: { label: 'Renovation', icon: FileText },
  rent_increase: { label: 'Rent Increase', icon: FileText },
  repairs: { label: 'Repairs', icon: FileText },
  other: { label: 'Other', icon: FileText },
}

export function CaseCard({ case: caseItem, onView, onEdit }: CaseCardProps) {
  const status = statusConfig[caseItem.status]
  const type = typeConfig[caseItem.type]
  const TypeIcon = type.icon

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{caseItem.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4" />
              <span>{type.label}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className={`${status.bgColor} ${status.color} border-0`}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Case Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          {caseItem.opposing_party_name && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Opposing Party:</span>
              <span>{caseItem.opposing_party_name}</span>
            </div>
          )}
          
          {caseItem.tal_dossier_number && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Dossier #:</span>
              <span>{caseItem.tal_dossier_number}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Next Hearing:</span>
            <span>{formatDate(caseItem.next_hearing_date)}</span>
          </div>
        </div>

        {/* Created Info */}
        <div className="flex items-center justify-center text-xs text-muted-foreground pt-2 border-t">
          <span>Created: {new Date(caseItem.created_at).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView?.(caseItem.id)}
            className="flex-1"
            aria-label={`View case: ${caseItem.title}`}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit?.(caseItem.id)}
            className="flex-1"
            aria-label={`Edit case: ${caseItem.title}`}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
