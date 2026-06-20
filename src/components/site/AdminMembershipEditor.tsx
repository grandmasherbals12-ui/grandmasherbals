import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, X, Loader2, Star, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MembershipPlan = {
  id?: string;
  tier_key: string;
  name: string;
  tagline: string;
  subtitle: string;
  price_monthly: number;
  features: string[];
  focus_areas: string;
  ideal_for: string;
  is_popular: boolean;
  display_order: number;
};

type MembershipAddon = {
  id?: string;
  name: string;
  price_label: string;
  description: string;
  is_priority: boolean;
  display_order: number;
};

const DEFAULT_PLANS: MembershipPlan[] = [
  {
    tier_key: "tier-1",
    name: "Foundation Awareness Package",
    tagline: "Restore & Reconnect",
    subtitle: "Tier I",
    price_monthly: 199,
    features: [
      "Online evaluation & assessment",
      "Assessment Report",
      "30-minute Guided Awareness & Breathwork Meditation",
      "Herbal Wellness Intake Assessment",
      "Personalized Lifestyle Survey",
      "Basic Meal Guidance Protocol",
      "Medication & Herbal Interaction Review",
      "Circulation & Relaxation Focus Recommendations",
      "Foundational Herbal Recommendations",
      "Educational Wellness Summary PDF",
      "Access to beginner guided meditation library",
    ],
    focus_areas: "Stress awareness • Relaxation support • Sleep support • Mental clarity • Foundational circulation support • Lifestyle balance",
    ideal_for: "Individuals beginning their wellness journey seeking foundational guidance and awareness support.",
    is_popular: false,
    display_order: 1,
  },
  {
    tier_key: "tier-2",
    name: "Integrated Wellness Package",
    tagline: "Elevate & Optimize",
    subtitle: "Tier II",
    price_monthly: 399,
    features: [
      "Everything in Tier I",
      "1 x 10-minute consultation",
      "Advanced herbal protocol recommendations",
      "Personalized meal plan protocols",
      "Advanced meditation library access",
      "Monthly wellness product access",
      "Personalized herbal tea & wellness kits",
      "Wellness tracking & progress reports",
      "Group meditation session access",
    ],
    focus_areas: "Comprehensive wellness transformation with personalized guidance",
    ideal_for: "Individuals committed to comprehensive wellness transformation with personalized guidance and tracking.",
    is_popular: true,
    display_order: 2,
  },
  {
    tier_key: "tier-3",
    name: "Premium Transformation Package",
    tagline: "Master Your Wellness",
    subtitle: "Tier III",
    price_monthly: 799,
    features: [
      "Everything in Tier II",
      "3 x 10-minute consultations",
      "Premium herbal compounds & custom blends",
      "Integrative practitioner collaboration",
      "Comprehensive wellness lifestyle design",
      "Advanced automated wellness optimization",
      "Priority customer support",
      "Exclusive wellness summit access",
      "Family wellness integration program",
    ],
    focus_areas: "Premium comprehensive lifestyle transformation",
    ideal_for: "Executives, entrepreneurs, high-performance professionals seeking a comprehensive wellness lifestyle transformation.",
    is_popular: false,
    display_order: 3,
  },
];

const DEFAULT_ADDONS: MembershipAddon[] = [
  { name: "Guided Meditation Library Access", price_label: "$19–$49/month", description: "", is_priority: false, display_order: 1 },
  { name: "Smart Meal Protocol Generator", price_label: "$79/month", description: "", is_priority: false, display_order: 2 },
  { name: "Urgent Consultation", price_label: "Follow-Up Included", description: "1 next if issue subsides 50% during consultation or next day after follow up!", is_priority: true, display_order: 3 },
  { name: "Personalized Herbal Tea & Wellness Kits", price_label: "Starting at $49", description: "", is_priority: false, display_order: 4 },
  { name: "Premium Herbal Compounds", price_label: "Custom pricing", description: "", is_priority: false, display_order: 5 },
  { name: "Group Meditation Sessions", price_label: "Starting at $199/session", description: "", is_priority: false, display_order: 6 },
  { name: "Corporate Wellness Programs", price_label: "Custom enterprise pricing", description: "", is_priority: false, display_order: 7 },
];

