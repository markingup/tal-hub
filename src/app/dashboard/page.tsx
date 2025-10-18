'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/utils/logger'
import type { Database } from '@/lib/supabase/types'
import { FileText, Plus } from 'lucide-react'
import { DeadlineReminderBanner } from '@/components/deadline-reminder-banner'
import { LegalDisclaimer } from '@/components/legal-disclaimer'
import { NewCaseDialog } from '@/components/new-case-dialog'

type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Dashboard Page
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display authenticated user dashboard
 * - Simple over complex: Clean interface showing user info and logout
 * - Text as interface: User email as the primary identifier
 * 
 * Features:
 * - Shows authenticated user information
 * - Displays profile information from onboarding
 * - Provides logout functionality
 * - Protected by middleware
 */
export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          logger.error('Error fetching profile', error, { userId: user.id })
        } else {
          setProfile(data)
        }
      } catch (error) {
        logger.error('Error fetching profile', error, { userId: user.id })
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [user, supabase])

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ''} to your TAL Hub dashboard
        </p>
      </div>

      {/* Deadline Reminder Banner */}
      <DeadlineReminderBanner />

      <div className="grid gap-6">
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account and profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              {profile?.full_name && (
                <p><strong>Full Name:</strong> {profile.full_name}</p>
              )}
              {profile?.phone && (
                <p><strong>Phone:</strong> {profile.phone}</p>
              )}
              {profile?.role && (
                <p><strong>Role:</strong> <span className="capitalize">{profile.role}</span></p>
              )}
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Last Sign In:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => router.push('/dashboard/cases')}
              >
                <FileText className="h-6 w-6" />
                <span>View My Cases</span>
              </Button>
              <NewCaseDialog>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Plus className="h-6 w-6" />
                  <span>Create New Case</span>
                </Button>
              </NewCaseDialog>
            </div>
          </CardContent>
        </Card>

        {/* Legal Disclaimer */}
        <LegalDisclaimer />
      </div>
    </div>
  )
}