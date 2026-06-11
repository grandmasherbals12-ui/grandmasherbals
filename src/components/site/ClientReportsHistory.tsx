import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Activity,
  Zap,
  Brain,
  Heart,
} from "lucide-react";

type ReportRow = {
  id: string;
  report_date: string;
  member_name: string;
  wellness_formula: string;
  email_sent_at: string | null;
  sms_sent_at: string | null;
  created_at: string;
};

type EntryRow = {
  id: string;
  entry_date: string;
  avg_mood: number;
  avg_energy: number;
  avg_mental_clarity: number;
  avg_wellbeing: number;
  report_generated: boolean;
  email_sent: boolean;
  sms_sent: boolean;
};

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
        ok
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-stone-100 text-stone-400 border-stone-200"
      }`}
    >
      {ok ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {label}
    </span>
  );
}

function MiniBar({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-stone-400 shrink-0">{icon}</span>
      <span className="text-stone-500 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-bold text-stone-700 w-8 text-right">{value}%</span>
    </div>
  );
}

interface ClientReportsHistoryProps {
  userId: string;
}

export function ClientReportsHistory({ userId }: ClientReportsHistoryProps) {
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: entryData }, { data: reportData }] = await Promise.all([
        supabase
          .from("daily_progress_entries")
          .select(
            "id,entry_date,avg_mood,avg_energy,avg_mental_clarity,avg_wellbeing,report_generated,email_sent,sms_sent"
          )
          .eq("member_id", userId)
          .order("entry_date", { ascending: false })
          .limit(30),
        supabase
          .from("progress_reports")
          .select(
            "id,report_date,member_name,wellness_formula,email_sent_at,sms_sent_at,created_at"
          )
          .eq("member_id", userId)
          .order("report_date", { ascending: false })
          .limit(30),
      ]);
      setEntries((entryData as EntryRow[]) ?? []);
      setReports((reportData as ReportRow[]) ?? []);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-olive-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + CTA */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-cormorant font-bold text-olive-800">
            My Wellness Reports
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Every report you've submitted is saved here permanently.
          </p>
        </div>
        <Button
          asChild
          className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-6"
        >
          <Link to="/progress-report">
            <ClipboardList className="h-4 w-4 mr-2" />
            Submit New Report
          </Link>
        </Button>
      </div>

      {/* Generated Reports (full branded PDF-style) */}
      {reports.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-olive-700 flex items-center gap-2">
            <ClipboardList className="h-4 w-4" /> Generated Reports
          </h3>
          <div className="space-y-3">
            {reports.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    {/* Date badge */}
                    <div className="bg-olive-100 rounded-xl p-3 text-center min-w-[56px]">
                      <div className="text-xs text-olive-600 font-semibold uppercase">
                        {new Date(r.report_date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </div>
                      <div className="text-2xl font-black text-olive-800 leading-none">
                        {new Date(r.report_date).getDate()}
                      </div>
                      <div className="text-[10px] text-olive-500">
                        {new Date(r.report_date).getFullYear()}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-olive-800">
                        3-Day Progress Report
                      </p>
                      {r.wellness_formula && (
                        <p className="text-xs text-stone-500 mt-0.5">
                          Formula: {r.wellness_formula}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <StatusPill ok={!!r.email_sent_at} label="Email" />
                        <StatusPill ok={!!r.sms_sent_at} label="SMS" />
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full border-olive-300 text-olive-700 hover:bg-olive-50 gap-1.5"
                  >
                    <Link to={`/progress-report/${r.id}`}>
                      <Eye className="h-3.5 w-3.5" /> View Report
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Entries (raw data on file) */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-olive-700 flex items-center gap-2">
            <Activity className="h-4 w-4" /> Submitted Entries on File
          </h3>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Date */}
                  <div className="bg-stone-100 rounded-xl p-3 text-center min-w-[56px] shrink-0">
                    <div className="text-xs text-stone-500 font-semibold uppercase">
                      {new Date(e.entry_date).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </div>
                    <div className="text-2xl font-black text-stone-700 leading-none">
                      {new Date(e.entry_date).getDate()}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {new Date(e.entry_date).getFullYear()}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex-1 space-y-1.5 min-w-[200px]">
                    <MiniBar
                      icon={<Heart className="h-3 w-3" />}
                      label="Mood"
                      value={e.avg_mood}
                      color="bg-rose-400"
                    />
                    <MiniBar
                      icon={<Zap className="h-3 w-3" />}
                      label="Energy"
                      value={e.avg_energy}
                      color="bg-amber-400"
                    />
                    <MiniBar
                      icon={<Brain className="h-3 w-3" />}
                      label="Mental Clarity"
                      value={e.avg_mental_clarity}
                      color="bg-purple-400"
                    />
                    <MiniBar
                      icon={<Activity className="h-3 w-3" />}
                      label="Wellbeing"
                      value={e.avg_wellbeing}
                      color="bg-olive-500"
                    />
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-1.5 items-end shrink-0">
                    <StatusPill ok={e.report_generated} label="Report" />
                    <StatusPill ok={e.email_sent} label="Email" />
                    <StatusPill ok={e.sms_sent} label="SMS" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && reports.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-sm">
          <ClipboardList className="h-16 w-16 text-stone-200 mx-auto mb-4" />
          <h3 className="text-xl font-cormorant font-bold text-olive-800 mb-2">
            No Reports Yet
          </h3>
          <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto">
            Submit your first 3-day progress report. It will be saved here
            permanently and delivered to you each morning.
          </p>
          <Button
            asChild
            className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-8"
          >
            <Link to="/progress-report">
              Submit My First Report <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
