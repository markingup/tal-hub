#!/usr/bin/env node

/**
 * TALHub Magic Link Test Script
 * 
 * This script tests the magic link authentication flow.
 * Run with: node scripts/test-magic-link.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testMagicLink() {
  console.log('🔗 Testing Magic Link Authentication')
  console.log('===================================')
  console.log('')
  
  try {
    // Send magic link
    console.log('1. Sending magic link to testuser@gmail.com...')
    const { data, error } = await supabase.auth.signInWithOtp({
      email: 'testuser@gmail.com',
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/auth/callback`
      }
    })
    
    if (error) {
      console.error('❌ Magic link error:', error)
      return
    }
    
    console.log('✅ Magic link sent successfully!')
    console.log('')
    console.log('2. Check your email inbox for the magic link')
    console.log('3. Click the link to sign in')
    console.log('4. After signing in, run: node scripts/debug-auth.js')
    console.log('')
    console.log('Alternative: If you have access to the Supabase Dashboard:')
    console.log('1. Go to: https://untacsqalwkenjmdbvbk.supabase.co')
    console.log('2. Navigate to: Authentication → Settings')
    console.log('3. Under "Email Confirmation", uncheck "Enable email confirmations"')
    console.log('4. Click "Save"')
    console.log('5. Then run: node scripts/debug-auth.js')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the test
testMagicLink()
