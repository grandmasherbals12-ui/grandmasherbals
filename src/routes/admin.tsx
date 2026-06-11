import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  BarChart3, Box, Calendar, ClipboardList, LayoutDashboard, Package, Settings as SettingsIcon, ShoppingCart,
  Store, TrendingUp, Users, MessageSquare, BookOpen, Menu, X
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { products } from "@/lib/products";
import { AdminTestimonials } from "@/components/site/AdminTestimonials";
import { AdminProgressReports } from "@/components/site/AdminProgressReports";
import { AdminStories } from "@/components/site/AdminStories";
import { supabase } from "@/lib/supabase";

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

function Admin() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          {tab === "products" && <Products />}
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

function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await supabase.from("member_profiles").select("*").order("created_at", { ascending: false });
        if (data) setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground animate-pulse">Loading customers...</div>;
  }

  if (users.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No customers found.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((u) => (
        <div key={u.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-leaf font-serif text-primary-foreground text-xl">
            {(u.full_name || "G")[0].toUpperCase()}
          </div>
          <p className="mt-4 font-serif text-lg text-foreground truncate">{u.full_name || "Guest User"}</p>
          <p className="text-xs text-muted-foreground">Joined {new Date(u.created_at).getFullYear()}</p>
          <p className="mt-2 text-xs text-olive-600 font-medium truncate">{u.wellness_formula || "No active formula"}</p>
        </div>
      ))}
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