-- Fix RLS Policies for TALHub
-- This script fixes the RLS policies to allow proper case creation and access

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view cases they participate in" ON cases;
DROP POLICY IF EXISTS "Users can create cases" ON cases;
DROP POLICY IF EXISTS "Users can update cases they participate in" ON cases;
DROP POLICY IF EXISTS "Users can view case participants" ON case_participants;
DROP POLICY IF EXISTS "Users can add participants to cases they participate in" ON case_participants;
DROP POLICY IF EXISTS "Users can remove themselves from cases" ON case_participants;

-- Create improved RLS policies

-- Cases: Users can view cases where they are participants OR where they are the creator
CREATE POLICY "Users can view cases they participate in or created" ON cases
    FOR SELECT USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = cases.id AND cp.user_id = auth.uid()
        )
    );

-- Cases: Users can create cases (they become the creator)
CREATE POLICY "Users can create cases" ON cases
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Cases: Users can update cases where they are participants OR where they are the creator
CREATE POLICY "Users can update cases they participate in or created" ON cases
    FOR UPDATE USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = cases.id AND cp.user_id = auth.uid()
        )
    );

-- Case participants: Users can view participants of cases they participate in OR cases they created
CREATE POLICY "Users can view case participants" ON case_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM cases c
            WHERE c.id = case_participants.case_id AND c.created_by = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM case_participants cp
            WHERE cp.case_id = case_participants.case_id AND cp.user_id = auth.uid()
        )
    );

-- Case participants: Users can add participants to cases they created OR cases they participate in
CREATE POLICY "Users can add participants to cases they created or participate in" ON case_participants
    FOR INSERT WITH CHECK (
        (
            EXISTS (
                SELECT 1 FROM cases c
                WHERE c.id = case_participants.case_id AND c.created_by = auth.uid()
            )
        ) OR
        (
            EXISTS (
                SELECT 1 FROM case_participants cp
                WHERE cp.case_id = case_participants.case_id AND cp.user_id = auth.uid()
            )
        )
    );

-- Case participants: Users can remove themselves from cases
CREATE POLICY "Users can remove themselves from cases" ON case_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Also allow case creators to remove any participant
CREATE POLICY "Case creators can remove participants" ON case_participants
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM cases c
            WHERE c.id = case_participants.case_id AND c.created_by = auth.uid()
        )
    );
