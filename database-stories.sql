-- =========================================================
-- Grandma's Herbals — Stories & Comments
-- Run this in Supabase SQL Editor
-- =========================================================

CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  story_type TEXT DEFAULT 'wellness' CHECK (story_type IN ('wellness', 'testimonial', 'milestone', 'journey')),
  media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS story_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  commenter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  commenter_name TEXT NOT NULL,
  commenter_email TEXT,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage bucket for story media
-- Run in Supabase dashboard: create bucket "story-media" (public)

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved stories
DROP POLICY IF EXISTS "stories_public_select" ON stories;
CREATE POLICY "stories_public_select" ON stories FOR SELECT USING (is_approved = true);

-- Authors can see their own
DROP POLICY IF EXISTS "stories_own_select" ON stories;
CREATE POLICY "stories_own_select" ON stories FOR SELECT USING (auth.uid() = author_id);

-- Anyone can submit
DROP POLICY IF EXISTS "stories_insert" ON stories;
CREATE POLICY "stories_insert" ON stories FOR INSERT WITH CHECK (true);

-- Comments: approved only for public
DROP POLICY IF EXISTS "comments_public_select" ON story_comments;
CREATE POLICY "comments_public_select" ON story_comments FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "comments_insert" ON story_comments;
CREATE POLICY "comments_insert" ON story_comments FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_stories_approved ON stories(is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_story_comments_story ON story_comments(story_id);
