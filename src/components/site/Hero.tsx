import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Leaf, HeartPulse, Infinity } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Section Data ──────────────────────────────────────────────────────────── */

const sections = [
  {
    id: 1,
    media: "/carousel-1.png",
    alt: "Ancient tree roots — foundation of wellness",
    overlayTypography: true, // Typography ON the image
    eyebrow: "Integrative Wellness",
    title: "Bespoke Formulated Compounds",
    subtitle: "mind. body. spirit. soul",
    description:
      "A whole-body approach combining botanicals, nutrition, and lifestyle support for balanced wellness.",
    cta: { label: "Begin Your Wellness Journey", to: "/assessment" },
    secondaryCta: { label: "Discover Our Story", to: "/about" },
    icon: Sparkles,
    bg: "bg-stone-950", // Image container bg
    contrastBg: "bg-olive-900", // Contrasting section bg
    contrastText: "text-white",
  },
  {
    id: 2,
    media: "/carousel-2.png",
    alt: "Herbal lifestyle scene",
    overlayTypography: false,
    eyebrow: "Integrative Wellness",
    title: "Organic Wellness",
    subtitle: "Grown in nature. Guided by Wisdom.",
    description:
      "Tailored botanical protocols designed around your specific health goals and daily routines.",
    cta: { label: "Explore Consultations", to: "/consultation" },
    icon: HeartPulse,
    bg: "bg-stone-950",
    contrastBg: "bg-[#FAF8F5]",
    contrastText: "text-stone-900",
  },
  {
    id: 3,
    media: "/carousel-4.png",
    alt: "Botanical products scene",
    overlayTypography: false,
    eyebrow: "Nature's Pharmacy",
    title: "Rooted In Nature. Guided By Wisdom.",
    subtitle: "Premium botanicals with modern wellness insight.",
    description:
      "Premium botanicals, traditional herbal knowledge, and modern wellness insights combined to help support your everyday health goals.",
    cta: { label: "Shop Botanicals", to: "/shop" },
    icon: Leaf,
    bg: "bg-stone-950",
    contrastBg: "bg-olive-800",
    contrastText: "text-white",
  },
  {
    id: 4,
    media: "/carousel-2.png",
    alt: "Wellness botanical renewal scene",
    overlayTypography: true, // Typography ON the image
    eyebrow: "Regenerative Wellness",
    title: "Support Your Body's Natural Ability to Renew",
    subtitle: "Restore resilience, energy, and mobility.",
    description:
      "Discover wellness strategies focused on restoration, resilience, recovery, circulation, energy, mobility, and long-term vitality.",
    cta: { label: "Learn More", to: "/about" },
    icon: Infinity,
    bg: "bg-stone-950",
    contrastBg: "bg-[#2C2C2C]",
    contrastText: "text-white",
  },
  {
    id: 5,
    media: "/carousel-4.png",
    alt: "Mind body spirit wellness scene",
    overlayTypography: false,
    eyebrow: "Whole Person Wellness",
    title: "Mind • Body • Spirit",
    subtitle: "Well-being that supports the whole person.",
    description:
      "True wellness supports emotional wellness, mental clarity, personal growth, and overall well-being. Our wholistic approach supports the whole person.",
    cta: { label: "Join Membership", to: "/membership" },
    icon: Sparkles,
    bg: "bg-stone-950",
    contrastBg: "bg-olive-900",
    contrastText: "text-white",
  },
  {
    id: 6,
    media: "/meditation.png",
    alt: "Wellness community scene",
    overlayTypography: false,
    eyebrow: "Community Wellness",
    title: "Feel Better. Live Better. Thrive Naturally.",
    subtitle: "A growing community embracing a natural path to vitality.",
    description:
      "Join a growing community embracing a natural path toward vitality, balance, and lifelong wellness.",
    cta: { label: "Shop Now", to: "/shop" },
    secondaryCta: { label: "Join Membership", to: "/membership" },
    icon: ArrowRight,
    bg: "bg-stone-950",
    contrastBg: "bg-[#FAF8F5]",
    contrastText: "text-stone-900",
  },
];

/* ─── Hero Component ────────────────────────────────────────────────────────── */

export function Hero() {
  return (
    <section className="w-full">
      {sections.map((section, index) => (
        <HeroSection key={section.id} section={section} index={index} />
      ))}
    </section>
  );
}

/* ─── Individual Hero Section ───────────────────────────────────────────────── */

interface HeroSectionData {
  id: number;
  media: string;
  alt: string;
  overlayTypography: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  cta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  icon: React.ElementType;
  bg: string;
  contrastBg: string;
  contrastText: string;
}

