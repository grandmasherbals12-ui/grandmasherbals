import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  ChevronRight, ChevronLeft, CheckCircle2, Star, Send, Loader2, Activity,
  Sun, Phone, Footprints, Brain, Zap, Heart, SmilePlus, Target,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type FormData = {
  // Client identity (auto-filled from profile)
  memberName: string;
  age: string;
  wellnessFormula: string;

  // Day 1
  day1Hour1Notes: string;
  day1Hour2Notes: string;
  day1PainReduction: number;
  day1MoodImprovement: number;
  day1EnergyImprovement: number;
  day1MentalClarity: number;

  // Day 2 – Morning
  day2MorningImprovement: number;
  day2MorningSleepQuality: boolean;
  day2MorningMood: boolean;
  day2MorningEnergy: boolean;
  day2MorningMotivation: boolean;
  // Day 2 – One hour after
  day2FocusScore: number;
  day2ClarityScore: number;
  day2EnergyScore: number;
  day2MoodScore: number;
  // Day 2 – Improvement %
  day2FocusPct: number;
  day2MentalClarityPct: number;
  day2EnergyPct: number;
  day2MoodPct: number;
  // Day 2 – Afternoon
  day2AfternoonNotes: string;

  // Day 3
  day3FeelingGreat: boolean;
  day3IncreasedEnergy: boolean;
  day3ImprovedMotivation: boolean;
  day3PositiveMood: boolean;
  day3MajorMilestone: string;
  day3MilestoneYears: string;
  day3MilestoneDetail: string;
  day3NoKneePain: boolean;
  day3NoMobilityLimit: boolean;
  day3ImprovedConfidence: boolean;
  day3WillingToExercise: boolean;
  day3MorningEnergy: number;
  day3Motivation: number;
  day3WalkingComfort: number;
  day3KneeComfort: number;
  day3OverallWellbeing: number;

  // Quote & Feedback
  clientQuote: string;
  videoFeedbackUrl: string;
  negativeFeedback: string;
};

const initialForm: FormData = {
  memberName: "", age: "", wellnessFormula: "",
  day1Hour1Notes: "", day1Hour2Notes: "",
  day1PainReduction: 0, day1MoodImprovement: 0, day1EnergyImprovement: 0, day1MentalClarity: 0,
  day2MorningImprovement: 0,
  day2MorningSleepQuality: false, day2MorningMood: false, day2MorningEnergy: false, day2MorningMotivation: false,
  day2FocusScore: 0, day2ClarityScore: 0, day2EnergyScore: 0, day2MoodScore: 0,
  day2FocusPct: 0, day2MentalClarityPct: 0, day2EnergyPct: 0, day2MoodPct: 0,
  day2AfternoonNotes: "",
  day3FeelingGreat: false, day3IncreasedEnergy: false, day3ImprovedMotivation: false, day3PositiveMood: false,
  day3MajorMilestone: "", day3MilestoneYears: "", day3MilestoneDetail: "",
  day3NoKneePain: false, day3NoMobilityLimit: false, day3ImprovedConfidence: false, day3WillingToExercise: false,
  day3MorningEnergy: 0, day3Motivation: 0, day3WalkingComfort: 0, day3KneeComfort: 0, day3OverallWellbeing: 0,
  clientQuote: "", videoFeedbackUrl: "", negativeFeedback: "",
};

// ─── Step Components ─────────────────────────────────────────────────────────

function StepHeader({ icon, day, title }: { icon: React.ReactNode; day: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-olive-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shrink-0">
        {day}
      </div>
      <div className="flex items-center gap-2 text-olive-700">
        {icon}
        <h3 className="text-xl font-cormorant font-bold">{title}</h3>
      </div>
    </div>
  );
}

