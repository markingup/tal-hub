/**
 * Supabase Client Configuration (Legacy)
 * 
 * DEPRECATED: Use /lib/supabase/client.ts for browser or /lib/supabase/server.ts for server
 * 
 * This file is kept for backward compatibility but should be migrated to the new structure:
 * - Use createClient() from './supabase/client' for browser-side operations
 * - Use createClient() from './supabase/server' for server-side operations
 * 
 * Follows UNIX principles:
 * - Single responsibility: Legacy Supabase client setup
 * - Simple over complex: Minimal configuration
 * - Text as interface: Environment variables as config
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
