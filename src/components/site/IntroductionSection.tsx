import { motion } from "framer-motion";
import { Leaf, Heart, ShieldCheck } from "lucide-react";

const principles = [
  {
    title: "Our Philosophy",
    description: "We believe in the power of nature to heal, restore, and rejuvenate. Our approach to wellness is rooted in traditional wisdom and modern science.",
    icon: Leaf,
  },
  {
    title: "Our Mission",
    description: "To empower individuals on their journey to holistic well-being through carefully crafted botanical compounds, guided support, and a nurturing community.",
    icon: Heart,
  },
  {
    title: "Our Commitment",
    description: "Purity and potency in every formulation. We source organically and ethically, ensuring what you put into your body supports your natural regenerative ability.",
    icon: ShieldCheck,
  },
];

export function IntroductionSection() {
  return (
    <section className="relative w-full bg-olive-900 py-24 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-olive-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cream-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-[500px] h-[500px] bg-olive-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
      </div>

      <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-olive-700/50 bg-olive-800/50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-olive-200 backdrop-blur-md"
          >
            <Leaf className="h-4 w-4" />
            <span>Welcome to Grandma's Herbals</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1]"
          >
            Rooted in tradition. Crafted for your vitality.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-olive-100/90 max-w-3xl leading-relaxed"
          >
            More than just an apothecary, we are a sanctuary for integrative regenerative wellness. 
            We guide you toward a life of balance, resilience, and natural thriving.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {principles.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.3 + index * 0.1 }}
              className="relative group rounded-3xl border border-olive-700/30 bg-olive-800/20 p-8 hover:bg-olive-800/40 transition-colors duration-500 backdrop-blur-sm"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-olive-700/50 text-olive-200 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-cormorant font-bold text-white tracking-wide">
                {item.title}
              </h3>
              <p className="text-olive-100/80 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
