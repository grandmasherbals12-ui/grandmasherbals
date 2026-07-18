import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Testimonials } from "@/components/site/Testimonials";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Grandma's Herbals" },
      {
        name: "description",
        content:
          "Hear real stories and watch video testimonials from our wellness community members.",
      },
    ],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-olive-800 to-olive-950 py-24 sm:py-32 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, #a3b18a 0%, transparent 60%), radial-gradient(circle at 70% 50%, #588157 0%, transparent 60%)",
          }}
        />
        <div className="relative container mx-auto max-w-4xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-olive-700/50 bg-olive-800/50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-olive-200 backdrop-blur-md mb-4"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Community Voices</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-cormorant font-bold text-white mb-6 leading-none"
          >
            Testimonials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-olive-200 text-base sm:text-lg md:text-xl font-medium mb-3 max-w-2xl mx-auto"
          >
            Real stories from our wellness community — video testimonials
            and heartfelt comments from people just like you.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-olive-300 max-w-xl mx-auto text-xs sm:text-sm italic"
          >
            "Every journey begins with a single step toward wellness."
          </motion.p>
        </div>
      </section>

      {/* Testimonials Content */}
      <div className="bg-[#FAF8F5]">
        <Testimonials />
      </div>
    </SiteLayout>
  );
}
