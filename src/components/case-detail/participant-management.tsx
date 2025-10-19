import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  Plus,
  Mail,
  Trash2,
  Loader2
} from 'lucide-react'
import { useAddParticipant, useRemoveParticipant, useSendInvitation, useParticipantPermissions } from '@/lib/hooks/useCaseParticipants'
import { EmptyState } from '@/components/empty-state'
import { ParticipantListSkeleton } from '@/components/ui/skeleton-list'
import { toast } from 'sonner'
import type { CaseParticipant } from '@/lib/supabase/types'

const roleConfig = {
  tenant: 'Tenant',
  landlord: 'Landlord',
  lawyer: 'Lawyer',
  admin: 'Admin',
}

/**
 * Participant Management Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Manage case participants
 * - Work together: Composes with hooks and components
 * - Simple over complex: Clean, focused functionality
 */
export function ParticipantManagement({ 
  caseId, 
  participants = [], 
  isLoading = false 
}: { 
  caseId: string
  participants: Array<CaseParticipant & { profile: { full_name: string | null; email: string } }>
  isLoading?: boolean
}) {
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false)
  const [newParticipantEmail, setNewParticipantEmail] = useState('')
  const [newParticipantRole, setNewParticipantRole] = useState<CaseParticipant['role']>('tenant')

  // Mutation hooks
  const addParticipant = useAddParticipant()
  const removeParticipant = useRemoveParticipant()
  const sendInvitation = useSendInvitation()
  const { data: permissions } = useParticipantPermissions(caseId)

  const handleAddParticipant = async () => {
    if (!newParticipantEmail.trim()) return

    try {
      await addParticipant.mutateAsync({
        caseId,
        email: newParticipantEmail.trim(),
        role: newParticipantRole,
      })
      
      // Send invitation
      await sendInvitation.mutateAsync({
        caseId,
        email: newParticipantEmail.trim(),
        role: newParticipantRole,
      })

      toast.success(`Participant added and invitation sent to ${newParticipantEmail}`)
      setNewParticipantEmail('')
      setNewParticipantRole('tenant')
      setIsAddParticipantOpen(false)
    } catch (error) {
      toast.error('Failed to add participant. Please try again.')
    }
  }

  const handleRemoveParticipant = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this participant?')) return

    try {
      await removeParticipant.mutateAsync({ caseId, userId })
      toast.success('Participant removed successfully')
    } catch (error) {
      toast.error('Failed to remove participant. Please try again.')
    }
  }

  const handleSendInvitation = async (email: string, role: CaseParticipant['role']) => {
    try {
      await sendInvitation.mutateAsync({ caseId, email, role })
      toast.success(`Invitation sent to ${email}`)
    } catch (error) {
      toast.error('Failed to send invitation. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participants
          </CardTitle>
          <CardDescription>
            People involved in this case
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ParticipantListSkeleton count={2} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants
            </CardTitle>
            <CardDescription>
              People involved in this case
            </CardDescription>
          </div>
          
          {permissions?.canAdd && (
            <Dialog open={isAddParticipantOpen} onOpenChange={setIsAddParticipantOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Participant
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Participant</DialogTitle>
                  <DialogDescription>
                    Add a new participant to this case. They will receive an email invitation.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="participant@example.com"
                      value={newParticipantEmail}
                      onChange={(e) => setNewParticipantEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newParticipantRole} onValueChange={(value: CaseParticipant['role']) => setNewParticipantRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tenant">Tenant</SelectItem>
                        <SelectItem value="landlord">Landlord</SelectItem>
                        <SelectItem value="lawyer">Lawyer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddParticipantOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddParticipant}
                    disabled={!newParticipantEmail.trim() || addParticipant.isPending}
                  >
                    {addParticipant.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Participant
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.user_id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">
                  {participant.profile.full_name || participant.profile.email}
                </p>
                <p className="text-sm text-text-secondary">
                  {participant.profile.email}
                </p>
                <Badge variant="outline" className="text-xs">
                  {roleConfig[participant.role]}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSendInvitation(participant.profile.email, participant.role)}
                  disabled={sendInvitation.isPending}
                  aria-label={`Send invitation to ${participant.profile.email}`}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                
                {permissions?.canRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveParticipant(participant.user_id)}
                    disabled={removeParticipant.isPending}
                    aria-label={`Remove participant ${participant.profile.full_name || participant.profile.email}`}
                    className="min-h-[44px] min-w-[44px]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {participants.length === 0 && (
            <EmptyState
              icon={Users}
              title="No Participants Yet"
              description="Add participants to collaborate on this case and share access to documents and messages."
              actionLabel={permissions?.canAdd ? "Add Participant" : undefined}
              onAction={permissions?.canAdd ? () => setIsAddParticipantOpen(true) : undefined}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
