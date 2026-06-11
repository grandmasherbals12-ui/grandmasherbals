// Supabase Edge Function — 8 AM Morning Encouragement SMS
// Triggered by pg_cron at 13:00 UTC (8 AM EST)
// Deploy: supabase functions deploy send-morning-encouragement

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

  // Get all entries from last night that haven't sent encouragement yet
  const { data: entries } = await supabase
    .from("daily_progress_entries")
    .select("*, member_profiles(*)")
    .eq("entry_date", dateStr)
    .eq("encouragement_sent", false);

  const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const twilioAuth = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioFrom = Deno.env.get("TWILIO_PHONE_NUMBER");
  const resendKey = Deno.env.get("RESEND_API_KEY");

  for (const entry of entries ?? []) {
    const profile = entry.member_profiles;
    if (!profile) continue;

    // --- TIER LOGIC FOR NOTIFICATION FREQUENCY ---
    const dayOfWeek = new Date().getDay();
    let tone = "standard";

    if (profile.membership_tier === 'tier-1') {
      // 1 message a week
      if (dayOfWeek !== 1) continue;
    } else if (profile.membership_tier === 'tier-2') {
      // Every other day
      if (![1, 3, 5, 0].includes(dayOfWeek)) continue;
    } else if (profile.membership_tier === 'tier-3') {
      // Daily, specific tone on Mon/Wed/Fri/Sun
      if ([1, 3, 5, 0].includes(dayOfWeek)) {
        tone = "start-the-week";
      }
    }

    const firstName = (profile.full_name || "").split(" ")[0];
    const topProgress = getTopProgress(entry);

    const encouragementMsg = await buildEncouragementMessage(firstName, topProgress, entry, tone);

    // Send SMS
    if (twilioSid && twilioAuth && twilioFrom && profile.phone && profile.notification_sms) {
      const smsText = `🌿 Good Morning, ${firstName}!\n\n${encouragementMsg.short}\n\n— Dr. Travis Williams, Grandma's Herbals`;
      await sendSms(twilioSid, twilioAuth, twilioFrom, profile.phone, smsText);
    }

    // Send encouragement email
    if (resendKey && profile.email && profile.notification_email && profile.morning_encouragement) {
      const emailHtml = buildEncouragementEmailHtml(firstName, profile, encouragementMsg.full, entry);
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Dr. Travis Williams <care@grandmasherbals.com>",
          to: [profile.email],
          subject: `Good Morning ${firstName}! Your Daily Encouragement 🌿`,
          html: emailHtml,
        }),
      });
    }

    // Mark as sent + log
    await supabase.from("daily_progress_entries")
      .update({ encouragement_sent: true })
      .eq("id", entry.id);

    await supabase.from("message_log").insert({
      member_id: entry.member_id,
      message_type: "encouragement_sms",
      recipient_phone: profile.phone,
      recipient_email: profile.email,
      subject: `Morning Encouragement — ${firstName}`,
      body: encouragementMsg.short,
      status: "sent",
      sent_at: new Date().toISOString(),
    });
  }

  return new Response(JSON.stringify({ processed: (entries ?? []).length }), {
    headers: { "Content-Type": "application/json" },
  });
});

function getTopProgress(entry: any): string {
  const metrics: [string, number][] = [
    ["energy", entry.day3_morning_energy ?? entry.day1_energy_improvement ?? 0],
    ["walking", entry.day3_walking_comfort ?? 0],
    ["mood", entry.day1_mood_improvement ?? 0],
    ["mental clarity", entry.day1_mental_clarity ?? 0],
    ["motivation", entry.day3_motivation ?? 0],
  ];
  const top = metrics.sort((a, b) => b[1] - a[1])[0];
  return top[0];
}

