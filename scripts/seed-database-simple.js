#!/usr/bin/env node

/**
 * TALHub Database Seeding Script (Simple Version)
 * 
 * This script populates the Supabase database with mock data using REST API calls.
 * Run with: node scripts/seed-database-simple.js
 * 
 * Note: This uses the anon key, so it will only work if RLS policies allow inserts.
 * For production, use the service role key or disable RLS temporarily.
 */

const https = require('https')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

// Helper function to make HTTP requests
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body)
          resolve({ data: parsed, error: res.statusCode >= 400 ? parsed : null })
        } catch (e) {
          resolve({ data: body, error: { message: 'Invalid JSON response' } })
        }
      })
    })
    
    req.on('error', reject)
    
    if (data) {
      req.write(JSON.stringify(data))
    }
    
    req.end()
  })
}

// Mock data
const mockProfiles = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'tenant@example.com',
    role: 'tenant',
    full_name: 'Test Tenant',
    phone: '+1-555-0101'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'landlord@example.com',
    role: 'landlord',
    full_name: 'Test Landlord',
    phone: '+1-555-0102'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'lawyer@example.com',
    role: 'lawyer',
    full_name: 'Test Lawyer',
    phone: '+1-555-0103'
  }
]

const mockCases = [
  {
    id: '650e8400-e29b-41d4-a716-446655440001',
    title: 'Non-payment dispute – Apt 3B',
    type: 'non_payment',
    status: 'active',
    created_by: '550e8400-e29b-41d4-a716-446655440002',
    opposing_party_name: 'Test Tenant',
    notes: 'Tenant owes 3 months rent; a payment plan is being discussed.'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440002',
    title: 'Renovation / temporary relocation',
    type: 'renovation',
    status: 'draft',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    opposing_party_name: 'Test Landlord',
    notes: 'Landlord planning major renovations; tenant exploring relocation rights.'
  }
]

const mockCaseParticipants = [
  {
    case_id: '650e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    role: 'landlord',
    added_by: '550e8400-e29b-41d4-a716-446655440002'
  },
  {
    case_id: '650e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    role: 'tenant',
    added_by: '550e8400-e29b-41d4-a716-446655440002'
  },
  {
    case_id: '650e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    role: 'lawyer',
    added_by: '550e8400-e29b-41d4-a716-446655440002'
  },
  {
    case_id: '650e8400-e29b-41d4-a716-446655440002',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    role: 'tenant',
    added_by: '550e8400-e29b-41d4-a716-446655440001'
  }
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')
  
  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`
  }

  try {
    // First, let's check what's currently in the database
    console.log('🔍 Checking current database state...')
    
    const { data: currentProfiles } = await makeRequest(
      `${supabaseUrl}/rest/v1/profiles?select=count`,
      { method: 'GET', headers: { ...headers, 'Prefer': 'count=exact' } }
    )
    
    const { data: currentCases } = await makeRequest(
      `${supabaseUrl}/rest/v1/cases?select=count`,
      { method: 'GET', headers: { ...headers, 'Prefer': 'count=exact' } }
    )
    
    console.log(`Current profiles: ${currentProfiles?.length || 0}`)
    console.log(`Current cases: ${currentCases?.length || 0}`)
    
    if (currentProfiles?.length > 0) {
      console.log('✅ Database already has data. Skipping seeding.')
      return
    }

    // Try to insert profiles
    console.log('📝 Inserting profiles...')
    const { error: profilesError } = await makeRequest(
      `${supabaseUrl}/rest/v1/profiles`,
      { method: 'POST', headers },
      mockProfiles
    )
    
    if (profilesError) {
      console.error('❌ Error inserting profiles:', profilesError)
      console.log('💡 This is likely due to RLS policies. You may need to:')
      console.log('   1. Temporarily disable RLS for seeding')
      console.log('   2. Use the service role key instead of anon key')
      console.log('   3. Create a proper auth user first')
      return
    }
    console.log('✅ Profiles inserted successfully')

    // Insert cases
    console.log('📋 Inserting cases...')
    const { error: casesError } = await makeRequest(
      `${supabaseUrl}/rest/v1/cases`,
      { method: 'POST', headers },
      mockCases
    )
    
    if (casesError) {
      console.error('❌ Error inserting cases:', casesError)
      return
    }
    console.log('✅ Cases inserted successfully')

    // Insert case participants
    console.log('👥 Inserting case participants...')
    const { error: participantsError } = await makeRequest(
      `${supabaseUrl}/rest/v1/case_participants`,
      { method: 'POST', headers },
      mockCaseParticipants
    )
    
    if (participantsError) {
      console.error('❌ Error inserting case participants:', participantsError)
      return
    }
    console.log('✅ Case participants inserted successfully')

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('You can now test the application with mock data.')

  } catch (error) {
    console.error('❌ Unexpected error during seeding:', error)
  }
}

// Run the seeding script
seedDatabase()
