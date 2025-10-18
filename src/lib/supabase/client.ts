/**
 * Supabase Browser Client
 * 
 * Follows UNIX principles:
 * - Single responsibility: Browser-side Supabase client with auth persistence
 * - Simple over complex: Minimal configuration with proper cookie handling
 * - Text as interface: Environment variables as config
 * 
 * Best practices for Next.js 15 App Router:
 * - Uses createBrowserClient for client-side operations
 * - Proper cookie handling for auth persistence
 * - Type-safe with Database types
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export a default instance for convenience
export const supabase = createClient()
