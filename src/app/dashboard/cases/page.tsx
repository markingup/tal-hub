'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Clock, CheckCircle, Archive, Loader2 } from 'lucide-react'
import { useCases, useCreateCase } from '@/lib/hooks/useCases'
import { CaseCard } from '@/components/case-card'
import { NewCaseDialog } from '@/components/new-case-dialog'
import { EmptyState } from '@/components/empty-state'
import { CaseCardSkeleton } from '@/components/ui/skeleton-list'
import { logger } from '@/lib/utils/logger'
import { toast } from 'sonner'
import type { CaseType } from '@/lib/supabase/types'

// Form validation schema
const newCaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  type: z.enum(['non_payment', 'repossession', 'renovation', 'rent_increase', 'repairs', 'other']),
  opposing_party_name: z.string().min(1, 'Opposing party name is required').max(255, 'Name is too long'),
  tal_dossier_number: z.string().optional(),
  next_hearing_date: z.string().optional(),
  notes: z.string().optional(),
})

type NewCaseFormData = z.infer<typeof newCaseSchema>

const caseTypeOptions: { value: CaseType; label: string }[] = [
  { value: 'non_payment', label: 'Non-Payment' },
  { value: 'repossession', label: 'Repossession' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'rent_increase', label: 'Rent Increase' },
  { value: 'repairs', label: 'Repairs' },
  { value: 'other', label: 'Other' },
]

