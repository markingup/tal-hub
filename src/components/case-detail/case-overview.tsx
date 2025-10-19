import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { FileText } from 'lucide-react'
import type { Case } from '@/lib/supabase/types'

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100', textColor: 'text-text-secondary' },
  active: { label: 'Active', color: 'bg-primary/10', textColor: 'text-primary' },
  closed: { label: 'Closed', color: 'bg-green-100', textColor: 'text-success' },
  archived: { label: 'Archived', color: 'bg-gray-50', textColor: 'text-text-secondary' },
}

const typeConfig = {
  non_payment: 'Non-Payment',
  repossession: 'Repossession',
  renovation: 'Renovation',
  rent_increase: 'Rent Increase',
  repairs: 'Repairs',
  other: 'Other',
}

/**
 * Case Overview Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display case information
 * - Work together: Composes with Card components
 * - Simple over complex: Clean, focused content
 */
export function CaseOverview({ caseData }: { caseData: Case }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Case Information
        </CardTitle>
        <CardDescription>
          Basic details about this case
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Title</Label>
          <p className="text-sm text-text-secondary">{caseData.title}</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Type</Label>
          <p className="text-sm text-text-secondary">{typeConfig[caseData.type]}</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <Badge variant="secondary" className={`${statusConfig[caseData.status].color} ${statusConfig[caseData.status].textColor} border-0`}>
            {statusConfig[caseData.status].label}
          </Badge>
        </div>
        
        {caseData.opposing_party_name && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Opposing Party</Label>
            <p className="text-sm text-text-secondary">{caseData.opposing_party_name}</p>
          </div>
        )}
        
        {caseData.tal_dossier_number && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">TAL Dossier Number</Label>
            <p className="text-sm text-text-secondary">{caseData.tal_dossier_number}</p>
          </div>
        )}
        
        {caseData.next_hearing_date && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Next Hearing</Label>
            <p className="text-sm text-text-secondary">
              {new Date(caseData.next_hearing_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}
        
        {caseData.notes && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notes</Label>
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{caseData.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
