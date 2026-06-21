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
                <div className="flex flex-col w-full bg-cream-100">
                  {/* Media Viewport Container - Full Page Height */}
                  <div className="relative w-full h-[80vh] min-h-[520px] max-h-[750px] overflow-hidden bg-stone-950">
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

                    {/* Dark overlay for cinema look and title readability */}
                    <div className="absolute inset-0 bg-stone-950/45 z-[2]" />

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
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
                          }}
                          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-stone-950/30 backdrop-blur-md px-3.5 py-1 text-[9px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm"
                        >
                          <slide.icon className="h-3.5 w-3.5 text-olive-300" />
                          <span>{slide.eyebrow}</span>
                        </motion.div>

                        <motion.h1 
                          variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
                          }}
                          className="font-cormorant text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                        >
                          {slide.title}
                        </motion.h1>

                        {slide.subtitle && (
                          <motion.p 
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
                            }}
                            className="mt-4 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] max-w-xl"
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
                      
                      {/* Numbered Feature Cards */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={index === current ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                        className="w-full rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5 shadow-sm"
                      >
                        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                          {slide.features.slice(0, 4).map((feature, featureIndex) => (
                            <div
                              key={feature}
                              className="flex items-center gap-2 rounded-xl border border-stone-100 bg-stone-50/50 px-3 py-2.5 shadow-sm min-w-0"
                            >
                              <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-olive-600 text-[10px] font-bold text-white shadow-sm">
                                0{featureIndex + 1}
                              </span>
                              <span className="text-[11px] sm:text-xs font-semibold text-stone-800 truncate">{feature}</span>
                            </div>
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
                        <Button
                          asChild
                          className="bg-olive-600 hover:bg-olive-700 text-white rounded-full px-8 py-5 shadow-lg shadow-olive-900/10 transition-transform duration-200 hover:-translate-y-0.5 text-xs font-semibold"
                        >
                          <Link to={slide.primaryCta.to}>
                            {slide.primaryCta.label}
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                          </Link>
                        </Button>
                        {slide.secondaryCta ? (
                          <Button
                            asChild
                            variant="outline"
                            className="border-stone-300 bg-white hover:bg-stone-50 text-stone-800 rounded-full px-8 py-5 transition-transform duration-200 hover:-translate-y-0.5 text-xs font-semibold"
                          >
                            <Link to={slide.secondaryCta.to}>{slide.secondaryCta.label}</Link>
                          </Button>
                        ) : null}
                      </motion.div>

                      {/* Description text at bottom */}
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={index === current ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-6 text-xs sm:text-sm font-medium text-stone-600 tracking-wide leading-relaxed max-w-2xl border-t border-stone-200/60 pt-4"
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
  );
}
