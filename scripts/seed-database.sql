-- TALHub Database Seed Script
-- This script populates the database with mock data for development and testing
-- Run this in Supabase SQL Editor or via CLI

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('tenant', 'landlord', 'lawyer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE case_status AS ENUM ('draft', 'active', 'closed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE case_type AS ENUM ('non_payment', 'repossession', 'renovation', 'rent_increase', 'repairs', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE doc_type AS ENUM ('lease', 'notice', 'photo', 'invoice', 'email', 'audio', 'video', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_type AS ENUM ('text', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role DEFAULT 'tenant',
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type case_type NOT NULL,
    status case_status DEFAULT 'draft',
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tal_dossier_number TEXT,
    opposing_party_name TEXT,
    next_hearing_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS case_participants (
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    added_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (case_id, user_id)
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type doc_type DEFAULT 'other',
    storage_path TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type message_type DEFAULT 'text',
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deadlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view cases they participate in" ON cases;
DROP POLICY IF EXISTS "Users can create cases" ON cases;
DROP POLICY IF EXISTS "Users can update cases they participate in" ON cases;
DROP POLICY IF EXISTS "Users can view case participants" ON case_participants;
DROP POLICY IF EXISTS "Users can add participants to cases they participate in" ON case_participants;
DROP POLICY IF EXISTS "Users can remove themselves from cases" ON case_participants;
DROP POLICY IF EXISTS "Users can view documents for cases they participate in" ON documents;
DROP POLICY IF EXISTS "Users can create documents for cases they participate in" ON documents;
DROP POLICY IF EXISTS "Users can view messages for cases they participate in" ON messages;
DROP POLICY IF EXISTS "Users can create messages for cases they participate in" ON messages;
DROP POLICY IF EXISTS "Users can view deadlines for cases they participate in" ON deadlines;
DROP POLICY IF EXISTS "Users can create deadlines for cases they participate in" ON deadlines;
DROP POLICY IF EXISTS "Users can update deadlines for cases they participate in" ON deadlines;

-- Create RLS policies
-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Cases: Users can view cases where they are participants
CREATE POLICY "Users can view cases they participate in" ON cases
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = cases.id AND cp.user_id = auth.uid()
        )
    );

-- Cases: Users can create cases
CREATE POLICY "Users can create cases" ON cases
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Cases: Users can update cases where they are participants
CREATE POLICY "Users can update cases they participate in" ON cases
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = cases.id AND cp.user_id = auth.uid()
        )
    );

-- Case participants: Users can view participants of cases they participate in
CREATE POLICY "Users can view case participants" ON case_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = case_participants.case_id AND cp.user_id = auth.uid()
        )
    );

-- Case participants: Users can add participants to cases they participate in
CREATE POLICY "Users can add participants to cases they participate in" ON case_participants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = case_participants.case_id AND cp.user_id = auth.uid()
        ) AND auth.uid() = added_by
    );

-- Case participants: Users can remove themselves from cases
CREATE POLICY "Users can remove themselves from cases" ON case_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Documents: Users can view documents for cases they participate in
CREATE POLICY "Users can view documents for cases they participate in" ON documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = documents.case_id AND cp.user_id = auth.uid()
        )
    );

-- Documents: Users can create documents for cases they participate in
CREATE POLICY "Users can create documents for cases they participate in" ON documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = documents.case_id AND cp.user_id = auth.uid()
        ) AND auth.uid() = user_id
    );

-- Messages: Users can view messages for cases they participate in
CREATE POLICY "Users can view messages for cases they participate in" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = messages.case_id AND cp.user_id = auth.uid()
        )
    );

-- Messages: Users can create messages for cases they participate in
CREATE POLICY "Users can create messages for cases they participate in" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = messages.case_id AND cp.user_id = auth.uid()
        ) AND auth.uid() = sender_id
    );

-- Deadlines: Users can view deadlines for cases they participate in
CREATE POLICY "Users can view deadlines for cases they participate in" ON deadlines
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = deadlines.case_id AND cp.user_id = auth.uid()
        )
    );

-- Deadlines: Users can create deadlines for cases they participate in
CREATE POLICY "Users can create deadlines for cases they participate in" ON deadlines
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = deadlines.case_id AND cp.user_id = auth.uid()
        ) AND auth.uid() = created_by
    );

