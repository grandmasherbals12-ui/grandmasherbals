import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export function About() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(199,213,180,0.35),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(252,240,196,0.55),transparent_34%)]" />
      <div className="container mx-auto px-4 relative">
        <div className="grid items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-olive-50 via-white to-amber-50 p-8 sm:p-10 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-olive-700">
              Heritage & Wellness
            </p>
            <h2 className="mx-auto max-w-2xl text-3xl font-cormorant font-bold leading-tight sm:text-4xl">
              Learn more about our heritage, values, and practices.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
              The full story and values are available on our About page. Visit to explore the
              traditions and inspirations behind Grandma's Herbals.
            </p>

            <div className="mt-6">
              <Button asChild size="lg" className="bg-olive-600 px-6 text-white hover:bg-olive-700">
                <Link to="/about">Discover Our Story</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
