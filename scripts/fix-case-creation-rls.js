#!/usr/bin/env node

/**
 * Fix Case Creation RLS Policy
 * 
 * This script fixes the circular dependency issue in case creation
 * where users can't add themselves as participants to newly created cases.
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  console.error('')
  console.error('Please ensure these are set in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixCaseCreationRLS() {
  console.log('🔧 Fixing Case Creation RLS Policies...')
  console.log('')

  try {
    // Read the SQL fix script
    const fs = require('fs')
    const path = require('path')
    const sqlFile = path.join(__dirname, 'fix-case-creation-rls.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')

    console.log('📝 Applying RLS policy fixes...')
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error('❌ Error applying RLS fixes:', error.message)
      process.exit(1)
    }

    console.log('✅ RLS policies updated successfully!')
    console.log('')
    console.log('🎯 What was fixed:')
    console.log('   • Case creators can now add participants to their own cases')
    console.log('   • Resolved circular dependency in case creation flow')
    console.log('   • Users can view participants of cases they created or participate in')
    console.log('')
    console.log('🧪 Test the fix by:')
    console.log('   1. Sign in to the application')
    console.log('   2. Try creating a new case')
    console.log('   3. The case should be created successfully')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  }
}

// Check if we have the exec_sql function, if not provide manual instructions
async function checkExecSqlFunction() {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' })
    if (error && error.message.includes('function exec_sql')) {
      return false
    }
    return true
  } catch (error) {
    return false
  }
}

async function main() {
  const hasExecSql = await checkExecSqlFunction()
  
  if (!hasExecSql) {
    console.log('🔧 Case Creation RLS Policy Fix Instructions')
    console.log('============================================')
    console.log('')
    console.log('The RLS policies need to be updated to fix the circular dependency')
    console.log('in case creation. Apply these fixes manually:')
    console.log('')
    console.log('1. Go to your Supabase Dashboard:')
    console.log(`   ${supabaseUrl.replace('/rest/v1', '')}`)
    console.log('')
    console.log('2. Navigate to: SQL Editor')
    console.log('')
    console.log('3. Run the following SQL:')
    console.log('')
    console.log('```sql')
    const fs = require('fs')
    const path = require('path')
    const sqlFile = path.join(__dirname, 'fix-case-creation-rls.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    console.log(sql)
    console.log('```')
    console.log('')
    console.log('4. After applying these policies, test case creation in the app')
    console.log('')
    console.log('🎯 What this fixes:')
    console.log('   • Case creators can add participants to their own cases')
    console.log('   • Resolves "new row violates row-level security policy" error')
    console.log('   • Allows proper case creation workflow')
    return
  }

  await fixCaseCreationRLS()
}

main().catch(console.error)
