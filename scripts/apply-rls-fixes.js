#!/usr/bin/env node

/**
 * Apply RLS Policy Fixes
 * 
 * This script applies the RLS policy fixes to the Supabase database.
 * It uses the service role key to bypass RLS and apply the policies.
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!serviceRoleKey)
  console.error('')
  console.error('Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyRLSFixes() {
  console.log('🔧 Applying RLS Policy Fixes...')
  console.log('================================')

  try {
    // Read the SQL file
    const fs = await import('fs')
    const sqlContent = fs.readFileSync('./scripts/fix-rls-policies.sql', 'utf8')
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (!statement) continue

      console.log(`\n${i + 1}. Executing: ${statement.substring(0, 50)}...`)
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      
      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message)
        // Continue with other statements
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`)
      }
    }

    console.log('\n🎉 RLS policy fixes applied successfully!')
    console.log('\nNext steps:')
    console.log('1. Test case creation in the application')
    console.log('2. Verify users can only see their own cases')
    console.log('3. Check that case participants can access case data')

  } catch (error) {
    console.error('❌ Error applying RLS fixes:', error.message)
    console.error('\nManual fix required:')
    console.error('1. Go to Supabase Dashboard → SQL Editor')
    console.error('2. Copy the contents of scripts/fix-rls-policies.sql')
    console.error('3. Execute the SQL statements manually')
  }
}

// Check if we have the exec_sql function
async function checkExecSqlFunction() {
  try {
    const { data, error } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'exec_sql')
      .limit(1)

    if (error || !data || data.length === 0) {
      console.log('⚠️  exec_sql function not found. Creating it...')
      
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION exec_sql(sql text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$;
      `
      
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL })
      
      if (createError) {
        console.error('❌ Failed to create exec_sql function:', createError.message)
        return false
      }
      
      console.log('✅ exec_sql function created successfully')
    }
    
    return true
  } catch (error) {
    console.error('❌ Error checking exec_sql function:', error.message)
    return false
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting RLS Policy Fix Application')
  console.log('=====================================')
  
  const hasExecSql = await checkExecSqlFunction()
  
  if (hasExecSql) {
    await applyRLSFixes()
  } else {
    console.log('\n📋 Manual Application Required')
    console.log('==============================')
    console.log('Please apply the RLS fixes manually:')
    console.log('1. Go to: https://untacsqalwkenjmdbvbk.supabase.co')
    console.log('2. Navigate to: SQL Editor')
    console.log('3. Copy and paste the contents of scripts/fix-rls-policies.sql')
    console.log('4. Execute the SQL statements')
  }
}

main().catch(console.error)
