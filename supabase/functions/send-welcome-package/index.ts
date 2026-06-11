// Supabase Edge Function — Send Concierge Wellness Welcome Package (Email + SMS)
// Deploy: supabase functions deploy send-welcome-package

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { memberId } = body;

    if (!memberId) {
      return new Response(JSON.stringify({ error: "Missing memberId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the member profile
    const { data: profile, error: profileErr } = await supabaseClient
      .from("member_profiles")
      .select("*")
      .eq("id", memberId)
      .single();

    if (profileErr || !profile) {
      return new Response(
        JSON.stringify({ error: "Member profile not found: " + (profileErr?.message || "") }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine pronoun variables based on gender
    let relationshipNouns = "leader, entrepreneur, provider, mentor, and friend";
    if (profile.gender === "male") {
      relationshipNouns = "husband, father, leader, entrepreneur, provider, mentor, and friend";
    } else if (profile.gender === "female") {
      relationshipNouns = "wife, mother, leader, entrepreneur, provider, mentor, and friend";
    }

    // Generate HTML content
    const welcomeHtml = generateWelcomeHtml(profile, relationshipNouns);

    // Send welcome email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    let emailSent = false;
    let emailErr = "";

    if (resendKey && profile.email) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Dr. Travis Williams <reports@grandmasherbals.com>",
            to: [profile.email],
            subject: `Welcome to Concierge Wellness Care — ${profile.full_name}`,
            html: welcomeHtml,
          }),
        });

        if (res.ok) {
          emailSent = true;
          // Log email to message_log
          await supabaseClient.from("message_log").insert({
            member_id: memberId,
            message_type: "report_email",
            recipient_email: profile.email,
            subject: `Welcome to Concierge Wellness Care`,
            body: "Sent Concierge Wellness Welcome Package Email",
            status: "sent",
            sent_at: new Date().toISOString(),
          });
        } else {
          const errText = await res.text();
          emailErr = `Resend API error: ${errText}`;
        }
      } catch (err: any) {
        emailErr = String(err);
      }
    } else {
      emailErr = "Resend API key or email missing.";
    }

    // Send welcome SMS via Twilio
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuth = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioFrom = Deno.env.get("TWILIO_PHONE_NUMBER");
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://grandmasherbals.com";
    let smsSent = false;
    let smsErr = "";

    if (twilioSid && twilioAuth && twilioFrom && profile.phone) {
      try {
        const namePart = (profile.full_name || "").replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/, "");
        const firstName = namePart.split(" ")[0];
        const smsBody = `🌿 Grandma's Herbals\nWelcome to Concierge Wellness Care, ${firstName}!\nWe are honored to support your wellness journey.\nLog in to submit daily reports: ${siteUrl}/membership\n— Dr. Travis Williams`;

        const params = new URLSearchParams({
          To: profile.phone,
          From: twilioFrom,
          Body: smsBody,
        });

        const res = await fetch(
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

        if (res.ok) {
          smsSent = true;
          // Log SMS to message_log
          await supabaseClient.from("message_log").insert({
            member_id: memberId,
            message_type: "report_sms",
            recipient_phone: profile.phone,
            body: smsBody,
            status: "sent",
            sent_at: new Date().toISOString(),
          });
        } else {
          const errText = await res.text();
          smsErr = `Twilio API error: ${errText}`;
        }
      } catch (err: any) {
        smsErr = String(err);
      }
    } else {
      smsErr = "Twilio credentials or phone number missing.";
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailSent,
        emailErr: emailErr || null,
        smsSent,
        smsErr: smsErr || null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateWelcomeHtml(profile: any, relationshipNouns: string): string {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const goals = profile.primary_goals || [];
  const hasWellnessFormula = !!profile.wellness_formula;
  const formulaName = profile.wellness_formula || "Bespoke Wellness Compound";

  // Render wellness objectives as checkmarks
  const goalsHtml = goals.length > 0
    ? goals
        .map(
          (g: string) => `
        <div style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px; text-align: left;">
          <span style="color: #495834; font-weight: bold; font-size: 14px; margin-right: 6px;">✓</span>
          <span style="font-size: 13px; color: #4a4a4a; line-height: 1.4;">${g}</span>
        </div>`
        )
        .join("")
    : `
      <div style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px; text-align: left;">
        <span style="color: #495834; font-weight: bold; font-size: 14px; margin-right: 6px;">✓</span>
        <span style="font-size: 13px; color: #4a4a4a; line-height: 1.4;">Healthy energy production</span>
      </div>
      <div style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px; text-align: left;">
        <span style="color: #495834; font-weight: bold; font-size: 14px; margin-right: 6px;">✓</span>
        <span style="font-size: 13px; color: #4a4a4a; line-height: 1.4;">Positive mood & well-being</span>
      </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Concierge Wellness Care</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=Outfit:wght@300;400;600&display=swap');
    
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #faf8f5;
      color: #333333;
    }
    
    .container {
      max-width: 800px;
      margin: 40px auto;
      background-color: #ffffff;
      border: 1px solid #e3decb;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(73, 88, 52, 0.05);
    }
    
    .header {
      padding: 40px;
      background: linear-gradient(135deg, #f4f1ea 0%, #faf8f5 100%);
      border-bottom: 1px dashed #e3decb;
      position: relative;
    }
    
    .header-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .logo-container {
      width: 110px;
      vertical-align: middle;
    }
    
    .logo-circle {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background-color: #495834;
      border: 3px solid #8ca885;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-family: 'Cormorant Garamond', serif;
      font-size: 10px;
      font-weight: bold;
      letter-spacing: 1px;
      line-height: 1.1;
      text-align: center;
    }
    
    .logo-circle span {
      font-size: 13px;
      letter-spacing: 0px;
    }
    
    .title-container {
      text-align: center;
      vertical-align: middle;
      padding: 0 20px;
    }
    
    .welcome-text {
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: #b8924b;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin: 0 0 4px 0;
    }
    
    .main-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 32px;
      font-weight: 700;
      color: #273822;
      line-height: 1.1;
      margin: 0 0 6px 0;
    }
    
    .subtitle-text {
      font-size: 11px;
      font-weight: 400;
      color: #617355;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 0;
    }
    
    .client-info-box {
      width: 220px;
      background-color: #faf8f5;
      border: 1px solid #e3decb;
      border-radius: 16px;
      padding: 16px;
      vertical-align: middle;
      font-size: 13px;
      line-height: 1.5;
    }
    
    .info-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #617355;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    
    .info-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 17px;
      font-weight: 700;
      color: #273822;
      margin-bottom: 12px;
    }
    
    .info-value:last-child {
      margin-bottom: 0;
    }
    
    .content-body {
      padding: 40px;
    }
    
    .letter-card {
      background-color: #faf9f6;
      border: 1px solid #ebdcb7;
      border-radius: 20px;
      padding: 30px;
      position: relative;
    }
    
    .letter-header {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .salutation {
      font-family: 'Cormorant Garamond', serif;
      font-size: 26px;
      font-style: italic;
      color: #273822;
    }
    
    .letter-date {
      font-size: 13px;
      color: #617355;
      text-align: right;
    }
    
    .letter-text {
      font-size: 15px;
      line-height: 1.7;
      color: #4a4a4a;
    }
    
    .letter-text p {
      margin-top: 0;
      margin-bottom: 16px;
    }
    
    .letter-text p:last-child {
      margin-bottom: 0;
    }
    
    .letter-footer {
      margin-top: 24px;
      border-top: 1px solid #ebdcb7;
      padding-top: 16px;
    }
    
    .signature-title {
      font-size: 12px;
      color: #617355;
      margin-bottom: 4px;
    }
    
    .signature-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 24px;
      font-style: italic;
      font-weight: 700;
      color: #273822;
      line-height: 1;
    }
    
    .signature-brand {
      font-size: 13px;
      font-weight: 600;
      color: #495834;
      margin-top: 2px;
    }
    
    .features-section {
      margin-top: 30px;
    }
    
    .features-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .feature-card {
      width: 32.5%;
      background-color: #ffffff;
      border: 1px solid #e3decb;
      border-radius: 16px;
      padding: 20px;
      vertical-align: top;
    }
    
    .feature-icon-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .feature-icon {
      font-size: 20px;
      line-height: 1;
    }
    
    .feature-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #273822;
      line-height: 1.2;
    }
    
    .feature-subtitle {
      font-size: 11px;
      font-style: italic;
      color: #b8924b;
      margin-top: -8px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .feature-text {
      font-size: 12px;
      line-height: 1.6;
      color: #555555;
    }
    
    .monitor-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    .monitor-label {
      font-size: 12px;
      font-weight: 600;
      color: #333333;
    }
    
    .footer-bar {
      background-color: #f4f1ea;
      padding: 24px;
      text-align: center;
      font-size: 13px;
      font-style: italic;
      color: #617355;
      border-top: 1px solid #e3decb;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Area -->
    <div class="header">
      <table class="header-table">
        <tr>
          <!-- Logo -->
          <td class="logo-container">
            <div class="logo-circle">
              GRANDMA'S<br>
              <span>HERBALS</span><br>
              PLANT WISDOM
            </div>
          </td>
          <!-- Titles -->
          <td class="title-container">
            <div class="welcome-text">Welcome To</div>
            <h1 class="main-title">CONCIERGE WELLNESS CARE</h1>
            <div class="subtitle-text">Rooted in Ancient Wisdom. Cultivated for Well-Being.</div>
          </td>
          <!-- Client Details -->
          <td class="client-info-box">
            <div class="info-label">Client</div>
            <div class="info-value">${profile.full_name}</div>
            
            <div class="info-label">Age</div>
            <div class="info-value">${profile.age || "—"}</div>
            
            <div class="info-label">Wellness Formula</div>
            <div class="info-value" style="font-size: 15px; margin-bottom: 0;">${formulaName}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content Body -->
    <div class="content-body">
      <!-- Letter Block -->
      <div class="letter-card">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <td class="salutation">Dear ${profile.full_name},</td>
            <td class="letter-date">${currentDate}</td>
          </tr>
        </table>
        
        <div class="letter-text">
          <p>Welcome to the Grandma's Herbals Concierge Wellness Community.</p>
          
          <p>I am honored to be a part of your wellness journey.</p>
          
          <p>The decision to invest in your health, vitality, performance, and longevity is one of the most important commitments you can make—not only for yourself, but for the people who love you, depend on you, and benefit from your presence every day.</p>
          
          <p>You are entering a season of intentional wellness. This is not simply about feeling better. It is about becoming stronger, more energized, more resilient, and more capable of showing up as the best version of yourself.</p>
          
          <p>You are a ${relationshipNouns} to many people. So many others depend on you in different ways, and because you spend so much of your time pouring into others, this season is also about pouring into yourself.</p>
          
          <p>Your commitment today is an investment in your future.</p>
          
          <p>We are excited to walk alongside you and support your journey toward greater vitality, performance, and well-being.</p>
        </div>
        
        <div class="letter-footer">
          <div class="signature-title">With gratitude and respect,</div>
          <div class="signature-name">Dr. Travis Williams</div>
          <div class="signature-brand">Grandma's Herbals</div>
        </div>
      </div>

      <!-- Footer Cards Grid -->
      <div class="features-section">
        <table class="features-table">
          <tr>
            <!-- Why This is Different -->
            <td class="feature-card" style="padding-right: 12px;">
              <div class="feature-icon-title">
                <span class="feature-icon">🍯</span>
                <span class="feature-title">Why This Is Different</span>
              </div>
              <div class="feature-subtitle">Not a Generic Supplement</div>
              <div class="feature-text">
                Your formulation is not a mass-produced vitamin. It is not a one-size-fits-all product. It is not designed for millions of people.
                <br><br>
                Instead, your formulation is a bespoke wellness compound, thoughtfully developed around your wellness objectives, lifestyle, performance goals, and desired outcomes.
                <br><br>
                <strong>Every ingredient has a purpose. Every recommendation has intention. Every protocol is designed to support your wellness journey.</strong>
                <br><br>
                This is Concierge Wellness Formulation.
              </div>
            </td>
            
            <td style="width: 1.25%;"></td>
            
            <!-- Primary Wellness Objectives -->
            <td class="feature-card" style="padding-left: 12px; padding-right: 12px;">
              <div class="feature-icon-title">
                <span class="feature-icon">🍁</span>
                <span class="feature-title">Wellness Objectives</span>
              </div>
              <div class="feature-subtitle">Bespoke Guidance & Targets</div>
              <div class="feature-text">
                ${goalsHtml}
              </div>
            </td>
            
            <td style="width: 1.25%;"></td>
            
            <!-- Areas We Will Monitor -->
            <td class="feature-card" style="padding-left: 12px;">
              <div class="feature-icon-title">
                <span class="feature-icon">❤️</span>
                <span class="feature-title">Areas We Monitor</span>
              </div>
              <div class="feature-subtitle">Waking & Performance Metrics</div>
              <div class="feature-text">
                <div class="monitor-item">
                  <span style="font-size: 14px;">🏃</span>
                  <span class="monitor-label">Energy & Endurance</span>
                </div>
                <div style="font-size: 11px; color: #666; margin-left: 24px; margin-bottom: 8px; line-height: 1.3;">
                  Supporting sustainable daily energy and physical performance.
                </div>
                
                <div class="monitor-item">
                  <span style="font-size: 14px;">😊</span>
                  <span class="monitor-label">Mood & Motivation</span>
                </div>
                <div style="font-size: 11px; color: #666; margin-left: 24px; margin-bottom: 8px; line-height: 1.3;">
                  Promoting emotional balance, confidence, and mental clarity.
                </div>
                
                <div class="monitor-item">
                  <span style="font-size: 14px;">🩸</span>
                  <span class="monitor-label">Circulation & Blood Flow</span>
                </div>
                <div style="font-size: 11px; color: #666; margin-left: 24px; margin-bottom: 8px; line-height: 1.3;">
                  Optimizing flow, muscle recovery, and overall systemic relaxation.
                </div>
                
                <div class="monitor-item">
                  <span style="font-size: 14px;">🩺</span>
                  <span class="monitor-label">Heart Conditioning</span>
                </div>
                <div style="font-size: 11px; color: #666; margin-left: 24px; margin-bottom: 8px; line-height: 1.3;">
                  Supporting healthy cardiac reserves and cardiovascular stamina.
                </div>
                
                <div class="monitor-item">
                  <span style="font-size: 14px;">🔬</span>
                  <span class="monitor-label">Metabolic Wellness</span>
                </div>
                <div style="font-size: 11px; color: #666; margin-left: 24px; margin-bottom: 8px; line-height: 1.3;">
                  Maintaining healthy blood sugar balance and lipid profiles.
                </div>
                
                <div class="monitor-item">
                  <span style="font-size: 14px;">🌱</span>
                  <span class="monitor-label">${profile.gender === "female" ? "Women's Wellness" : "Men's Wellness"}</span>
                </div>
                <div style="font-size: 11px; color: #666; margin-left: 24px; line-height: 1.3;">
                  Nurturing endocrine balance, vitality, and physical longevity.
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Bottom Footer Bar -->
    <div class="footer-bar">
      🌿 Small daily choices create extraordinary outcomes over time.
    </div>
  </div>
</body>
</html>`;
}
