/**
 * Supabase Client Utilities
 * 
 * Follows UNIX principles:
 * - Single responsibility: Centralized exports for Supabase utilities
 * - Simple over complex: Clean re-exports
 * - Text as interface: Clear module boundaries
 * 
 * This barrel file provides convenient access to all Supabase utilities.
 * Use this for cleaner imports throughout your application.
 */

// Re-export all Supabase utilities
export { createClient as createServerClient } from './server'
export { createClient as createBrowserClient, supabase as browserSupabase } from './client'
export type { Database, Tables, TablesInsert, TablesUpdate, Enums } from './types'

// Convenience exports with clear naming
export { createClient as createSupabaseClient } from './client'
export { createClient as createSupabaseServerClient } from './server'
