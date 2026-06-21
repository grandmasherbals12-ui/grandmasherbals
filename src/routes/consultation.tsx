import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ConsultationSection } from "@/components/site/ConsultationSection";
import { motion } from "framer-motion";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Wellness Consultations — Grandma's Herbals" },
      { name: "description", content: "Book a personalized, one-on-one wellness consultation to receive customized lifestyle and botanical guidance." },
    ],
  }),
  component: ConsultationPage,
});

function ConsultationPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white">
        {/* Header Hero Section with Large Typography */}
        <section className="relative overflow-hidden bg-gradient-to-br from-olive-800 to-olive-950 py-24 sm:py-32 px-4 text-center">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, #a3b18a 0%, transparent 60%), radial-gradient(circle at 70% 50%, #588157 0%, transparent 60%)",
            }}
          />
          <div className="container mx-auto px-4 relative z-10 max-w-4xl">
            <p className="text-xs font-bold tracking-[0.35em] text-olive-300 uppercase mb-4">
              Grandma's Herbals
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl sm:text-7xl md:text-8xl font-cormorant font-bold text-white mb-6 leading-none uppercase tracking-tight"
            >
              Consultations
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-olive-200 leading-relaxed font-medium"
            >
              Personalized wellness consultations tailored to your goals. Experience a custom approach with ancestral wisdom and modern analysis.
            </motion.p>
          </div>
        </section>

        {/* Shared Consultation Section without duplicated header */}
        <ConsultationSection showHeader={false} />
      </div>
    </SiteLayout>
  );
}