export function AdminMembershipEditor() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [addons, setAddons] = useState<MembershipAddon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"plans" | "addons">("plans");
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [editingAddon, setEditingAddon] = useState<MembershipAddon | null>(null);
  const [saving, setSaving] = useState(false);
  const [featuresText, setFeaturesText] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [{ data: pData }, { data: aData }] = await Promise.all([
        supabase.from("membership_plans").select("*").order("display_order"),
        supabase.from("membership_addons").select("*").order("display_order"),
      ]);
      setPlans(pData && pData.length > 0 ? pData : DEFAULT_PLANS);
      setAddons(aData && aData.length > 0 ? aData : DEFAULT_ADDONS);
    } catch {
      setPlans(DEFAULT_PLANS);
      setAddons(DEFAULT_ADDONS);
    } finally {
      setLoading(false);
    }
  };

  // ── Plan CRUD ────────────────────────────────────────────────────────────────

  const startEditPlan = (plan: MembershipPlan) => {
    setEditingPlan({ ...plan });
    setFeaturesText((plan.features || []).join("\n"));
  };

  const savePlan = async () => {
    if (!editingPlan) return;
    setSaving(true);
    const payload = {
      ...editingPlan,
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editingPlan.id) {
        const { id, ...rest } = payload as any;
        const { error } = await supabase.from("membership_plans").update(rest).eq("id", id);
        if (error) throw error;
        setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...rest } : p)));
        toast.success("Plan updated!");
      } else {
        const { data, error } = await supabase.from("membership_plans").insert([payload]).select().single();
        if (error) throw error;
        setPlans((prev) => [...prev, data as MembershipPlan]);
        toast.success("Plan created!");
      }
      setEditingPlan(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save plan.");
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (plan: MembershipPlan) => {
    if (!confirm("Delete this membership plan?")) return;
    if (plan.id) {
      const { error } = await supabase.from("membership_plans").delete().eq("id", plan.id);
      if (error) { toast.error("Failed to delete."); return; }
    }
    setPlans((prev) => prev.filter((p) => p.tier_key !== plan.tier_key));
    toast.success("Plan deleted.");
  };

  // ── Addon CRUD ────────────────────────────────────────────────────────────────

  const saveAddon = async () => {
    if (!editingAddon) return;
    setSaving(true);
    try {
      if (editingAddon.id) {
        const { id, ...rest } = editingAddon as any;
        const { error } = await supabase.from("membership_addons").update(rest).eq("id", id);
        if (error) throw error;
        setAddons((prev) => prev.map((a) => (a.id === id ? { ...a, ...rest } : a)));
        toast.success("Add-on updated!");
      } else {
        const { data, error } = await supabase.from("membership_addons").insert([editingAddon]).select().single();
        if (error) throw error;
        setAddons((prev) => [...prev, data as MembershipAddon]);
        toast.success("Add-on created!");
      }
      setEditingAddon(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to save add-on.");
    } finally {
      setSaving(false);
    }
  };

  const deleteAddon = async (addon: MembershipAddon) => {
    if (!confirm("Delete this add-on?")) return;
    if (addon.id) {
      const { error } = await supabase.from("membership_addons").delete().eq("id", addon.id);
      if (error) { toast.error("Failed to delete."); return; }
    }
    setAddons((prev) => prev.filter((a) => a.id !== addon.id && a.name !== addon.name));
    toast.success("Add-on deleted.");
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-olive-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition flex items-center gap-2 ${activeTab === "plans" ? "bg-card border border-border border-b-card text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Star className="h-4 w-4" /> Membership Plans
        </button>
        <button
          onClick={() => setActiveTab("addons")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition flex items-center gap-2 ${activeTab === "addons" ? "bg-card border border-border border-b-card text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Package className="h-4 w-4" /> Add-On Services
        </button>
      </div>

      {/* ── PLANS ── */}
      {activeTab === "plans" && (
        <div className="space-y-4">
          <AnimatePresence>
            {editingPlan && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-olive-200 shadow-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-serif font-bold text-olive-800 text-lg">{editingPlan.id ? `Edit: ${editingPlan.name}` : "New Plan"}</h3>
                  <button onClick={() => setEditingPlan(null)} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"><X className="h-5 w-5" /></button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>Tier Key (e.g. tier-1)</Label><Input value={editingPlan.tier_key} onChange={(e) => setEditingPlan({ ...editingPlan, tier_key: e.target.value })} className="mt-1" /></div>
                  <div><Label>Subtitle (e.g. Tier I)</Label><Input value={editingPlan.subtitle} onChange={(e) => setEditingPlan({ ...editingPlan, subtitle: e.target.value })} className="mt-1" /></div>
                  <div><Label>Plan Name *</Label><Input value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} className="mt-1" /></div>
                  <div><Label>Tagline / Quote</Label><Input value={editingPlan.tagline} onChange={(e) => setEditingPlan({ ...editingPlan, tagline: e.target.value })} className="mt-1" /></div>
                  <div><Label>Monthly Price ($) *</Label><Input type="number" value={editingPlan.price_monthly} onChange={(e) => setEditingPlan({ ...editingPlan, price_monthly: parseFloat(e.target.value) })} className="mt-1" /></div>
                  <div><Label>Display Order</Label><Input type="number" value={editingPlan.display_order} onChange={(e) => setEditingPlan({ ...editingPlan, display_order: parseInt(e.target.value) })} className="mt-1" /></div>
                  <div className="md:col-span-2"><Label>Focus Areas</Label><Input value={editingPlan.focus_areas} onChange={(e) => setEditingPlan({ ...editingPlan, focus_areas: e.target.value })} className="mt-1" placeholder="Area 1 • Area 2 • ..." /></div>
                  <div className="md:col-span-2"><Label>Ideal For</Label><Input value={editingPlan.ideal_for} onChange={(e) => setEditingPlan({ ...editingPlan, ideal_for: e.target.value })} className="mt-1" /></div>
                  <div className="md:col-span-2">
                    <Label>Features (one per line)</Label>
                    <Textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={8} className="mt-1 text-sm font-mono" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_popular" checked={editingPlan.is_popular} onChange={(e) => setEditingPlan({ ...editingPlan, is_popular: e.target.checked })} className="h-4 w-4 accent-olive-600" />
                    <Label htmlFor="is_popular" className="cursor-pointer">Mark as "Most Popular"</Label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={savePlan} disabled={saving} className="bg-olive-600 hover:bg-olive-700 text-white rounded-full gap-2 px-6">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Plan
                  </Button>
                  <Button onClick={() => setEditingPlan(null)} variant="outline" className="rounded-full px-6">Cancel</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{plans.length} membership plan(s)</p>
            <Button onClick={() => { setEditingPlan({ tier_key: "", name: "", tagline: "", subtitle: "", price_monthly: 0, features: [], focus_areas: "", ideal_for: "", is_popular: false, display_order: plans.length + 1 }); setFeaturesText(""); }} className="bg-olive-600 hover:bg-olive-700 text-white rounded-full text-xs gap-1.5 px-4">
              <Plus className="h-3.5 w-3.5" /> Add Plan
            </Button>
          </div>

          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.tier_key} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{plan.subtitle}</span>
                      {plan.is_popular && <span className="text-xs bg-olive-100 text-olive-700 px-2 py-0.5 rounded-full font-bold">⭐ Most Popular</span>}
                    </div>
                    <h4 className="font-serif font-bold text-foreground text-lg">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground italic">"{plan.tagline}"</p>
                    <p className="text-xl font-bold text-olive-700 mt-2">${plan.price_monthly}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                    <p className="text-xs text-muted-foreground mt-1">{(plan.features || []).length} features included</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="rounded-full text-xs gap-1 border-olive-200 text-olive-700" onClick={() => startEditPlan(plan)}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1" onClick={() => deletePlan(plan)}>
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ADD-ONS ── */}
      {activeTab === "addons" && (
        <div className="space-y-4">
          <AnimatePresence>
            {editingAddon && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-olive-200 shadow-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-serif font-bold text-olive-800 text-lg">{editingAddon.id ? `Edit: ${editingAddon.name}` : "New Add-On"}</h3>
                  <button onClick={() => setEditingAddon(null)} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400"><X className="h-5 w-5" /></button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2"><Label>Service Name *</Label><Input value={editingAddon.name} onChange={(e) => setEditingAddon({ ...editingAddon, name: e.target.value })} className="mt-1" /></div>
                  <div><Label>Price Label</Label><Input value={editingAddon.price_label} onChange={(e) => setEditingAddon({ ...editingAddon, price_label: e.target.value })} className="mt-1" placeholder="e.g. $79/month" /></div>
                  <div><Label>Display Order</Label><Input type="number" value={editingAddon.display_order} onChange={(e) => setEditingAddon({ ...editingAddon, display_order: parseInt(e.target.value) })} className="mt-1" /></div>
                  <div className="md:col-span-2"><Label>Description (optional)</Label><Textarea value={editingAddon.description} onChange={(e) => setEditingAddon({ ...editingAddon, description: e.target.value })} rows={2} className="mt-1" /></div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_priority" checked={editingAddon.is_priority} onChange={(e) => setEditingAddon({ ...editingAddon, is_priority: e.target.checked })} className="h-4 w-4 accent-olive-600" />
                    <Label htmlFor="is_priority" className="cursor-pointer">Mark as "Priority"</Label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={saveAddon} disabled={saving} className="bg-olive-600 hover:bg-olive-700 text-white rounded-full gap-2 px-6">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Add-On
                  </Button>
                  <Button onClick={() => setEditingAddon(null)} variant="outline" className="rounded-full px-6">Cancel</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{addons.length} add-on service(s)</p>
            <Button onClick={() => setEditingAddon({ name: "", price_label: "", description: "", is_priority: false, display_order: addons.length + 1 })} className="bg-olive-600 hover:bg-olive-700 text-white rounded-full text-xs gap-1.5 px-4">
              <Plus className="h-3.5 w-3.5" /> Add Service
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon, i) => (
              <div key={addon.id || i} className={`rounded-2xl border bg-card p-5 shadow-soft ${addon.is_priority ? "border-olive-400 ring-1 ring-olive-200" : "border-border"}`}>
                {addon.is_priority && <span className="inline-block text-xs bg-olive-100 text-olive-800 font-bold px-2 py-0.5 rounded mb-2">Priority</span>}
                <h4 className="font-semibold text-foreground">{addon.name}</h4>
                <p className="text-olive-600 font-bold text-sm mt-1">{addon.price_label}</p>
                {addon.description && <p className="text-xs text-muted-foreground mt-1">{addon.description}</p>}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="rounded-full text-xs gap-1 border-olive-200 text-olive-700" onClick={() => setEditingAddon({ ...addon })}>
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1" onClick={() => deleteAddon(addon)}>
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
