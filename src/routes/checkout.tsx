import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const checkoutSearchSchema = z.object({
  tier: z.enum(["tier-1", "tier-2", "tier-3"]).optional(),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: (search) => checkoutSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Checkout — Grandma's Herbals" },
      {
        name: "description",
        content: "Complete your botanical wellness order.",
      },
      { property: "og:url", content: "/checkout" },
    ],
  }),
  component: CheckoutPage,
});

const TIERS = {
  "tier-1": {
    name: "Tier I — Foundation Wellness Package",
    price: 199.00,
    description: "No consultation, online evaluation, and assessment report.",
  },
  "tier-2": {
    name: "Tier II — Integrated Wellness Package",
    price: 399.00,
    description: "1 x 10-minute consultation plus online evaluation and assessment report.",
  },
  "tier-3": {
    name: "Tier III — Premium Transformation Package",
    price: 799.00,
    description: "3 x 10-minute consultations plus online evaluation and assessment report.",
  },
};

const GOAL_OPTIONS = [
  "Healthy energy production",
  "Endurance and stamina",
  "Healthy blood flow & circulation",
  "Cardiovascular conditioning support",
  "Positive mood & emotional well-being",
  "Motivation and drive",
  "Healthy aging",
  "Metabolic wellness",
  "Healthy cholesterol balance",
  "Healthy blood sugar management",
  "Wellness support", // will show as "Men's Wellness Support" or "Women's Wellness Support"
  "BPH maintenance support", // for males
  "Recovery & performance optimization",
];

