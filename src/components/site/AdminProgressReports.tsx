import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, Mail, MessageSquare, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Report = {
  id: string;
  member_name: string;
  member_age: number;
  wellness_formula: string;
  report_date: string;
  email_sent_at: string | null;
  sms_sent_at: string | null;
  encouragement_sent_at: string | null;
  created_at: string;
};

type Entry = {
  id: string;
  member_id: string;
  entry_date: string;
  avg_mood: number;
  avg_energy: number;
  avg_wellbeing: number;
  report_generated: boolean;
  email_sent: boolean;
  sms_sent: boolean;
  encouragement_sent: boolean;
  member_name?: string;
};

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
      ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-stone-100 text-stone-500 border border-stone-200"
    }`}>
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}
    </span>
  );
}

export function AdminProgressReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeTab, setActiveTab] = useState<"reports" | "entries" | "messages">("reports");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: r }, { data: e }, { data: m }] = await Promise.all([
      supabase.from("progress_reports").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("daily_progress_entries").select("*").order("entry_date", { ascending: false }).limit(50),
      supabase.from("message_log").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    setReports((r as Report[]) ?? []);
    setEntries((e as Entry[]) ?? []);
    setMessages(m ?? []);
    setLoading(false);
  };

  const manualSendReport = async (entryId: string, memberId: string) => {
    toast.info("Triggering report generation...");
    const { error } = await supabase.functions.invoke("generate-progress-report", {
      body: { entry_id: entryId, member_id: memberId },
    });
    if (error) {
      toast.error("Failed to trigger report.");
    } else {
      toast.success("Report generated and sent!");
      fetchAll();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-olive-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {(["reports", "entries", "messages"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm rounded-t-lg font-medium transition capitalize ${
              activeTab === t ? "bg-card border border-border border-b-card text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "reports" ? "📊 Reports" : t === "entries" ? "📝 Daily Entries" : "📬 Message Log"}
          </button>
        ))}
      </div>

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Member</th>
                <th className="px-5 py-4">Age</th>
                <th className="px-5 py-4">Formula</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Sent</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No reports yet.</td></tr>
              )}
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <td className="px-5 py-4 font-medium text-foreground">{r.member_name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.member_age}</td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">{r.wellness_formula}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.report_date}</td>
                  <td className="px-5 py-4 space-y-1">
                    <StatusBadge ok={!!r.email_sent_at} label="Email" />
                    {" "}
                    <StatusBadge ok={!!r.sms_sent_at} label="SMS" />
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-xs gap-1"
                      onClick={() => window.open(`/progress-report/${r.id}`, "_blank")}
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Entries Tab */}
      {activeTab === "entries" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Entry Date</th>
                <th className="px-5 py-4">Member</th>
                <th className="px-5 py-4">Avg Mood</th>
                <th className="px-5 py-4">Avg Energy</th>
                <th className="px-5 py-4">Wellbeing</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">No entries yet.</td></tr>
              )}
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-secondary/40">
                  <td className="px-5 py-4 font-medium">{e.entry_date}</td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">{e.member_id.slice(0, 8)}…</td>
                  <td className="px-5 py-4">{e.avg_mood}%</td>
                  <td className="px-5 py-4">{e.avg_energy}%</td>
                  <td className="px-5 py-4">{e.avg_wellbeing}%</td>
                  <td className="px-5 py-4 space-x-1">
                    <StatusBadge ok={e.report_generated} label="Report" />
                    <StatusBadge ok={e.email_sent} label="Email" />
                    <StatusBadge ok={e.sms_sent} label="SMS" />
                  </td>
                  <td className="px-5 py-4">
                    {!e.report_generated && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs gap-1"
                        onClick={() => manualSendReport(e.id, e.member_id)}
                      >
                        <Mail className="h-3.5 w-3.5" /> Send Report
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Log Tab */}
      {activeTab === "messages" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Recipient</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {messages.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No messages yet.</td></tr>
              )}
              {messages.map((m) => (
                <tr key={m.id} className="hover:bg-secondary/40">
                  <td className="px-5 py-4">
                    <span className="text-xs bg-olive-100 text-olive-700 px-2 py-0.5 rounded-full">{m.message_type.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{m.recipient_email || m.recipient_phone}</td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">{m.subject}</td>
                  <td className="px-5 py-4">
                    <StatusBadge ok={m.status === "sent"} label={m.status} />
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">
                    {m.sent_at ? new Date(m.sent_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
