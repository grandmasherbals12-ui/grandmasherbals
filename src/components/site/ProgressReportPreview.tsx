import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

type ReportEntry = {
  id: string;
  member_name: string;
  member_age: number;
  wellness_formula: string;
  report_date: string;
  entry?: {
    day1_hour1_notes: string;
    day1_hour2_notes: string;
    day1_pain_reduction: number;
    day1_mood_improvement: number;
    day1_energy_improvement: number;
    day1_mental_clarity: number;
    day2_morning_improvement: number;
    day2_morning_checklist: Record<string, boolean>;
    day2_focus_score: number;
    day2_clarity_score: number;
    day2_energy_score: number;
    day2_mood_score: number;
    day2_afternoon_notes: string;
    day2_focus_pct: number;
    day2_mental_clarity_pct: number;
    day2_energy_pct: number;
    day2_mood_pct: number;
    day3_followup_checklist: Record<string, boolean>;
    day3_major_milestone: string;
    day3_milestone_years: number;
    day3_milestone_detail: string;
    day3_walking_checklist: Record<string, boolean>;
    day3_morning_energy: number;
    day3_motivation: number;
    day3_walking_comfort: number;
    day3_knee_comfort: number;
    day3_overall_wellbeing: number;
    client_quote: string;
    avg_mood: number;
    avg_energy: number;
    avg_mental_clarity: number;
    avg_focus: number;
    avg_motivation: number;
    avg_walking_comfort: number;
    avg_knee_comfort: number;
    avg_wellbeing: number;
  };
  encouragement_text: string;
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

function ProgressBar({ label, value, icon }: { label: string; value: number; icon?: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs text-stone-500 w-32 shrink-0">{icon} {label}</span>
      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: "linear-gradient(to right, #5a8a5c, #2d5a30)",
          }}
        />
      </div>
      <span className="text-xs font-bold text-olive-700 w-10 text-right">{value}%</span>
    </div>
  );
}

function StarRow({ label, score, outOf = 10 }: { label: string; score: number; outOf?: number }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-stone-50 last:border-0">
      <span className="text-xs font-semibold text-stone-700 w-16">{label}</span>
      <span className="text-xs text-stone-400">{score}/{outOf}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: outOf }, (_, i) => (
          <span key={i} className={`text-sm ${i < score ? "text-yellow-400" : "text-stone-200"}`}>★</span>
        ))}
      </div>
    </div>
  );
}

function CheckRow({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className={`font-bold text-sm ${checked ? "text-olive-600" : "text-stone-300"}`}>
        {checked ? "✓" : "○"}
      </span>
      <span className={`text-xs ${checked ? "text-stone-700" : "text-stone-300"}`}>{label}</span>
    </div>
  );
}

function SummaryMetric({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-stone-500 mb-1 leading-tight">{label}</div>
      <div className="text-xl font-black text-olive-700">{value}%</div>
    </div>
  );
}

// ─── Main Report Preview ──────────────────────────────────────────────────────

interface ProgressReportPreviewProps {
  reportId?: string;
  /** Pass live data when generating from form before saving */
  liveData?: ReportEntry;
}

