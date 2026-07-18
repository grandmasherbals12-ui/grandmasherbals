-- ==============================================
-- Grandma's Herbals — Admin Access RLS Policies
-- Run this in your Supabase SQL Editor
-- ==============================================

-- 1. Policies for member_profiles
DROP POLICY IF EXISTS "admin_profile_select" ON member_profiles;
CREATE POLICY "admin_profile_select" ON member_profiles
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

DROP POLICY IF EXISTS "admin_profile_update" ON member_profiles;
CREATE POLICY "admin_profile_update" ON member_profiles
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

-- 2. Policies for daily_progress_entries
DROP POLICY IF EXISTS "admin_entry_select" ON daily_progress_entries;
CREATE POLICY "admin_entry_select" ON daily_progress_entries
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

DROP POLICY IF EXISTS "admin_entry_update" ON daily_progress_entries;
CREATE POLICY "admin_entry_update" ON daily_progress_entries
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

-- 3. Policies for progress_reports
DROP POLICY IF EXISTS "admin_report_select" ON progress_reports;
CREATE POLICY "admin_report_select" ON progress_reports
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

-- 4. Policies for message_log
DROP POLICY IF EXISTS "admin_message_select" ON message_log;
CREATE POLICY "admin_message_select" ON message_log
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

-- 5. Policies for users
DROP POLICY IF EXISTS "admin_users_select" ON users;
CREATE POLICY "admin_users_select" ON users
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

DROP POLICY IF EXISTS "admin_users_update" ON users;
CREATE POLICY "admin_users_update" ON users
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

-- 6. Policies for orders
DROP POLICY IF EXISTS "admin_orders_select" ON orders;
CREATE POLICY "admin_orders_select" ON orders
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

DROP POLICY IF EXISTS "admin_orders_update" ON orders;
CREATE POLICY "admin_orders_update" ON orders
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

-- 7. Policies for consultations
DROP POLICY IF EXISTS "admin_consultations_select" ON consultations;
CREATE POLICY "admin_consultations_select" ON consultations
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

DROP POLICY IF EXISTS "admin_consultations_update" ON consultations;
CREATE POLICY "admin_consultations_update" ON consultations
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

-- 8. Policies for stories
DROP POLICY IF EXISTS "admin_stories_select" ON stories;
CREATE POLICY "admin_stories_select" ON stories
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

DROP POLICY IF EXISTS "admin_stories_update" ON stories;
CREATE POLICY "admin_stories_update" ON stories
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

DROP POLICY IF EXISTS "admin_stories_delete" ON stories;
CREATE POLICY "admin_stories_delete" ON stories
  FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

-- 9. Policies for story_comments
DROP POLICY IF EXISTS "admin_comments_select" ON story_comments;
CREATE POLICY "admin_comments_select" ON story_comments
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

DROP POLICY IF EXISTS "admin_comments_update" ON story_comments;
CREATE POLICY "admin_comments_update" ON story_comments
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

DROP POLICY IF EXISTS "admin_comments_delete" ON story_comments;
CREATE POLICY "admin_comments_delete" ON story_comments
  FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');
