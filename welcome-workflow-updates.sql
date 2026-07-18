-- ==============================================
-- Grandma's Herbals — Welcome Letter Workflow Updates
-- Run this in your Supabase SQL Editor
-- ==============================================

-- 1. Add practitioner_name and welcome_approved to member_profiles
ALTER TABLE member_profiles
  ADD COLUMN IF NOT EXISTS practitioner_name TEXT DEFAULT 'Dr. Travis Williams',
  ADD COLUMN IF NOT EXISTS welcome_approved BOOLEAN DEFAULT false;

-- 2. Update default RLS policies so admin can insert/update these fields
DROP POLICY IF EXISTS "admin_profile_update" ON member_profiles;
CREATE POLICY "admin_profile_update" ON member_profiles
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' IN ('admin@gmail.com', 'grandmasherbals12@gmail.com'));