export function ProgressReportPreview({ reportId, liveData }: ProgressReportPreviewProps) {
  const [report, setReport] = useState<ReportEntry | null>(liveData ?? null);
  const [loading, setLoading] = useState(!liveData && !!reportId);

  useEffect(() => {
    if (!reportId || liveData) return;
    const fetchReport = async () => {
      const { data } = await supabase
        .from("progress_reports")
        .select("*, entry:daily_progress_entries(*)")
        .eq("id", reportId)
        .single();
      if (data) setReport(data as ReportEntry);
      setLoading(false);
    };
    fetchReport();
  }, [reportId, liveData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin h-10 w-10 border-4 border-olive-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!report) return null;

  const e = report.entry;
  const firstName = (report.member_name || "").split(" ")[0];

  // Parse encouragement into paragraphs
  const encouragementParagraphs = (report.encouragement_text || "")
    .split("\n\n")
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div>
      {/* Print/Download controls */}
      <div className="flex gap-3 mb-6 print:hidden">
        <Button
          onClick={() => window.print()}
          variant="outline"
          className="rounded-full gap-2"
        >
          <Printer className="h-4 w-4" /> Print / Save PDF
        </Button>
        <Button
          onClick={() => window.print()}
          className="bg-olive-600 hover:bg-olive-700 text-white rounded-full gap-2"
        >
          <Download className="h-4 w-4" /> Download Report
        </Button>
      </div>

      {/* ─── Report Card ─── */}
      <div
        id="report-preview"
        className="bg-[#faf8f2] rounded-2xl overflow-hidden shadow-xl border border-stone-200 font-sans"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {/* ── Header ── */}
        <div className="bg-[#faf8f2] p-8 border-b-4 border-[#3d6b3f]">
          <div className="flex items-start justify-between">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 rounded-full border-4 border-[#8ba888] flex items-center justify-center text-center"
                style={{ background: "radial-gradient(circle, #4a7a4c, #2d5a30)" }}
              >
                <div className="text-white text-[9px] font-black leading-tight tracking-wide px-2">
                  <div className="border-b border-white/50 pb-1 mb-1 text-[7px]">
                    ✦ FLOWER ✦ HERB ✦
                  </div>
                  GRANDMA'S<br />HERBALS
                  <div className="border-t border-white/50 pt-1 mt-1 text-[7px]">
                    ✦ ROOT ✦ LEAF ✦
                  </div>
                </div>
              </div>
              <div className="text-[9px] text-[#3d6b3f] font-semibold mt-1 tracking-wide">Plant wisdom from root to leaf</div>
            </div>

            {/* Title */}
            <div className="text-center flex-1 px-6">
              <p className="text-[11px] font-bold tracking-[0.3em] text-[#5a8a5c] uppercase mb-1">3-Day Client</p>
              <h1
                className="text-4xl font-black text-[#1a3d1c] leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                PROGRESS<br />REPORT
              </h1>
              <div className="w-12 h-0.5 bg-[#8ba888] mx-auto my-2" />
              <p className="text-[10px] tracking-[0.25em] text-[#5a8a5c] uppercase">
                Celebrating Consistency,<br />Movement & Well-Being
              </p>
            </div>

            {/* Client Info */}
            <div className="bg-[#f0f5f0] border-2 border-[#c8dcc8] rounded-xl p-4 min-w-[160px] text-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#3d6b3f]">👤</span>
                <div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wide">Client</div>
                  <div className="font-bold text-[#1a3d1c]">{firstName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#3d6b3f]">📅</span>
                <div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wide">Age</div>
                  <div className="font-bold text-[#1a3d1c]">{report.member_age}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#3d6b3f]">🌿</span>
                <div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wide">Wellness Formula</div>
                  <div className="font-semibold text-[#1a3d1c] text-xs">{report.wellness_formula}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ── Nourishing Box ── */}
          <div
            className="rounded-xl p-5 text-white text-center font-bold text-base leading-relaxed"
            style={{ background: "linear-gradient(135deg, #3d6b3f, #2d5a30)" }}
          >
            NOURISHING THE BODY,<br />
            SUPPORTING THE JOURNEY,<br />
            HONORING YOU. 💚
          </div>

          {/* ── Letter ── */}
          {encouragementParagraphs.length > 0 && (
            <div className="bg-[#faf9f5] border-l-4 border-[#8ba888] p-6 rounded-r-xl">
              <div className="text-sm leading-relaxed text-[#3d3d3d] space-y-3">
                {encouragementParagraphs.map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{
                    __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#1a3d1c]">$1</strong>'),
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* ── Day Cards Grid ── */}
          {e && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* DAY 1 */}
              <div className="bg-white border-2 border-[#c8dcc8] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-[#3d6b3f] text-white text-xs font-black rounded-full w-8 h-8 flex items-center justify-center">
                    DAY<br/>1
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[#3d6b3f]">⏰</span>
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-wide">Hour 1</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{e.day1_hour1_notes || "No adverse effects reported. Mild improvement in overall comfort and well-being."}</p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[#3d6b3f]">⏰</span>
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-wide">Hour 2</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{e.day1_hour2_notes || "Reported feeling the best felt in years."}</p>
                </div>
                <div className="pt-3 border-t border-stone-100">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">Estimated Improvement Markers</div>
                  <ProgressBar label="Pain Reduction" value={e.day1_pain_reduction} icon="❤️" />
                  <ProgressBar label="Mood Improvement" value={e.day1_mood_improvement} icon="😊" />
                  <ProgressBar label="Energy" value={e.day1_energy_improvement} icon="⚡" />
                  <ProgressBar label="Mental Clarity" value={e.day1_mental_clarity} icon="🧠" />
                </div>
              </div>

              {/* DAY 2 */}
              <div className="bg-white border-2 border-[#c8dcc8] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-[#3d6b3f] text-white text-xs font-black rounded-full w-8 h-8 flex items-center justify-center">
                    DAY<br/>2
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#5a8a5c] uppercase tracking-wide">☀️ Morning Upon Waking</div>
                  </div>
                </div>
                <p className="text-xs text-stone-600 mb-2">
                  Client reported waking with approximately{" "}
                  <strong className="text-[#2d5a30]">{e.day2_morning_improvement}%</strong> overall improvement compared to normal baseline.
                </p>
                <div className="mb-3 space-y-0.5">
                  {Object.entries(e.day2_morning_checklist || {}).map(([k, v]) => (
                    <CheckRow key={k} checked={!!v} label={k.replace(/_/g, " ")} />
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 mb-3">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">🌿 One Hour After Capsule</div>
                  <StarRow label="Focus" score={e.day2_focus_score} />
                  <StarRow label="Clarity" score={e.day2_clarity_score} />
                  <StarRow label="Energy" score={e.day2_energy_score} />
                  <StarRow label="Mood" score={e.day2_mood_score} />
                </div>

                <div className="pt-2 border-t border-stone-100 mb-3">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">Estimated Improvement Markers</div>
                  <ProgressBar label="Focus" value={e.day2_focus_pct} icon="🎯" />
                  <ProgressBar label="Mental Clarity" value={e.day2_mental_clarity_pct} icon="🧠" />
                  <ProgressBar label="Energy" value={e.day2_energy_pct} icon="⚡" />
                  <ProgressBar label="Mood" value={e.day2_mood_pct} icon="😊" />
                </div>

                {e.day2_afternoon_notes && (
                  <div className="pt-2 border-t border-stone-100">
                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">🍽️ Afternoon</div>
                    <p className="text-xs text-stone-600 leading-relaxed">{e.day2_afternoon_notes}</p>
                  </div>
                )}
              </div>

              {/* DAY 3 */}
              <div className="bg-white border-2 border-[#c8dcc8] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-[#3d6b3f] text-white text-xs font-black rounded-full w-8 h-8 flex items-center justify-center">
                    DAY<br/>3
                  </div>
                  <div className="text-[10px] font-bold text-[#5a8a5c] uppercase tracking-wide">📞 8:30 AM Follow-Up</div>
                </div>
                <div className="mb-3 space-y-0.5">
                  {Object.entries(e.day3_followup_checklist || {}).map(([k, v]) => (
                    <CheckRow key={k} checked={!!v} label={k.replace(/_/g, " ")} />
                  ))}
                </div>

                {e.day3_major_milestone && (
                  <div className="bg-[#fffbe6] border border-[#f5c518] rounded-lg p-3 mb-3">
                    <div className="text-[10px] font-black text-[#7a6000] uppercase tracking-wider mb-1">⭐ MAJOR MILESTONE</div>
                    <p className="text-xs text-[#5a4500] font-semibold">
                      For the first time in approximately{" "}
                      <strong>{e.day3_milestone_years} YEARS</strong>
                    </p>
                    <p className="text-xs text-[#5a4500]">{e.day3_major_milestone}</p>
                    {e.day3_milestone_detail && <p className="text-xs text-stone-500 mt-1">{e.day3_milestone_detail}</p>}
                  </div>
                )}

                <div className="mb-3">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">🚶 Walking Assessment</div>
                  <div className="space-y-0.5">
                    {Object.entries(e.day3_walking_checklist || {}).map(([k, v]) => (
                      <CheckRow key={k} checked={!!v} label={k.replace(/_/g, " ")} />
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">Estimated Improvement Markers</div>
                  <ProgressBar label="Morning Energy" value={e.day3_morning_energy} icon="⚡" />
                  <ProgressBar label="Motivation" value={e.day3_motivation} icon="💪" />
                  <ProgressBar label="Walking Comfort" value={e.day3_walking_comfort} icon="🚶" />
                  <ProgressBar label="Knee Comfort" value={e.day3_knee_comfort} icon="🦵" />
                  <ProgressBar label="Overall Well-Being" value={e.day3_overall_wellbeing} icon="✨" />
                </div>
              </div>
            </div>
          )}

          {/* ── Quote ── */}
          {e?.client_quote && (
            <div
              className="rounded-2xl p-6 text-white text-center"
              style={{ background: "linear-gradient(135deg, #3d6b3f, #1a3d1c)" }}
            >
              <div className="text-5xl opacity-40 font-serif leading-none mb-2">"</div>
              <p className="text-sm italic leading-relaxed mb-3">{e.client_quote}</p>
              <p className="text-xs opacity-70">— {firstName}</p>
            </div>
          )}

          {/* ── 3-Day Summary ── */}
          {e && (
            <div>
              <div className="text-center mb-4">
                <div className="inline-block border-t-2 border-b-2 border-[#c8dcc8] px-8 py-2">
                  <span
                    className="text-sm font-bold tracking-[0.25em] text-[#2d5a30] uppercase"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    ❧ 3-Day Average Progress Summary ❧
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4 bg-white border-2 border-[#c8dcc8] rounded-xl p-6">
                <SummaryMetric icon="😊" label="Mood" value={e.avg_mood} />
                <SummaryMetric icon="⚡" label="Energy" value={e.avg_energy} />
                <SummaryMetric icon="🧠" label="Mental Clarity" value={e.avg_mental_clarity} />
                <SummaryMetric icon="🎯" label="Focus" value={e.avg_focus} />
                <SummaryMetric icon="💪" label="Motivation" value={e.avg_motivation} />
                <SummaryMetric icon="🚶" label="Walking Comfort" value={e.avg_walking_comfort} />
                <SummaryMetric icon="🦵" label="Knee Comfort" value={e.avg_knee_comfort} />
                <SummaryMetric icon="✨" label="Overall Well-Being" value={e.avg_wellbeing} />
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="border-t-2 border-[#c8dcc8] pt-6 text-center space-y-2">
            <p className="text-xs text-stone-500 italic">
              🌿 Small daily choices create extraordinary outcomes over time.
            </p>
            <p className="text-xs text-stone-400">Kindest Regards,</p>
            <p
              className="text-xl text-[#2d5a30] font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Dr. Travis Williams
            </p>
            <p className="text-xs text-[#5a8a5c] font-semibold tracking-wide uppercase">Grandma's Herbals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
