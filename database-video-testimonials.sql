-- ==============================================
-- VIDEO TESTIMONIALS — COMPLETE SETUP SQL
-- Run this entire script in Supabase SQL Editor
-- ==============================================

-- STEP 1: Create the video_testimonials table (if not exists)
CREATE TABLE IF NOT EXISTS video_testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  video_url TEXT, -- Can be null initially if storage bucket upload failed, or for text testimonials
  thumbnail_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  duration INTEGER DEFAULT 0, -- video duration in seconds
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Better Performance
CREATE INDEX IF NOT EXISTS idx_video_testimonials_approved ON video_testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_video_testimonials_featured ON video_testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_video_testimonials_created_at ON video_testimonials(created_at DESC);

-- STEP 2: Enable Row Level Security (RLS)
ALTER TABLE video_testimonials ENABLE ROW LEVEL SECURITY;

-- STEP 3: Drop old policies to recreate cleanly
DROP POLICY IF EXISTS "Anyone can view approved video testimonials" ON video_testimonials;
DROP POLICY IF EXISTS "Anyone can submit video testimonials" ON video_testimonials;
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON video_testimonials;
DROP POLICY IF EXISTS "Anyone can read approved testimonials" ON video_testimonials;
DROP POLICY IF EXISTS "Admin can read all testimonials" ON video_testimonials;
DROP POLICY IF EXISTS "Admin can update testimonials" ON video_testimonials;
DROP POLICY IF EXISTS "Admin can delete testimonials" ON video_testimonials;
DROP POLICY IF EXISTS "Service role can update video testimonials" ON video_testimonials;
DROP POLICY IF EXISTS "Service role can delete video testimonials" ON video_testimonials;

-- Policy A: Public SELECT — Anyone can view approved testimonials, admin can view all
CREATE POLICY "Anyone can read approved testimonials"
  ON video_testimonials FOR SELECT
  TO anon, authenticated
  USING (
    approved = true
    OR
    (auth.jwt() ->> 'email' = 'admin@gmail.com')
  );

-- Policy B: Public INSERT — Anyone can submit a testimonial (no auth required)
CREATE POLICY "Anyone can submit testimonials"
  ON video_testimonials FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy C: Admin UPDATE — Only admin can approve/feature testimonials
CREATE POLICY "Admin can update testimonials"
  ON video_testimonials FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');

-- Policy D: Admin DELETE — Only admin can delete testimonials
CREATE POLICY "Admin can delete testimonials"
  ON video_testimonials FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@gmail.com');


-- ==============================================
-- STEP 4: Storage bucket for video files
-- ==============================================

-- Create storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-testimonials', 'video-testimonials', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop old storage policies to recreate cleanly
DROP POLICY IF EXISTS "Anyone can upload video testimonials" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view video testimonials" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete video testimonials" ON storage.objects;
DROP POLICY IF EXISTS "Allow public video uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public video reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin video deletes" ON storage.objects;

-- Policy E: Storage INSERT — Anyone can upload videos to the bucket
CREATE POLICY "Allow public video uploads"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'video-testimonials');

-- Policy F: Storage SELECT — Anyone can view/read uploaded videos
CREATE POLICY "Allow public video reads"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'video-testimonials');

-- Policy G: Storage DELETE — Only admin can delete videos from storage
CREATE POLICY "Allow admin video deletes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'video-testimonials'
    AND
    (auth.jwt() ->> 'email' = 'admin@gmail.com')
  );

-- ==============================================
-- VERIFY: Quick select to check existing testimonials
-- ==============================================
SELECT id, customer_name, approved, video_url, created_at
FROM video_testimonials
ORDER BY created_at DESC;
