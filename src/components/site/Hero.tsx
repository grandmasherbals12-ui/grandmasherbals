import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Leaf, HeartPulse, Infinity } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const slides = [
  {
    id: 1,
    type: "image" as const,
    media: "/carousel-1.png",
    alt: "Wellness botanical scene",
    eyebrow: "Integrative Wellness",
    title: "Bespoke Formulated Compounds",
    subtitle: "Rejuvenating",
    description: "mind. body. spirit. soul",
    features: ["Integrative Wellness", "Regenerative Living", "Natural & Organic", "Wholistic Well-Being"],
    featureDescriptions: [
      "A whole-body approach combining botanicals, nutrition, and lifestyle support for balanced wellness.",
      "Support your body's natural ability to renew, recover, and maintain vibrant energy every day.",
      "Every ingredient is responsibly sourced — free from synthetics, pesticides, and artificial fillers.",
      "True wellness nurtures the mind, body, spirit, and soul — not just physical symptoms.",
    ],
    primaryCta: { label: "Begin Your Wellness Journey", to: "/assessment", tooltip: "Start your personalized wellness assessment" },
    secondaryCta: { label: "Discover Our Story", to: "/about", tooltip: "Learn more about our wellness approach" },
    icon: Sparkles,
  },
  {
    id: 2,
    type: "image" as const,
    media: "/carousel-2.png",
    alt: "Herbal lifestyle scene",
    eyebrow: "Integrative Wellness",
    title: "Organic Wellness",
    subtitle: "Grown in nature.",
    description: "Guided by Wisdom.",
    features: ["Personalized Recommendations", "Lifestyle Support", "Herbal Guidance", "Smart Wellness Support"],
    featureDescriptions: [
      "Tailored botanical protocols designed around your specific health goals and daily routines.",
      "Practical strategies for sleep, stress, nutrition, and movement that fit into your life.",
      "Expert herbal guidance rooted in generations of traditional plant-based wisdom.",
      "Data-informed wellness insights to help track progress and optimize your journey.",
    ],
    primaryCta: { label: "Explore Consultations", to: "/consultation", tooltip: "Book a 1-on-1 wellness session" },
    icon: HeartPulse,
  },
  {
    id: 3,
    type: "video" as const,
    media: "/carousel-3.mp4",
    alt: "Wellness video scene",
    eyebrow: "Regenerative Wellness",
    title: "Support Your Body’s Natural Ability to Renew",
    subtitle: "Restore resilience, energy, and mobility.",
    description: "Discover wellness strategies focused on restoration, resilience, recovery, circulation, energy, mobility, and long-term vitality.",
    features: ["Recovery Support", "Energy & Vitality", "Active Lifestyle", "Healthy Aging Focus"],
    featureDescriptions: [
      "Botanical blends designed to support post-activity recovery, muscle comfort, and restoration.",
      "Natural adaptogens and energizing herbs to sustain steady energy without caffeine crashes.",
      "Formulas tailored for people who move — supporting joints, flexibility, and daily performance.",
      "Age-supportive botanicals promoting longevity, cellular health, and graceful vitality over time.",
    ],
    primaryCta: { label: "Learn More", to: "/about", tooltip: "Discover restorative wellness strategies" },
    icon: Infinity,
  },
  {
    id: 4,
    type: "image" as const,
    media: "/carousel-4.png",
    alt: "Botanical products scene",
    eyebrow: "Nature’s Pharmacy",
    title: "Rooted In Nature. Guided By Wisdom.",
    subtitle: "Premium botanicals with modern wellness insight.",
    description: "Premium botanicals, traditional herbal knowledge, and modern wellness insights combined to help support your everyday health goals.",
    features: ["Organic Ingredients", "Small Batch Formulas", "Quality Focused", "Naturally Inspired"],
    featureDescriptions: [
      "Every herb is sourced from certified organic farms — no synthetic pesticides or fertilizers.",
      "Handcrafted in batches of 50 or fewer to preserve freshness and potency in every bottle.",
      "Third-party tested for purity, potency, and safety before every single product release.",
      "Formulas rooted in traditional herbal wisdom passed down through generations of healers.",
    ],
    primaryCta: { label: "Shop Botanicals", to: "/shop", tooltip: "Browse our premium botanical products" },
    icon: Leaf,
  },
  {
    id: 5,
    type: "video" as const,
    media: "/carousel-5.mp4",
    alt: "Wellness video scene",
    eyebrow: "Whole Person Wellness",
    title: "Mind • Body • Spirit",
    subtitle: "Well-being that supports the whole person.",
    description: "True wellness supports emotional wellness, mental clarity, personal growth, and overall well-being. Our wholistic approach supports the whole person.",
    features: ["Meditation Support", "Stress Management", "Wellness Coaching", "Guided Resources"],
    featureDescriptions: [
      "Guided meditation practices and calming botanicals to help quiet the mind and find stillness.",
      "Adaptogenic herbs and lifestyle strategies that help your body manage daily stress naturally.",
      "One-on-one wellness support to build sustainable habits, set goals, and track your progress.",
      "Curated articles, videos, and wellness protocols to empower your self-care journey at home.",
    ],
    primaryCta: { label: "Join Membership", to: "/membership", tooltip: "Become a member for exclusive content" },
    icon: Sparkles,
  },
  {
    id: 6,
    type: "image" as const,
    media: "/carousel-1.png",
    alt: "Wellness botanical scene",
    eyebrow: "Community Wellness",
    title: "Feel Better. Live Better. Thrive Naturally.",
    subtitle: "A growing community embracing a natural path to vitality.",
    description: "Join a growing community embracing a natural path toward vitality, balance, and lifelong wellness.",
    features: ["Shop the collection", "Join membership", "Book support", "Grow with us"],
    featureDescriptions: [
      "Browse our curated apothecary of hand-blended tinctures, teas, candles, and wellness oils.",
      "Unlock exclusive access to wellness guides, coaching sessions, and member-only discounts.",
      "Schedule a personalized consultation to build a wellness plan that fits your unique needs.",
      "Be part of a vibrant community on a shared journey toward natural health and vitality.",
    ],
    primaryCta: { label: "Shop Now", to: "/shop", tooltip: "Browse our premium botanical products" },
    secondaryCta: { label: "Join Membership", to: "/membership", tooltip: "Become a member for exclusive content" },
    icon: ArrowRight,
  },
];

