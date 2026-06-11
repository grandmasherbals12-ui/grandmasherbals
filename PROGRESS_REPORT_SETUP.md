# Progress Report, Video & Stories — Setup Guide

## 1. Run Database Migrations

In your **Supabase Dashboard → SQL Editor**, run these two files in order:

```sql
-- File 1:
database-progress-reports.sql

-- File 2:
database-stories.sql
```

---

## 2. Set Up Environment Secrets (Supabase Edge Functions)

In **Supabase Dashboard → Edge Functions → Manage Secrets**, add:

| Secret Name | Description |
|---|---|
| `RESEND_API_KEY` | Get from resend.com (free tier: 3,000 emails/month) |
| `TWILIO_ACCOUNT_SID` | From twilio.com console |
| `TWILIO_AUTH_TOKEN` | From twilio.com console |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number (e.g. +15551234567) |
| `SITE_URL` | Your site URL (e.g. https://grandmasherbals.com) |

---

## 3. Deploy Edge Functions

Install Supabase CLI, then:

```bash
# Login
supabase login

# Link your project
supabase link --project-ref azurdwzifjkmhxbvnaix

# Deploy all four functions
supabase functions deploy generate-progress-report
supabase functions deploy send-morning-encouragement
supabase functions deploy send-daily-report
supabase functions deploy send-welcome-package
```

---

## 4. Set Up Scheduled Cron Jobs

In **Supabase Dashboard → Database → Extensions**, enable **pg_cron**.

Then in **SQL Editor**, run:

```sql
-- 8 AM EST (13:00 UTC) — Morning Encouragement SMS
SELECT cron.schedule(
  'morning-encouragement',
  '0 13 * * *',
  $$
  SELECT net.http_post(
    url := 'https://azurdwzifjkmhxbvnaix.supabase.co/functions/v1/send-morning-encouragement',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- 9 AM EST (14:00 UTC) — Full Report Email + SMS
SELECT cron.schedule(
  'send-daily-report',
  '0 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://azurdwzifjkmhxbvnaix.supabase.co/functions/v1/send-daily-report',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

Replace `YOUR_SERVICE_ROLE_KEY` with your **Service Role Key** from Supabase → Project Settings → API.

---

## 5. Member Profile Setup

When a member first uses the Progress Report form, it auto-reads their profile from `member_profiles`. 
To create a profile for a member, insert into Supabase:

```sql
INSERT INTO member_profiles (id, full_name, age, phone, email, wellness_formula, membership_tier)
VALUES (
  'AUTH_USER_UUID',
  'Felix Johnson',
  62,
  '+15551234567',
  'felix@example.com',
  'Felix 30 M.D. Capsule',
  'tier-2'
);
```

Or let members fill it in through the form (it auto-saves on first submit).

---

## 6. New Pages & Navigation

| URL | Description |
|---|---|
| `/membership` | Membership page — now has a "Submit Progress Report" button |
| `/progress-report` | Member daily progress entry form (5-step wizard) |
| `/progress-report/:reportId` | View a generated progress report |
| `/stories` | Community stories & comments page |
| `/testimonials` | Video testimonials (now with auto-refresh after submission) |
| `/admin` | Admin panel — new **Progress Reports** and **Stories** tabs |

---

## 7. Workflow Summary

```
Member enters data each evening via /progress-report
    ↓
Supabase stores in daily_progress_entries
    ↓
generate-progress-report edge function fires immediately:
    • Generates HTML report
    • Stores in progress_reports table
    ↓
8:00 AM → send-morning-encouragement cron fires:
    • Reads yesterday's entries
    • Generates personalized encouragement text
    • Sends SMS to member phone
    • Sends encouragement email
    ↓
9:00 AM → send-daily-report cron fires:
    • Reads generated reports not yet emailed
    • Sends full HTML report via email (Resend)
    • Sends SMS with report link (Twilio)
```
