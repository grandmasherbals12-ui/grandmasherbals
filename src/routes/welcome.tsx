import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Printer, Leaf, Loader2 } from "lucide-react";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome Letter — Grandma's Herbals" },
      {
        name: "description",
        content: "Welcome letter template for concierge wellness clients.",
      },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase.from("member_profiles").select("*").eq("id", user.id).single();
        if (data) setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] flex items-center justify-center bg-stone-50">
          <Loader2 className="h-8 w-8 animate-spin text-olive-650" />
        </div>
      </SiteLayout>
    );
  }

  if (profile && !profile.welcome_approved) {
    return (
      <SiteLayout>
        <section className="min-h-[75vh] flex items-center justify-center bg-gradient-to-b from-stone-50 via-white to-olive-50 px-4 py-16">
          <div className="w-full max-w-2xl rounded-[2rem] border border-amber-100 bg-[#faf8f2] p-8 text-center shadow-[0_20px_70px_rgba(73,88,52,0.06)]">
            <span className="text-[2.5rem]">🌿</span>
            <h1 className="mt-4 text-3xl font-cormorant font-bold text-olive-900 md:text-4xl">Preparing Your Wellness Protocol</h1>
            <p className="mt-4 text-stone-600 leading-7 max-w-md mx-auto">
              Our concierge wellness team is currently personalizing your welcome package and custom compounding your herbal formula.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <span className="h-2 w-2 rounded-full bg-olive-500 animate-bounce delay-100"></span>
              <span className="h-2 w-2 rounded-full bg-olive-500 animate-bounce delay-250"></span>
              <span className="h-2 w-2 rounded-full bg-olive-500 animate-bounce delay-500"></span>
            </div>
            <p className="mt-6 text-xs text-stone-400 uppercase tracking-widest">
              You will receive an email and SMS as soon as your practitioner releases your letter.
            </p>
            <Button asChild className="mt-8 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50">
              <Link to="/account">Back to My Journal</Link>
            </Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const clientName = profile?.full_name || user?.fullName || "Client";
  const age = profile?.age || "--";
  const formula = profile?.wellness_formula || "Your Wellness Formula";
  const dateLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-stone-50 via-white to-olive-50/40 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex justify-between items-center flex-wrap gap-4 mb-6 print:hidden">
            <Link
              to="/account"
              className="text-sm font-semibold text-olive-700 hover:text-olive-900 transition"
            >
              ← Back to Journal
            </Link>
            <Button
              onClick={() => window.print()}
              className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-5 py-2 text-xs font-semibold gap-1.5 shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <Printer className="h-4 w-4" /> Export PDF / Print Welcome Letter
            </Button>
          </div>

          <div className="mx-auto max-w-5xl rounded-[2rem] border border-amber-200 bg-[#faf8f2] p-6 shadow-[0_20px_70px_rgba(73,88,52,0.10)] md:p-10">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-olive-500">Welcome To</p>
              <h1 className="mt-3 text-4xl font-cormorant font-bold text-olive-900 md:text-6xl">Concierge Wellness Care</h1>
              <p className="mt-3 text-stone-500 uppercase tracking-[0.25em] text-xs">Rooted in ancient wisdom. Cultivated for well-being.</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3 text-sm">
              <div className="rounded-2xl border border-amber-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Client</p>
                <p className="mt-1 text-lg font-semibold text-olive-800">{clientName}</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Age</p>
                <p className="mt-1 text-lg font-semibold text-olive-800">{age}</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Formula</p>
                <p className="mt-1 text-lg font-semibold text-olive-800">{formula}</p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-amber-200 bg-white p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="font-cormorant text-2xl italic text-olive-700">Dear {clientName},</p>
                <p className="text-sm text-stone-500">{dateLabel}</p>
              </div>
              <div className="mt-5 space-y-4 text-stone-700 leading-7">
                <p>
                  Welcome to the Grandma&apos;s Herbals Concierge Wellness Community. Your wellness journey is now being supported with a personalized, bespoke experience tailored to your goals, comfort, and lifestyle.
                </p>
                <p>
                  We are honored to support you with mind, body, spirit, and overall quality of life at the center of your protocol.
                </p>
                <p>
                  Your intake information has been received and will guide your next recommendations.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between text-sm flex-wrap gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400">Practitioner</p>
                  <p className="font-semibold text-olive-800 mt-1">{profile?.practitioner_name || "Dr. Travis Williams"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-400">Grandma's Herbals</p>
                  <p className="font-semibold text-olive-800 mt-1">Concierge Care Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
