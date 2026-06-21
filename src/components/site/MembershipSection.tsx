import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Minus, Star, Loader2, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export type MembershipPlan = {
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

export type MembershipAddon = {
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
      "Online evaluation & assessment with personalized report",
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

export function MembershipSection({ showHeader = true }: { showHeader?: boolean }) {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [addons, setAddons] = useState<MembershipAddon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pData }, { data: aData }] = await Promise.all([
          supabase.from("membership_plans").select("*").order("display_order"),
          supabase.from("membership_addons").select("*").order("display_order"),
        ]);
        setPlans(pData && pData.length > 0 ? (pData as MembershipPlan[]) : DEFAULT_PLANS);
        setAddons(aData && aData.length > 0 ? (aData as MembershipAddon[]) : DEFAULT_ADDONS);
      } catch {
        setPlans(DEFAULT_PLANS);
        setAddons(DEFAULT_ADDONS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
        // Requirement 5: Additional services require purchase of at least minimum package (Tier I)
        if (!selectedPlan) {
          setSelectedPlan("tier-1");
          toast.success("Tier I Foundation Awareness Package has been auto-selected as the minimum required package for add-on services.", {
            duration: 5000,
          });
        }
      }
      return next;
    });
  };

  const handleProceed = () => {
    if (!selectedPlan) {
      toast.error("Please select a membership plan first.");
      return;
    }
    const plan = plans.find((p) => p.tier_key === selectedPlan);
    const addonNames = Array.from(selectedAddons).join(", ");
    toast.success(
      `Selected: ${plan?.name}${addonNames ? ` + ${selectedAddons.size} add-on(s)` : ""}. Proceeding to checkout...`
    );
  };

  const tierColors: Record<string, string> = {
    "tier-1": "from-stone-50 to-white border-stone-200",
    "tier-2": "from-olive-50 to-white border-olive-300",
    "tier-3": "from-amber-50 to-white border-amber-300",
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center bg-cream-100">
        <Loader2 className="h-10 w-10 animate-spin text-olive-600" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Plans Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#FAF8F5] to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-olive-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-amber-50/50 blur-3xl pointer-events-none" />
        
        <div className="container mx-auto">
          {showHeader && (
            <div className="text-center mb-16">
              <p className="text-xs font-bold tracking-[0.35em] text-olive-600 uppercase mb-3">Choose Your Path</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-cormorant font-bold text-stone-900 tracking-tight">
                Membership Tiers
              </h2>
              <p className="text-stone-600 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Select the plan that best fits your wellness journey. All plans include our core wellness assessment.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.tier_key;
              return (
                <motion.div
                  key={plan.tier_key}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedPlan(plan.tier_key)}
                  className={`relative rounded-[2rem] border-2 bg-gradient-to-b p-8 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl ${
                    tierColors[plan.tier_key] || "from-stone-50 to-white border-stone-200"
                  } ${
                    isSelected
                      ? "ring-4 ring-olive-400 border-olive-500 shadow-xl scale-[1.02]"
                      : "border-stone-200"
                  }`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-olive-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                        <Star className="h-3.5 w-3.5 fill-current" /> Most Popular
                      </span>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-olive-500 text-white rounded-full p-1.5 shadow-sm">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                      {plan.subtitle}
                    </p>
                    <h3 className="text-2xl font-cormorant font-bold text-stone-900 mb-1 leading-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-olive-700 italic mt-1">"{plan.tagline}"</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-stone-900 tracking-tight">
                      ${plan.price_monthly}
                    </span>
                    <span className="text-stone-500 text-xs sm:text-sm ml-1.5">/month</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {(plan.features || []).slice(0, 8).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-stone-700 leading-snug">
                        <Check className="h-4.5 w-4.5 text-olive-600 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {(plan.features || []).length > 8 && (
                      <li className="text-xs text-olive-600 font-semibold pl-7">
                        +{(plan.features || []).length - 8} more features...
                      </li>
                    )}
                  </ul>

                  <Button
                    asChild
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering parent div selectPlan
                      setSelectedPlan(plan.tier_key);
                    }}
                    className={`w-full rounded-full py-5 font-semibold transition ${
                      isSelected
                        ? "bg-olive-600 hover:bg-olive-700 text-white shadow-md"
                        : "bg-olive-50 text-olive-800 hover:bg-olive-100"
                    }`}
                  >
                    <Link
                      to="/checkout"
                      search={{
                        tier: plan.tier_key as "tier-1" | "tier-2" | "tier-3",
                        addons: selectedAddons.size > 0 ? Array.from(selectedAddons).join(",") : undefined,
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-4.5 w-4.5 mr-1.5" /> Selected
                        </>
                      ) : (
                        <>
                          Get Started <ChevronRight className="h-4.5 w-4.5 ml-1" />
                        </>
                      )}
                    </Link>
                  </Button>

                  {plan.focus_areas && (
                    <div className="mt-6 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <p className="text-xs font-semibold text-stone-700 mb-1">Focus Areas:</p>
                      <p className="text-xs text-stone-600 leading-relaxed">{plan.focus_areas}</p>
                    </div>
                  )}
                  {plan.ideal_for && (
                    <p className="text-xs text-stone-500 mt-4 leading-normal">
                      <strong className="text-stone-700">Ideal For:</strong> {plan.ideal_for}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-On Services Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-[#FAF8F5]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.35em] text-olive-600 uppercase mb-3">Enhance Your Experience</p>
            <h2 className="text-4xl sm:text-5xl font-cormorant font-bold text-stone-900 tracking-tight">
              Optional Add-On Services
            </h2>
            <p className="text-stone-600 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Customize your wellness journey by adding services that complement your selected plan.
              <span className="block mt-2 font-semibold text-olive-700 text-xs sm:text-sm">
                * Note: Additional services require purchase of at least the minimum package (Tier I).
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {addons.map((addon, i) => {
              const selected = selectedAddons.has(addon.name);
              return (
                <motion.div
                  key={addon.id || i}
                  whileHover={{ y: -3 }}
                  onClick={() => toggleAddon(addon.name)}
                  className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                    selected
                      ? "border-olive-400 bg-olive-50/50 shadow-md ring-2 ring-olive-100"
                      : addon.is_priority
                      ? "border-olive-200 bg-white hover:border-olive-300 hover:shadow-sm"
                      : "border-stone-200 bg-white hover:border-olive-200 hover:shadow-sm"
                  }`}
                >
                  {addon.is_priority && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-olive-100 text-olive-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Priority
                      </span>
                    </div>
                  )}
                  {selected && (
                    <div className="absolute top-4 left-4 bg-olive-500 text-white rounded-full p-0.5 shadow-sm">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div className={selected ? "pl-7" : ""}>
                    <h3 className="font-semibold text-stone-800 text-sm leading-snug pr-12">{addon.name}</h3>
                    <p className="text-olive-700 font-bold text-base mt-2">{addon.price_label}</p>
                    {addon.description && (
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed">{addon.description}</p>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected
                          ? "bg-olive-500 border-olive-500 text-white"
                          : "border-stone-300 text-stone-400"
                      }`}
                    >
                      {selected ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Billing Summary Section */}
          <AnimatePresence>
            {(selectedPlan || selectedAddons.size > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-white rounded-[2rem] border-2 border-stone-200 shadow-xl p-8 max-w-4xl mx-auto"
              >
                <h3 className="text-2xl font-cormorant font-bold text-stone-900 mb-6 flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6 text-olive-600" /> Your Wellness Package
                </h3>

                {selectedPlan && (() => {
                  const plan = plans.find((p) => p.tier_key === selectedPlan);
                  return plan ? (
                    <div className="flex items-center justify-between py-4 border-b border-stone-100">
                      <div>
                        <p className="font-semibold text-stone-800">{plan.name}</p>
                        <p className="text-xs text-stone-500">{plan.subtitle} Membership</p>
                      </div>
                      <p className="font-bold text-stone-900 text-lg">${plan.price_monthly}/mo</p>
                    </div>
                  ) : null;
                })()}

                {selectedAddons.size > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                      Add-Ons Selected:
                    </p>
                    {Array.from(selectedAddons).map((name) => {
                      const addon = addons.find((a) => a.name === name);
                      return (
                        <div key={name} className="flex items-center justify-between py-2 border-b border-stone-50">
                          <p className="text-sm text-stone-700 flex items-center gap-2">
                            <Check className="h-4 w-4 text-olive-600 shrink-0" /> {name}
                          </p>
                          <p className="text-sm font-semibold text-olive-700">
                            {addon?.price_label || "Varies"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 pt-4">
                  <p className="text-xs text-stone-500 mb-6">
                    * Add-on pricing will be added to your selected package at checkout. Final billing details will be itemized on the checkout screen.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleProceed}
                      size="lg"
                      className="flex-1 bg-olive-600 hover:bg-olive-700 text-white rounded-full py-6 font-semibold shadow-md"
                      asChild
                    >
                      <Link
                        to="/checkout"
                        search={{
                          tier: (selectedPlan || "tier-1") as "tier-1" | "tier-2" | "tier-3",
                          addons: selectedAddons.size > 0 ? Array.from(selectedAddons).join(",") : undefined,
                        }}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Proceed to Checkout
                        <ChevronRight className="h-5 w-5 ml-1" />
                      </Link>
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedAddons(new Set());
                        setSelectedPlan(null);
                      }}
                      variant="outline"
                      className="rounded-full border-stone-300 text-stone-600 px-6 py-6"
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
