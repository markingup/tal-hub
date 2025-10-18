/**
 * Supabase Server Client
 * 
 * Follows UNIX principles:
 * - Single responsibility: Server-side Supabase client with SSR support
 * - Simple over complex: Minimal configuration with proper cookie handling
 * - Text as interface: Environment variables as config
 * 
 * Best practices for Next.js 15 App Router:
 * - Uses cookies for auth persistence across server requests
 * - Proper SSR support with createServerClient
 * - Type-safe with Database types
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Note: Don't export a default instance as it causes build issues
// Always call createClient() within request context
