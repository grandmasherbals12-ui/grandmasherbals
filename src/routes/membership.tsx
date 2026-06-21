import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { MembershipSection } from "@/components/site/MembershipSection";
import { ClipboardList, Check } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership Plans — Grandma's Herbals" },
      { name: "description", content: "Guided Meditation, Herbal Wellness & Personalized Lifestyle Optimization Tiers." },
    ],
  }),
  component: MembershipPage,
});

function MembershipPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white">
        {/* Standalone Hero Section with Large Typography */}
        <section className="bg-gradient-to-br from-olive-800 to-olive-950 py-24 sm:py-32 px-4 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, #a3b18a 0%, transparent 60%), radial-gradient(circle at 70% 50%, #588157 0%, transparent 60%)",
            }}
          />
          <div className="relative container mx-auto max-w-4xl z-10">
            <p className="text-xs font-bold tracking-[0.35em] text-olive-300 uppercase mb-4">
              Grandma's Herbals
            </p>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-cormorant font-bold text-white mb-6 leading-none">
              Membership Plans
            </h1>
            <p className="text-olive-200 text-base sm:text-lg md:text-xl font-medium mb-3 max-w-2xl mx-auto">
              Guided Meditation • Herbal Wellness • Personalized Lifestyle Optimization
            </p>
            <p className="text-olive-300 max-w-xl mx-auto text-xs sm:text-sm italic">
              "Wholistic Wellness Through Awareness, Circulation & Strategic Herbal Guidance"
            </p>
          </div>
        </section>

        {/* Progress Report CTA */}
        <section className="py-12 bg-olive-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-olive-600/50 text-olive-100 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                  <ClipboardList className="h-3.5 w-3.5" /> Member Dashboard
                </div>
                <h2 className="text-2xl sm:text-3xl font-cormorant font-bold text-white mb-3">
                  Submit Your Daily Progress Report
                </h2>
                <p className="text-olive-200 max-w-xl mx-auto text-xs sm:text-sm">
                  Enter your wellness data each evening. Your personalized branded report is automatically generated and delivered each morning.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    icon: <ClipboardList className="h-7 w-7 mx-auto mb-2 text-olive-300" />,
                    title: "Enter Tonight",
                    desc: "Fill in your 3-day progress data each evening before bed",
                  },
                  {
                    icon: <div className="text-2xl mb-2">💌</div>,
                    title: "8:00 AM",
                    desc: "Personalized SMS & email generated from your data",
                  },
                  {
                    icon: <div className="text-2xl mb-2">📊</div>,
                    title: "9:00 AM",
                    desc: "Your branded 3-day progress report by email & text",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-2xl p-4 text-center text-white border border-white/5">
                    {item.icon}
                    <div className="font-semibold text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-olive-200 leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-olive-800 hover:bg-olive-50 rounded-full px-10 py-6 font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <Link to="/progress-report">
                    <ClipboardList className="h-5 w-5 mr-2" /> Submit My Progress Report
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3 & 4. Membership & Addon Tiers component (without duplicate headers) */}
        <MembershipSection showHeader={false} />

        {/* Wellness Ecosystem */}
        <section className="py-20 bg-white border-t border-stone-200/60 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-cormorant font-bold text-[#354f52] mb-12 text-center uppercase tracking-tight">
              Our Wellness Ecosystem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-olive-800">Core Offerings</h3>
                {[
                  "Guided meditation for awareness, relaxation, and circulation support",
                  "Herbal wellness consultations",
                  "Personalized meal and lifestyle recommendations",
                  "Wellness education protocols",
                  "Medication and herbal interaction screening",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-stone-700 text-sm leading-relaxed">
                    <Check className="h-4.5 w-4.5 text-olive-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-olive-800">Expert Advisory Team</h3>
                {[
                  "Master Herbalist & Energy Flow Specialist",
                  "Psychologist",
                  "Physiotherapist",
                  "Internal Medicine Specialists",
                  "Psychiatrist Support",
                  "Smart wellness analysis engines",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-stone-700 text-sm leading-relaxed">
                    <Check className="h-4.5 w-4.5 text-olive-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 bg-stone-50 border-t border-stone-200/50 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-amber-50/50 border-l-4 border-amber-500 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-amber-900 mb-2">Important Wellness Notice</h3>
              <p className="text-amber-800 text-xs sm:text-sm mb-2 leading-relaxed">
                Grandma's Herbals wellness consultations, guided meditation services, and auto-generated wellness recommendations are educational and wellness-supportive in nature and are not intended to diagnose, treat, cure, or prevent disease.
              </p>
              <p className="text-amber-800 text-xs sm:text-sm leading-relaxed">
                Clients should always consult with licensed healthcare professionals regarding medical concerns, medications, or treatment decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-white border-t border-stone-200/50 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto rounded-[2rem] border border-olive-200 bg-gradient-to-b from-[#FAF8F5] to-white px-8 py-14 text-center shadow-md">
              <p className="text-xs font-bold tracking-[0.35em] text-olive-600 uppercase mb-4">Our Mission</p>
              <p className="text-2xl md:text-3xl leading-relaxed text-stone-900 font-cormorant font-bold max-w-2xl mx-auto">
                Grandma's Herbals delivers Integrative Regenerative Wellness through a personalized, bespoke concierge experience tailored to support your mind, body, spirit, and overall quality of life.
              </p>
              <blockquote className="mt-8 text-olive-700 italic text-lg sm:text-xl font-semibold">
                "Adjusting to changing paradigms strategically & methodically."
              </blockquote>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