// Reusable form component for case creation
function NewCaseDialogContent({ onClose }: { onClose: () => void }) {
  const createCase = useCreateCase()

  const form = useForm<NewCaseFormData>({
    resolver: zodResolver(newCaseSchema),
    defaultValues: {
      title: '',
      type: 'non_payment',
      opposing_party_name: '',
      tal_dossier_number: '',
      next_hearing_date: '',
      notes: '',
    },
  })

  const onSubmit = async (data: NewCaseFormData) => {
    try {
      await createCase.mutateAsync({
        title: data.title,
        type: data.type,
        opposing_party_name: data.opposing_party_name,
        tal_dossier_number: data.tal_dossier_number || null,
        next_hearing_date: data.next_hearing_date || null,
        notes: data.notes || null,
      })
      
      toast.success('Case created successfully')
      form.reset()
      onClose()
    } catch (error) {
      toast.error('Failed to create case. Please try again.')
      logger.componentError('NewCaseDialogContent', 'createCase', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Case Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Title *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter case title..." 
                  {...field} 
                  disabled={createCase.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Case Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Type *</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={createCase.isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {caseTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Opposing Party Name */}
        <FormField
          control={form.control}
          name="opposing_party_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opposing Party Name *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter opposing party name..." 
                  {...field} 
                  disabled={createCase.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dossier Number */}
        <FormField
          control={form.control}
          name="tal_dossier_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TAL Dossier Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter dossier number (optional)..." 
                  {...field} 
                  disabled={createCase.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Next Hearing Date */}
        <FormField
          control={form.control}
          name="next_hearing_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Hearing Date</FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field} 
                  disabled={createCase.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Additional notes (optional)..." 
                  {...field} 
                  disabled={createCase.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Display */}
        {createCase.error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {createCase.error.message}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createCase.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createCase.isPending}>
            {createCase.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {createCase.isPending ? 'Creating...' : 'Create Case'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

/**
 * Cases Page
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display and manage user cases
 * - Simple over complex: Clean tabbed interface
 * - Work together: Composes with dashboard layout and case components
 * 
 * Features:
 * - Tabbed navigation for different case views
 * - Real-time case data from Supabase
 * - Case creation dialog
 * - Quick actions for case management
 */


export default function CasesPage() {
  const router = useRouter()
  const { data: cases = [], isLoading, error } = useCases()
  const [showNewCaseDialog, setShowNewCaseDialog] = useState(false)

  // Filter cases by status
  const draftCases = cases.filter(c => c.status === 'draft')
  const activeCases = cases.filter(c => c.status === 'active')
  const closedCases = cases.filter(c => c.status === 'closed')
  const archivedCases = cases.filter(c => c.status === 'archived')

  const handleViewCase = (caseId: string) => {
    router.push(`/dashboard/cases/${caseId}`)
  }

  const handleEditCase = () => {
    // TODO: Open edit dialog or navigate to edit page
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Cases</h1>
              <p className="text-muted-foreground">
                Manage and track your legal cases and projects
              </p>
            </div>
            <Button onClick={() => setShowNewCaseDialog(true)}>
              Create Case
            </Button>
          </div>
        </div>
        <CaseCardSkeleton count={6} />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Cases</h1>
              <p className="text-muted-foreground">
                Manage and track your legal cases and projects
              </p>
            </div>
            <Button onClick={() => setShowNewCaseDialog(true)}>
              Create Case
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Cases</h3>
            <p className="text-muted-foreground text-center">
              {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Cases</h1>
            <p className="text-muted-foreground">
              Manage and track your legal cases and projects
            </p>
          </div>
          <NewCaseDialog />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="all" className="text-xs sm:text-sm">All ({cases.length})</TabsTrigger>
          <TabsTrigger value="draft" className="text-xs sm:text-sm">Draft ({draftCases.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm">Active ({activeCases.length})</TabsTrigger>
          <TabsTrigger value="closed" className="text-xs sm:text-sm">Closed ({closedCases.length})</TabsTrigger>
          <TabsTrigger value="archived" className="text-xs sm:text-sm">Archived ({archivedCases.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cases.map((caseItem) => (
              <CaseCard 
                key={caseItem.id} 
                case={caseItem} 
                onView={handleViewCase}
                onEdit={handleEditCase}
              />
            ))}
          </div>
          {cases.length === 0 && (
            <EmptyState
              icon={FileText}
              title="No Cases Yet"
              description="Create your first case to get started with managing your legal matters."
              actionLabel="Create Case"
              onAction={() => setShowNewCaseDialog(true)}
            />
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {draftCases.map((caseItem) => (
              <CaseCard 
                key={caseItem.id} 
                case={caseItem} 
                onView={handleViewCase}
                onEdit={handleEditCase}
              />
            ))}
          </div>
          {draftCases.length === 0 && (
            <EmptyState
              icon={FileText}
              title="No Draft Cases"
              description="You don&apos;t have any draft cases at the moment. Create a new case to get started."
              actionLabel="Create Case"
              onAction={() => setShowNewCaseDialog(true)}
            />
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeCases.map((caseItem) => (
              <CaseCard 
                key={caseItem.id} 
                case={caseItem} 
                onView={handleViewCase}
                onEdit={handleEditCase}
              />
            ))}
          </div>
          {activeCases.length === 0 && (
            <EmptyState
              icon={Clock}
              title="No Active Cases"
              description="You don&apos;t have any active cases at the moment. Create a new case or update existing ones to active status."
              actionLabel="Create Case"
              onAction={() => setShowNewCaseDialog(true)}
            />
          )}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {closedCases.map((caseItem) => (
              <CaseCard 
                key={caseItem.id} 
                case={caseItem} 
                onView={handleViewCase}
                onEdit={handleEditCase}
              />
            ))}
          </div>
          {closedCases.length === 0 && (
            <EmptyState
              icon={CheckCircle}
              title="No Closed Cases"
              description="You don&apos;t have any closed cases yet. Cases are marked as closed when they&apos;re resolved."
            />
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {archivedCases.map((caseItem) => (
              <CaseCard 
                key={caseItem.id} 
                case={caseItem} 
                onView={handleViewCase}
                onEdit={handleEditCase}
              />
            ))}
          </div>
          {archivedCases.length === 0 && (
            <EmptyState
              icon={Archive}
              title="No Archived Cases"
              description="You don&apos;t have any archived cases. Cases are archived when they&apos;re no longer needed."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Controlled New Case Dialog */}
      <Dialog open={showNewCaseDialog} onOpenChange={setShowNewCaseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Case</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new legal case. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <NewCaseDialogContent onClose={() => setShowNewCaseDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
