-- =========================================================
-- Grandma's Herbals — Progress Reports & Member Profiles
-- Run this in Supabase SQL Editor
-- =========================================================

-- Member Profiles (extends auth.users with wellness info)
CREATE TABLE IF NOT EXISTS member_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER,
  phone TEXT,
  email TEXT,
  membership_tier TEXT DEFAULT 'tier-1' CHECK (membership_tier IN ('tier-1', 'tier-2', 'tier-3')),
  wellness_formula TEXT,          -- e.g. "Felix 30 M.D. Capsule"
  primary_goals TEXT[],
  health_notes TEXT,
  notification_email BOOLEAN DEFAULT true,
  notification_sms BOOLEAN DEFAULT true,
  morning_encouragement BOOLEAN DEFAULT true,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add gender column if table already exists
ALTER TABLE member_profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say'));


-- Daily Progress Entries (entered by client each evening)
CREATE TABLE IF NOT EXISTS daily_progress_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Day 1 data
  day1_hour1_notes TEXT,
  day1_hour2_notes TEXT,
  day1_pain_reduction INTEGER DEFAULT 0 CHECK (day1_pain_reduction BETWEEN 0 AND 100),
  day1_mood_improvement INTEGER DEFAULT 0 CHECK (day1_mood_improvement BETWEEN 0 AND 100),
  day1_energy_improvement INTEGER DEFAULT 0 CHECK (day1_energy_improvement BETWEEN 0 AND 100),
  day1_mental_clarity INTEGER DEFAULT 0 CHECK (day1_mental_clarity BETWEEN 0 AND 100),

  -- Day 2 data
  day2_morning_improvement INTEGER DEFAULT 0 CHECK (day2_morning_improvement BETWEEN 0 AND 100),
  day2_morning_checklist JSONB DEFAULT '{}',   -- { sleep_quality, mood, energy, motivation }
  day2_focus_score INTEGER DEFAULT 0 CHECK (day2_focus_score BETWEEN 0 AND 10),
  day2_clarity_score INTEGER DEFAULT 0 CHECK (day2_clarity_score BETWEEN 0 AND 10),
  day2_energy_score INTEGER DEFAULT 0 CHECK (day2_energy_score BETWEEN 0 AND 10),
  day2_mood_score INTEGER DEFAULT 0 CHECK (day2_mood_score BETWEEN 0 AND 10),
  day2_afternoon_notes TEXT,
  day2_focus_pct INTEGER DEFAULT 0,
  day2_mental_clarity_pct INTEGER DEFAULT 0,
  day2_energy_pct INTEGER DEFAULT 0,
  day2_mood_pct INTEGER DEFAULT 0,

  -- Day 3 data
  day3_followup_checklist JSONB DEFAULT '{}',  -- { feeling_great, energy, motivation, positive_mood }
  day3_major_milestone TEXT,
  day3_milestone_years INTEGER,
  day3_milestone_detail TEXT,
  day3_walking_checklist JSONB DEFAULT '{}',   -- { no_knee_pain, no_mobility_limit, improved_confidence, willing_to_exercise }
  day3_morning_energy INTEGER DEFAULT 0,
  day3_motivation INTEGER DEFAULT 0,
  day3_walking_comfort INTEGER DEFAULT 0,
  day3_knee_comfort INTEGER DEFAULT 0,
  day3_overall_wellbeing INTEGER DEFAULT 0,

  -- Client quote & Feedback
  client_quote TEXT,
  video_feedback_url TEXT,
  negative_feedback TEXT,

  -- 3-day averages (auto-calculated on backend)
  avg_mood INTEGER DEFAULT 0,
  avg_energy INTEGER DEFAULT 0,
  avg_mental_clarity INTEGER DEFAULT 0,
  avg_focus INTEGER DEFAULT 0,
  avg_motivation INTEGER DEFAULT 0,
  avg_walking_comfort INTEGER DEFAULT 0,
  avg_knee_comfort INTEGER DEFAULT 0,
  avg_wellbeing INTEGER DEFAULT 0,

  -- Report delivery status
  report_generated BOOLEAN DEFAULT false,
  report_pdf_url TEXT,
  email_sent BOOLEAN DEFAULT false,
  sms_sent BOOLEAN DEFAULT false,
  encouragement_sent BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(member_id, entry_date)
);

-- Generated Reports (archive of all sent reports)
CREATE TABLE IF NOT EXISTS progress_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_id UUID REFERENCES daily_progress_entries(id),
  member_name TEXT NOT NULL,
  member_age INTEGER,
  wellness_formula TEXT,
  report_date DATE NOT NULL,
  report_html TEXT,              -- Full HTML of the report
  pdf_url TEXT,                  -- Supabase Storage URL
  encouragement_text TEXT,       -- AI-generated morning message
  email_sent_at TIMESTAMPTZ,
  sms_sent_at TIMESTAMPTZ,
  encouragement_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Message Log
CREATE TABLE IF NOT EXISTS message_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES auth.users(id),
  message_type TEXT NOT NULL CHECK (message_type IN ('encouragement_sms', 'report_email', 'report_sms')),
  recipient_phone TEXT,
  recipient_email TEXT,
  subject TEXT,
  body TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_log ENABLE ROW LEVEL SECURITY;

-- Member can read/write their own profile
DROP POLICY IF EXISTS "member_profile_select" ON member_profiles;
CREATE POLICY "member_profile_select" ON member_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "member_profile_insert" ON member_profiles;
CREATE POLICY "member_profile_insert" ON member_profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "member_profile_update" ON member_profiles;
CREATE POLICY "member_profile_update" ON member_profiles FOR UPDATE USING (auth.uid() = id);

-- Member can read/write their own daily entries
DROP POLICY IF EXISTS "member_entry_select" ON daily_progress_entries;
CREATE POLICY "member_entry_select" ON daily_progress_entries FOR SELECT USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "member_entry_insert" ON daily_progress_entries;
CREATE POLICY "member_entry_insert" ON daily_progress_entries FOR INSERT WITH CHECK (auth.uid() = member_id);

DROP POLICY IF EXISTS "member_entry_update" ON daily_progress_entries;
CREATE POLICY "member_entry_update" ON daily_progress_entries FOR UPDATE USING (auth.uid() = member_id);

-- Member can view their own reports
DROP POLICY IF EXISTS "member_report_select" ON progress_reports;
CREATE POLICY "member_report_select" ON progress_reports FOR SELECT USING (auth.uid() = member_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_entries_member ON daily_progress_entries(member_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON daily_progress_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_progress_reports_member ON progress_reports(member_id);
CREATE INDEX IF NOT EXISTS idx_message_log_member ON message_log(member_id);

-- =========================================================
-- pg_cron jobs (enable pg_cron extension first in Supabase)
-- Run these after enabling the pg_cron extension:
-- =========================================================

-- 8:00 AM EST = 13:00 UTC — Send personalized encouragement SMS
SELECT cron.schedule('morning-encouragement', '0 13 * * *', $$
  SELECT net.http_post(
    url := 'https://azurdwzifjkmhxbvnaix.supabase.co/functions/v1/send-morning-encouragement',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
$$);

-- 9:00 AM EST = 14:00 UTC — Send progress report email + SMS
SELECT cron.schedule('send-daily-report', '0 14 * * *', $$
  SELECT net.http_post(
    url := 'https://azurdwzifjkmhxbvnaix.supabase.co/functions/v1/send-daily-report',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
$$);