export function Hero() {
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [current, setCurrent] = useState(0);
  const autoplayRef = useRef<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const autoplayCountRef = useRef<number>(0);
  const [videoReady, setVideoReady] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    handleSelect();
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;

    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
    }

    autoplayRef.current = window.setInterval(() => {
      autoplayCountRef.current += 1;
      
      // After 3 autoplay cycles, encourage scrolling with subtle animation
      if (autoplayCountRef.current >= 3) {
        autoplayCountRef.current = 0;
        
        // Trigger soft scroll animation to encourage user interaction
        const scrollElement = document.documentElement;
        const currentScroll = scrollElement.scrollTop;
        const targetScroll = Math.min(currentScroll + 80, scrollElement.scrollHeight - window.innerHeight);
        
        if (targetScroll > currentScroll) {
          const duration = 800;
          const start = Date.now();
          
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            scrollElement.scrollTop = currentScroll + (targetScroll - currentScroll) * easeOut;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      }
      
      api.scrollNext();
    }, 7000);

    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
      }
    };
  }, [api, current]);

  // Debounced video play/pause logic for smoother transitions
  const handleVideoTransition = useCallback((index: number, shouldPlay: boolean) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (shouldPlay) {
      video.muted = true;
      video.playbackRate = 1.0;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } else {
      // Small delay before pausing to prevent flicker
      setTimeout(() => {
        try {
          video.pause();
          video.currentTime = 0;
        } catch {
          // ignore reset issues
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (!api) return;

    slides.forEach((slide, index) => {
      if (slide.type !== "video") return;
      handleVideoTransition(index, index === current);
    });
  }, [current, api, handleVideoTransition]);

  // Determine which slides should have their video source loaded (current ± 1)
  const shouldLoadVideo = (index: number) => {
    if (!api) return index <= 1;
    const total = slides.length;
    return (
      index === current ||
      index === (current + 1) % total ||
      index === (current - 1 + total) % total
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <section className="relative w-full overflow-hidden bg-cream-100">
        <div className="relative w-full overflow-hidden">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              loop: true,
              align: "start",
            }}
          >
            <CarouselContent className="m-0">
              {slides.map((slide, index) => (
                <CarouselItem key={slide.id} className="p-0">
                  <div className="flex flex-col w-full bg-cream-100">
                    {/* Media Viewport Container - Full Page Height */}
                    <div className="relative w-full h-[80vh] min-h-[520px] max-h-[750px] overflow-hidden bg-stone-950">
                      {/* Media (Image or Video) - Full Background */}
                      <div className="absolute inset-0 w-full h-full z-0">
                        {slide.type === "video" ? (
                          <motion.div
                            className="h-full w-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: videoReady[index] ? 1 : 0 }}
                            transition={{ duration: 0.6 }}
                          >
                            <video
                              ref={(el) => {
                                videoRefs.current[index] = el;
                              }}
                              className="h-full w-full object-cover"
                              muted
                              playsInline
                              preload={shouldLoadVideo(index) ? "auto" : "none"}
                              poster={`/carousel-${slide.id}-poster.jpg`}
                              onCanPlayThrough={() => {
                                setVideoReady((prev) => ({ ...prev, [index]: true }));
                              }}
                              onEnded={() => api?.scrollNext()}
                            >
                              {shouldLoadVideo(index) && (
                                <source src={slide.media} type="video/mp4" />
                              )}
                            </video>
                          </motion.div>
                        ) : (
                          <img
                            src={slide.media}
                            alt={slide.alt}
                            className="h-full w-full object-cover"
                            loading={index <= 1 ? "eager" : "lazy"}
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                      </div>

                      {/* Dark overlay for cinema look and title readability, updated for more vivid colors */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent z-[2]" />

                      {/* Centered Large Title Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-[5] text-center px-4 md:px-8">
                        <motion.div
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.18,
                                delayChildren: 0.1,
                              },
                            },
                          }}
                          initial="hidden"
                          animate={index === current ? "visible" : "hidden"}
                          className="flex flex-col items-center max-w-5xl"
                        >
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 30, scale: 0.95 },
                              visible: { 
                                opacity: 1, 
                                y: [0, -5, 0], 
                                scale: 1,
                                transition: { 
                                  opacity: { duration: 0.8, ease: "easeOut" },
                                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                                  scale: { duration: 0.8, ease: "easeOut" }
                                } 
                              },
                            }}
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-stone-950/30 backdrop-blur-md px-3.5 py-1 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-sm"
                          >
                            <slide.icon className="h-3.5 w-3.5 text-olive-300" />
                            <span>{slide.eyebrow}</span>
                          </motion.div>

                          <motion.h1 
                            variants={{
                              hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
                              visible: { 
                                opacity: 1, 
                                y: [0, -10, 0], 
                                filter: "blur(0px)",
                                transition: { 
                                  opacity: { duration: 0.9, ease: "easeOut" },
                                  filter: { duration: 0.9, ease: "easeOut" },
                                  y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
                                } 
                              },
                            }}
                            className="font-cormorant text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                          >
                            {slide.title}
                          </motion.h1>

                          {slide.subtitle && (
                            <motion.p 
                              variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { 
                                  opacity: 1, 
                                  y: [0, -5, 0], 
                                  transition: { 
                                    opacity: { duration: 0.8, ease: "easeOut" },
                                    y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
                                  } 
                                },
                              }}
                              className="mt-4 text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] max-w-xl"
                            >
                              {slide.subtitle}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>
                    </div>

                    {/* Text Details Area - Rendered below the slide cover, sliding horizontally */}
                    <div className="w-full bg-[#FAF8F5] py-8 sm:py-10 px-4 sm:px-6 md:px-8 border-t border-stone-200/80">
                      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                        
                        {/* Numbered Feature Cards with Hover Tooltips */}
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={index === current ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                          className="w-full rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-sm"
                        >
                          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                            {slide.features.slice(0, 4).map((feature, featureIndex) => (
                              <FeatureTooltip
                                key={feature}
                                feature={feature}
                                description={slide.featureDescriptions?.[featureIndex] || ""}
                                index={featureIndex}
                              />
                            ))}
                          </div>
                        </motion.div>

                        {/* CTA Buttons in middle */}
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={index === current ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                          className="mt-6 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md"
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                asChild
                                className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-8 py-5 shadow-lg shadow-olive-900/10 transition-transform duration-200 hover:-translate-y-0.5 text-sm font-semibold"
                              >
                                <Link to={slide.primaryCta.to}>
                                  {slide.primaryCta.label}
                                  <ArrowRight className="ml-1.5 h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-olive-900 text-white border-none font-medium px-4 py-2">
                              <p>{slide.primaryCta.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {slide.secondaryCta ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  asChild
                                  variant="outline"
                                  className="border-stone-300 bg-white hover:bg-stone-50 text-stone-800 rounded-full px-8 py-5 transition-transform duration-200 hover:-translate-y-0.5 text-sm font-semibold"
                                >
                                  <Link to={slide.secondaryCta.to}>{slide.secondaryCta.label}</Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-stone-800 text-white border-none font-medium px-4 py-2">
                                <p>{slide.secondaryCta.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : null}
                        </motion.div>

                        {/* Description text at bottom */}
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={index === current ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="mt-6 text-sm sm:text-base font-medium text-stone-600 tracking-wide leading-relaxed max-w-2xl border-t border-stone-200/60 pt-4"
                        >
                          {slide.description}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel Next/Prev Controls - Floating relative to media viewport */}
            <div className="absolute inset-x-0 top-[40%] flex justify-between px-4 sm:px-6 pointer-events-none z-[10]">
              <CarouselPrevious className="pointer-events-auto border-white/20 bg-white/80 hover:bg-white text-olive-800 shadow-md backdrop-blur-md" />
              <CarouselNext className="pointer-events-auto border-white/20 bg-white/80 hover:bg-white text-olive-800 shadow-md backdrop-blur-md" />
            </div>

            {/* Dots Indicator overlaying the media bottom area */}
            <div className="absolute top-[75vh] left-1/2 z-[10] flex -translate-x-1/2 gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === current ? "w-8 bg-white" : "w-2 bg-white/60 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </section>
    </TooltipProvider>
  );
}

/* ── Feature Tooltip Component ── */
function FeatureTooltip({
  feature,
  description,
  index,
}: {
  feature: string;
  description: string;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-describedby={`feature-tooltip-${index}`}
    >
      <div
        className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 shadow-sm min-w-0 cursor-pointer transition-all duration-200 ${
          isHovered
            ? "border-olive-300 bg-olive-50 shadow-md scale-[1.03]"
            : "border-stone-100 bg-stone-50/50"
        }`}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-olive-600 text-xs font-bold text-white shadow-sm">
          0{index + 1}
        </span>
        <span className="text-[13px] sm:text-sm font-semibold text-stone-800 truncate">{feature}</span>
      </div>

      {/* Tooltip Popover */}
      <AnimatePresence>
        {isHovered && description && (
          <motion.div
            id={`feature-tooltip-${index}`}
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-56 sm:w-64 rounded-xl border border-olive-200 bg-white px-4 py-3 shadow-xl shadow-olive-900/10"
          >
            {/* Arrow */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-l border-t border-olive-200 bg-white" />
            <p className="relative z-10 text-xs sm:text-sm leading-relaxed text-stone-700 font-medium">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
