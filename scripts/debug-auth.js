#!/usr/bin/env node

/**
 * TALHub Authentication Debug Script
 * 
 * This script helps debug authentication and data access issues.
 * Run with: node scripts/debug-auth.js
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

async function debugAuth() {
  console.log('🔍 Debugging Authentication and Data Access')
  console.log('==========================================')
  console.log('')
  
  try {
    // Check current session
    console.log('1. Checking current session...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError)
    } else if (session) {
      console.log('✅ User is authenticated:')
      console.log(`   User ID: ${session.user.id}`)
      console.log(`   Email: ${session.user.email}`)
      console.log(`   Created: ${session.user.created_at}`)
    } else {
      console.log('❌ No active session - user is not authenticated')
    }
    
    console.log('')
    
    // Try to sign in with test user
    console.log('2. Attempting to sign in with test user...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'testuser@gmail.com',
      password: 'testpassword'
    })
    
    if (signInError) {
      console.error('❌ Sign in error:', signInError)
    } else if (signInData.user) {
      console.log('✅ Successfully signed in:')
      console.log(`   User ID: ${signInData.user.id}`)
      console.log(`   Email: ${signInData.user.email}`)
      
      // Now try to access data
      console.log('')
      console.log('3. Testing data access with authenticated user...')
      
      // Check profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
      
      if (profilesError) {
        console.error('❌ Profiles error:', profilesError)
      } else {
        console.log(`✅ Profiles accessible: ${profiles?.length || 0} records`)
        if (profiles && profiles.length > 0) {
          console.log('   Sample profile:', profiles[0])
        }
      }
      
      // Check cases
      const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select('*')
      
      if (casesError) {
        console.error('❌ Cases error:', casesError)
      } else {
        console.log(`✅ Cases accessible: ${cases?.length || 0} records`)
        if (cases && cases.length > 0) {
          console.log('   Sample case:', cases[0])
        }
      }
      
      // Check case participants
      const { data: participants, error: participantsError } = await supabase
        .from('case_participants')
        .select('*')
      
      if (participantsError) {
        console.error('❌ Case participants error:', participantsError)
      } else {
        console.log(`✅ Case participants accessible: ${participants?.length || 0} records`)
        if (participants && participants.length > 0) {
          console.log('   Sample participant:', participants[0])
        }
      }
      
    } else {
      console.log('❌ Sign in failed - no user data returned')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the debug script
debugAuth()
