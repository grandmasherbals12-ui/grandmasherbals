// Supabase Edge Function — Generate Progress Report, Send Email + SMS
// Deploy: supabase functions deploy generate-progress-report

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { entry_id, member_id } = body;

    // Fetch entry + member profile
    const { data: entry } = await supabaseClient
      .from("daily_progress_entries")
      .select("*")
      .eq("id", entry_id)
      .single();

    const { data: profile } = await supabaseClient
      .from("member_profiles")
      .select("*")
      .eq("id", member_id)
      .single();

    if (!entry || !profile) {
      return new Response(JSON.stringify({ error: "Entry or profile not found" }), {
        status: 404, headers: corsHeaders,
      });
    }

    // Generate encouragement text based on progress data
    const encouragement = generateEncouragement(profile, entry);

    // Generate HTML report
    const reportHtml = generateReportHtml(profile, entry, encouragement);

    // Store report record
    const { data: report } = await supabaseClient
      .from("progress_reports")
      .insert({
        member_id,
        entry_id,
        member_name: profile.full_name,
        member_age: profile.age,
        wellness_formula: profile.wellness_formula,
        report_date: entry.entry_date,
        report_html: reportHtml,
        encouragement_text: encouragement,
      })
      .select()
      .single();

    // Send email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey && profile.email && profile.notification_email) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Dr. Travis Williams <reports@grandmasherbals.com>",
          to: [profile.email],
          subject: `Your 3-Day Progress Report — ${profile.full_name}`,
          html: reportHtml,
        }),
      });

      await supabaseClient.from("daily_progress_entries")
        .update({ email_sent: true })
        .eq("id", entry_id);
    }

    // Send SMS via Twilio
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuth = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioFrom = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (twilioSid && twilioAuth && twilioFrom && profile.phone && profile.notification_sms) {
      const reportUrl = `${Deno.env.get("SITE_URL")}/progress-report/${report?.id}`;
      const smsBody = `Grandma's Herbals 🌿\nHello ${profile.full_name}! Your 3-Day Progress Report is ready.\nView it here: ${reportUrl}\n\n${encouragement.substring(0, 100)}...`;

      const params = new URLSearchParams({
        To: profile.phone,
        From: twilioFrom,
        Body: smsBody,
      });

      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa(`${twilioSid}:${twilioAuth}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      await supabaseClient.from("daily_progress_entries")
        .update({ sms_sent: true })
        .eq("id", entry_id);
    }

    await supabaseClient.from("daily_progress_entries")
      .update({ report_generated: true })
      .eq("id", entry_id);

    return new Response(JSON.stringify({ success: true, report_id: report?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: corsHeaders,
    });
  }
});

function generateEncouragement(profile: any, entry: any): string {
  const name = profile.full_name.split(" ")[0];
  const topMetric = getTopMetric(entry);
  const lines = [
    `Dear ${name},`,
    "",
    `I am so proud of you.`,
    "",
    `You are truly doing the work that matters and counts. The decision to prioritize your own health is not selfish — it is necessary.`,
    "",
  ];

  if (topMetric.label === "Walking Comfort" && entry.day3_walking_comfort > 60) {
    lines.push(`The progress you are making in your mobility and walking is truly remarkable. Movement is medicine, and you are proving that every single day.`);
    lines.push("");
  }
  if (entry.day3_major_milestone) {
    lines.push(`${entry.day3_major_milestone} — this is a major milestone worth celebrating. ${entry.day3_milestone_years ? `For the first time in approximately ${entry.day3_milestone_years} years, ` : ""}you are experiencing real, measurable change.`);
    lines.push("");
  }
  if (entry.day2_morning_improvement >= 35) {
    lines.push(`Waking up with ${entry.day2_morning_improvement}% overall improvement compared to your normal baseline speaks volumes about the consistency of your practice.`);
    lines.push("");
  }

  lines.push(`The early morning routines are especially encouraging. Consistent movement, proper rest, and daily wellness habits often create the greatest long-term improvements in health, mood, energy, and quality of life.`);
  lines.push("");
  lines.push(`**Keep up the good work.** The progress you are experiencing is worth celebrating.`);
  lines.push("");
  lines.push(`Kindest Regards,`);
  lines.push(`Dr. Travis Williams`);
  lines.push(`Grandma's Herbals`);

  return lines.join("\n");
}

function getTopMetric(entry: any): { label: string; value: number } {
  const metrics = [
    { label: "Walking Comfort", value: entry.day3_walking_comfort ?? 0 },
    { label: "Knee Comfort", value: entry.day3_knee_comfort ?? 0 },
    { label: "Energy", value: entry.day3_morning_energy ?? 0 },
    { label: "Motivation", value: entry.day3_motivation ?? 0 },
    { label: "Overall Well-Being", value: entry.day3_overall_wellbeing ?? 0 },
  ];
  return metrics.sort((a, b) => b.value - a.value)[0];
}

function generateReportHtml(profile: any, entry: any, encouragement: string): string {
  const name = profile.full_name.split(" ")[0];
  const paragraphs = encouragement.split("\n\n").filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>3-Day Progress Report — ${profile.full_name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #faf8f2; color: #2d2d2d; }
  .page { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid #3d6b3f; padding-bottom: 20px; }
  .logo-area { display: flex; align-items: center; gap: 12px; }
  .logo-circle { width: 90px; height: 90px; border-radius: 50%; background: #3d6b3f; border: 4px solid #8ba888; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 700; text-align: center; line-height: 1.2; padding: 8px; }
  .report-title { text-align: center; flex: 1; }
  .report-title h1 { font-family: 'Playfair Display', serif; font-size: 28px; color: #2d5a30; }
  .report-title h2 { font-size: 36px; font-weight: 900; color: #1a3d1c; }
  .report-title p { font-size: 11px; letter-spacing: 2px; color: #5a8a5c; text-transform: uppercase; margin-top: 4px; }
  .client-info { text-align: right; background: #f0f5f0; border: 1px solid #c8dcc8; border-radius: 8px; padding: 12px 16px; min-width: 160px; font-size: 13px; }
  .client-info strong { display: block; color: #2d5a30; }
  .letter { background: #faf9f5; border-left: 4px solid #8ba888; padding: 24px; margin-bottom: 30px; border-radius: 4px; font-size: 14px; line-height: 1.8; color: #3d3d3d; }
  .letter p { margin-bottom: 12px; }
  .letter .bold { font-weight: 700; color: #1a3d1c; }
  .days-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 30px; }
  .day-card { background: #fff; border: 2px solid #c8dcc8; border-radius: 12px; padding: 16px; }
  .day-badge { background: #3d6b3f; color: #fff; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; margin-bottom: 10px; }
  .day-card h3 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #5a8a5c; margin-bottom: 8px; }
  .day-card ul { list-style: none; padding: 0; font-size: 12px; }
  .day-card ul li { padding: 3px 0; color: #444; }
  .day-card ul li::before { content: "• "; color: #3d6b3f; }
  .checklist li { display: flex; align-items: center; gap: 6px; }
  .check { color: #3d6b3f; font-weight: bold; }
  .scores-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
  .score-row { display: flex; justify-content: space-between; font-size: 12px; align-items: center; }
  .stars { color: #f5c518; font-size: 14px; }
  .markers { margin-top: 12px; }
  .marker-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 12px; }
  .marker-label { width: 110px; color: #555; }
  .bar-bg { flex: 1; height: 8px; background: #e8ede8; border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; background: #3d6b3f; border-radius: 4px; }
  .pct { width: 35px; text-align: right; font-weight: 600; color: #2d5a30; font-size: 11px; }
  .quote-block { background: #3d6b3f; color: #fff; border-radius: 12px; padding: 24px; margin-bottom: 30px; text-align: center; }
  .quote-block .quote-mark { font-size: 48px; line-height: 1; opacity: 0.5; font-family: serif; }
  .quote-block p { font-style: italic; font-size: 15px; line-height: 1.7; margin-bottom: 8px; }
  .quote-block cite { font-size: 13px; opacity: 0.8; }
  .milestone-card { background: #fffbe6; border: 2px solid #f5c518; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
  .milestone-card h3 { color: #7a6000; font-size: 14px; font-weight: 700; margin-bottom: 6px; }
  .summary { margin-bottom: 30px; }
  .summary h2 { text-align: center; color: #2d5a30; border-top: 2px solid #c8dcc8; border-bottom: 2px solid #c8dcc8; padding: 10px; margin-bottom: 20px; font-family: 'Playfair Display', serif; font-size: 18px; letter-spacing: 2px; }
  .summary-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; text-align: center; }
  .summary-item { font-size: 11px; }
  .summary-item .icon { font-size: 20px; margin-bottom: 4px; }
  .summary-item .label { color: #666; font-size: 10px; margin-bottom: 4px; }
  .summary-item .pct-big { font-size: 16px; font-weight: 700; color: #2d5a30; }
  .footer { text-align: center; padding-top: 20px; border-top: 2px solid #c8dcc8; font-size: 12px; color: #888; }
  .footer .signature { font-family: 'Playfair Display', serif; font-size: 18px; color: #2d5a30; margin-top: 8px; }
  .nourish-box { background: #3d6b3f; color: #fff; border-radius: 10px; padding: 20px; margin-bottom: 30px; text-align: center; font-size: 15px; line-height: 1.8; font-weight: 600; }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo-area">
      <div class="logo-circle">GRANDMA'S<br/>HERBALS</div>
    </div>
    <div class="report-title">
      <p>3-DAY CLIENT</p>
      <h2>PROGRESS REPORT</h2>
      <p>CELEBRATING CONSISTENCY, MOVEMENT &amp; WELL-BEING</p>
    </div>
    <div class="client-info">
      <strong>CLIENT:</strong> ${name}<br/>
      <strong>AGE:</strong> ${profile.age || "—"}<br/>
      <strong>WELLNESS FORMULA:</strong><br/>${profile.wellness_formula || "—"}
    </div>
  </div>

  <div class="nourish-box">
    NOURISHING THE BODY,<br/>
    SUPPORTING THE JOURNEY,<br/>
    HONORING YOU.
  </div>

  <div class="letter">
    ${paragraphs.map(p => `<p>${p.replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>')}</p>`).join("")}
  </div>

  <div class="days-grid">
    <!-- DAY 1 -->
    <div class="day-card">
      <div class="day-badge">1</div>
      <h3>Hour 1</h3>
      <ul><li>${entry.day1_hour1_notes || "No pain reported. No adverse effects."}</li></ul>
      <h3 style="margin-top:10px">Hour 2</h3>
      <ul><li>${entry.day1_hour2_notes || "Feeling improvement in overall comfort and well-being."}</li></ul>
      <div class="markers">
        <div class="marker-row"><span class="marker-label">Pain Reduction</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day1_pain_reduction}%"></div></div><span class="pct">${entry.day1_pain_reduction}%</span></div>
        <div class="marker-row"><span class="marker-label">Mood Improvement</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day1_mood_improvement}%"></div></div><span class="pct">${entry.day1_mood_improvement}%</span></div>
        <div class="marker-row"><span class="marker-label">Energy</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day1_energy_improvement}%"></div></div><span class="pct">${entry.day1_energy_improvement}%</span></div>
        <div class="marker-row"><span class="marker-label">Mental Clarity</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day1_mental_clarity}%"></div></div><span class="pct">${entry.day1_mental_clarity}%</span></div>
      </div>
    </div>

    <!-- DAY 2 -->
    <div class="day-card">
      <div class="day-badge">2</div>
      <h3>☀️ Morning Upon Waking</h3>
      <p style="font-size:12px;margin-bottom:8px">Client reported waking with approximately <strong>${entry.day2_morning_improvement}%</strong> overall improvement.</p>
      <ul class="checklist">
        ${Object.entries(entry.day2_morning_checklist || {}).map(([k, v]) => v ? `<li><span class="check">✓</span> ${k.replace(/_/g," ")}</li>` : "").join("")}
      </ul>
      <h3 style="margin-top:10px">One Hour After Capsule</h3>
      <div>
        <div class="score-row"><span>Focus</span><span>${entry.day2_focus_score}/10</span><span class="stars">${"★".repeat(entry.day2_focus_score)}${"☆".repeat(10-entry.day2_focus_score)}</span></div>
        <div class="score-row"><span>Clarity</span><span>${entry.day2_clarity_score}/10</span><span class="stars">${"★".repeat(entry.day2_clarity_score)}${"☆".repeat(10-entry.day2_clarity_score)}</span></div>
        <div class="score-row"><span>Energy</span><span>${entry.day2_energy_score}/10</span><span class="stars">${"★".repeat(entry.day2_energy_score)}${"☆".repeat(10-entry.day2_energy_score)}</span></div>
        <div class="score-row"><span>Mood</span><span>${entry.day2_mood_score}/10</span><span class="stars">${"★".repeat(entry.day2_mood_score)}${"☆".repeat(10-entry.day2_mood_score)}</span></div>
      </div>
      <div class="markers" style="margin-top:10px">
        <div class="marker-row"><span class="marker-label">Focus</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day2_focus_pct}%"></div></div><span class="pct">+${entry.day2_focus_pct}%</span></div>
        <div class="marker-row"><span class="marker-label">Mental Clarity</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day2_mental_clarity_pct}%"></div></div><span class="pct">+${entry.day2_mental_clarity_pct}%</span></div>
        <div class="marker-row"><span class="marker-label">Energy</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day2_energy_pct}%"></div></div><span class="pct">+${entry.day2_energy_pct}%</span></div>
        <div class="marker-row"><span class="marker-label">Mood</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day2_mood_pct}%"></div></div><span class="pct">+${entry.day2_mood_pct}%</span></div>
      </div>
      <h3 style="margin-top:10px">🍽️ Afternoon</h3>
      <p style="font-size:12px">${entry.day2_afternoon_notes || ""}</p>
    </div>

    <!-- DAY 3 -->
    <div class="day-card">
      <div class="day-badge">3</div>
      <h3>📞 8:30 AM Follow-Up Call</h3>
      <ul class="checklist">
        ${Object.entries(entry.day3_followup_checklist || {}).map(([k, v]) => v ? `<li><span class="check">✓</span> ${k.replace(/_/g," ")}</li>` : "").join("")}
      </ul>
      ${entry.day3_major_milestone ? `
      <div class="milestone-card" style="margin-top:10px">
        <h3>⭐ MAJOR MILESTONE</h3>
        <p style="font-size:12px">${entry.day3_major_milestone}${entry.day3_milestone_years ? ` (${entry.day3_milestone_years} YEARS)` : ""}</p>
        <p style="font-size:11px;margin-top:4px">${entry.day3_milestone_detail || ""}</p>
      </div>` : ""}
      <h3 style="margin-top:10px">🚶 Walking Assessment</h3>
      <ul class="checklist">
        ${Object.entries(entry.day3_walking_checklist || {}).map(([k, v]) => v ? `<li><span class="check">✓</span> ${k.replace(/_/g," ")}</li>` : "").join("")}
      </ul>
      <div class="markers" style="margin-top:10px">
        <div class="marker-row"><span class="marker-label">Morning Energy</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day3_morning_energy}%"></div></div><span class="pct">+${entry.day3_morning_energy}%</span></div>
        <div class="marker-row"><span class="marker-label">Motivation</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day3_motivation}%"></div></div><span class="pct">+${entry.day3_motivation}%</span></div>
        <div class="marker-row"><span class="marker-label">Walking Comfort</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day3_walking_comfort}%"></div></div><span class="pct">+${entry.day3_walking_comfort}%</span></div>
        <div class="marker-row"><span class="marker-label">Knee Comfort</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day3_knee_comfort}%"></div></div><span class="pct">+${entry.day3_knee_comfort}%</span></div>
        <div class="marker-row"><span class="marker-label">Overall Well-Being</span><div class="bar-bg"><div class="bar-fill" style="width:${entry.day3_overall_wellbeing}%"></div></div><span class="pct">+${entry.day3_overall_wellbeing}%</span></div>
      </div>
    </div>
  </div>

  ${entry.client_quote ? `
  <div class="quote-block">
    <div class="quote-mark">"</div>
    <p>${entry.client_quote}</p>
    <cite>— ${name}</cite>
  </div>` : ""}

  <div class="summary">
    <h2>❧ 3-DAY AVERAGE PROGRESS SUMMARY ❧</h2>
    <div class="summary-grid">
      <div class="summary-item"><div class="icon">😊</div><div class="label">Mood</div><div class="pct-big">${entry.avg_mood}%</div></div>
      <div class="summary-item"><div class="icon">⚡</div><div class="label">Energy</div><div class="pct-big">${entry.avg_energy}%</div></div>
      <div class="summary-item"><div class="icon">🧠</div><div class="label">Mental Clarity</div><div class="pct-big">${entry.avg_mental_clarity}%</div></div>
      <div class="summary-item"><div class="icon">🎯</div><div class="label">Focus</div><div class="pct-big">${entry.avg_focus}%</div></div>
      <div class="summary-item"><div class="icon">💪</div><div class="label">Motivation</div><div class="pct-big">${entry.avg_motivation}%</div></div>
      <div class="summary-item"><div class="icon">🚶</div><div class="label">Walking Comfort</div><div class="pct-big">${entry.avg_walking_comfort}%</div></div>
      <div class="summary-item"><div class="icon">🦵</div><div class="label">Knee Comfort</div><div class="pct-big">${entry.avg_knee_comfort}%</div></div>
      <div class="summary-item"><div class="icon">✨</div><div class="label">Overall Well-Being</div><div class="pct-big">${entry.avg_wellbeing}%</div></div>
    </div>
  </div>

  <div class="footer">
    <p>🌿 Small daily choices create extraordinary outcomes over time.</p>
    <p style="margin-top:6px">Kindest Regards,</p>
    <div class="signature">Dr. Travis Williams — Grandma's Herbals</div>
  </div>
</div>
</body>
</html>`;
}
