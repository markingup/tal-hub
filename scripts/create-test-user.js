#!/usr/bin/env node

/**
 * TALHub Test User Creation Script
 * 
 * This script creates a test user account that can be used to test the application.
 * Run with: node scripts/create-test-user.js
 * 
 * The user will be created with email: test@example.com and password: testpassword
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTestUser() {
  console.log('👤 Creating test user...')
  
  const testEmail = 'testuser@gmail.com'
  const testPassword = 'testpassword'
  
  try {
    // Sign up the test user
    console.log(`📧 Signing up user: ${testEmail}`)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
      }
    })
    
    if (signUpError) {
      console.error('❌ Error signing up user:', signUpError)
      
      // If user already exists, try to sign in
      if (signUpError.message.includes('already registered')) {
        console.log('🔄 User already exists, attempting to sign in...')
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        })
        
        if (signInError) {
          console.error('❌ Error signing in:', signInError)
          return
        }
        
        console.log('✅ Successfully signed in existing user')
        console.log(`User ID: ${signInData.user.id}`)
        console.log(`Email: ${signInData.user.email}`)
        
        // Create a test case for this user
        await createTestCase(signInData.user.id)
        return
      }
      
      return
    }
    
    if (signUpData.user) {
      console.log('✅ Test user created successfully!')
      console.log(`User ID: ${signUpData.user.id}`)
      console.log(`Email: ${signUpData.user.email}`)
      
      // Note: In production, the user would need to confirm their email
      // For testing, we'll proceed with creating a test case
      await createTestCase(signUpData.user.id)
    } else {
      console.log('📧 Check your email for confirmation link')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

async function createTestCase(userId) {
  console.log('📋 Creating test case...')
  
  try {
    // Create a test case
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .insert({
        title: 'Test Case - Rent Dispute',
        type: 'non_payment',
        status: 'active',
        created_by: userId,
        opposing_party_name: 'Test Landlord',
        notes: 'This is a test case created by the test user.'
      })
      .select()
      .single()
    
    if (caseError) {
      console.error('❌ Error creating case:', caseError)
      return
    }
    
    console.log('✅ Test case created successfully!')
    console.log(`Case ID: ${caseData.id}`)
    console.log(`Case Title: ${caseData.title}`)
    
    // Add the user as a participant
    const { error: participantError } = await supabase
      .from('case_participants')
      .insert({
        case_id: caseData.id,
        user_id: userId,
        role: 'tenant',
        added_by: userId
      })
    
    if (participantError) {
      console.error('❌ Error adding participant:', participantError)
      return
    }
    
    console.log('✅ User added as case participant')
    
    // Create a test message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        case_id: caseData.id,
        sender_id: userId,
        type: 'text',
        content: 'This is a test message in the test case.'
      })
    
    if (messageError) {
      console.error('❌ Error creating message:', messageError)
      return
    }
    
    console.log('✅ Test message created')
    
    console.log('\n🎉 Test setup completed!')
    console.log('You can now:')
    console.log('1. Go to http://localhost:3000/auth/sign-in')
    console.log(`2. Sign in with email: test@example.com`)
    console.log('3. Password: testpassword')
    console.log('4. You should see your test case in the dashboard')
    
  } catch (error) {
    console.error('❌ Unexpected error creating test case:', error)
  }
}

// Run the script
createTestUser()