function PercentSlider({ label, value, onChange, icon }: { label: string; value: number; onChange: (v: number) => void; icon?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
          {icon} {label}
        </div>
        <span className="text-olive-700 font-bold text-sm">{value}%</span>
      </div>
      <div className="relative">
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${value}%`,
              background: "linear-gradient(to right, #5a8a5c, #2d5a30)",
            }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
      </div>
    </div>
  );
}

function StarRating({ label, score, onChange }: { label: string; score: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
      <span className="text-sm font-medium text-stone-700 w-24">{label}</span>
      <span className="text-xs text-stone-500 w-12 text-center">{score}/10</span>
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <button key={i} type="button" onClick={() => onChange(i + 1)} className="transition-transform hover:scale-125">
            <Star className={`h-4 w-4 ${i < score ? "fill-yellow-400 text-yellow-400" : "text-stone-200"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer group">
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? "bg-olive-600 border-olive-600" : "border-stone-300 group-hover:border-olive-400"
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && <CheckCircle2 className="h-3 w-3 text-white fill-white" />}
      </div>
      <span className={`text-sm ${checked ? "text-olive-800 font-medium" : "text-stone-600"}`}>{label}</span>
    </label>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface DailyProgressFormProps {
  onComplete?: () => void;
}

export function DailyProgressForm({ onComplete }: DailyProgressFormProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(null);

  const totalSteps = 5; // 0=Client Info, 1=Day1, 2=Day2, 3=Day3, 4=Quote+Submit

  const set = (key: keyof FormData, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Auto-fill from member profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("member_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (profile) {
        setForm((prev) => ({
          ...prev,
          memberName: profile.full_name ?? "",
          age: String(profile.age ?? ""),
          wellnessFormula: profile.wellness_formula ?? "",
        }));
      }
    };
    fetchProfile();
  }, []);

  const submitEntry = async () => {
    if (!form.memberName) {
      toast.error("Please enter your name in Step 1.", { duration: 4000 });
      setStep(0);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const avgMood = Math.round((form.day1MoodImprovement + form.day2MoodPct + (form.day3FeelingGreat ? 75 : 50)) / 3);
      const avgEnergy = Math.round((form.day1EnergyImprovement + form.day2EnergyPct + form.day3MorningEnergy) / 3);
      const avgFocus = Math.round((form.day1MentalClarity + form.day2FocusPct + form.day3MorningEnergy) / 3);
      const avgMentalClarity = Math.round((form.day1MentalClarity + form.day2MentalClarityPct + form.day3OverallWellbeing) / 3);

      const entryPayload = {
        member_id: user.id,
        entry_date: new Date().toISOString().split("T")[0],
        day1_hour1_notes: form.day1Hour1Notes,
        day1_hour2_notes: form.day1Hour2Notes,
        day1_pain_reduction: form.day1PainReduction,
        day1_mood_improvement: form.day1MoodImprovement,
        day1_energy_improvement: form.day1EnergyImprovement,
        day1_mental_clarity: form.day1MentalClarity,
        day2_morning_improvement: form.day2MorningImprovement,
        day2_morning_checklist: {
          sleep_quality: form.day2MorningSleepQuality,
          improved_mood: form.day2MorningMood,
          increased_energy: form.day2MorningEnergy,
          greater_motivation: form.day2MorningMotivation,
        },
        day2_focus_score: form.day2FocusScore,
        day2_clarity_score: form.day2ClarityScore,
        day2_energy_score: form.day2EnergyScore,
        day2_mood_score: form.day2MoodScore,
        day2_afternoon_notes: form.day2AfternoonNotes,
        day2_focus_pct: form.day2FocusPct,
        day2_mental_clarity_pct: form.day2MentalClarityPct,
        day2_energy_pct: form.day2EnergyPct,
        day2_mood_pct: form.day2MoodPct,
        day3_followup_checklist: {
          feeling_great: form.day3FeelingGreat,
          increased_morning_energy: form.day3IncreasedEnergy,
          improved_motivation: form.day3ImprovedMotivation,
          continued_positive_mood: form.day3PositiveMood,
        },
        day3_major_milestone: form.day3MajorMilestone,
        day3_milestone_years: form.day3MilestoneYears ? parseInt(form.day3MilestoneYears) : null,
        day3_milestone_detail: form.day3MilestoneDetail,
        day3_walking_checklist: {
          no_knee_pain: form.day3NoKneePain,
          no_mobility_limitations: form.day3NoMobilityLimit,
          improved_confidence: form.day3ImprovedConfidence,
          increased_willingness_to_exercise: form.day3WillingToExercise,
        },
        day3_morning_energy: form.day3MorningEnergy,
        day3_motivation: form.day3Motivation,
        day3_walking_comfort: form.day3WalkingComfort,
        day3_knee_comfort: form.day3KneeComfort,
        day3_overall_wellbeing: form.day3OverallWellbeing,
        client_quote: form.clientQuote,
        video_feedback_url: form.videoFeedbackUrl,
        negative_feedback: form.negativeFeedback,
        avg_mood: avgMood,
        avg_energy: avgEnergy,
        avg_mental_clarity: avgMentalClarity,
        avg_focus: avgFocus,
        avg_motivation: form.day3Motivation,
        avg_walking_comfort: form.day3WalkingComfort,
        avg_knee_comfort: form.day3KneeComfort,
        avg_wellbeing: form.day3OverallWellbeing,
      };

      const { data, error } = await supabase
        .from("daily_progress_entries")
        .upsert(entryPayload, { onConflict: "member_id,entry_date" })
        .select()
        .single();

      if (error) throw error;

      setEntryId(data.id);

      // Trigger report generation
      await supabase.functions.invoke("generate-progress-report", {
        body: { entry_id: data.id, member_id: user.id },
      });

      setSubmitted(true);
      toast.success("Progress report submitted! You'll receive your email & SMS report at 9 AM.");
      onComplete?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-olive-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-olive-600" />
        </div>
        <div>
          <h2 className="text-3xl font-cormorant font-bold text-olive-800 mb-3">Report Submitted!</h2>
          <p className="text-stone-600 max-w-md">
            Your 3-Day Progress Report has been saved. You'll receive a personalized encouragement message
            at <strong>8:00 AM</strong> and your full report by <strong>9:00 AM</strong> via email and text.
          </p>
        </div>
        <div className="bg-olive-50 border border-olive-200 rounded-xl p-6 max-w-sm">
          <p className="text-olive-700 italic text-sm">
            "Small daily choices create extraordinary outcomes over time."
          </p>
          <p className="text-olive-600 text-xs mt-2 font-semibold">— Dr. Travis Williams, Grandma's Herbals</p>
        </div>
        {entryId && (
          <Button
            onClick={() => window.open(`/progress-report/${entryId}`, "_blank")}
            className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-8"
          >
            View My Report Preview
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {["Client Info", "Day 1", "Day 2", "Day 3", "Finish"].map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? "bg-olive-600 text-white" :
                  i === step ? "bg-olive-700 text-white ring-4 ring-olive-200" :
                  "bg-stone-100 text-stone-400"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-olive-700 font-semibold" : "text-stone-400"}`}>
                {label}
              </span>
            </div>
          ))}
          <div className="absolute left-0 right-0 h-0.5 bg-stone-100 -z-10" />
        </div>
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-olive-500 to-olive-700 rounded-full transition-all duration-500"
            style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 0 — Client Info */}
      {step === 0 && (
        <div className="space-y-6">
          <StepHeader icon={<Activity className="h-5 w-5" />} day="👤" title="Your Wellness Profile" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="memberName">Your Full Name</Label>
              <Input id="memberName" value={form.memberName}
                onChange={(e) => set("memberName", e.target.value)}
                placeholder="First Last" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" value={form.age}
                onChange={(e) => set("age", e.target.value)}
                placeholder="e.g. 62" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="formula">Wellness Formula / Product</Label>
              <Input id="formula" value={form.wellnessFormula}
                onChange={(e) => set("wellnessFormula", e.target.value)}
                placeholder="e.g. Felix 30 M.D. Capsule" className="mt-1" />
            </div>
          </div>
          <div className="bg-olive-50 border border-olive-200 rounded-xl p-4 text-sm text-olive-700">
            <strong>💡 Tip:</strong> Your name and product info will appear on your personalized progress report,
            exactly like Dr. Williams' branded reports. Fill this in once and it saves to your profile automatically.
          </div>
        </div>
      )}

      {/* Step 1 — Day 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <StepHeader icon={<Activity className="h-5 w-5" />} day="1" title="Day 1 — Your First 24 Hours" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <span className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full">Hour 1</span>
                How did you feel in the first hour?
              </Label>
              <Textarea value={form.day1Hour1Notes}
                onChange={(e) => set("day1Hour1Notes", e.target.value)}
                placeholder="e.g. No pain reported. No adverse effects. Mild increase in overall comfort and well-being."
                rows={3} className="mt-1" />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <span className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full">Hour 2</span>
                How did you feel in the second hour?
              </Label>
              <Textarea value={form.day1Hour2Notes}
                onChange={(e) => set("day1Hour2Notes", e.target.value)}
                placeholder="e.g. Reported feeling the best he has felt in approximately 3 years..."
                rows={3} className="mt-1" />
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 space-y-5">
            <h4 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">
              Estimated Improvement Markers
            </h4>
            <PercentSlider label="Pain Reduction" value={form.day1PainReduction}
              onChange={(v) => set("day1PainReduction", v)}
              icon={<Heart className="h-4 w-4 text-rose-400" />} />
            <PercentSlider label="Mood Improvement" value={form.day1MoodImprovement}
              onChange={(v) => set("day1MoodImprovement", v)}
              icon={<SmilePlus className="h-4 w-4 text-yellow-400" />} />
            <PercentSlider label="Energy Improvement" value={form.day1EnergyImprovement}
              onChange={(v) => set("day1EnergyImprovement", v)}
              icon={<Zap className="h-4 w-4 text-orange-400" />} />
            <PercentSlider label="Mental Clarity" value={form.day1MentalClarity}
              onChange={(v) => set("day1MentalClarity", v)}
              icon={<Brain className="h-4 w-4 text-purple-400" />} />
          </div>
        </div>
      )}

      {/* Step 2 — Day 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <StepHeader icon={<Sun className="h-5 w-5" />} day="2" title="Day 2 — Morning & Afternoon" />

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-4 w-4 text-amber-500" />
              <span className="font-semibold text-amber-800 text-sm">Morning Upon Waking</span>
            </div>
            <div>
              <Label>Overall improvement % compared to normal baseline</Label>
              <div className="flex items-center gap-4 mt-2">
                <input type="range" min={0} max={100} value={form.day2MorningImprovement}
                  onChange={(e) => set("day2MorningImprovement", Number(e.target.value))}
                  className="flex-1 accent-olive-600" />
                <span className="font-bold text-olive-700 text-lg w-16 text-right">{form.day2MorningImprovement}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CheckItem label="Better sleep quality" checked={form.day2MorningSleepQuality}
                onChange={(v) => set("day2MorningSleepQuality", v)} />
              <CheckItem label="Improved mood" checked={form.day2MorningMood}
                onChange={(v) => set("day2MorningMood", v)} />
              <CheckItem label="Improved energy" checked={form.day2MorningEnergy}
                onChange={(v) => set("day2MorningEnergy", v)} />
              <CheckItem label="Greater motivation" checked={form.day2MorningMotivation}
                onChange={(v) => set("day2MorningMotivation", v)} />
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
            <div className="font-semibold text-stone-700 text-sm mb-3">One Hour After Capsule — Rate out of 10</div>
            <StarRating label="Focus" score={form.day2FocusScore} onChange={(v) => set("day2FocusScore", v)} />
            <StarRating label="Clarity" score={form.day2ClarityScore} onChange={(v) => set("day2ClarityScore", v)} />
            <StarRating label="Energy" score={form.day2EnergyScore} onChange={(v) => set("day2EnergyScore", v)} />
            <StarRating label="Mood" score={form.day2MoodScore} onChange={(v) => set("day2MoodScore", v)} />
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4">
            <div className="font-semibold text-stone-700 text-sm">Estimated Improvement Markers</div>
            <div className="grid grid-cols-2 gap-4">
              <PercentSlider label="Focus" value={form.day2FocusPct} onChange={(v) => set("day2FocusPct", v)} icon={<Target className="h-4 w-4 text-blue-400" />} />
              <PercentSlider label="Mental Clarity" value={form.day2MentalClarityPct} onChange={(v) => set("day2MentalClarityPct", v)} icon={<Brain className="h-4 w-4 text-purple-400" />} />
              <PercentSlider label="Energy" value={form.day2EnergyPct} onChange={(v) => set("day2EnergyPct", v)} icon={<Zap className="h-4 w-4 text-orange-400" />} />
              <PercentSlider label="Mood" value={form.day2MoodPct} onChange={(v) => set("day2MoodPct", v)} icon={<SmilePlus className="h-4 w-4 text-yellow-400" />} />
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <span className="text-sm">🍽️ Afternoon Notes</span>
            </Label>
            <Textarea value={form.day2AfternoonNotes}
              onChange={(e) => set("day2AfternoonNotes", e.target.value)}
              placeholder="How did benefits hold through the afternoon? Any dietary influences, timing observations..."
              rows={4} />
          </div>
        </div>
      )}

      {/* Step 3 — Day 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <StepHeader icon={<Phone className="h-5 w-5" />} day="3" title="Day 3 — Follow-Up & Assessment" />

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-3">
            <div className="font-semibold text-green-800 text-sm flex items-center gap-2">
              <Phone className="h-4 w-4" /> 8:30 AM Follow-Up Check-In
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CheckItem label="Feeling great" checked={form.day3FeelingGreat} onChange={(v) => set("day3FeelingGreat", v)} />
              <CheckItem label="Increased morning energy" checked={form.day3IncreasedEnergy} onChange={(v) => set("day3IncreasedEnergy", v)} />
              <CheckItem label="Improved motivation" checked={form.day3ImprovedMotivation} onChange={(v) => set("day3ImprovedMotivation", v)} />
              <CheckItem label="Continued positive mood" checked={form.day3PositiveMood} onChange={(v) => set("day3PositiveMood", v)} />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 space-y-4">
            <div className="font-semibold text-yellow-800 text-sm flex items-center gap-2">
              ⭐ Major Milestone (if any)
            </div>
            <div>
              <Label>Milestone description</Label>
              <Input value={form.day3MajorMilestone} onChange={(e) => set("day3MajorMilestone", e.target.value)}
                placeholder="e.g. Naturally waking at 5:30 AM and completing a morning walk"
                className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Years since last achieved this</Label>
                <Input type="number" value={form.day3MilestoneYears} onChange={(e) => set("day3MilestoneYears", e.target.value)}
                  placeholder="e.g. 7" className="mt-1" />
              </div>
              <div>
                <Label>Additional detail</Label>
                <Input value={form.day3MilestoneDetail} onChange={(e) => set("day3MilestoneDetail", e.target.value)}
                  placeholder="Any context..." className="mt-1" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
            <div className="font-semibold text-blue-800 text-sm flex items-center gap-2">
              <Footprints className="h-4 w-4" /> Walking Assessment
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CheckItem label="No knee pain reported" checked={form.day3NoKneePain} onChange={(v) => set("day3NoKneePain", v)} />
              <CheckItem label="No mobility limitations" checked={form.day3NoMobilityLimit} onChange={(v) => set("day3NoMobilityLimit", v)} />
              <CheckItem label="Improved confidence in movement" checked={form.day3ImprovedConfidence} onChange={(v) => set("day3ImprovedConfidence", v)} />
              <CheckItem label="Increased willingness to exercise" checked={form.day3WillingToExercise} onChange={(v) => set("day3WillingToExercise", v)} />
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4">
            <div className="font-semibold text-stone-700 text-sm">Day 3 Improvement Markers</div>
            <PercentSlider label="Morning Energy" value={form.day3MorningEnergy} onChange={(v) => set("day3MorningEnergy", v)} icon={<Zap className="h-4 w-4 text-orange-400" />} />
            <PercentSlider label="Motivation" value={form.day3Motivation} onChange={(v) => set("day3Motivation", v)} icon={<Target className="h-4 w-4 text-blue-400" />} />
            <PercentSlider label="Walking Comfort" value={form.day3WalkingComfort} onChange={(v) => set("day3WalkingComfort", v)} icon={<Footprints className="h-4 w-4 text-green-400" />} />
            <PercentSlider label="Knee Comfort During Activity" value={form.day3KneeComfort} onChange={(v) => set("day3KneeComfort", v)} icon={<Activity className="h-4 w-4 text-teal-400" />} />
            <PercentSlider label="Overall Well-Being" value={form.day3OverallWellbeing} onChange={(v) => set("day3OverallWellbeing", v)} icon={<Heart className="h-4 w-4 text-rose-400" />} />
          </div>
        </div>
      )}

      {/* Step 4 — Feedback + Submit */}
      {step === 4 && (
        <div className="space-y-6">
          <StepHeader icon={<Heart className="h-5 w-5" />} day="✍️" title="Feedback & Submit" />

          <div className="bg-olive-50 border border-olive-200 rounded-xl p-5 space-y-5">
            <div>
              <Label className="text-olive-800 font-semibold">
                Your personal quote / how you feel in your own words
                <span className="text-stone-400 font-normal ml-1">(Optional)</span>
              </Label>
              <Textarea
                value={form.clientQuote}
                onChange={(e) => set("clientQuote", e.target.value)}
                placeholder={`"I feel great. For the first time in years..."`}
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-olive-800 font-semibold">
                Video Feedback Link
                <span className="text-stone-400 font-normal ml-1">(Optional)</span>
              </Label>
              <p className="text-xs text-olive-600 mb-2">We encourage video feedback of your blood pressure, blood sugar, or day-to-day results!</p>
              <Input
                value={form.videoFeedbackUrl}
                onChange={(e) => set("videoFeedbackUrl", e.target.value)}
                placeholder="Paste a link to your video (e.g. YouTube, Google Drive, iCloud)"
              />
            </div>

            <div>
              <Label className="text-rose-800 font-semibold flex items-center gap-2">
                Negative Feedback or Side Effects
                <span className="text-stone-400 font-normal ml-1">(Optional)</span>
              </Label>
              <p className="text-xs text-rose-600 mb-2">Please share any negative feedback. This helps us strictly tailor and adjust your protocol(s) and botanical formulation.</p>
              <Textarea
                value={form.negativeFeedback}
                onChange={(e) => set("negativeFeedback", e.target.value)}
                placeholder="Any negative feedback or adverse reactions..."
                rows={3}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-olive-700 to-olive-900 text-white rounded-2xl p-6 text-center space-y-3">
            <h4 className="text-lg font-bold">What happens next</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl mb-1">📊</div>
                <div className="font-semibold">Report Generated</div>
                <div className="text-white/70 text-xs">Immediately after submit</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl mb-1">💌</div>
                <div className="font-semibold">8 AM Encouragement</div>
                <div className="text-white/70 text-xs">Personalized SMS & email</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-2xl mb-1">📬</div>
                <div className="font-semibold">9 AM Full Report</div>
                <div className="text-white/70 text-xs">Email + SMS with your report</div>
              </div>
            </div>
          </div>

          <Button
            onClick={submitEntry}
            disabled={isSubmitting}
            size="lg"
            className="w-full bg-olive-600 hover:bg-olive-700 text-white rounded-full py-6 text-lg font-semibold"
          >
            {isSubmitting ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Generating your report...</>
            ) : (
              <><Send className="h-5 w-5 mr-2" /> Submit My Progress Report</>
            )}
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-100">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-full px-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        {step < totalSteps - 1 && (
          <Button
            onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
            className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-8"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
