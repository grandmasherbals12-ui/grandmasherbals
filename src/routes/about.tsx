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
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-olive-50/40 py-10 sm:py-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-olive-200/35 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-100/55 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-7xl rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_70px_rgba(73,88,52,0.12)] backdrop-blur sm:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-5 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-olive-700">
                  Heritage & Wellness
                </p>
                <h1 className="text-3xl font-cormorant font-bold leading-tight text-olive-900 sm:text-4xl lg:text-4xl">
                  ROOTED IN HERITAGE. <br className="hidden sm:inline" />
                  GROWN THROUGH GENERATIONS.
                </h1>
                <div className="space-y-3.5 text-stone-700 text-sm sm:text-base">
                  <p className="leading-6 sm:leading-7">
                    Our story is rooted in Creole traditions, Native American plant wisdom, and West African botanical knowledge, connecting waterways and communities from Louisiana to Belize. For generations, families cultivated herbs and healing plants to support wellness, resilience, and connection to nature.
                  </p>
                  <p className="leading-6 sm:leading-7">
                    Grandma&apos;s Herbals honors these traditions by blending ancestral wisdom with modern understanding to support balance of the mind, body, and spirit through natural, regenerative wellness solutions.
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                  {[
                    "Respect Nature.",
                    "Honor Heritage.",
                    "Support Wellness.",
                    "Strengthen Community.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-stone-200/80 bg-white/90 px-4 py-3 text-left text-xs sm:text-sm font-semibold text-olive-800 shadow-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <Link
                    to="/consultation"
                    className="inline-flex items-center justify-center rounded-full bg-olive-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-olive-900/10 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-olive-700"
                  >
                    Book a Consultation
                  </Link>
                </div>
              </div>

              <div className="order-first lg:order-last flex items-center justify-center">
                <div className="w-full max-w-3xl aspect-[4/3] overflow-hidden rounded-[2rem] bg-black shadow-none">
                  <img
                    src="/yogaplant.jpeg"
                    alt="Yoga plant scene"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