async function buildEncouragementMessage(name: string, topArea: string, entry: any, tone: string) {
  const areaMessages: Record<string, string> = {
    energy: `Your energy levels are rising and your body is responding beautifully.`,
    walking: `The progress in your movement and walking shows how much your body is healing.`,
    mood: `Your mood improvements are a powerful sign that your wellness journey is working.`,
    "mental clarity": `The mental clarity you're experiencing is opening new possibilities for you each day.`,
    motivation: `Your motivation is building a foundation for lasting health transformation.`,
  };

  let short = `I am so proud of you, ${name}. ${areaMessages[topArea] || "You are making incredible progress on your wellness journey."} Keep showing up. The progress you are experiencing is worth celebrating. 💚`;

  if (tone === "start-the-week") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayStr = days[new Date().getDay()];
    short = `Happy ${todayStr}, ${name}! Let's start the week strong. ${areaMessages[topArea] || "You are making incredible progress."} Keep showing up with intention! 🚀🌿`;
  }

  let full = `Dear ${name},

I am thinking of you this morning and wanted to remind you of something important:

You are doing the work. Every entry you make, every measurement you track, every morning you choose your health — it adds up to something remarkable.

${areaMessages[topArea] || "You are making incredible progress."} ${entry.day3_major_milestone ? `\n\nYour milestone — ${entry.day3_major_milestone} — is something to be deeply proud of. This is real, measurable change.` : ""}

As you begin this day, I encourage you to:
• Take a moment to acknowledge the progress you've made
• Continue your morning movement practice
• Stay consistent with your wellness formula
• Nourish your body with intention

Small daily choices create extraordinary outcomes over time.

Kindest Regards,
Dr. Travis Williams
Grandma's Herbals 🌿`;

  // AI Generation (if API key is present)
  const openRouterKey = Deno.env.get("OPENROUTER_API_KEY") || Deno.env.get("OPENAI_API_KEY");
  if (openRouterKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterKey}`,
          "HTTP-Referer": "https://grandmasherbals.com", // Recommended by OpenRouter
          "X-Title": "Grandma's Herbals", // Recommended by OpenRouter
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are Dr. Travis Williams, the founder of Grandma's Herbals. You write short, deeply encouraging text messages and emails to your wellness clients based on their daily progress. Keep it empathetic, professional, and rooted in natural wellness. Always return valid JSON containing 'short' and 'full' string keys."
            },
            {
              role: "user",
              content: `Write a short SMS encouragement message (under 160 characters) and a full email message for my client ${name}. Their top progress area is ${topArea}. The tone should be "${tone}". Include the milestone "${entry.day3_major_milestone || 'none'}" if present. Return the response as JSON with "short" and "full" keys. Make the full email formatted with paragraphs and bullet points if necessary.`
            }
          ],
          response_format: { type: "json_object" }
        }),
      });

      if (response.ok) {
        const aiData = await response.json();
        const aiResult = JSON.parse(aiData.choices[0].message.content);
        if (aiResult.short && aiResult.full) {
          short = aiResult.short;
          full = aiResult.full;
        }
      } else {
        console.error("OpenAI API Error:", await response.text());
      }
    } catch (err) {
      console.error("Failed to generate AI message", err);
    }
  }

  return { short, full };
}

async function sendSms(sid: string, auth: string, from: string, to: string, body: string) {
  const params = new URLSearchParams({ To: to, From: from, Body: body });
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${sid}:${auth}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
}

function buildEncouragementEmailHtml(name: string, profile: any, message: string, _entry: any): string {
  const paragraphs = message.split("\n\n").filter(Boolean);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #faf8f2; margin: 0; padding: 20px; }
    .wrap { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: #3d6b3f; color: #fff; padding: 32px 40px; text-align: center; }
    .header h1 { font-size: 28px; margin: 0 0 6px; }
    .header p { margin: 0; opacity: 0.8; font-size: 14px; }
    .body { padding: 40px; color: #333; line-height: 1.8; font-size: 15px; }
    .body p { margin-bottom: 18px; }
    .body ul { padding-left: 20px; }
    .body ul li { margin-bottom: 8px; }
    .footer { background: #f0f5f0; padding: 24px 40px; text-align: center; font-size: 12px; color: #666; }
    .sig { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; color: #2d5a30; margin-top: 8px; }
  </style></head><body>
  <div class="wrap">
    <div class="header">
      <h1>🌿 Good Morning, ${name}!</h1>
      <p>Your Daily Encouragement from Grandma's Herbals</p>
    </div>
    <div class="body">
      ${paragraphs.map(p => {
        if (p.startsWith("•")) {
          const items = p.split("\n").filter(l => l.trim().startsWith("•"));
          return `<ul>${items.map(i => `<li>${i.replace("• ", "")}</li>`).join("")}</ul>`;
        }
        return `<p>${p}</p>`;
      }).join("")}
    </div>
    <div class="footer">
      <p>Small daily choices create extraordinary outcomes over time.</p>
      <div class="sig">Dr. Travis Williams — Grandma's Herbals</div>
    </div>
  </div>
  </body></html>`;
}
