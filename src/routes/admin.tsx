import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  BarChart3, Box, Calendar, ClipboardList, LayoutDashboard, Package, Settings as SettingsIcon, ShoppingCart,
  Store, TrendingUp, Users, MessageSquare, BookOpen, Menu, X, CreditCard,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { products } from "@/lib/products";
import { AdminTestimonials } from "@/components/site/AdminTestimonials";
import { AdminProgressReports } from "@/components/site/AdminProgressReports";
import { AdminStories } from "@/components/site/AdminStories";
import { AdminProductEditor } from "@/components/site/AdminProductEditor";
import { AdminMembershipEditor } from "@/components/site/AdminMembershipEditor";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Grandma's Herbals" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Admin,
});

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "membership", label: "Membership", icon: CreditCard },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "inventory", label: "Inventory", icon: Box },
  { id: "users", label: "Customers", icon: Users },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "progress-reports", label: "Progress Reports", icon: ClipboardList },
  { id: "stories", label: "Stories", icon: BookOpen },
  { id: "consultations", label: "Consultations", icon: Calendar },
  { id: "channels", label: "Marketplaces", icon: Store },
  { id: "settings", label: "Settings", icon: SettingsIcon },
] as const;

/** Inline login form shown on the /admin page when not authenticated */
function AdminLoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { Eye, EyeOff, LogIn } = {
    Eye: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    EyeOff: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
    LogIn: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Enter email and password."); return; }
    setLoading(true);
    try {
      await signIn(email, password);
      // After sign-in, the auth state change will re-render with isAdmin=true
      toast.success("Signed in — verifying admin access…");
    } catch (err: any) {
      toast.error(err?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="admin@gmail.com"
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive-500"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-olive-500"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-stone-400 hover:text-stone-600"
          >
            {showPw ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-olive-700 hover:bg-olive-800 text-white rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-60 mt-1"
      >
        {loading ? (
          <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <><LogIn /> Sign In to Admin</>
        )}
      </button>
    </form>
  );
}

function Admin() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Only redirect after loading is done and not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      // Don't auto-redirect — show the unauthorized screen instead
    }
  }, [loading, isAdmin, navigate]);

  // Show spinner while auth is being resolved
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 gap-4">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-olive-600"></div>
        <p className="text-stone-500 text-sm">Checking credentials…</p>
      </div>
    );
  }

  // Show unauthorized screen if not admin (not loading)
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-olive-50 to-stone-100 p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Access Denied</h1>
          <p className="text-stone-500 text-sm mb-6">
            {isAuthenticated
              ? "Your account does not have admin privileges."
              : "Please sign in with your admin account to access this portal."}
          </p>
          <AdminLoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sidebar text-sidebar-foreground">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-sidebar border-b border-sidebar-border">
        <Logo />
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className={`border-r border-sidebar-border bg-sidebar p-6 lg:block ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="hidden lg:block"><Logo /></div>
          <nav className="mt-6 lg:mt-10 space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  tab === t.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </nav>
          <Link to="/" className="mt-10 inline-block text-xs text-muted-foreground hover:text-foreground">← Back to storefront</Link>
        </aside>

        <main className={`bg-background p-4 sm:p-8 lg:p-12 ${mobileMenuOpen ? 'hidden lg:block' : 'block'}`}>
          <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Admin</p>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-foreground capitalize">{tabs.find(t => t.id === tab)?.label}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-border bg-card px-4 py-2 text-sm">Export</button>
              <button className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">+ New</button>
            </div>
          </div>

          {tab === "overview" && <Overview />}
          {tab === "products" && <AdminProductEditor />}
          {tab === "membership" && <AdminMembershipEditor />}
          {tab === "orders" && <Orders />}
          {tab === "inventory" && <Inventory />}
          {tab === "users" && <UsersPanel />}
          {tab === "testimonials" && <AdminTestimonials />}
          {tab === "progress-reports" && <AdminProgressReports />}
          {tab === "stories" && <AdminStories />}
          {tab === "consultations" && <Consultations />}
          {tab === "channels" && <Channels />}
          {tab === "settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 font-serif text-3xl text-foreground">{value}</p>
      <p className="mt-2 inline-flex items-center gap-1 text-xs text-sage-deep">
        <TrendingUp className="h-3 w-3" /> {delta}
      </p>
    </div>
  );
}

function Overview() {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Revenue · 30d" value="$28,940" delta="+18%" />
        <Stat label="Orders" value="412" delta="+9%" />
        <Stat label="Consultations" value="63" delta="+22%" />
        <Stat label="New customers" value="186" delta="+12%" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-foreground">Sales overview</h2>
            <select className="rounded-full border border-border bg-background px-3 py-1.5 text-xs">
              <option>Last 30 days</option><option>Last 90 days</option>
            </select>
          </div>
          <div className="mt-6 flex h-56 items-end gap-2">
            {[40,55,42,68,72,60,80,65,82,90,76,95].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-gradient-leaf" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-serif text-2xl text-foreground">Top products</h2>
          <ul className="mt-5 space-y-4">
            {products.slice(0, 4).map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="font-serif text-sage-deep">0{i+1}</span>
                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">${p.price}</p>
                </div>
                <span className="text-xs text-muted-foreground">{120 - i * 18} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Products() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead className="bg-secondary text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <tr>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4">Rating</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p, i) => (
            <tr key={p.id} className="hover:bg-secondary/40">
              <td className="flex items-center gap-3 px-6 py-4">
                <img src={p.image} className="h-10 w-10 rounded-lg object-cover" alt="" />
                <span className="font-medium text-foreground">{p.name}</span>
              </td>
              <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
              <td className="px-6 py-4">${p.price}</td>
              <td className="px-6 py-4">{120 - i * 11}</td>
              <td className="px-6 py-4">★ {p.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await supabase.from("orders").select("*, member_profiles(full_name)").order("created_at", { ascending: false });
        if (data) setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
      <table className="w-full text-sm min-w-[500px]">
        <thead className="bg-secondary text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <tr><th className="px-6 py-4">Order</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th></tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading orders...</td></tr>
          ) : orders.length === 0 ? (
            <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No orders found.</td></tr>
          ) : (
            orders.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/40">
                <td className="px-6 py-4 font-medium">GH-{r.id.substring(0, 6).toUpperCase()}</td>
                <td className="px-6 py-4 text-muted-foreground">{r.member_profiles?.full_name || "Guest"}</td>
                <td className="px-6 py-4">${parseFloat(r.total_amount).toFixed(2)}</td>
                <td className="px-6 py-4"><span className="rounded-full bg-sage/30 px-3 py-1 text-xs text-sage-deep uppercase">{r.status}</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Inventory() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex gap-3">
            <img src={p.image} className="h-14 w-14 rounded-lg object-cover" alt="" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.category}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground"><span>In stock</span><span>{120 - i * 12}/200</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gradient-leaf" style={{ width: `${(120 - i * 12) / 2}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { Edit, Save, Plus, FileText, Check, Loader2, Calendar as CalendarIcon, Download, Printer } from "lucide-react";

function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Recommendations form states
  const [formula, setFormula] = useState("");
  const [healthNotes, setHealthNotes] = useState("");
  const [savingRecs, setSavingRecs] = useState(false);

  // Follow Up scheduler states
  const [followupDate, setFollowupDate] = useState("");
  const [followupNotes, setFollowupNotes] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [userConsultations, setUserConsultations] = useState<any[]>([]);

  // Report Generator modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<"welcome" | "3day" | "10day">("welcome");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from("member_profiles").select("*").order("created_at", { ascending: false });
      if (data) setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (user: any) => {
    setSelectedUser(user);
    setFormula(user.wellness_formula || "");
    setHealthNotes(user.health_notes || "");
    setFollowupDate("");
    setFollowupNotes("");
    
    // Fetch consultations for this user
    try {
      const { data } = await supabase
        .from("consultations")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: true });
      if (data) setUserConsultations(data);
    } catch (err) {
      console.error("Error fetching consultations:", err);
    }
  };

  const handleSaveRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSavingRecs(true);

    try {
      const { data, error } = await supabase
        .from("member_profiles")
        .update({
          wellness_formula: formula,
          health_notes: healthNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedUser.id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Recommendations updated successfully!");
      setSelectedUser(data);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update recommendations.");
    } finally {
      setSavingRecs(false);
    }
  };

  const handleScheduleFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !followupDate) return;
    setScheduling(true);

    try {
      const { data, error } = await supabase
        .from("consultations")
        .insert({
          user_id: selectedUser.id,
          consultation_type: "Follow-Up Consultation",
          scheduled_date: new Date(followupDate).toISOString(),
          notes: followupNotes,
          status: "confirmed",
        })
        .select();

      if (error) throw error;

      toast.success("Follow-up appointment scheduled!");
      setFollowupDate("");
      setFollowupNotes("");
      if (data) setUserConsultations([...userConsultations, ...data]);
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule follow-up.");
    } finally {
      setScheduling(false);
    }
  };

  const printReport = (reportType: "welcome" | "3day" | "10day") => {
    const imageUrl = reportType === "welcome"
      ? "/welcomereport.png"
      : reportType === "3day"
        ? "/3daysreport.png"
        : "/10daysreport.png";

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Grandma's Herbals - Report Preview</title>
            <style>
              body {
                margin: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background-color: #faf9f5;
                font-family: sans-serif;
              }
              .container {
                max-width: 900px;
                background: #fff;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                border: 1px solid #ebdcb7;
              }
              @media print {
                body { background: none; }
                .container { box-shadow: none; padding: 0; }
                img { max-width: 100%; height: auto; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="${imageUrl}" onload="window.print();" />
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-olive-600" />
      </div>
    );
  }

  // Client Details panel
  if (selectedUser) {
    const goals = selectedUser.primary_goals || [];
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Back and Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-sm text-olive-700 hover:text-olive-900 font-semibold mb-2 block"
            >
              ← Back to Clients List
            </button>
            <h2 className="text-3xl font-serif font-semibold text-foreground flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-leaf text-white font-serif text-sm">
                {(selectedUser.full_name || "C")[0].toUpperCase()}
              </span>
              {selectedUser.full_name}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Client ID: {selectedUser.id}</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowReportModal(true)}
              className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-5 py-2 text-xs font-semibold gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" /> Generate Report
            </Button>
          </div>
        </div>

        {/* Client Detail Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Column 1: Intake Form View */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
            <h3 className="text-lg font-serif font-bold text-olive-800 border-b pb-2 flex items-center gap-2">
              <ClipboardList className="h-5 w-5" /> Submitted Intake Form
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-secondary/40 p-3 rounded-xl border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Age</span>
                <p className="font-semibold text-foreground mt-0.5">{selectedUser.age || "—"}</p>
              </div>
              <div className="bg-secondary/40 p-3 rounded-xl border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Gender</span>
                <p className="font-semibold text-foreground mt-0.5 capitalize">{selectedUser.gender || "—"}</p>
              </div>
              <div className="bg-secondary/40 p-3 rounded-xl border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Phone</span>
                <p className="font-semibold text-foreground mt-0.5">{selectedUser.phone || "—"}</p>
              </div>
              <div className="bg-secondary/40 p-3 rounded-xl border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Email</span>
                <p className="font-semibold text-foreground mt-0.5 truncate">{selectedUser.email || "—"}</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-2">Primary Wellness Objectives</span>
              {goals.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No objectives specified.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {goals.map((g: string) => (
                    <span key={g} className="text-xs bg-olive-50 border border-olive-200 text-olive-800 px-3 py-1 rounded-full font-medium">
                      ✓ {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Focus Areas &amp; Health History</span>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs sm:text-sm text-stone-700 whitespace-pre-line leading-relaxed max-h-[220px] overflow-y-auto">
                {selectedUser.health_notes || "No historical notes submitted."}
              </div>
            </div>
          </div>

          {/* Column 2: CRUD Recommendations & Scheduling */}
          <div className="space-y-8">
            {/* Recommendations Form (CRUD) */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-lg font-serif font-bold text-olive-800 border-b pb-2 flex items-center gap-2">
                <Edit className="h-5 w-5" /> Manage Recommendations
              </h3>
              
              <form onSubmit={handleSaveRecommendations} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="rec-formula">Active Wellness Formula</Label>
                  <Input
                    id="rec-formula"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    placeholder="e.g. Ashford Vitality Formula"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="rec-notes">Practitioner Notes &amp; Herbal Protocol</Label>
                  <Textarea
                    id="rec-notes"
                    value={healthNotes}
                    onChange={(e) => setHealthNotes(e.target.value)}
                    placeholder="Update specific guidelines, dosing, and daily routine adjustments..."
                    rows={4}
                    className="mt-1 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={savingRecs}
                  className="bg-olive-600 hover:bg-olive-700 text-white rounded-full gap-1.5 w-full"
                >
                  {savingRecs ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Recommendations
                </Button>
              </form>
            </div>

            {/* Follow-Ups Scheduler */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-lg font-serif font-bold text-olive-800 border-b pb-2 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" /> Schedule Follow-Ups
              </h3>

              {/* Consultation list */}
              {userConsultations.length > 0 && (
                <div className="mt-3 space-y-2 max-h-[140px] overflow-y-auto border-b pb-4 mb-4">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Scheduled Sessions</p>
                  {userConsultations.map((c) => (
                    <div key={c.id} className="flex justify-between items-center bg-stone-50 border p-2.5 rounded-xl text-xs">
                      <div>
                        <p className="font-semibold text-foreground capitalize">{c.consultation_type.replace(/-/g, " ")}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(c.scheduled_date).toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-bold border ${
                        c.status === "confirmed" ? "bg-green-50 text-green-700 border-green-200" : "bg-stone-100 text-stone-500 border-stone-200"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Schedule form */}
              <form onSubmit={handleScheduleFollowup} className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="sched-date">Next Session Date &amp; Time</Label>
                  <Input
                    id="sched-date"
                    type="datetime-local"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    required
                    className="text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="sched-notes">Session Notes (Optional)</Label>
                  <Input
                    id="sched-notes"
                    value={followupNotes}
                    onChange={(e) => setFollowupNotes(e.target.value)}
                    placeholder="Focus areas for follow-up session..."
                    className="text-xs sm:text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={scheduling || !followupDate}
                  className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-full gap-1.5 w-full"
                >
                  {scheduling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Schedule Next Appointment
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Report Generator Modal Overlay */}
        {showReportModal && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 bg-stone-50 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-olive-800">Report Generation Portal</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Select a template to generate a client document</p>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="h-8 w-8 rounded-full border bg-white flex items-center justify-center hover:bg-stone-100"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 grid md:grid-cols-[200px_1fr] gap-6">
                {/* Tabs selection */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Templates</p>
                  {[
                    { id: "welcome", label: "Welcome Report" },
                    { id: "3day", label: "3-Day Progress" },
                    { id: "10day", label: "10-Day Deep Dive" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedReportType(t.id as any)}
                      className={`px-4 py-3 text-left text-xs font-semibold rounded-xl transition ${
                        selectedReportType === t.id
                          ? "bg-olive-600 text-white shadow-md"
                          : "bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Preview window */}
                <div className="border border-stone-200 rounded-2xl bg-stone-50/50 p-4 flex flex-col items-center justify-center min-h-[350px] relative">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Branded Document Preview</p>
                  
                  <div className="relative border rounded-xl overflow-hidden shadow-md max-w-md w-full aspect-[3/4] bg-white flex items-center justify-center">
                    <img
                      src={
                        selectedReportType === "welcome"
                          ? "/welcomereport.png"
                          : selectedReportType === "3day"
                            ? "/3daysreport.png"
                            : "/10daysreport.png"
                      }
                      alt="Report preview template"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Button
                      onClick={() => printReport(selectedReportType)}
                      className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-6 gap-2 text-xs font-semibold"
                    >
                      <Printer className="h-4 w-4" /> Print / Export PDF
                    </Button>
                    <Button
                      onClick={() => printReport(selectedReportType)}
                      variant="outline"
                      className="rounded-full px-6 gap-2 text-xs font-semibold"
                    >
                      <Download className="h-4 w-4" /> Download Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Clients List view (default)
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-widest text-olive-700 flex items-center gap-2">
          <Users className="h-4 w-4" /> Active Clients ({users.length})
        </h3>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-secondary text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Age</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4">Membership Tier</th>
              <th className="px-6 py-4">Wellness Formula</th>
              <th className="px-6 py-4">Date Joined</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-olive-100 text-olive-800 text-xs font-bold font-serif uppercase">
                    {(u.full_name || "G")[0]}
                  </span>
                  <span>{u.full_name || "Guest User"}</span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{u.age || "—"}</td>
                <td className="px-6 py-4 text-muted-foreground capitalize">{u.gender || "—"}</td>
                <td className="px-6 py-4">
                  <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                    {(u.membership_tier || "tier-1").replace("-", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-olive-700 truncate max-w-[160px]">
                  {u.wellness_formula || "No active formula"}
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs font-semibold px-4 border-olive-200 text-olive-700 hover:bg-olive-50"
                    onClick={() => handleSelectUser(u)}
                  >
                    View Chart
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Consultations() {
  const [consults, setConsults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsults = async () => {
      try {
        const { data } = await supabase.from("consultations").select("*, member_profiles(full_name)").order("scheduled_date", { ascending: true });
        if (data) setConsults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsults();
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft overflow-x-auto">
      <h2 className="font-serif text-2xl text-foreground">Upcoming sessions</h2>
      <ul className="mt-5 divide-y divide-border min-w-[500px]">
        {loading ? (
          <li className="py-4 text-center text-muted-foreground">Loading...</li>
        ) : consults.length === 0 ? (
          <li className="py-4 text-center text-muted-foreground">No upcoming sessions.</li>
        ) : (
          consults.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-foreground">{c.member_profiles?.full_name || "Guest"}</p>
                <p className="text-xs text-muted-foreground">{c.consultation_type}</p>
              </div>
              <p className="text-sm">{new Date(c.scheduled_date).toLocaleString()}</p>
              <button className="rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground">Prepare</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function Channels() {
  const channels = [
    { name: "Shopify", status: "Connected", products: 24, color: "bg-sage/30 text-sage-deep" },
    { name: "Amazon", status: "Sync pending", products: 12, color: "bg-clay/20 text-clay" },
    { name: "Etsy", status: "Connected", products: 18, color: "bg-sage/30 text-sage-deep" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-3">
        {channels.map((c) => (
          <div key={c.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl">{c.name}</h3>
              <span className={`rounded-full px-3 py-1 text-xs ${c.color}`}>{c.status}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{c.products} products synced</p>
            <div className="mt-5 flex gap-2">
              <button className="rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground">Sync now</button>
              <button className="rounded-full border border-border px-4 py-2 text-xs">Settings</button>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-sage-deep" />
          <h2 className="font-serif text-xl">Multi-channel sales (30d)</h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[["Storefront", 14200], ["Shopify", 8920], ["Amazon + Etsy", 5820]].map(([n, v]) => (
            <div key={String(n)} className="rounded-xl bg-secondary p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{n}</p>
              <p className="mt-2 font-serif text-2xl">${(v as number).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-soft">
      <h2 className="font-serif text-2xl text-foreground">Store settings</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {[["Store name", "Grandma's Herbals"], ["Support email", "care@grandmasherbals.com"], ["Currency", "USD"], ["Timezone", "Europe/Lisbon"]].map(([k, v]) => (
          <div key={k}>
            <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{k}</label>
            <input defaultValue={v} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
        ))}
      </div>
      <button className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Save changes</button>
    </div>
  );
}