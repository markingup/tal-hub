-- Fix Case Creation RLS Policy Issue
-- This script fixes the circular dependency in case creation

-- The issue: Case creation fails because the user can't add themselves as a participant
-- The solution: Allow case creators to add participants to their own cases

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view case participants" ON case_participants;
DROP POLICY IF EXISTS "Users can add participants to cases they participate in" ON case_participants;
DROP POLICY IF EXISTS "Users can remove themselves from cases" ON case_participants;

-- Create improved policies for case_participants

-- Allow users to view participants of cases they created OR cases they participate in
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

-- Allow users to add participants to cases they created OR cases they participate in
-- This fixes the circular dependency by allowing case creators to add themselves
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

-- Allow users to remove themselves from cases
CREATE POLICY "Users can remove themselves from cases" ON case_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Allow case creators to remove any participant
CREATE POLICY "Case creators can remove participants" ON case_participants
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM cases c
            WHERE c.id = case_participants.case_id AND c.created_by = auth.uid()
        )
    );