-- Deadlines: Users can update deadlines for cases they participate in
CREATE POLICY "Users can update deadlines for cases they participate in" ON deadlines
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = deadlines.case_id AND cp.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cp_user ON case_participants (user_id);
CREATE INDEX IF NOT EXISTS idx_docs_case ON documents (case_id);
CREATE INDEX IF NOT EXISTS idx_msgs_case_created ON messages (case_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deadlines_case_due ON deadlines (case_id, due_date);

-- Insert mock data
-- First, create test users in auth.users (this would normally be done via Supabase Auth)
-- For now, we'll create profiles that reference non-existent auth users
-- In a real scenario, you would sign up users first, then run this script

-- Create mock profiles (these would be created by the auth trigger in production)
INSERT INTO profiles (id, email, role, full_name, phone) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'tenant@example.com', 'tenant', 'Test Tenant', '+1-555-0101'),
    ('550e8400-e29b-41d4-a716-446655440002', 'landlord@example.com', 'landlord', 'Test Landlord', '+1-555-0102'),
    ('550e8400-e29b-41d4-a716-446655440003', 'lawyer@example.com', 'lawyer', 'Test Lawyer', '+1-555-0103')
ON CONFLICT (id) DO NOTHING;

-- Create mock cases
INSERT INTO cases (id, title, type, status, created_by, opposing_party_name, notes) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 'Non-payment dispute – Apt 3B', 'non_payment', 'active', '550e8400-e29b-41d4-a716-446655440002', 'Test Tenant', 'Tenant owes 3 months rent; a payment plan is being discussed.'),
    ('650e8400-e29b-41d4-a716-446655440002', 'Renovation / temporary relocation', 'renovation', 'draft', '550e8400-e29b-41d4-a716-446655440001', 'Test Landlord', 'Landlord planning major renovations; tenant exploring relocation rights.')
ON CONFLICT (id) DO NOTHING;

-- Create case participants
INSERT INTO case_participants (case_id, user_id, role, added_by) VALUES
    -- Non-payment case participants
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'landlord', '550e8400-e29b-41d4-a716-446655440002'),
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'tenant', '550e8400-e29b-41d4-a716-446655440002'),
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'lawyer', '550e8400-e29b-41d4-a716-446655440002'),
    -- Renovation case participants
    ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'tenant', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (case_id, user_id) DO NOTHING;

-- Create mock documents
INSERT INTO documents (id, case_id, user_id, name, type, storage_path, size_bytes) VALUES
    ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Lease_2023.pdf', 'lease', 'case/650e8400-e29b-41d4-a716-446655440001/landlord/lease_2023.pdf', 120000),
    ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Payment_Receipts_Jan-Mar.pdf', 'invoice', 'case/650e8400-e29b-41d4-a716-446655440001/tenant/receipts_q1.pdf', 88000),
    ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Notice_of_Renovation.jpg', 'notice', 'case/650e8400-e29b-41d4-a716-446655440002/tenant/reno_notice.jpg', 420000)
ON CONFLICT (id) DO NOTHING;

-- Create mock messages
INSERT INTO messages (id, case_id, sender_id, type, content) VALUES
    ('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'text', 'Hello, can we arrange a payment plan to avoid further action?'),
    ('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'text', 'Yes, I can do $400 on the 1st and $400 on the 15th for the next two months.'),
    ('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'system', 'Lawyer added to case and reviewing documents.'),
    ('850e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'text', 'Landlord mentioned ''major renos''. What are my rights for temp relocation & return?')
ON CONFLICT (id) DO NOTHING;

-- Create mock deadlines
INSERT INTO deadlines (id, case_id, title, due_date, created_by) VALUES
    ('950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'File proof of payment plan', NOW() + INTERVAL '7 days', '550e8400-e29b-41d4-a716-446655440002'),
    ('950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Proposed consent agreement draft', NOW() + INTERVAL '10 days', '550e8400-e29b-41d4-a716-446655440003'),
    ('950e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 'Prepare evidence of habitability issues', NOW() + INTERVAL '5 days', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- Verify the data was inserted
SELECT 'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Cases' as table_name, COUNT(*) as count FROM cases
UNION ALL
SELECT 'Case Participants' as table_name, COUNT(*) as count FROM case_participants
UNION ALL
SELECT 'Documents' as table_name, COUNT(*) as count FROM documents
UNION ALL
SELECT 'Messages' as table_name, COUNT(*) as count FROM messages
UNION ALL
SELECT 'Deadlines' as table_name, COUNT(*) as count FROM deadlines;
