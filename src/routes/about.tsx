import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <SiteLayout>
      {/* Full-width hero with yogaplant background */}
      <section className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Image — full width, no padding */}
        <img
          src="/yogaplant.jpeg"
          alt="Yoga plant scene"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
              Heritage &amp; Wellness
            </p>
            <h1 className="text-5xl font-cormorant font-bold leading-[1.05] text-white sm:text-7xl lg:text-8xl tracking-tight">
              ROOTED IN HERITAGE. <br className="hidden sm:inline" />
              GROWN THROUGH GENERATIONS.
            </h1>
            <div className="space-y-4 text-white/85 text-sm sm:text-base max-w-xl">
              <p className="leading-7">
                Our story is rooted in Creole traditions, Native American plant wisdom, and West African botanical knowledge, connecting waterways and communities from Louisiana to Belize. For generations, families cultivated herbs and healing plants to support wellness, resilience, and connection to nature.
              </p>
              <p className="leading-7">
                Grandma&apos;s Herbals honors these traditions by blending ancestral wisdom with modern understanding to support balance of the mind, body, and spirit through natural, regenerative wellness solutions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 max-w-md">
              {[
                "Respect Nature.",
                "Honor Heritage.",
                "Support Wellness.",
                "Strengthen Community.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-left text-xs sm:text-sm font-semibold text-white shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/consultation"
                className="inline-flex items-center justify-center rounded-full bg-olive-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-olive-700"
              >
                Book a Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
