import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Calendar,
  Heart,
  Package,
  Settings,
  Sparkles,
  User,
  LogOut,
  Lock,
  Mail,
  UserPlus,
  ClipboardList,
  BarChart,
  LineChart,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/site/ProductCard";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ClientProfileTemplates } from "@/components/site/ClientProfileTemplates";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Wellness Journal — Grandma's Herbals" },
      {
        name: "description",
        content:
          "Your orders, saved rituals, consultation bookings, and personalized wellness recommendations.",
      },
      { property: "og:url", content: "/account" },
    ],
  }),
  component: AccountPage,
});

const tabs = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Saved Rituals", icon: Heart },
  { id: "bookings", label: "Consultations", icon: Calendar },
  { id: "reports", label: "Analytics & Reports", icon: BarChart },
  { id: "profiles", label: "Success Profiles", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

function AccountPage() {
  const { user, loading: authLoading, signIn, signUp, signOut, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("orders");

  // Login & Register Form States
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Dynamic user profile info (age, phone, wellness formula from database)
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from("member_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfileData(data);
      };
      fetchProfile();
    } else {
      setProfileData(null);
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back to Grandma's Herbals!");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await signUp(email, password, fullName);
      toast.success("Account created successfully! Welcome to the community.");
    } catch (err: any) {
      toast.error(err.message || "Failed to create account. Try another email.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been signed out successfully.");
    } catch (err: any) {
      toast.error("Failed to sign out: " + err.message);
    }
  };

  if (authLoading) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-600 mx-auto"></div>
          <p className="mt-4 text-stone-500 font-medium">Synchronizing session...</p>
        </div>
      </SiteLayout>
    );
  }

  // Not Authenticated: Show beautiful portal
  if (!isAuthenticated || !user) {
    return (
      <SiteLayout>
        <section className="min-h-[80vh] bg-gradient-to-b from-olive-50 to-white flex items-center py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200/80 shadow-[0_20px_60px_rgba(73,88,52,0.06)] overflow-hidden">
              <div className="p-8 text-center bg-olive-50/50 border-b border-stone-100">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-olive-600 border-2 border-olive-200 text-white font-cormorant font-bold text-sm mb-3">
                  GH
                </div>
                <h1 className="text-3xl font-cormorant font-bold text-olive-900">
                  Your Wellness Journal
                </h1>
                <p className="text-sm text-stone-600 mt-2">
                  Access your orders, saved rituals, and progress reports.
                </p>
              </div>

              <div className="p-8">
                {/* Tabs */}
                <div className="flex border-b border-stone-200 mb-6">
                  <button
                    onClick={() => setIsRegistering(false)}
                    className={`flex-1 pb-3 text-sm font-semibold text-center transition-colors border-b-2 ${
                      !isRegistering
                        ? "border-olive-600 text-olive-800"
                        : "border-transparent text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsRegistering(true)}
                    className={`flex-1 pb-3 text-sm font-semibold text-center transition-colors border-b-2 ${
                      isRegistering
                        ? "border-olive-600 text-olive-800"
                        : "border-transparent text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {isRegistering ? (
                  /* Register Form */
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="reg-name">Full Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                        <Input
                          id="reg-name"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Elena Johnson"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reg-email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                        <Input
                          id="reg-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="elena@example.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reg-pass">Create Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                        <Input
                          id="reg-pass"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={formLoading}
                      className="w-full bg-olive-600 hover:bg-olive-700 text-white rounded-full py-6 mt-4 shadow-md font-semibold"
                    >
                      {formLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                ) : (
                  /* Login Form */
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                        <Input
                          id="login-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="elena@example.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="login-pass">Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                        <Input
                          id="login-pass"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={formLoading}
                      className="w-full bg-olive-600 hover:bg-olive-700 text-white rounded-full py-6 mt-4 shadow-md font-semibold"
                    >
                      {formLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  // Authenticated: Show dashboard
  return (
    <SiteLayout>
      <div className="bg-olive-50 border-b border-olive-100">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-6">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-olive-200 border-2 border-olive-300 text-olive-600 shadow-inner">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-olive-800">
                Good Morning, {user.fullName || "Wellness Seeker"}
              </h1>
              <p className="text-olive-600 flex items-center gap-1.5 mt-1 text-sm font-medium">
                Logged in as <span className="underline">{user.email}</span>
                {profileData?.membership_tier && (
                  <span className="bg-amber-100 border border-amber-200 text-amber-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ml-2">
                    {profileData.membership_tier.replace("-", " ")}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12">
          {/* Sidebar Nav */}
          <nav className="flex flex-col gap-2 bg-stone-50/50 p-4 rounded-2xl border border-stone-200/60 lg:sticky lg:top-28">
            {tabs.map((t) => (
              <Button
                key={t.id}
                variant={tab === t.id ? "default" : "ghost"}
                onClick={() => setTab(t.id)}
                className={`justify-start gap-3 px-4 py-6 text-base rounded-xl transition ${
                  tab === t.id
                    ? "bg-olive-500 hover:bg-olive-600 text-white shadow-sm"
                    : "text-olive-700 hover:bg-olive-100/50"
                }`}
              >
                <t.icon className="h-5 w-5" /> {t.label}
              </Button>
            ))}

            <div className="border-t border-stone-200 my-4 pt-4">
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start gap-3 px-4 py-6 text-base text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition"
              >
                <LogOut className="h-5 w-5" /> Log Out
              </Button>
            </div>
          </nav>

          {/* Active Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "orders" && <Orders userId={user.id} />}
              {tab === "wishlist" && <Wishlist userId={user.id} />}
              {tab === "bookings" && <Bookings userId={user.id} />}
              {tab === "reports" && <Reports userId={user.id} />}
              {tab === "profiles" && (
                <Card>
                  <ClientProfileTemplates />
                </Card>
              )}
              {tab === "settings" && (
                <SettingsPanel
                  userId={user.id}
                  initialProfile={profileData}
                  onUpdate={(newProfile) => setProfileData(newProfile)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </SiteLayout>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-[0_4px_25px_rgba(73,88,52,0.03)]">
      {children}
    </div>
  );
}

function Orders({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (data) setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <div className="py-12 text-center text-stone-400 animate-pulse">Loading orders...</div>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <h2 className="text-3xl font-cormorant font-bold text-olive-800">Recent Orders</h2>
        <div className="mt-8 text-center text-stone-500 py-6">
          <Package className="h-12 w-12 text-stone-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-stone-600">No orders placed yet.</p>
          <p className="text-sm mt-1 mb-6">Start your wellness ritual with our organic blends.</p>
          <Button asChild className="bg-olive-600 hover:bg-olive-700 rounded-full px-6 py-4">
            <Link to="/shop">Shop Botanicals</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-3xl font-cormorant font-bold text-olive-800">Recent Orders</h2>
      <div className="mt-6 divide-y divide-stone-100">
        {orders.map((o) => (
          <div key={o.id} className="flex flex-wrap items-center justify-between py-5 gap-4">
            <div>
              <p className="font-bold text-olive-800">Order GH-{o.id.substring(0, 6).toUpperCase()}</p>
              <p className="text-xs text-stone-500">{new Date(o.created_at).toLocaleDateString()}</p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                o.status === "shipped"
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : o.status === "delivered"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}
            >
              {o.status}
            </span>
            <p className="font-semibold text-lg text-stone-800">${parseFloat(o.total_amount).toFixed(2)}</p>
            <Button variant="outline" className="rounded-full">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Wishlist({ userId }: { userId: string }) {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await supabase
          .from("wishlist")
          .select("*, products(*)")
          .eq("user_id", userId);
        if (data) {
          setWishlist(data.map((item: any) => item.products).filter(Boolean));
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <div className="py-12 text-center text-stone-400 animate-pulse">Loading rituals...</div>
      </Card>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Card>
        <h2 className="text-3xl font-cormorant font-bold text-olive-800 mb-6">Saved Rituals</h2>
        <div className="mt-8 text-center text-stone-500 py-6">
          <Heart className="h-12 w-12 text-stone-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-stone-600">No saved rituals yet.</p>
          <p className="text-sm mt-1 mb-6">Heart your favorite botanicals in our shop to save them here.</p>
          <Button asChild className="bg-olive-600 hover:bg-olive-700 rounded-full px-6 py-4">
            <Link to="/shop">Explore Shop</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-3xl font-cormorant font-bold text-olive-800 mb-6">Your Saved Rituals</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </Card>
  );
}

function Bookings({ userId }: { userId: string }) {
  const [consults, setConsults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsults = async () => {
      try {
        const { data } = await supabase
          .from("consultations")
          .select("*")
          .eq("user_id", userId)
          .order("scheduled_date", { ascending: true });
        if (data) setConsults(data);
      } catch (err) {
        console.error("Error fetching consultations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsults();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <div className="py-12 text-center text-stone-400 animate-pulse">Loading consultations...</div>
      </Card>
    );
  }

  if (consults.length === 0) {
    return (
      <Card>
        <h2 className="text-3xl font-cormorant font-bold text-olive-800 mb-6">Your Consultations</h2>
        <div className="text-center text-stone-500 py-8">
          <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-stone-600">No upcoming consultations scheduled.</p>
          <Button asChild variant="link" className="mt-2 text-olive-700 hover:text-olive-900 font-semibold">
            <Link to="/consultation">Book a new session</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-3xl font-cormorant font-bold text-olive-800 mb-6">Your Consultations</h2>
      <div className="space-y-4">
        {consults.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4 rounded-xl border border-stone-200">
            <div>
              <p className="font-semibold text-stone-800">{c.consultation_type}</p>
              <p className="text-xs text-stone-500">
                Scheduled: {new Date(c.scheduled_date).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                c.status === "confirmed"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : c.status === "completed"
                    ? "bg-stone-50 text-stone-700 border border-stone-100"
                    : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}
            >
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Reports({ userId }: { userId: string }) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from("progress_reports")
          .select("*, entry:daily_progress_entries!inner(*)")
          .eq("entry.member_id", userId)
          .order("created_at", { ascending: false });
        if (data) setReports(data);
        if (error) console.error("Error fetching reports:", error);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <div className="py-12 text-center text-stone-400 animate-pulse">Loading reports...</div>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <h2 className="text-3xl font-cormorant font-bold text-olive-800 mb-6">Your Progress Reports</h2>
        <div className="text-center text-stone-500 py-8">
          <ClipboardList className="h-12 w-12 text-stone-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-stone-600">No progress reports generated yet.</p>
          <p className="text-sm mt-1">Submit your daily progress entries to generate a personalized report.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-3xl font-cormorant font-bold text-olive-800">Analytics & Reports</h2>
        <Button asChild variant="outline" className="text-sm">
          <Link to="/progress-report">Submit New Data</Link>
        </Button>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-olive-600" /> Recent Progress Trends
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
            <div className="text-xs font-semibold text-stone-500 uppercase mb-1">Avg Mood</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-olive-700">{reports[0]?.entry?.avg_mood || 0}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-olive-500" style={{ width: `${reports[0]?.entry?.avg_mood || 0}%` }} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
            <div className="text-xs font-semibold text-stone-500 uppercase mb-1">Avg Energy</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-amber-600">{reports[0]?.entry?.avg_energy || 0}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${reports[0]?.entry?.avg_energy || 0}%` }} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
            <div className="text-xs font-semibold text-stone-500 uppercase mb-1">Avg Clarity</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-blue-600">{reports[0]?.entry?.avg_mental_clarity || 0}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${reports[0]?.entry?.avg_mental_clarity || 0}%` }} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
            <div className="text-xs font-semibold text-stone-500 uppercase mb-1">Wellbeing</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-rose-600">{reports[0]?.entry?.avg_wellbeing || 0}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-rose-500" style={{ width: `${reports[0]?.entry?.avg_wellbeing || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-cormorant font-bold text-olive-800 mb-4">Report Archive</h3>
      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between p-5 rounded-xl border border-stone-200 gap-4 hover:border-olive-300 transition-colors">
            <div>
              <p className="font-semibold text-stone-800">3-Day Progress Report</p>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> {new Date(r.created_at).toLocaleDateString()}
                <span className="text-stone-300">|</span>
                <span className="bg-olive-50 text-olive-700 px-2 py-0.5 rounded-full font-medium">{r.wellness_formula}</span>
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full border-olive-200 text-olive-700 hover:bg-olive-50">
              <Link to={`/progress-report/${r.id}`} target="_blank">View Report</Link>
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Recs() {
  const recsProducts = products.slice(0, 3);
  return (
    <Card>
      <h2 className="text-3xl font-cormorant font-bold text-olive-800 mb-2">Personally For You</h2>
      <p className="text-sm text-stone-500 mb-6">
        Botanical recommendations tailored to support your vitality, blood circulation, and alignment.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recsProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </Card>
  );
}

interface SettingsPanelProps {
  userId: string;
  initialProfile: any;
  onUpdate: (newProfile: any) => void;
}

function SettingsPanel({ userId, initialProfile, onUpdate }: SettingsPanelProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [formula, setFormula] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setFullName(initialProfile.full_name || "");
      setPhone(initialProfile.phone || "");
      setAge(initialProfile.age ? String(initialProfile.age) : "");
      setFormula(initialProfile.wellness_formula || "");
    }
  }, [initialProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("member_profiles")
        .upsert({
          id: userId,
          full_name: fullName,
          phone,
          age: age ? parseInt(age) : null,
          wellness_formula: formula,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        toast.error("Failed to save settings: " + error.message);
      } else {
        toast.success("Wellness profile updated successfully!");
        onUpdate(data);
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred saving your profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="text-3xl font-cormorant font-bold text-olive-800 mb-2">Account Settings</h2>
      <p className="text-sm text-stone-500 mb-6">
        Update your personal wellness profile details and delivery preferences.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="set-name">Full Name</Label>
          <Input
            id="set-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="set-phone">Phone Number</Label>
            <Input
              id="set-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="set-age">Age</Label>
            <Input
              id="set-age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 48"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="set-formula">Assigned Wellness Formula</Label>
          <Input
            id="set-formula"
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="e.g. Torarie Vitality Formula"
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-6 py-4 mt-2"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}