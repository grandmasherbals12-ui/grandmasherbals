// Supabase Edge Function — 9 AM Progress Report Email + SMS
// Triggered by pg_cron at 14:00 UTC (9 AM EST)
// Deploy: supabase functions deploy send-daily-report

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  const { data: entries } = await supabase
    .from("daily_progress_entries")
    .select("*, member_profiles(*)")
    .eq("entry_date", dateStr)
    .eq("report_generated", true)
    .eq("email_sent", false);

  for (const entry of entries ?? []) {
    const profile = entry.member_profiles;
    if (!profile) continue;

    // --- TIER LOGIC FOR REPORT FREQUENCY ---
    const dayOfWeek = new Date().getDay();
    if (profile.membership_tier === 'tier-1') {
      // 1 report a week (e.g. Friday)
      if (dayOfWeek !== 5) continue;
    } else if (profile.membership_tier === 'tier-2') {
      // 4 days a week (Mon, Wed, Fri, Sun)
      if (![1, 3, 5, 0].includes(dayOfWeek)) continue;
    }

    // Fetch the generated report HTML
    const { data: report } = await supabase
      .from("progress_reports")
      .select("report_html, id")
      .eq("entry_id", entry.id)
      .single();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuth = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioFrom = Deno.env.get("TWILIO_PHONE_NUMBER");
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://grandmasherbals.com";

    const firstName = (profile.full_name || "").split(" ")[0];

    if (resendKey && profile.email && profile.notification_email && report?.report_html) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Dr. Travis Williams <reports@grandmasherbals.com>",
          to: [profile.email],
          subject: `${firstName}'s 3-Day Progress Report — Grandma's Herbals`,
          html: report.report_html,
        }),
      });

      await supabase.from("daily_progress_entries")
        .update({ email_sent: true })
        .eq("id", entry.id);

      await supabase.from("message_log").insert({
        member_id: entry.member_id,
        message_type: "report_email",
        recipient_email: profile.email,
        subject: `${firstName}'s 3-Day Progress Report`,
        status: "sent",
        sent_at: new Date().toISOString(),
      });
    }

    if (twilioSid && twilioAuth && twilioFrom && profile.phone && profile.notification_sms) {
      const reportUrl = `${siteUrl}/progress-report/${report?.id ?? ""}`;
      const smsBody = `🌿 Grandma's Herbals\nHello ${firstName}! Your 3-Day Progress Report is ready.\nView: ${reportUrl}\n\nKeep up the great work! — Dr. Travis Williams`;

      const params = new URLSearchParams({ To: profile.phone, From: twilioFrom, Body: smsBody });
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${twilioSid}:${twilioAuth}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      await supabase.from("daily_progress_entries")
        .update({ sms_sent: true })
        .eq("id", entry.id);

      await supabase.from("message_log").insert({
        member_id: entry.member_id,
        message_type: "report_sms",
        recipient_phone: profile.phone,
        body: smsBody,
        status: "sent",
        sent_at: new Date().toISOString(),
      });
    }
  }

  return new Response(JSON.stringify({ processed: (entries ?? []).length }), {
    headers: { "Content-Type": "application/json" },
  });
});