function HeroSection({
  section,
  index,
}: {
  section: HeroSectionData;
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  // once: false enables triggering animations both scrolling down and up
  const isInView = useInView(sectionRef, { once: false, margin: "-10%" });

  return (
    <div ref={sectionRef}>
      {/* ── Image Section ── */}
      <div className={`relative w-full overflow-hidden ${section.bg}`}>
        {/* Image with gentle zoom animation on scroll */}
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={
            isInView
              ? { scale: 1, opacity: 1 }
              : { scale: 1.08, opacity: 0 }
          }
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="w-full"
        >
          <img
            src={section.media}
            alt={section.alt}
            className="w-full h-[70vh] min-h-[450px] max-h-[700px] object-cover"
            loading={index === 0 ? "eager" : "lazy"}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </motion.div>

        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/15 to-transparent pointer-events-none" />

        {/* Typography Overlay — only for sections with overlayTypography */}
        {section.overlayTypography && (
          <OverlayTypography section={section} isInView={isInView} />
        )}
      </div>

      {/* ── Contrasting Typography Section (for non-overlay images) ── */}
      {!section.overlayTypography && (
        <ContrastTypographySection section={section} />
      )}

      {/* ── CTA Section below overlay images ── */}
      {section.overlayTypography && (
        <OverlayCTASection section={section} />
      )}
    </div>
  );
}

/* ─── Typography Overlay (appears ON the image for sections 1 & 4) ─────── */

function OverlayTypography({
  section,
  isInView,
}: {
  section: HeroSectionData;
  isInView: boolean;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-[5] text-center px-4 md:px-8">
      {/* Eyebrow badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: isInView ? 1.5 : 0, ease: "easeOut" }}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-stone-950/30 backdrop-blur-md px-3.5 py-1 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-sm"
      >
        <section.icon className="h-3.5 w-3.5 text-olive-300" />
        <span>{section.eyebrow}</span>
      </motion.div>

      {/* Hero Title — appears 1.5s after image */}
      <motion.h2
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={
          isInView
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 40, filter: "blur(8px)" }
        }
        transition={{ duration: 1, delay: isInView ? 1.5 : 0, ease: "easeOut" }}
        className="font-cormorant text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] max-w-5xl"
      >
        {section.title}
      </motion.h2>

      {/* Subtitle — appears 1s after hero title (2.5s total) */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: isInView ? 2.5 : 0, ease: "easeOut" }}
        className="mt-4 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] max-w-xl"
      >
        {section.subtitle}
      </motion.p>

      {/* Description — fades in after subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: isInView ? 3 : 0, ease: "easeOut" }}
        className="mt-3 text-xs sm:text-sm text-white/75 max-w-lg leading-relaxed"
      >
        {section.description}
      </motion.p>
    </div>
  );
}

/* ─── CTA Section below overlay images ──────────────────────────────────── */

function OverlayCTASection({ section }: { section: HeroSectionData }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  return (
    <div
      ref={ref}
      className={`${section.contrastBg} py-10 sm:py-14 px-4 sm:px-6`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 justify-center items-center"
      >
        <Button
          asChild
          className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-8 py-5 shadow-lg shadow-olive-900/10 transition-transform duration-200 hover:-translate-y-0.5 text-sm font-semibold"
        >
          <Link to={section.cta.to}>
            {section.cta.label}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
        {section.secondaryCta && (
          <Button
            asChild
            variant="outline"
            className="border-white/30 bg-white/10 hover:bg-white/20 text-white rounded-full px-8 py-5 transition-transform duration-200 hover:-translate-y-0.5 text-sm font-semibold"
          >
            <Link to={section.secondaryCta.to}>
              {section.secondaryCta.label}
            </Link>
          </Button>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Contrasting Typography Section (sits between images) ──────────────── */

function ContrastTypographySection({
  section,
}: {
  section: HeroSectionData;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  const isLight =
    section.contrastBg.includes("FAF8F5") ||
    section.contrastBg.includes("white");

  return (
    <div
      ref={ref}
      className={`${section.contrastBg} py-16 sm:py-24 px-4 sm:px-6 md:px-8`}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.25em] shadow-sm ${
            isLight
              ? "border-olive-300 bg-olive-50 text-olive-700"
              : "border-white/20 bg-white/10 backdrop-blur-md text-white/90"
          }`}
        >
          <section.icon
            className={`h-3.5 w-3.5 ${isLight ? "text-olive-500" : "text-olive-300"}`}
          />
          <span>{section.eyebrow}</span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: isInView ? 0.1 : 0, ease: "easeOut" }}
          className={`font-cormorant text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-4 ${section.contrastText}`}
        >
          {section.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: isInView ? 0.2 : 0, ease: "easeOut" }}
          className={`text-sm sm:text-base md:text-lg font-semibold uppercase tracking-[0.18em] mb-4 ${
            isLight ? "text-stone-600" : "text-white/80"
          }`}
        >
          {section.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: isInView ? 0.3 : 0, ease: "easeOut" }}
          className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8 ${
            isLight ? "text-stone-500" : "text-white/70"
          }`}
        >
          {section.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.7, delay: isInView ? 0.4 : 0, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            asChild
            className={`rounded-full px-8 py-5 shadow-lg transition-transform duration-200 hover:-translate-y-0.5 text-sm font-semibold ${
              isLight
                ? "bg-olive-600 hover:bg-olive-700 text-white shadow-olive-900/10"
                : "bg-white hover:bg-white/90 text-olive-900 shadow-white/10"
            }`}
          >
            <Link to={section.cta.to}>
              {section.cta.label}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          {section.secondaryCta && (
            <Button
              asChild
              variant="outline"
              className={`rounded-full px-8 py-5 transition-transform duration-200 hover:-translate-y-0.5 text-sm font-semibold ${
                isLight
                  ? "border-stone-300 bg-white hover:bg-stone-50 text-stone-800"
                  : "border-white/30 bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Link to={section.secondaryCta.to}>
                {section.secondaryCta.label}
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
