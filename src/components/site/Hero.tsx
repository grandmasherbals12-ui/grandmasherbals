import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Leaf, HeartPulse, Infinity } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    primaryCta: { label: "Begin Your Wellness Journey", to: "/assessment" },
    secondaryCta: { label: "Discover Our Story", to: "/about" },
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
    primaryCta: { label: "Explore Consultations", to: "/consultation" },
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
    primaryCta: { label: "Learn More", to: "/about" },
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
    primaryCta: { label: "Shop Botanicals", to: "/shop" },
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
    primaryCta: { label: "Join Membership", to: "/membership" },
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
    primaryCta: { label: "Shop Now", to: "/shop" },
    secondaryCta: { label: "Join Membership", to: "/membership" },
    icon: ArrowRight,
  },
];

export function Hero() {
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [current, setCurrent] = useState(0);
  const autoplayRef = useRef<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const autoplayCountRef = useRef<number>(0);

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

  useEffect(() => {
    if (!api) return;

    slides.forEach((slide, index) => {
      if (slide.type !== "video") return;

      const video = videoRefs.current[index];
      if (!video) return;

      if (index === current) {
        video.muted = true;
        video.playbackRate = 1.25;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      } else {
        try {
          video.pause();
          video.currentTime = 0;
        } catch {
          // ignore reset issues
        }
      }
    });
  }, [current, api]);

  return (
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
                <div className="relative w-full h-[560px] sm:h-[640px] md:h-[680px] lg:h-[720px] overflow-hidden bg-stone-950">
                  {/* Media (Image or Video) - Full Background */}
                  <div className="absolute inset-0 w-full h-full z-0">
                    {slide.type === "video" ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                        onEnded={() => api?.scrollNext()}
                      >
                        <source src={slide.media} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={slide.media}
                        alt={slide.alt}
                        className="h-full w-full object-cover"
                        loading="eager"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>

                  {/* Gradient Overlay - Only at bottom for card area */}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-transparent z-[2]" />

                  {/* Content Card - Positioned at bottom, more compact */}
                  <div className="absolute bottom-0 left-0 right-0 z-[15] w-full px-3 sm:px-6 md:px-12 lg:px-24 pb-4 sm:pb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={index === current ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                      className="w-full max-w-4xl bg-stone-900/60 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-3 sm:p-5 md:p-6 text-white mx-auto"
                    >
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] text-white shadow-sm">
                        <slide.icon className="h-3 w-3" />
                        <span>{slide.eyebrow}</span>
                      </div>

                      <h1 className="max-w-2xl text-lg sm:text-3xl md:text-4xl lg:text-5xl font-cormorant font-bold tracking-tight text-white leading-[1.1]">
                        {slide.title}
                      </h1>

                      {/* Numbered Feature Cards (Glassmorphic Cards) with Subtitle */}
                      <div className="mt-2 sm:mt-3 rounded-xl border border-white/10 bg-white/5 p-2 sm:p-3 shadow-inner">
                        {/* Yellow Subtitle - Inside the box as client marked with RED */}
                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300/95 mb-1.5">
                          {slide.subtitle}
                        </p>
                        
                        <p className="text-[8px] font-bold uppercase tracking-[0.35em] text-amber-300">
                          Guided by heritage
                        </p>
                        <div className="mt-1.5 grid gap-1.5 grid-cols-2 md:grid-cols-4">
                          {slide.features.slice(0, 4).map((feature, featureIndex) => (
                            <div
                              key={feature}
                              className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/10 px-2 py-1 sm:py-1.5 shadow-sm min-w-0"
                            >
                              <span className="flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full bg-olive-800 text-[8px] sm:text-[9px] font-bold text-olive-200">
                                0{featureIndex + 1}
                              </span>
                              <span className="text-[9px] sm:text-[10px] font-semibold text-stone-100 truncate">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Buttons in middle */}
                      <div className="mt-3 sm:mt-4 flex flex-col gap-1.5 sm:flex-row sm:gap-2">
                        <Button
                          asChild
                          className="bg-olive-600 px-4 sm:px-6 text-white shadow-lg shadow-olive-900/10 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-olive-700 text-[10px] sm:text-xs font-semibold h-8 sm:h-9"
                        >
                          <Link to={slide.primaryCta.to}>
                            {slide.primaryCta.label}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                        {slide.secondaryCta ? (
                          <Button
                            asChild
                            variant="outline"
                            className="border-white/30 bg-white/10 px-4 sm:px-6 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/20 text-[10px] sm:text-xs font-semibold h-8 sm:h-9"
                          >
                            <Link to={slide.secondaryCta.to}>{slide.secondaryCta.label}</Link>
                          </Button>
                        ) : null}
                      </div>

                      {/* Red/Pink description text at BOTTOM - As client marked with BLUE line */}
                      <p className="mt-3 sm:mt-4 max-w-2xl text-[10px] sm:text-xs font-medium text-rose-400/95 tracking-wide leading-relaxed border-t border-white/10 pt-2 sm:pt-3">
                        {slide.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex left-4 lg:left-8 border-white/40 bg-white/70 text-olive-800 shadow-lg backdrop-blur hover:bg-white z-[25]" />
          <CarouselNext className="hidden md:flex right-4 lg:right-8 border-white/40 bg-white/70 text-olive-800 shadow-lg backdrop-blur hover:bg-white z-[25]" />

          <div className="absolute bottom-4 left-1/2 z-[25] flex -translate-x-1/2 gap-2 md:bottom-8">
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
  );
}