function CheckoutPage() {
  const { tier } = Route.useSearch();
  const { cart, total, clearCart } = useCart();
  const { user, signUp } = useAuth();

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Intake questionnaire states
  const [title, setTitle] = useState("Mr.");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [wellnessFormula, setWellnessFormula] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [healthNotes, setHealthNotes] = useState("");

  // Shipping states
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Handle name change to automatically default the wellness formula
  const handleNameChange = (newName: string) => {
    setName(newName);
    const parts = newName.trim().split(" ");
    const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    if (lastName && !wellnessFormula) {
      setWellnessFormula(`${lastName} Vitality Formula`);
    }
  };

  const getGoalLabel = (goal: string) => {
    if (goal === "Wellness support") {
      if (gender === "male") return "Men's Wellness Support";
      if (gender === "female") return "Women's Wellness Support";
      return "Gender-Specific Wellness Support";
    }
    return goal;
  };

  const visibleGoals = GOAL_OPTIONS.filter((goal) => {
    if (goal === "BPH maintenance support" && gender === "female") return false;
    return true;
  });

  const selectedTier = tier ? TIERS[tier] : null;
  const finalTotal = total + (selectedTier ? selectedTier.price : 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let activeUserId = user?.id;

      if (tier) {
        // Membership signup requires registration if not logged in
        if (!activeUserId) {
          if (!password) {
            toast.error("Please enter a password to register your wellness membership.");
            setIsSubmitting(false);
            return;
          }
          try {
            await signUp(email, password, name);
            // Brief wait for Supabase auth to process the session
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const {
              data: { session },
            } = await supabase.auth.getSession();
            activeUserId = session?.user?.id;
          } catch (signUpErr: any) {
            toast.error(signUpErr.message || "Failed to create account. Check email/password.");
            setIsSubmitting(false);
            return;
          }
        }

        if (!activeUserId) {
          toast.error("Could not link account. Please try signing up again.");
          setIsSubmitting(false);
          return;
        }

        // Save intake info to member_profiles
        const finalFormula =
          wellnessFormula || `${name.trim().split(" ").pop()} Vitality Formula`;
        const { error: profileError } = await supabase.from("member_profiles").upsert({
          id: activeUserId,
          full_name: `${title} ${name}`.trim(),
          age: age ? parseInt(age) : null,
          gender: gender,
          phone: phone,
          email: email,
          membership_tier: tier,
          wellness_formula: finalFormula,
          primary_goals: selectedGoals,
          health_notes: healthNotes,
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          toast.error("Failed to save intake profile: " + profileError.message);
          setIsSubmitting(false);
          return;
        }

        // Trigger welcome Edge Function
        const { error: fnError } = await supabase.functions.invoke("send-welcome-package", {
          body: { memberId: activeUserId },
        });

        if (fnError) {
          console.error("Welcome Edge Function failed to call:", fnError);
          // We don't block order placement on email/SMS dispatch failure
        }
      }

      setSubmitted(true);
      clearCart();
    } catch (err: any) {
      toast.error(err.message || "Checkout encountered an error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-cormorant font-bold text-olive-800">
            Thank You!
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            {tier
              ? `Your registration for ${selectedTier?.name} is complete! We have emailed you a Concierge Wellness Care Welcome Package. Check your phone shortly for SMS updates.`
              : "Your order has been placed. A confirmation email is on its way to you."}
          </p>
          <Button asChild className="mt-8 bg-olive-600 hover:bg-olive-700">
            <Link to={tier ? "/intake" : "/shop"} search={{}}>
              {tier ? "Continue to Intake" : "Continue Shopping"}
            </Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="bg-olive-50">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl font-cormorant font-bold text-olive-700">
            {tier ? "Membership Registration" : "Checkout"}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1.5fr_1fr] gap-12">
          {/* Main Form Fields */}
          <div className="space-y-8">
            {/* Contact & Account Registration */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-[0_4px_20px_rgba(73,88,52,0.05)]">
              <h2 className="text-2xl font-cormorant font-bold text-olive-800 mb-4 border-b pb-2">
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={!!user}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="First and Last Name"
                    disabled={!!user}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (For SMS)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required={!!tier}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {tier && !user && (
                  <div className="md:col-span-2 mt-2 p-4 bg-olive-50/50 rounded-xl border border-olive-100">
                    <Label htmlFor="password">Create Account Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-olive-600 mt-2">
                      An account password is required so you can securely log in to fill
                      out your daily progress reports.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Concierge Intake Questionnaire (Only if Tier selected) */}
            {tier && (
              <div className="bg-amber-50/40 p-6 rounded-2xl border border-amber-200/60 shadow-[0_4px_20px_rgba(217,119,6,0.03)]">
                <h2 className="text-2xl font-cormorant font-bold text-olive-800 mb-2">
                  Concierge Wellness Intake
                </h2>
                <p className="text-sm text-stone-600 mb-6">
                  Please answer these questions. This information will customize your wellness
                  compound recommendations and generate your personalized welcome document.
                </p>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="title">Title / Prefix</Label>
                      <select
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="">None</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 48"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Gender</Label>
                      <div className="flex gap-4 h-10 items-center">
                        <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={gender === "male"}
                            onChange={() => setGender("male")}
                            className="text-olive-600 focus:ring-olive-500"
                          />
                          Male
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={gender === "female"}
                            onChange={() => setGender("female")}
                            className="text-olive-600 focus:ring-olive-500"
                          />
                          Female
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                          <input
                            type="radio"
                            name="gender"
                            value="prefer-not-to-say"
                            checked={gender === "prefer-not-to-say"}
                            onChange={() => setGender("prefer-not-to-say")}
                            className="text-olive-600 focus:ring-olive-500"
                          />
                          Other
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="wellnessFormula">Wellness Formula</Label>
                    <Input
                      id="wellnessFormula"
                      type="text"
                      value={wellnessFormula}
                      onChange={(e) => setWellnessFormula(e.target.value)}
                      placeholder="e.g. Felix Vitality Formula"
                    />
                    <p className="text-xs text-stone-500 mt-1">
                      A personalized title for your bespoke herbal wellness compound.
                    </p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Primary Wellness Objectives</Label>
                    <div className="grid md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1 border rounded-lg bg-white/70">
                      {visibleGoals.map((goal) => (
                        <label
                          key={goal}
                          className="flex items-start gap-2.5 p-2 rounded hover:bg-olive-50/50 cursor-pointer select-none transition"
                        >
                          <input
                            type="checkbox"
                            value={goal}
                            checked={selectedGoals.includes(goal)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGoals([...selectedGoals, goal]);
                              } else {
                                setSelectedGoals(selectedGoals.filter((g) => g !== goal));
                              }
                            }}
                            className="mt-1 h-4 w-4 text-olive-600 border-stone-300 rounded focus:ring-olive-500"
                          />
                          <span className="text-sm text-stone-700">{getGoalLabel(goal)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="healthNotes">Focus Areas & Health Notes</Label>
                    <textarea
                      id="healthNotes"
                      value={healthNotes}
                      onChange={(e) => setHealthNotes(e.target.value)}
                      placeholder="List any physical concerns, mobility hurdles, sleep difficulties, or other specific goals..."
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-[0_4px_20px_rgba(73,88,52,0.05)]">
              <h2 className="text-2xl font-cormorant font-bold text-olive-800 mb-4 border-b pb-2">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Herbal Lane"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Apothecaryville"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State / Province</Label>
                  <Input
                    id="state"
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="CA"
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP / Postal Code</Label>
                  <Input
                    id="zip"
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="90210"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-[0_4px_20px_rgba(73,88,52,0.05)]">
              <h2 className="text-2xl font-cormorant font-bold text-olive-800 mb-4 border-b pb-2">
                Payment Details
              </h2>
              <RadioGroup defaultValue="card" className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
                </div>
              </RadioGroup>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="•••• •••• •••• ••••" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiration</Label>
                    <Input id="expiry" placeholder="MM / YY" required />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="•••" required />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary sidebar */}
          <aside className="bg-white p-8 rounded-2xl shadow-[0_4px_30px_rgba(73,88,52,0.08)] border border-stone-200 lg:sticky lg:top-28 lg:self-start space-y-6">
            <h2 className="text-2xl font-cormorant font-bold text-olive-800 border-b pb-3">
              Your Order
            </h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {/* Selected Membership Tier */}
              {selectedTier && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-olive-50/50 border border-olive-100/60">
                  <div className="text-2xl mt-0.5">🌿</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 leading-snug">{selectedTier.name}</p>
                    <p className="text-xs text-olive-700 font-medium">{selectedTier.description}</p>
                  </div>
                  <p className="font-semibold text-stone-800">${selectedTier.price.toFixed(2)}</p>
                </div>
              )}

              {/* Cart Products */}
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-14 w-14 rounded-lg object-cover border border-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-stone-800">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <dl className="pt-4 border-t space-y-3 text-sm text-stone-600">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-stone-800">${finalTotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="font-medium text-stone-800">Free</dd>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-stone-800">
                <dt>Total</dt>
                <dd>${finalTotal.toFixed(2)}</dd>
              </div>
            </dl>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-olive-600 hover:bg-olive-700 text-white rounded-full py-6 font-semibold shadow-md transition"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : tier
                  ? "Complete Registration"
                  : "Place Order"}
            </Button>

            <p className="text-center text-[10px] text-stone-500 leading-normal">
              By purchasing, you agree to Grandma's Herbals wellness terms. Your information is
              stored securely in compliance with RLS protocols.
            </p>
          </aside>
        </form>
      </div>
    </SiteLayout>
  );
}
