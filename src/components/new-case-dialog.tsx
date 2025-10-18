/**
 * New Case Dialog Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Handle case creation form
 * - Work together: Composes with form components and hooks
 * - Simple over complex: Clean form with proper validation
 * 
 * Features:
 * - Form validation with Zod schema
 * - Required and optional fields
 * - Loading states and error handling
 * - Success feedback
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { logger } from '@/lib/utils/logger'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { useCreateCase } from '@/lib/hooks/useCases'
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

interface NewCaseDialogProps {
  children?: React.ReactNode
}

export function NewCaseDialog({ children }: NewCaseDialogProps) {
  const [open, setOpen] = useState(false)
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
      // Reset form and close dialog on success
      form.reset()
      setOpen(false)
    } catch (error) {
      // Provide more specific error messages
      let errorMessage = 'Failed to create case. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('not authenticated')) {
          errorMessage = 'Please sign in to create a case.'
        } else if (error.message.includes('Invalid session')) {
          errorMessage = 'Your session has expired. Please sign in again.'
        } else if (error.message.includes('row-level security policy')) {
          errorMessage = 'Permission denied. Please ensure you are signed in.'
        } else {
          errorMessage = `Failed to create case: ${error.message}`
        }
      }
      
      toast.error(errorMessage)
      logger.componentError('NewCaseDialog', 'createCase', error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createCase.isPending) {
      setOpen(newOpen)
      form.reset()
    } else if (newOpen) {
      setOpen(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new legal case. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

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
                onClick={() => handleOpenChange(false)}
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
      </DialogContent>
    </Dialog>
  )
}
