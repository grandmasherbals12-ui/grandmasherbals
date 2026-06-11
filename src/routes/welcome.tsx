import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

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

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase.from("member_profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
    };
    load();
  }, [user]);

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
              <div className="mt-8 rounded-2xl bg-olive-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-olive-500 mb-2">Next Steps</p>
                <p className="text-stone-700 leading-7">
                  We will review your intake, prepare your wellness recommendations, and continue supporting your concierge care journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
