import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit } from 'lucide-react'
import type { Case } from '@/lib/supabase/types'

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-500', textColor: 'text-gray-600' },
  active: { label: 'Active', color: 'bg-blue-500', textColor: 'text-blue-600' },
  closed: { label: 'Closed', color: 'bg-green-500', textColor: 'text-green-600' },
  archived: { label: 'Archived', color: 'bg-gray-400', textColor: 'text-gray-500' },
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
 * Case Header Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display case header with navigation
 * - Work together: Composes with Button and Badge components
 * - Simple over complex: Clean, focused functionality
 */
export function CaseHeader({ caseData }: { caseData: Case }) {
  const router = useRouter()

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/dashboard/cases')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cases
        </Button>
      </div>
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{caseData.title}</h1>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className={`${statusConfig[caseData.status]?.color || 'bg-gray-500'} ${statusConfig[caseData.status]?.textColor || 'text-gray-600'} border-0`}>
              {statusConfig[caseData.status]?.label || 'Unknown'}
            </Badge>
            <span className="text-muted-foreground">
              {typeConfig[caseData.type]}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Case
          </Button>
        </div>
      </div>
    </div>
  )
}
