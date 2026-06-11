-- Video Testimonials Table
-- Add this to your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS video_testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  duration INTEGER, -- video duration in seconds
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Index for Better Performance
CREATE INDEX idx_video_testimonials_approved ON video_testimonials(approved);
CREATE INDEX idx_video_testimonials_featured ON video_testimonials(featured);
CREATE INDEX idx_video_testimonials_created_at ON video_testimonials(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE video_testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view approved video testimonials"
  ON video_testimonials FOR SELECT
  USING (approved = true);

CREATE POLICY "Anyone can submit video testimonials"
  ON video_testimonials FOR INSERT
  WITH CHECK (true);

-- Admins can update and approve testimonials
-- (You'll need to create an admin role or use auth.jwt() checks)
CREATE POLICY "Service role can update video testimonials"
  ON video_testimonials FOR UPDATE
  USING (true);

CREATE POLICY "Service role can delete video testimonials"
  ON video_testimonials FOR DELETE
  USING (true);

-- Create storage bucket for video testimonials
-- Run this in SQL Editor or create manually in Supabase Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-testimonials', 'video-testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for video uploads
CREATE POLICY "Anyone can upload video testimonials"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'video-testimonials');

CREATE POLICY "Anyone can view video testimonials"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'video-testimonials');

CREATE POLICY "Service role can delete video testimonials"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'video-testimonials');
