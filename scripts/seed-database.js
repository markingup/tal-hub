#!/usr/bin/env node

/**
 * TALHub Database Seeding Script
 * 
 * This script populates the Supabase database with mock data for development and testing.
 * Run with: node scripts/seed-database.js
 * 
 * Follows UNIX principles:
 * - Single responsibility: Seed database with mock data
 * - Simple over complex: Straightforward data insertion
 * - Text as interface: Uses environment variables for configuration
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
  // Non-payment case participants
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
  // Renovation case participants
  {
    case_id: '650e8400-e29b-41d4-a716-446655440002',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    role: 'tenant',
    added_by: '550e8400-e29b-41d4-a716-446655440001'
  }
]

const mockDocuments = [
  {
    id: '750e8400-e29b-41d4-a716-446655440001',
    case_id: '650e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Lease_2023.pdf',
    type: 'lease',
    storage_path: 'case/650e8400-e29b-41d4-a716-446655440001/landlord/lease_2023.pdf',
    size_bytes: 120000
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440002',
    case_id: '650e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Payment_Receipts_Jan-Mar.pdf',
    type: 'invoice',
    storage_path: 'case/650e8400-e29b-41d4-a716-446655440001/tenant/receipts_q1.pdf',
    size_bytes: 88000
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440003',
    case_id: '650e8400-e29b-41d4-a716-446655440002',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Notice_of_Renovation.jpg',
    type: 'notice',
    storage_path: 'case/650e8400-e29b-41d4-a716-446655440002/tenant/reno_notice.jpg',
    size_bytes: 420000
  }
]

const mockMessages = [
  {
    id: '850e8400-e29b-41d4-a716-446655440001',
    case_id: '650e8400-e29b-41d4-a716-446655440001',
    sender_id: '550e8400-e29b-41d4-a716-446655440002',
    type: 'text',
    content: 'Hello, can we arrange a payment plan to avoid further action?'
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440002',
    case_id: '650e8400-e29b-41d4-a716-446655440001',
    sender_id: '550e8400-e29b-41d4-a716-446655440001',
    type: 'text',
    content: 'Yes, I can do $400 on the 1st and $400 on the 15th for the next two months.'
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440003',
    case_id: '650e8400-e29b-41d4-a716-446655440001',
    sender_id: '550e8400-e29b-41d4-a716-446655440003',
    type: 'system',
    content: 'Lawyer added to case and reviewing documents.'
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440004',
    case_id: '650e8400-e29b-41d4-a716-446655440002',
    sender_id: '550e8400-e29b-41d4-a716-446655440001',
    type: 'text',
    content: 'Landlord mentioned \'major renos\'. What are my rights for temp relocation & return?'
  }
]

const mockDeadlines = [
  {
    id: '950e8400-e29b-41d4-a716-446655440001',
    case_id: '650e8400-e29b-41d4-a716-446655440001',
    title: 'File proof of payment plan',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: '550e8400-e29b-41d4-a716-446655440002'
  },
  {
    id: '950e8400-e29b-41d4-a716-446655440002',
    case_id: '650e8400-e29b-41d4-a716-446655440001',
    title: 'Proposed consent agreement draft',
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: '550e8400-e29b-41d4-a716-446655440003'
  },
  {
    id: '950e8400-e29b-41d4-a716-446655440003',
    case_id: '650e8400-e29b-41d4-a716-446655440002',
    title: 'Prepare evidence of habitability issues',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: '550e8400-e29b-41d4-a716-446655440001'
  }
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // Insert profiles
    console.log('📝 Inserting profiles...')
    const { error: profilesError } = await supabase
      .from('profiles')
      .upsert(mockProfiles, { onConflict: 'id' })
    
    if (profilesError) {
      console.error('❌ Error inserting profiles:', profilesError)
      return
    }
    console.log('✅ Profiles inserted successfully')

    // Insert cases
    console.log('📋 Inserting cases...')
    const { error: casesError } = await supabase
      .from('cases')
      .upsert(mockCases, { onConflict: 'id' })
    
    if (casesError) {
      console.error('❌ Error inserting cases:', casesError)
      return
    }
    console.log('✅ Cases inserted successfully')

    // Insert case participants
    console.log('👥 Inserting case participants...')
    const { error: participantsError } = await supabase
      .from('case_participants')
      .upsert(mockCaseParticipants, { onConflict: 'case_id,user_id' })
    
    if (participantsError) {
      console.error('❌ Error inserting case participants:', participantsError)
      return
    }
    console.log('✅ Case participants inserted successfully')

    // Insert documents
    console.log('📄 Inserting documents...')
    const { error: documentsError } = await supabase
      .from('documents')
      .upsert(mockDocuments, { onConflict: 'id' })
    
    if (documentsError) {
      console.error('❌ Error inserting documents:', documentsError)
      return
    }
    console.log('✅ Documents inserted successfully')

    // Insert messages
    console.log('💬 Inserting messages...')
    const { error: messagesError } = await supabase
      .from('messages')
      .upsert(mockMessages, { onConflict: 'id' })
    
    if (messagesError) {
      console.error('❌ Error inserting messages:', messagesError)
      return
    }
    console.log('✅ Messages inserted successfully')

    // Insert deadlines
    console.log('⏰ Inserting deadlines...')
    const { error: deadlinesError } = await supabase
      .from('deadlines')
      .upsert(mockDeadlines, { onConflict: 'id' })
    
    if (deadlinesError) {
      console.error('❌ Error inserting deadlines:', deadlinesError)
      return
    }
    console.log('✅ Deadlines inserted successfully')

    // Verify data
    console.log('🔍 Verifying inserted data...')
    const { data: profiles } = await supabase.from('profiles').select('count', { count: 'exact' })
    const { data: cases } = await supabase.from('cases').select('count', { count: 'exact' })
    const { data: participants } = await supabase.from('case_participants').select('count', { count: 'exact' })
    const { data: documents } = await supabase.from('documents').select('count', { count: 'exact' })
    const { data: messages } = await supabase.from('messages').select('count', { count: 'exact' })
    const { data: deadlines } = await supabase.from('deadlines').select('count', { count: 'exact' })

    console.log('\n📊 Database seeding completed successfully!')
    console.log('Summary:')
    console.log(`  Profiles: ${profiles?.length || 0}`)
    console.log(`  Cases: ${cases?.length || 0}`)
    console.log(`  Case Participants: ${participants?.length || 0}`)
    console.log(`  Documents: ${documents?.length || 0}`)
    console.log(`  Messages: ${messages?.length || 0}`)
    console.log(`  Deadlines: ${deadlines?.length || 0}`)
    
    console.log('\n🎉 You can now test the application with mock data!')
    console.log('Test users:')
    console.log('  - tenant@example.com (tenant)')
    console.log('  - landlord@example.com (landlord)')
    console.log('  - lawyer@example.com (lawyer)')

  } catch (error) {
    console.error('❌ Unexpected error during seeding:', error)
  }
}

// Run the seeding script
seedDatabase()
