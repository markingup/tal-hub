import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger'

/**
 * Auth Callback Route
 * 
 * Follows UNIX principles:
 * - Single responsibility: Handle OAuth/magic link callbacks
 * - Simple over complex: Clean redirect logic with proper error handling
 * - Text as interface: URL parameters as the interface
 * 
 * Features:
 * - Handles Supabase auth callbacks
 * - Redirects to dashboard on success
 * - Redirects to sign-in on error
 * - Proper session handling for SSR
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        // TODO: Add profile completeness check when types are fixed
        // For now, redirect all users to dashboard

        // Successful authentication
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (error) {
      logger.error('Auth callback error', error)
    }
  }

  // If we get here, there was an error
  return NextResponse.redirect(`${origin}/auth/sign-in?error=auth_callback_error`)
}